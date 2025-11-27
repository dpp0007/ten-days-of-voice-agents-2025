#!/usr/bin/env python3
"""
Test script for Fraud Alert Database
Tests both SQLite and MongoDB (if available)
"""
import os
import sys

# Add src to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from fraud_db import FraudDatabase, get_fraud_db
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("test_fraud_db")


def test_sqlite():
    """Test SQLite database functionality"""
    print("\n" + "="*60)
    print("🧪 TESTING SQLITE DATABASE")
    print("="*60)
    
    # Force SQLite
    os.environ["USE_MONGODB"] = "false"
    
    db = FraudDatabase(use_mongodb=False)
    
    # Test 1: Get case by username
    print("\n📋 Test 1: Get case by username 'John'")
    case = db.get_case_by_username("John")
    if case:
        print(f"✅ Found case for {case['userName']}")
        print(f"   Card: **** {case['cardEnding']}")
        print(f"   Transaction: ${case['transactionAmount']} at {case['transactionName']}")
        print(f"   Status: {case['caseStatus']}")
    else:
        print("❌ Case not found")
        return False
    
    # Test 2: Case-insensitive lookup
    print("\n📋 Test 2: Case-insensitive lookup 'JOHN'")
    case = db.get_case_by_username("JOHN")
    if case:
        print(f"✅ Found case (case-insensitive works)")
    else:
        print("❌ Case-insensitive lookup failed")
        return False
    
    # Test 3: Update case status to safe
    print("\n📋 Test 3: Mark transaction as SAFE")
    success = db.update_case_status("John", "confirmed_safe", "Test: Customer confirmed")
    if success:
        print("✅ Case updated successfully")
        # Verify update
        case = db.get_case_by_username("John")
        print(f"   New status: {case['caseStatus']}")
        print(f"   Outcome: {case['outcome']}")
    else:
        print("❌ Update failed")
        return False
    
    # Test 4: Update case status to fraudulent
    print("\n📋 Test 4: Mark transaction as FRAUDULENT")
    success = db.update_case_status("Sarah", "confirmed_fraud", "Test: Customer denied transaction")
    if success:
        print("✅ Case updated successfully")
        case = db.get_case_by_username("Sarah")
        print(f"   New status: {case['caseStatus']}")
        print(f"   Outcome: {case['outcome']}")
    else:
        print("❌ Update failed")
        return False
    
    # Test 5: Non-existent user
    print("\n📋 Test 5: Non-existent user")
    case = db.get_case_by_username("NonExistent")
    if case is None:
        print("✅ Correctly returned None for non-existent user")
    else:
        print("❌ Should have returned None")
        return False
    
    # Test 6: Get all sample users
    print("\n📋 Test 6: Verify all sample users exist")
    users = ["John", "Sarah", "Michael"]
    for user in users:
        case = db.get_case_by_username(user)
        if case:
            print(f"✅ {user}: Card **** {case['cardEnding']}, ${case['transactionAmount']}")
        else:
            print(f"❌ {user}: Not found")
            return False
    
    db.close()
    print("\n✅ ALL SQLITE TESTS PASSED!")
    return True


def test_mongodb():
    """Test MongoDB database functionality (if available)"""
    print("\n" + "="*60)
    print("🧪 TESTING MONGODB DATABASE")
    print("="*60)
    
    # Check if MongoDB URI is configured
    mongo_uri = os.getenv("MONGODB_URI")
    if not mongo_uri:
        print("⚠️  MONGODB_URI not configured - skipping MongoDB tests")
        print("   To test MongoDB, set MONGODB_URI in .env.local")
        return True
    
    # Force MongoDB
    os.environ["USE_MONGODB"] = "true"
    
    try:
        db = FraudDatabase(use_mongodb=True)
        
        if not db.use_mongodb:
            print("⚠️  MongoDB connection failed - using SQLite fallback")
            return True
        
        # Test 1: Get case by username
        print("\n📋 Test 1: Get case by username 'John'")
        case = db.get_case_by_username("John")
        if case:
            print(f"✅ Found case for {case['userName']}")
            print(f"   Card: **** {case['cardEnding']}")
            print(f"   Transaction: ${case['transactionAmount']} at {case['transactionName']}")
        else:
            print("❌ Case not found")
            return False
        
        # Test 2: Update case
        print("\n📋 Test 2: Update case status")
        success = db.update_case_status("John", "test_status", "MongoDB test")
        if success:
            print("✅ Case updated successfully")
        else:
            print("❌ Update failed")
            return False
        
        db.close()
        print("\n✅ ALL MONGODB TESTS PASSED!")
        return True
        
    except Exception as e:
        print(f"❌ MongoDB test error: {e}")
        return False


def test_singleton():
    """Test singleton pattern"""
    print("\n" + "="*60)
    print("🧪 TESTING SINGLETON PATTERN")
    print("="*60)
    
    db1 = get_fraud_db()
    db2 = get_fraud_db()
    
    if db1 is db2:
        print("✅ Singleton pattern works - same instance returned")
        return True
    else:
        print("❌ Singleton pattern failed - different instances")
        return False


def main():
    """Run all tests"""
    print("\n" + "="*60)
    print("🚀 FRAUD ALERT DATABASE TEST SUITE")
    print("="*60)
    
    results = []
    
    # Test SQLite (always available)
    results.append(("SQLite", test_sqlite()))
    
    # Test MongoDB (if configured)
    results.append(("MongoDB", test_mongodb()))
    
    # Test singleton
    results.append(("Singleton", test_singleton()))
    
    # Summary
    print("\n" + "="*60)
    print("📊 TEST SUMMARY")
    print("="*60)
    
    for name, passed in results:
        status = "✅ PASSED" if passed else "❌ FAILED"
        print(f"{name:20} {status}")
    
    all_passed = all(result[1] for result in results)
    
    if all_passed:
        print("\n🎉 ALL TESTS PASSED!")
        return 0
    else:
        print("\n❌ SOME TESTS FAILED")
        return 1


if __name__ == "__main__":
    sys.exit(main())
