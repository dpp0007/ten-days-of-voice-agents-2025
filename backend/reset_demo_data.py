#!/usr/bin/env python3
"""Reset all fraud cases to pending_review status for demo"""
import os
import sys
from dotenv import load_dotenv

load_dotenv(".env.local")
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from fraud_db import get_fraud_db

def reset_cases():
    db = get_fraud_db()
    
    users = ["John", "Sarah", "Michael"]
    for user in users:
        db.update_case_status(user, "pending_review", None)
        print(f"✅ Reset {user} to pending_review")
    
    db.close()
    print("\n🎉 All cases reset to pending_review!")

if __name__ == "__main__":
    reset_cases()
