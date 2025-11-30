#!/usr/bin/env python3
"""
Test script to verify the list_products function fix
"""
import asyncio
import sys
import os

# Add src directory to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from commerce_agent import CommerceAgent

async def test_list_products_fix():
    """Test that list_products works with empty parameters"""
    print("🧪 Testing list_products fix...")
    
    # Create agent instance
    agent = CommerceAgent()
    
    # Test 1: Call with empty parameters (this was failing before)
    try:
        print("\n1. Testing with empty parameters...")
        result = await agent.list_products()
        print(f"✅ SUCCESS: {result[:100]}...")
    except Exception as e:
        print(f"❌ FAILED: {e}")
        return False
    
    # Test 2: Call with category only
    try:
        print("\n2. Testing with category='Electronics'...")
        result = await agent.list_products(category="Electronics")
        print(f"✅ SUCCESS: {result[:100]}...")
    except Exception as e:
        print(f"❌ FAILED: {e}")
        return False
    
    # Test 3: Call with search_query only
    try:
        print("\n3. Testing with search_query='headphones'...")
        result = await agent.list_products(search_query="headphones")
        print(f"✅ SUCCESS: {result[:100]}...")
    except Exception as e:
        print(f"❌ FAILED: {e}")
        return False
    
    # Test 4: Call with both parameters
    try:
        print("\n4. Testing with both category and search_query...")
        result = await agent.list_products(category="Electronics", search_query="watch")
        print(f"✅ SUCCESS: {result[:100]}...")
    except Exception as e:
        print(f"❌ FAILED: {e}")
        return False
    
    print("\n🎉 All tests passed! The list_products function is working correctly.")
    return True

if __name__ == "__main__":
    success = asyncio.run(test_list_products_fix())
    exit(0 if success else 1)