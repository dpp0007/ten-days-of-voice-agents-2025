#!/usr/bin/env python3
"""
MongoDB Atlas Connection Test Script
Tests cloud database connectivity and operations
"""
import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv(".env.local")

# Add src to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

import logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("mongodb_atlas_test")


def test_mongodb_uri():
    """Test if MongoDB URI is configured"""
    print("\n" + "="*60)
    print("🔍 STEP 1: Check MongoDB URI Configuration")
    print("="*60)
    
    mongo_uri = os.getenv("MONGODB_URI")
    use_mongodb = os.getenv("USE_MONGODB", "false").lower()
    
    print(f"\nUSE_MONGODB: {use_mongodb}")
    
    if not mongo_uri:
        print("❌ MONGODB_URI not set in .env.local")
        print("\n💡 To use MongoDB Atlas:")
        print("   1. Create account at https://www.mongodb.com/cloud/atlas/register")
        print("   2. Create a free cluster (M0)")
        print("   3. Get connection string")
        print("   4. Add to .env.local:")
        print("      USE_MONGODB=true")
        print("      MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/")
        return False
    
    if mongo_uri == "mongodb://localhost:27017/":
        print("⚠️  Using default localhost URI (not Atlas)")
        print("💡 Update MONGODB_URI with your Atlas connection string")
        return False
    
    # Check if it looks like an Atlas URI
    if "mongodb+srv://" in mongo_uri or "mongodb.net" in mongo_uri:
        print("✅ MongoDB Atlas URI detected")
        print(f"   URI: {mongo_uri[:30]}...{mongo_uri[-20:]}")
        return True
    else:
        print("⚠️  URI doesn't look like MongoDB Atlas")
        print(f"   URI: {mongo_uri[:50]}...")
        return True


def test_pymongo_import():
    """Test if pymongo is installed"""
    print("\n" + "="*60)
    print("🔍 STEP 2: Check pymongo Installation")
    print("="*60)
    
    try:
        import pymongo
        print(f"✅ pymongo installed (version {pymongo.__version__})")
        return True
    except ImportError:
        print("❌ pymongo not installed")
        print("\n💡 Install with:")
        print("   cd backend")
        print("   uv sync")
        return False


def test_connection():
    """Test MongoDB Atlas connection"""
    print("\n" + "="*60)
    print("🔍 STEP 3: Test MongoDB Atlas Connection")
    print("="*60)
    
    try:
        from pymongo import MongoClient
        from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
        
        mongo_uri = os.getenv("MONGODB_URI")
        
        print("\n🔌 Attempting connection...")
        print("   (This may take 5-10 seconds)")
        
        client = MongoClient(
            mongo_uri,
            serverSelectionTimeoutMS=10000,
            connectTimeoutMS=10000,
            socketTimeoutMS=10000
        )
        
        # Test connection
        client.admin.command('ping')
        
        print("✅ Connection successful!")
        
        # Get server info
        server_info = client.server_info()
        print(f"\n📊 Server Information:")
        print(f"   MongoDB Version: {server_info.get('version', 'unknown')}")
        print(f"   Max BSON Size: {server_info.get('maxBsonObjectSize', 0) / 1024 / 1024:.1f} MB")
        
        client.close()
        return True
        
    except ConnectionFailure as e:
        print(f"❌ Connection failed: {e}")
        print("\n💡 Troubleshooting:")
        print("   1. Check your internet connection")
        print("   2. Verify IP whitelist in Atlas (Network Access)")
        print("   3. Check firewall/VPN settings")
        return False
        
    except ServerSelectionTimeoutError as e:
        print(f"❌ Connection timeout: {e}")
        print("\n💡 Troubleshooting:")
        print("   1. Verify connection string is correct")
        print("   2. Check if cluster is running in Atlas dashboard")
        print("   3. Ensure IP address is whitelisted (0.0.0.0/0 for testing)")
        return False
        
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False


def test_database_operations():
    """Test database read/write operations"""
    print("\n" + "="*60)
    print("🔍 STEP 4: Test Database Operations")
    print("="*60)
    
    try:
        from fraud_db import FraudDatabase
        
        print("\n📝 Creating database instance...")
        db = FraudDatabase(use_mongodb=True)
        
        if not db.use_mongodb:
            print("⚠️  Database fell back to SQLite")
            print("   MongoDB connection may have failed")
            return False
        
        print("✅ Database instance created")
        
        # Test 1: Read operation
        print("\n📖 Test 1: Read fraud case")
        case = db.get_case_by_username("John")
        if case:
            print(f"✅ Read successful")
            print(f"   User: {case['userName']}")
            print(f"   Card: **** {case['cardEnding']}")
            print(f"   Amount: ${case['transactionAmount']}")
        else:
            print("❌ Read failed - no case found")
            return False
        
        # Test 2: Write operation
        print("\n✏️  Test 2: Update fraud case")
        success = db.update_case_status(
            "John",
            "test_status",
            "MongoDB Atlas connection test - successful"
        )
        if success:
            print("✅ Write successful")
            
            # Verify update
            case = db.get_case_by_username("John")
            print(f"   Status: {case['caseStatus']}")
            print(f"   Outcome: {case['outcome']}")
        else:
            print("❌ Write failed")
            return False
        
        # Test 3: Case-insensitive search
        print("\n🔍 Test 3: Case-insensitive search")
        case = db.get_case_by_username("SARAH")
        if case:
            print(f"✅ Case-insensitive search works")
            print(f"   Found: {case['userName']}")
        else:
            print("❌ Case-insensitive search failed")
            return False
        
        db.close()
        print("\n✅ ALL DATABASE OPERATIONS PASSED!")
        return True
        
    except Exception as e:
        print(f"❌ Database operation error: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_data_validation():
    """Test data validation and error handling"""
    print("\n" + "="*60)
    print("🔍 STEP 5: Test Data Validation")
    print("="*60)
    
    try:
        from fraud_db import FraudDatabase
        
        db = FraudDatabase(use_mongodb=True)
        
        if not db.use_mongodb:
            print("⚠️  Skipping (using SQLite)")
            return True
        
        # Test 1: Empty username
        print("\n📝 Test 1: Empty username")
        case = db.get_case_by_username("")
        if case is None:
            print("✅ Correctly rejected empty username")
        else:
            print("❌ Should reject empty username")
            return False
        
        # Test 2: Non-existent user
        print("\n📝 Test 2: Non-existent user")
        case = db.get_case_by_username("NonExistentUser123")
        if case is None:
            print("✅ Correctly returned None for non-existent user")
        else:
            print("❌ Should return None for non-existent user")
            return False
        
        # Test 3: Invalid update
        print("\n📝 Test 3: Update with empty status")
        success = db.update_case_status("John", "", "test")
        if not success:
            print("✅ Correctly rejected empty status")
        else:
            print("❌ Should reject empty status")
            return False
        
        db.close()
        print("\n✅ ALL VALIDATION TESTS PASSED!")
        return True
        
    except Exception as e:
        print(f"❌ Validation test error: {e}")
        return False


def view_all_cases():
    """View all fraud cases in database"""
    print("\n" + "="*60)
    print("🔍 STEP 6: View All Fraud Cases")
    print("="*60)
    
    try:
        from pymongo import MongoClient
        
        mongo_uri = os.getenv("MONGODB_URI")
        client = MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)
        
        db = client["fraud_alert_db"]
        collection = db["fraud_cases"]
        
        cases = list(collection.find())
        
        print(f"\n📊 Found {len(cases)} fraud cases:\n")
        
        for i, case in enumerate(cases, 1):
            print(f"{i}. {case['userName']}")
            print(f"   Card: **** {case['cardEnding']}")
            print(f"   Amount: ${case['transactionAmount']}")
            print(f"   Merchant: {case['transactionName']}")
            print(f"   Status: {case['caseStatus']}")
            if case.get('outcome'):
                print(f"   Outcome: {case['outcome']}")
            print()
        
        client.close()
        return True
        
    except Exception as e:
        print(f"❌ Error viewing cases: {e}")
        return False


def main():
    """Run all tests"""
    print("\n" + "="*60)
    print("🚀 MONGODB ATLAS CONNECTION TEST SUITE")
    print("="*60)
    print("\nThis script tests your MongoDB Atlas cloud database setup.")
    print("Make sure you have:")
    print("  1. Created a MongoDB Atlas account")
    print("  2. Set up a cluster")
    print("  3. Added MONGODB_URI to .env.local")
    print("  4. Set USE_MONGODB=true in .env.local")
    
    results = []
    
    # Run tests
    results.append(("URI Configuration", test_mongodb_uri()))
    results.append(("pymongo Installation", test_pymongo_import()))
    
    # Only continue if basics are working
    if not all(r[1] for r in results):
        print("\n" + "="*60)
        print("⚠️  BASIC SETUP INCOMPLETE")
        print("="*60)
        print("\nPlease fix the issues above before continuing.")
        return 1
    
    results.append(("Connection Test", test_connection()))
    
    # Only test operations if connection works
    if results[-1][1]:
        results.append(("Database Operations", test_database_operations()))
        results.append(("Data Validation", test_data_validation()))
        results.append(("View All Cases", view_all_cases()))
    
    # Summary
    print("\n" + "="*60)
    print("📊 TEST SUMMARY")
    print("="*60)
    
    for name, passed in results:
        status = "✅ PASSED" if passed else "❌ FAILED"
        print(f"{name:25} {status}")
    
    all_passed = all(result[1] for result in results)
    
    if all_passed:
        print("\n" + "="*60)
        print("🎉 MONGODB ATLAS IS READY!")
        print("="*60)
        print("\nYour cloud database is configured and working.")
        print("You can now run your fraud alert agent with:")
        print("\n  cd backend")
        print("  uv run python src/agent.py dev")
        print("\nThe agent will use MongoDB Atlas for all data storage.")
        return 0
    else:
        print("\n" + "="*60)
        print("❌ SETUP INCOMPLETE")
        print("="*60)
        print("\nPlease fix the failed tests above.")
        print("See MONGODB_ATLAS_SETUP.md for detailed instructions.")
        return 1


if __name__ == "__main__":
    sys.exit(main())
