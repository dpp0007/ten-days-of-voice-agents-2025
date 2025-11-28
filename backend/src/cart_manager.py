import json
import logging
from typing import Dict, List, Optional
from pathlib import Path

logger = logging.getLogger("cart_manager")


class CartManager:
    def __init__(self):
        self.catalog = self._load_catalog()
        self.recipes = self._load_recipes()
        self.cart: Dict[str, Dict] = {}

    def _load_catalog(self) -> Dict:
        """Load product catalog from JSON file"""
        catalog_path = Path(__file__).parent / "catalog.json"
        with open(catalog_path, "r") as f:
            return json.load(f)

    def _load_recipes(self) -> Dict:
        """Load recipes from JSON file"""
        recipes_path = Path(__file__).parent / "recipes.json"
        with open(recipes_path, "r") as f:
            return json.load(f)

    def find_item_by_name(self, item_name: str) -> Optional[Dict]:
        """Find an item in catalog by name (case-insensitive partial match)"""
        item_name_lower = item_name.lower()
        
        for category_data in self.catalog["categories"].values():
            for item in category_data["items"]:
                if item_name_lower in item["name"].lower():
                    return item
        return None

    def find_item_by_id(self, item_id: str) -> Optional[Dict]:
        """Find an item in catalog by ID"""
        for category_data in self.catalog["categories"].values():
            for item in category_data["items"]:
                if item["id"] == item_id:
                    return item
        return None

    def add_to_cart(self, item_name: str, quantity: int = 1) -> Dict:
        """Add item to cart"""
        item = self.find_item_by_name(item_name)
        
        if not item:
            return {
                "success": False,
                "message": f"Sorry, I couldn't find '{item_name}' in our catalog."
            }
        
        item_id = item["id"]
        
        if item_id in self.cart:
            self.cart[item_id]["quantity"] += quantity
        else:
            self.cart[item_id] = {
                "id": item_id,
                "name": item["name"],
                "price": item["price"],
                "unit": item["unit"],
                "quantity": quantity
            }
        
        total_qty = self.cart[item_id]["quantity"]
        return {
            "success": True,
            "message": f"Added {quantity} {item['name']} to your cart. You now have {total_qty} in cart.",
            "item": self.cart[item_id]
        }

    def remove_from_cart(self, item_name: str) -> Dict:
        """Remove item from cart completely"""
        item = self.find_item_by_name(item_name)
        
        if not item:
            return {
                "success": False,
                "message": f"Sorry, I couldn't find '{item_name}'."
            }
        
        item_id = item["id"]
        
        if item_id not in self.cart:
            return {
                "success": False,
                "message": f"{item['name']} is not in your cart."
            }
        
        removed_item = self.cart.pop(item_id)
        return {
            "success": True,
            "message": f"Removed {removed_item['name']} from your cart.",
            "item": removed_item
        }

    def update_quantity(self, item_name: str, quantity: int) -> Dict:
        """Update quantity of item in cart"""
        item = self.find_item_by_name(item_name)
        
        if not item:
            return {
                "success": False,
                "message": f"Sorry, I couldn't find '{item_name}'."
            }
        
        item_id = item["id"]
        
        if item_id not in self.cart:
            return {
                "success": False,
                "message": f"{item['name']} is not in your cart."
            }
        
        if quantity <= 0:
            return self.remove_from_cart(item_name)
        
        self.cart[item_id]["quantity"] = quantity
        return {
            "success": True,
            "message": f"Updated {item['name']} quantity to {quantity}.",
            "item": self.cart[item_id]
        }

    def add_recipe_items(self, recipe_name: str) -> Dict:
        """Add all items from a recipe to cart"""
        recipe_name_lower = recipe_name.lower()
        
        # Find matching recipe
        recipe = None
        for key, value in self.recipes["recipes"].items():
            if recipe_name_lower in key.lower():
                recipe = value
                break
        
        if not recipe:
            return {
                "success": False,
                "message": f"Sorry, I don't have a recipe for '{recipe_name}'."
            }
        
        added_items = []
        for item_id in recipe["items"]:
            item = self.find_item_by_id(item_id)
            if item:
                result = self.add_to_cart(item["name"], 1)
                if result["success"]:
                    added_items.append(item["name"])
        
        if added_items:
            items_str = ", ".join(added_items)
            return {
                "success": True,
                "message": f"Added ingredients for {recipe['name']}: {items_str}",
                "items": added_items
            }
        else:
            return {
                "success": False,
                "message": f"Couldn't add items for {recipe_name}."
            }

    def get_cart(self) -> Dict:
        """Get current cart contents"""
        if not self.cart:
            return {
                "items": [],
                "total": 0,
                "count": 0,
                "message": "Your cart is empty."
            }
        
        items = list(self.cart.values())
        total = sum(item["price"] * item["quantity"] for item in items)
        count = sum(item["quantity"] for item in items)
        
        return {
            "items": items,
            "total": total,
            "count": count,
            "message": f"You have {count} items in your cart. Total: ₹{total}"
        }

    def clear_cart(self) -> Dict:
        """Clear all items from cart"""
        self.cart = {}
        return {
            "success": True,
            "message": "Cart cleared."
        }

    def place_order(self, customer_name: str = "Guest") -> Dict:
        """Place order and save to JSON file"""
        if not self.cart:
            return {
                "success": False,
                "message": "Your cart is empty. Add some items first."
            }
        
        cart_data = self.get_cart()
        
        import datetime
        import uuid
        
        order_id = str(uuid.uuid4())[:8]
        timestamp = datetime.datetime.now().isoformat()
        
        order = {
            "order_id": order_id,
            "timestamp": timestamp,
            "customer": customer_name,
            "items": cart_data["items"],
            "total": cart_data["total"],
            "status": "placed"
        }
        
        # Save to JSON file
        orders_dir = Path(__file__).parent / "orders"
        orders_dir.mkdir(exist_ok=True)
        
        order_file = orders_dir / f"order_{order_id}.json"
        with open(order_file, "w") as f:
            json.dump(order, f, indent=2)
        
        logger.info(f"Order {order_id} placed and saved to {order_file}")
        
        # Clear cart after placing order
        self.clear_cart()
        
        return {
            "success": True,
            "message": f"Order placed successfully! Your order ID is {order_id}. Total: ₹{cart_data['total']}",
            "order": order
        }
