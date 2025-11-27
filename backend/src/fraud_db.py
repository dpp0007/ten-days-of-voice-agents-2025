"""
Fraud Alert Database Module
Supports both MongoDB (cloud-ready) and SQLite (local fallback)
"""
import os
import logging
from typing import Optional, Dict, Any
from datetime import datetime

logger = logging.getLogger("fraud_db")

# Try MongoDB first (cloud-ready)
try:
    from pymongo import MongoClient
    from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
    MONGODB_AVAILABLE = True
except ImportError:
    MONGODB_AVAILABLE = False
    logger.warning("pymongo not installed. Falling back to SQLite.")

# SQLite is always available (built-in)
import sqlite3
import json


class FraudDatabase:
    """Database abstraction for fraud cases - supports MongoDB Atlas or SQLite"""
    
    def __init__(self, use_mongodb: bool = True):
        self.use_mongodb = use_mongodb and MONGODB_AVAILABLE
        self.db = None
        self.conn = None
        
        if self.use_mongodb:
            self._init_mongodb()
        else:
            self._init_sqlite()
    
    def _init_mongodb(self):
        """Initialize MongoDB connection (Atlas-compatible with retry logic)"""
        try:
            mongo_uri = os.getenv("MONGODB_URI", "mongodb://localhost:27017/")
            
            if not mongo_uri or mongo_uri == "mongodb://localhost:27017/":
                logger.warning("⚠️ MONGODB_URI not configured or using default localhost")
                logger.info("💡 Set MONGODB_URI in .env.local for cloud database")
                logger.info("Falling back to SQLite...")
                self.use_mongodb = False
                self._init_sqlite()
                return
            
            logger.info("🔌 Connecting to MongoDB Atlas...")
            
            # MongoDB Atlas connection with proper timeouts and retry
            self.client = MongoClient(
                mongo_uri,
                serverSelectionTimeoutMS=10000,  # 10 seconds for cloud
                connectTimeoutMS=10000,
                socketTimeoutMS=10000,
                retryWrites=True,
                retryReads=True,
                maxPoolSize=10,
                minPoolSize=1
            )
            
            # Test connection with retry
            max_retries = 3
            for attempt in range(max_retries):
                try:
                    self.client.admin.command('ping')
                    break
                except Exception as e:
                    if attempt < max_retries - 1:
                        logger.warning(f"⚠️ Connection attempt {attempt + 1} failed, retrying...")
                    else:
                        raise e
            
            self.db = self.client["fraud_alert_db"]
            self.collection = self.db["fraud_cases"]
            
            # Create indexes for performance
            self.collection.create_index("userName")
            self.collection.create_index("caseStatus")
            
            logger.info("✅ MongoDB Atlas connected successfully")
            logger.info(f"📊 Database: fraud_alert_db | Collection: fraud_cases")
            
            self._seed_mongodb_data()
            
        except (ConnectionFailure, ServerSelectionTimeoutError) as e:
            logger.error(f"❌ MongoDB connection failed: {e}")
            logger.info("💡 Check your MONGODB_URI and network connection")
            logger.info("Falling back to SQLite...")
            self.use_mongodb = False
            self._init_sqlite()
        except Exception as e:
            logger.error(f"❌ MongoDB initialization error: {e}")
            logger.info("Falling back to SQLite...")
            self.use_mongodb = False
            self._init_sqlite()
    
    def _init_sqlite(self):
        """Initialize SQLite database (local fallback)"""
        db_path = os.path.join(os.path.dirname(__file__), "fraud_cases.db")
        self.conn = sqlite3.connect(db_path, check_same_thread=False)
        self.conn.row_factory = sqlite3.Row
        self._create_sqlite_schema()
        self._seed_sqlite_data()
        logger.info(f"✅ SQLite database initialized at {db_path}")
    
    def _create_sqlite_schema(self):
        """Create SQLite table schema"""
        cursor = self.conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS fraud_cases (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                userName TEXT NOT NULL,
                securityIdentifier TEXT NOT NULL,
                cardEnding TEXT NOT NULL,
                caseStatus TEXT NOT NULL,
                transactionName TEXT NOT NULL,
                transactionAmount REAL NOT NULL,
                transactionTime TEXT NOT NULL,
                transactionCategory TEXT NOT NULL,
                transactionSource TEXT NOT NULL,
                securityQuestion TEXT NOT NULL,
                securityAnswer TEXT NOT NULL,
                outcome TEXT,
                updatedAt TEXT
            )
        """)
        self.conn.commit()
    
    def _seed_mongodb_data(self):
        """Seed MongoDB with sample fraud cases"""
        if self.collection.count_documents({}) == 0:
            sample_cases = self._get_sample_cases()
            self.collection.insert_many(sample_cases)
            logger.info(f"✅ Seeded {len(sample_cases)} fraud cases to MongoDB")
    
    def _seed_sqlite_data(self):
        """Seed SQLite with sample fraud cases"""
        cursor = self.conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM fraud_cases")
        if cursor.fetchone()[0] == 0:
            sample_cases = self._get_sample_cases()
            for case in sample_cases:
                cursor.execute("""
                    INSERT INTO fraud_cases (
                        userName, securityIdentifier, cardEnding, caseStatus,
                        transactionName, transactionAmount, transactionTime,
                        transactionCategory, transactionSource, securityQuestion,
                        securityAnswer, outcome, updatedAt
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    case["userName"], case["securityIdentifier"], case["cardEnding"],
                    case["caseStatus"], case["transactionName"], case["transactionAmount"],
                    case["transactionTime"], case["transactionCategory"], case["transactionSource"],
                    case["securityQuestion"], case["securityAnswer"], case.get("outcome"),
                    case.get("updatedAt")
                ))
            self.conn.commit()
            logger.info(f"✅ Seeded {len(sample_cases)} fraud cases to SQLite")
    
    def _get_sample_cases(self) -> list:
        """Generate sample fraud cases (FAKE DATA ONLY)"""
        return [
            {
                "userName": "John",
                "securityIdentifier": "12345",
                "cardEnding": "4242",
                "caseStatus": "pending_review",
                "transactionName": "ABC Industry",
                "transactionAmount": 1250.00,
                "transactionTime": "2025-11-26 14:30:00",
                "transactionCategory": "e-commerce",
                "transactionSource": "alibaba.com",
                "securityQuestion": "What is your favorite color?",
                "securityAnswer": "blue",
                "outcome": None,
                "updatedAt": None
            },
            {
                "userName": "Sarah",
                "securityIdentifier": "67890",
                "cardEnding": "8888",
                "caseStatus": "pending_review",
                "transactionName": "Luxury Watches Ltd",
                "transactionAmount": 5499.99,
                "transactionTime": "2025-11-26 09:15:00",
                "transactionCategory": "retail",
                "transactionSource": "luxurywatches.ru",
                "securityQuestion": "What city were you born in?",
                "securityAnswer": "chicago",
                "outcome": None,
                "updatedAt": None
            },
            {
                "userName": "Michael",
                "securityIdentifier": "11111",
                "cardEnding": "1234",
                "caseStatus": "pending_review",
                "transactionName": "Crypto Exchange Pro",
                "transactionAmount": 9999.00,
                "transactionTime": "2025-11-25 23:45:00",
                "transactionCategory": "cryptocurrency",
                "transactionSource": "cryptoexchange.xyz",
                "securityQuestion": "What is your pet's name?",
                "securityAnswer": "max",
                "outcome": None,
                "updatedAt": None
            },
            {
                "userName": "Emily",
                "securityIdentifier": "22222",
                "cardEnding": "5678",
                "caseStatus": "pending_review",
                "transactionName": "Global Electronics Store",
                "transactionAmount": 2899.99,
                "transactionTime": "2025-11-27 10:20:00",
                "transactionCategory": "electronics",
                "transactionSource": "globalelectronics.cn",
                "securityQuestion": "What is your mother's maiden name?",
                "securityAnswer": "smith",
                "outcome": None,
                "updatedAt": None
            },
            {
                "userName": "David",
                "securityIdentifier": "33333",
                "cardEnding": "9012",
                "caseStatus": "pending_review",
                "transactionName": "Premium Gaming Store",
                "transactionAmount": 799.00,
                "transactionTime": "2025-11-27 15:45:00",
                "transactionCategory": "gaming",
                "transactionSource": "premiumgaming.net",
                "securityQuestion": "What was your first car?",
                "securityAnswer": "honda",
                "outcome": None,
                "updatedAt": None
            },
            {
                "userName": "Jessica",
                "securityIdentifier": "44444",
                "cardEnding": "3456",
                "caseStatus": "pending_review",
                "transactionName": "Fashion Boutique Online",
                "transactionAmount": 1599.50,
                "transactionTime": "2025-11-27 12:00:00",
                "transactionCategory": "fashion",
                "transactionSource": "fashionboutique.fr",
                "securityQuestion": "What is your favorite food?",
                "securityAnswer": "pizza",
                "outcome": None,
                "updatedAt": None
            },
            {
                "userName": "Robert",
                "securityIdentifier": "55555",
                "cardEnding": "7890",
                "caseStatus": "pending_review",
                "transactionName": "Tech Gadgets Pro",
                "transactionAmount": 3499.00,
                "transactionTime": "2025-11-27 08:30:00",
                "transactionCategory": "technology",
                "transactionSource": "techgadgets.de",
                "securityQuestion": "What is your favorite movie?",
                "securityAnswer": "inception",
                "outcome": None,
                "updatedAt": None
            },
            {
                "userName": "Amanda",
                "securityIdentifier": "66666",
                "cardEnding": "2468",
                "caseStatus": "pending_review",
                "transactionName": "Travel Booking Agency",
                "transactionAmount": 4250.00,
                "transactionTime": "2025-11-26 18:00:00",
                "transactionCategory": "travel",
                "transactionSource": "travelbooking.uk",
                "securityQuestion": "What is your favorite book?",
                "securityAnswer": "gatsby",
                "outcome": None,
                "updatedAt": None
            },
            {
                "userName": "James",
                "securityIdentifier": "77777",
                "cardEnding": "1357",
                "caseStatus": "pending_review",
                "transactionName": "Sports Equipment Store",
                "transactionAmount": 899.99,
                "transactionTime": "2025-11-27 11:15:00",
                "transactionCategory": "sports",
                "transactionSource": "sportsequipment.ca",
                "securityQuestion": "What is your favorite sport?",
                "securityAnswer": "basketball",
                "outcome": None,
                "updatedAt": None
            },
            {
                "userName": "Lisa",
                "securityIdentifier": "88888",
                "cardEnding": "9753",
                "caseStatus": "pending_review",
                "transactionName": "Home Decor Emporium",
                "transactionAmount": 1750.00,
                "transactionTime": "2025-11-27 13:30:00",
                "transactionCategory": "home",
                "transactionSource": "homedecor.au",
                "securityQuestion": "What is your favorite season?",
                "securityAnswer": "summer",
                "outcome": None,
                "updatedAt": None
            }
        ]
    
    def get_case_by_username(self, username: str) -> Optional[Dict[str, Any]]:
        """Retrieve fraud case by username with validation"""
        if not username or not username.strip():
            logger.error("❌ Invalid username: empty or None")
            return None
        
        username_clean = username.strip()
        username_lower = username_clean.lower()
        
        try:
            if self.use_mongodb:
                case = self.collection.find_one(
                    {"userName": {"$regex": f"^{username_clean}$", "$options": "i"}}
                )
                if case:
                    # Validate required fields
                    required_fields = [
                        "userName", "securityIdentifier", "cardEnding", 
                        "caseStatus", "transactionName", "transactionAmount",
                        "securityQuestion", "securityAnswer"
                    ]
                    missing_fields = [f for f in required_fields if f not in case]
                    if missing_fields:
                        logger.error(f"❌ Invalid case schema - missing fields: {missing_fields}")
                        return None
                    
                    case["_id"] = str(case["_id"])  # Convert ObjectId to string
                    logger.info(f"✅ Retrieved case for '{username_clean}' from MongoDB")
                    return case
                else:
                    logger.warning(f"⚠️ No case found for username: '{username_clean}'")
                    return None
            else:
                cursor = self.conn.cursor()
                cursor.execute(
                    "SELECT * FROM fraud_cases WHERE LOWER(userName) = ? LIMIT 1",
                    (username_lower,)
                )
                row = cursor.fetchone()
                if row:
                    logger.info(f"✅ Retrieved case for '{username_clean}' from SQLite")
                    return dict(row)
                else:
                    logger.warning(f"⚠️ No case found for username: '{username_clean}'")
                    return None
        except Exception as e:
            logger.error(f"❌ Database error retrieving case: {e}")
            return None
    
    def update_case_status(self, username: str, status: str, outcome: str = None) -> bool:
        """Update fraud case status and outcome with validation"""
        if not username or not username.strip():
            logger.error("❌ Invalid username: empty or None")
            return False
        
        if not status or not status.strip():
            logger.error("❌ Invalid status: empty or None")
            return False
        
        if outcome is not None and not outcome.strip():
            logger.error("❌ Invalid outcome: empty string")
            return False
        
        username_clean = username.strip()
        username_lower = username_clean.lower()
        status_clean = status.strip()
        outcome_clean = outcome.strip() if outcome else None
        updated_at = datetime.utcnow().isoformat()
        
        # Validate status values
        valid_statuses = [
            "pending_review", "confirmed_safe", "confirmed_fraud", 
            "verification_failed", "test_status"
        ]
        if status_clean not in valid_statuses:
            logger.warning(f"⚠️ Unusual status value: '{status_clean}' (proceeding anyway)")
        
        try:
            if self.use_mongodb:
                result = self.collection.update_one(
                    {"userName": {"$regex": f"^{username_clean}$", "$options": "i"}},
                    {"$set": {
                        "caseStatus": status_clean,
                        "outcome": outcome_clean,
                        "updatedAt": updated_at
                    }}
                )
                success = result.modified_count > 0
                
                if success:
                    logger.info(f"✅ MongoDB: Updated case for '{username_clean}'")
                    logger.info(f"   Status: {status_clean}")
                    logger.info(f"   Outcome: {outcome_clean}")
                else:
                    logger.warning(f"⚠️ MongoDB: No case found for username: '{username_clean}'")
                
            else:
                cursor = self.conn.cursor()
                cursor.execute("""
                    UPDATE fraud_cases 
                    SET caseStatus = ?, outcome = ?, updatedAt = ?
                    WHERE LOWER(userName) = ?
                """, (status_clean, outcome_clean, updated_at, username_lower))
                self.conn.commit()
                success = cursor.rowcount > 0
                
                if success:
                    logger.info(f"✅ SQLite: Updated case for '{username_clean}'")
                    logger.info(f"   Status: {status_clean}")
                    logger.info(f"   Outcome: {outcome_clean}")
                else:
                    logger.warning(f"⚠️ SQLite: No case found for username: '{username_clean}'")
            
            return success
            
        except Exception as e:
            logger.error(f"❌ Database error updating case: {e}")
            return False
    
    def close(self):
        """Close database connection"""
        if self.use_mongodb and hasattr(self, 'client'):
            self.client.close()
        elif self.conn:
            self.conn.close()
        logger.info("Database connection closed")


# Singleton instance
_db_instance = None

def get_fraud_db() -> FraudDatabase:
    """Get or create fraud database instance"""
    global _db_instance
    if _db_instance is None:
        # Try MongoDB first, fallback to SQLite
        use_mongo = os.getenv("USE_MONGODB", "true").lower() == "true"
        _db_instance = FraudDatabase(use_mongodb=use_mongo)
    return _db_instance
