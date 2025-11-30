#!/usr/bin/env python3
"""
Test script to simulate how LLM calls list_products with empty dict
"""
import asyncio
import sys
import os

# Add src directory to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from commerce_agent import CommerceAgent

async def test_llm_call_simulation():
    """Test simulating how LLM calls with empty arguments"""
    print("🤖 Simulating LLM function call with empty arguments...")
    
    # Create agent instance
    agent = CommerceAgent()
    
    # Simulate the exact call that was failing:
    # The error showed the LLM calling list_products with arguments: "{}"
    # which means both parameters should get their default values
    try:
        print("\nSimulating LLM call with empty dict...")
        print("Calling: await agent.list_products()")
        result = await agent.list_products()
        print(f"✅ SUCCESS: Function executed without validation errors")
        print(f"📝 Result preview: {result[:150]}...")
        
        # Also test with explicit empty strings
        print("\nTesting with explicit empty strings...")
        result2 = await agent.list_products(category="", search_query="")
        print(f"✅ SUCCESS: Function executed with empty string parameters")
        print(f"📝 Result preview: {result2[:150]}...")
        
    except Exception as e:
        print(f"❌ FAILED: {e}")
        import traceback
        print("Full traceback:")
        traceback.print_exc()
        return False
    
    print("\n🎉 Fix verified! The list_products function now accepts empty parameters correctly.")
    return True

if __name__ == "__main__":
    success = asyncio.run(test_llm_call_simulation())
    exit(0 if success else 1)