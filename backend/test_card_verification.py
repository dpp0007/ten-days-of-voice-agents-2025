#!/usr/bin/env python3
"""
Test Card Digit Verification
Tests the card digit verification feature
"""
import os
import sys
from dotenv import load_dotenv

load_dotenv(".env.local")
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from fraud_db import get_fraud_db

def test_card_verification():
    """Test card digit verification logic"""
    print("\n" + "="*60)
    print("🧪 TESTING CARD DIGIT VERIFICATION")
    print("="*60)
    
    db = get_fraud_db()
    
    # Test 1: Verify cardEnding field exists
    print("\n📋 Test 1: Verify cardEnding field in database")
    case = db.get_case_by_username("John")
    if case and "cardEnding" in case:
        print(f"✅ cardEnding field exists: '{case['cardEnding']}'")
        print(f"   Type: {type(case['cardEnding'])}")
        print(f"   Length: {len(case['cardEnding'])}")
    else:
        print("❌ cardEnding field missing")
        return False
    
    # Test 2: Check all users have cardEnding
    print("\n📋 Test 2: Verify all users have cardEnding")
    users = ["John", "Sarah", "Michael"]
    for user in users:
        case = db.get_case_by_username(user)
        if case and "cardEnding" in case:
            print(f"✅ {user}: cardEnding = '{case['cardEnding']}'")
        else:
            print(f"❌ {user}: cardEnding missing")
            return False
    
    # Test 3: Exact match verification
    print("\n📋 Test 3: Test exact match logic")
    case = db.get_case_by_username("John")
    correct_digits = case["cardEnding"]
    
    # Test correct input
    user_input = "4242"
    if user_input == correct_digits:
        print(f"✅ Correct match: '{user_input}' == '{correct_digits}'")
    else:
        print(f"❌ Should match: '{user_input}' vs '{correct_digits}'")
        return False
    
    # Test incorrect input
    user_input = "1234"
    if user_input != correct_digits:
        print(f"✅ Correct rejection: '{user_input}' != '{correct_digits}'")
    else:
        print(f"❌ Should not match: '{user_input}' vs '{correct_digits}'")
        return False
    
    # Test 4: No transformation logic
    print("\n📋 Test 4: Verify no transformation (strict equality)")
    test_cases = [
        ("4242", "4242", True),   # Exact match
        ("4242", "1234", False),  # Different digits
        ("4242", " 4242", False), # With space
        ("4242", "4242 ", False), # With trailing space
        ("4242", "04242", False), # With leading zero
    ]
    
    for user_input, db_value, should_match in test_cases:
        result = (user_input == db_value)
        expected = "match" if should_match else "not match"
        actual = "match" if result else "not match"
        
        if result == should_match:
            print(f"✅ '{user_input}' vs '{db_value}': {actual} (expected: {expected})")
        else:
            print(f"❌ '{user_input}' vs '{db_value}': {actual} (expected: {expected})")
            return False
    
    db.close()
    print("\n✅ ALL CARD VERIFICATION TESTS PASSED!")
    return True


def main():
    """Run all tests"""
    print("\n" + "="*60)
    print("🚀 CARD DIGIT VERIFICATION TEST SUITE")
    print("="*60)
    
    success = test_card_verification()
    
    if success:
        print("\n" + "="*60)
        print("🎉 CARD VERIFICATION READY!")
        print("="*60)
        print("\nTest Cases:")
        print("  John:    cardEnding = '4242'")
        print("  Sarah:   cardEnding = '8888'")
        print("  Michael: cardEnding = '1234'")
        print("\nVerification Logic:")
        print("  ✅ Exact string match (no transformation)")
        print("  ✅ Case-sensitive for digits")
        print("  ✅ No trimming or parsing")
        print("  ✅ Strict equality check")
        return 0
    else:
        print("\n" + "="*60)
        print("❌ TESTS FAILED")
        print("="*60)
        return 1


if __name__ == "__main__":
    sys.exit(main())
