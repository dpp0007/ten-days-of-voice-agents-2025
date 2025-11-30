import logging
from dotenv import load_dotenv
from livekit.agents import (
    AgentSession,
    JobContext,
    JobProcess,
    MetricsCollectedEvent,
    RoomInputOptions,
    WorkerOptions,
    cli,
    metrics,
    tokenize,
    function_tool
)
from livekit.agents.voice import Agent
import json
import os
from datetime import datetime
from typing import Optional, List, Dict, Annotated
from pydantic import Field
from livekit.plugins import murf, silero, google, deepgram, noise_cancellation
from livekit.plugins.turn_detector.multilingual import MultilingualModel

logger = logging.getLogger("commerce_agent")
load_dotenv(".env.local")


# Sample product catalog - will be replaced with real data
PRODUCT_CATALOG = [
    {
        "id": "prod_001",
        "name": "Premium Wireless Headphones",
        "category": "Electronics",
        "price": 299.99,
        "description": "High-quality wireless headphones with noise cancellation",
        "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
        "colors": ["Black", "Silver", "Blue"],
        "sizes": [],
        "in_stock": True
    },
    {
        "id": "prod_002",
        "name": "Smart Watch Pro",
        "category": "Electronics",
        "price": 399.99,
        "description": "Advanced fitness tracking and notifications",
        "image": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
        "colors": ["Black", "Rose Gold"],
        "sizes": ["Small", "Medium", "Large"],
        "in_stock": True
    },
    {
        "id": "prod_003",
        "name": "Organic Cotton T-Shirt",
        "category": "Clothing",
        "price": 29.99,
        "description": "Comfortable organic cotton t-shirt",
        "image": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
        "colors": ["White", "Black", "Navy", "Gray"],
        "sizes": ["XS", "S", "M", "L", "XL"],
        "in_stock": True
    },
    {
        "id": "prod_004",
        "name": "Leather Backpack",
        "category": "Accessories",
        "price": 149.99,
        "description": "Premium leather backpack with laptop compartment",
        "image": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
        "colors": ["Brown", "Black"],
        "sizes": [],
        "in_stock": True
    },
    {
        "id": "prod_005",
        "name": "Running Shoes",
        "category": "Footwear",
        "price": 129.99,
        "description": "Lightweight running shoes with cushioned sole",
        "image": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
        "colors": ["Black/White", "Blue/Gray", "Red/Black"],
        "sizes": ["7", "8", "9", "10", "11", "12"],
        "in_stock": True
    }
]


class CommerceAgent(Agent):
    def __init__(self, room=None) -> None:
        super().__init__(
            instructions="""You are a helpful AI shopping assistant. Your goal is to help customers discover products, answer questions, and complete purchases through natural conversation.

PERSONA & TONE:
- Friendly, professional, and helpful
- Enthusiastic about products without being pushy
- Clear and concise in your responses
- Patient and understanding with customer needs

CAPABILITIES:
- Browse and search products by category, name, or features
- Provide detailed product information
- Help customers compare products
- Add items to cart
- Process orders
- Track order history

PRODUCT PRESENTATION:
- ALWAYS use the list_products() function when customer asks to see products
- NEVER list products in your response text - always call the function
- When customer asks for a SPECIFIC product (e.g., "show me headphones", "I want a watch", "do you have t-shirts"):
  * Use list_products() with search_query parameter containing the specific product type
  * Example: list_products(search_query="headphones") for "show me headphones"
- When customer asks to browse a CATEGORY (e.g., "show me electronics", "what clothing do you have"):
  * Use list_products() with category parameter
  * Example: list_products(category="Electronics")
- When customer asks to see ALL products (e.g., "show me everything", "what do you have"):
  * Use list_products() with no parameters
- Use get_product_details() ONLY when customer asks about a product they already saw or mentions by full name
- After calling functions, briefly mention what you found
- Highlight what makes each product special
- Be honest about availability and options
- Suggest alternatives if something is out of stock

CART MANAGEMENT:
- Use add_to_cart() when customer wants to add products
- Use remove_from_cart() when customer wants to remove items
- Use get_cart() when customer asks "what's in my cart?"
- Use clear_cart() when customer wants to empty cart
- Cart persists across conversation
- Multiple items can be in cart simultaneously

ORDER MANAGEMENT:
- Use checkout_cart() when customer says "checkout" or "complete order"
- Always confirm cart contents before checkout
- Get customer name if not already provided
- Provide clear order confirmation with order number
- Cart automatically clears after successful checkout
- Offer to help with anything else after order completion

IMPORTANT:
- Keep responses natural and conversational for voice interaction
- Don't use complex formatting or markdown in speech
- Use function tools to manage cart and orders
- Always call checkout_cart() (not save_order) for checkout
- Cart updates are sent to UI automatically"""
        )
        
        # Initialize shopping cart with structured format
        self.cart = {
            "items": [],
            "total": 0.0
        }
        self.customer_name = ""
        self.shipping_address = ""
        self._room = room

    async def on_enter(self) -> None:
        """Called when the agent starts - greet the customer"""
        await self.session.say("Hello! Welcome to our store. I'm your AI shopping assistant. What can I help you find today?")
    
    @function_tool()
    async def list_products(
        self, 
        category: Annotated[Optional[str], Field(default=None, description="Filter by category (Electronics, Clothing, Accessories, Footwear). Leave empty to browse all categories.")] = None, 
        search_query: Annotated[Optional[str], Field(default=None, description="Search for products by name or description. Leave empty to see all products.")] = None
    ) -> str:
        """List available products, optionally filtered by category or search query.
        
        Args:
            category: Filter by category (Electronics, Clothing, Accessories, Footwear). Leave empty to browse all categories.
            search_query: Search for products by name or description. Leave empty to see all products.
        """
        try:
            # Convert None to empty string for backward compatibility
            category = category or ""
            search_query = search_query or ""
            
            logger.info(f"🎯 list_products() CALLED with category={category}, search_query={search_query}")
            products = PRODUCT_CATALOG
            
            # Filter by category
            if category:
                products = [p for p in products if p["category"].lower() == category.lower()]
            
            # Filter by search query with improved matching
            if search_query:
                query = search_query.lower()
                
                # First, try exact match
                exact_matches = [p for p in products if query == p["name"].lower()]
                
                if exact_matches:
                    products = exact_matches
                else:
                    # Try matching individual words for more precise results
                    query_words = query.split()
                    scored_products = []
                    
                    for p in products:
                        name_lower = p["name"].lower()
                        desc_lower = p["description"].lower()
                        
                        # Count how many query words match
                        match_score = 0
                        for word in query_words:
                            if word in name_lower:
                                match_score += 2  # Name matches are more important
                            elif word in desc_lower:
                                match_score += 1
                        
                        if match_score > 0:
                            scored_products.append((match_score, p))
                    
                    # Sort by score (highest first) and take top matches
                    scored_products.sort(reverse=True, key=lambda x: x[0])
                    
                    # If we have high-scoring matches, only return those
                    if scored_products:
                        max_score = scored_products[0][0]
                        # Only return products with at least 50% of the max score
                        threshold = max(1, max_score * 0.5)
                        products = [p for score, p in scored_products if score >= threshold]
                    else:
                        products = []
            
            if not products:
                logger.warning(f"⚠️ No products found for category={category}, search_query={search_query}")
                return "I couldn't find any products matching your criteria. Would you like to browse all products or try a different search?"
            
            # Log that function was called
            logger.info(f"🔍 list_products() completed! Found {len(products)} products")
            logger.info(f"📦 Products to send: {json.dumps(products, indent=2)}")
            
            # Send structured product data to frontend via data channel
            product_message = {
                "type": "product_list",
                "products": products,
                "timestamp": datetime.now().isoformat()
            }
            
            try:
                # Use stored room reference
                if self._room:
                    data_payload = json.dumps(product_message).encode('utf-8')
                    logger.info(f"📡 Sending data payload: {data_payload[:200]}...")
                    await self._room.local_participant.publish_data(
                        data_payload,
                        reliable=True
                    )
                    logger.info(f"✅ Successfully sent {len(products)} products to frontend via data channel")
                else:
                    logger.error("❌ Room reference not available")
            except Exception as e:
                logger.error(f"❌ Failed to send products to frontend: {e}")
                import traceback
                logger.error(traceback.format_exc())
            
            # Format product list for voice response
            product_list = []
            for p in products:
                product_list.append(f"{p['name']} for ${p['price']}")
            
            response = f"I found {len(products)} product{'s' if len(products) > 1 else ''}. "
            response += ", ".join(product_list[:5])  # Limit to 5 for voice
            
            if len(products) > 5:
                response += f", and {len(products) - 5} more."
            
            response += " Which one interests you?"
            
            return response
        except Exception as e:
            logger.error(f"❌ CRITICAL ERROR in list_products: {e}")
            import traceback
            logger.error(traceback.format_exc())
            return "I'm having trouble loading the products right now. Let me try again."
    
    @function_tool()
    async def get_product_details(self, product_name: str) -> str:
        """Get detailed information about a specific product.
        
        Args:
            product_name: Name of the product to get details for
        """
        # Find product by name (fuzzy match)
        product = None
        for p in PRODUCT_CATALOG:
            if product_name.lower() in p["name"].lower():
                product = p
                break
        
        if not product:
            return f"I couldn't find a product called {product_name}. Would you like me to show you similar items?"
        
        logger.info(f"📦 Product details requested: {product['name']}")
        
        # Send product card to frontend
        product_message = {
            "type": "product_list",
            "products": [product],  # Send as single-item array
            "timestamp": datetime.now().isoformat()
        }
        
        try:
            if self._room:
                data_payload = json.dumps(product_message).encode('utf-8')
                await self._room.local_participant.publish_data(
                    data_payload,
                    reliable=True
                )
                logger.info(f"✅ Sent product card for {product['name']}")
            else:
                logger.error("❌ Room reference not available")
        except Exception as e:
            logger.error(f"❌ Failed to send product card: {e}")
        
        response = f"The {product['name']} is ${product['price']}. {product['description']}. "
        
        if product['colors']:
            response += f"Available in {', '.join(product['colors'])}. "
        
        if product['sizes']:
            response += f"Sizes available: {', '.join(product['sizes'])}. "
        
        response += "Would you like to add this to your cart?"
        
        return response
    
    @function_tool()
    async def add_to_cart(self, product_name: str, quantity: int = 1, color: Optional[str] = None, size: Optional[str] = None) -> str:
        """Add a product to the shopping cart.
        
        Args:
            product_name: Name of the product to add
            quantity: Number of items to add (default: 1)
            color: Selected color variant
            size: Selected size
        """
        # Validate quantity
        if quantity < 1:
            quantity = 1
        
        # Find product
        product = None
        for p in PRODUCT_CATALOG:
            if product_name.lower() in p["name"].lower():
                product = p
                break
        
        if not product:
            return f"I couldn't find {product_name}. Could you try again?"
        
        # Check if product already in cart
        existing_item = None
        for item in self.cart["items"]:
            if item["product_id"] == product["id"]:
                existing_item = item
                break
        
        if existing_item:
            # Update quantity
            existing_item["quantity"] += quantity
            logger.info(f"Updated quantity for {product['name']}: {existing_item['quantity']}")
        else:
            # Add new item to cart
            cart_item = {
                "product_id": product["id"],
                "name": product["name"],
                "unit_price": product["price"],
                "quantity": quantity,
                "color": color,
                "size": size,
                "image": product["image"]
            }
            self.cart["items"].append(cart_item)
        
        # Recalculate total
        self.cart["total"] = sum(item["unit_price"] * item["quantity"] for item in self.cart["items"])
        
        logger.info(f"CART_UPDATED: {json.dumps(self.cart)}")
        
        # Send cart update to frontend
        await self._send_cart_update()
        
        item_count = sum(item["quantity"] for item in self.cart["items"])
        
        response = f"Added {quantity} {product['name']}"
        if color:
            response += f" in {color}"
        if size:
            response += f", size {size}"
        response += f" to your cart. You now have {item_count} item{'s' if item_count > 1 else ''} totaling ${self.cart['total']:.2f}. "
        response += "Would you like to continue shopping or checkout?"
        
        return response
    
    @function_tool()
    async def remove_from_cart(self, product_name: str) -> str:
        """Remove a product from the shopping cart.
        
        Args:
            product_name: Name of the product to remove
        """
        # Find item in cart
        item_to_remove = None
        for item in self.cart["items"]:
            if product_name.lower() in item["name"].lower():
                item_to_remove = item
                break
        
        if not item_to_remove:
            return f"I couldn't find {product_name} in your cart."
        
        # Remove item
        self.cart["items"].remove(item_to_remove)
        
        # Recalculate total
        self.cart["total"] = sum(item["unit_price"] * item["quantity"] for item in self.cart["items"])
        
        logger.info(f"CART_UPDATED: {json.dumps(self.cart)}")
        
        # Send cart update to frontend
        await self._send_cart_update()
        
        item_count = sum(item["quantity"] for item in self.cart["items"])
        
        if item_count == 0:
            return f"Removed {item_to_remove['name']} from your cart. Your cart is now empty."
        else:
            return f"Removed {item_to_remove['name']} from your cart. You now have {item_count} item{'s' if item_count > 1 else ''} totaling ${self.cart['total']:.2f}."
    
    @function_tool()
    async def get_cart(self) -> str:
        """Get the current shopping cart contents."""
        if not self.cart["items"]:
            return "Your cart is empty. Would you like me to show you some products?"
        
        logger.info(f"CART_VIEW: {json.dumps(self.cart)}")
        
        # Send cart to frontend
        await self._send_cart_update()
        
        item_count = sum(item["quantity"] for item in self.cart["items"])
        response = f"You have {item_count} item{'s' if item_count > 1 else ''} in your cart: "
        
        items = []
        for item in self.cart["items"]:
            item_desc = f"{item['quantity']} {item['name']}"
            if item.get('color'):
                item_desc += f" in {item['color']}"
            if item.get('size'):
                item_desc += f", size {item['size']}"
            item_desc += f" at ${item['unit_price']} each"
            items.append(item_desc)
        
        response += ", ".join(items)
        response += f". Your total is ${self.cart['total']:.2f}. Ready to checkout?"
        
        return response
    
    @function_tool()
    async def clear_cart(self) -> str:
        """Clear all items from the shopping cart."""
        self.cart = {
            "items": [],
            "total": 0.0
        }
        
        logger.info("CART_CLEARED")
        
        # Send cart update to frontend
        await self._send_cart_update()
        
        return "Your cart has been cleared."
    
    async def _send_cart_update(self):
        """Send cart update to frontend via data channel."""
        cart_message = {
            "type": "cart_update",
            "cart": self.cart,
            "timestamp": datetime.now().isoformat()
        }
        
        try:
            if self._room:
                data_payload = json.dumps(cart_message).encode('utf-8')
                await self._room.local_participant.publish_data(
                    data_payload,
                    reliable=True
                )
                logger.info(f"✅ Sent cart update to frontend: {len(self.cart['items'])} items")
            else:
                logger.error("❌ Room reference not available for cart update")
        except Exception as e:
            logger.error(f"❌ Failed to send cart update: {e}")
    

    
    @function_tool()
    async def set_customer_name(self, name: str) -> str:
        """Set the customer's name for the order.
        
        Args:
            name: Customer's name
        """
        self.customer_name = name
        logger.info(f"Customer name set: {name}")
        return f"Got it, {name}! "
    
    @function_tool()
    async def get_last_order(self) -> str:
        """Get the most recent order."""
        orders = self._load_all_orders()
        
        if not orders:
            return "You haven't placed any orders yet. Would you like to browse products?"
        
        last_order = orders[0]  # Already sorted by timestamp
        
        # Send order to frontend
        await self._send_order_history([last_order])
        
        # Format response
        item_count = sum(item["quantity"] for item in last_order["items"])
        response = f"Your last order was {last_order['order_id']} placed on {self._format_date(last_order['timestamp'])}. "
        response += f"You ordered {item_count} item{'s' if item_count > 1 else ''} for a total of ${last_order['total']:.2f}."
        
        return response
    
    @function_tool()
    async def list_orders(self, limit: Optional[int] = None) -> str:
        """List recent orders.
        
        Args:
            limit: Maximum number of orders to return (default: all)
        """
        orders = self._load_all_orders()
        
        if not orders:
            return "You haven't placed any orders yet. Would you like to browse products?"
        
        # Apply limit
        if limit:
            orders = orders[:limit]
        
        # Send orders to frontend
        await self._send_order_history(orders)
        
        # Format response
        response = f"You have {len(orders)} order{'s' if len(orders) > 1 else ''}: "
        
        order_summaries = []
        for order in orders:
            item_count = sum(item["quantity"] for item in order["items"])
            order_summaries.append(f"{order['order_id']} with {item_count} item{'s' if item_count > 1 else ''} for ${order['total']:.2f}")
        
        response += ", ".join(order_summaries)
        
        return response
    
    @function_tool()
    async def get_orders_today(self) -> str:
        """Get all orders placed today."""
        orders = self._load_all_orders()
        
        if not orders:
            return "You haven't placed any orders yet."
        
        # Filter orders from today
        today = datetime.now().date()
        today_orders = [
            order for order in orders
            if datetime.fromisoformat(order["timestamp"]).date() == today
        ]
        
        if not today_orders:
            return "You haven't placed any orders today."
        
        # Send orders to frontend
        await self._send_order_history(today_orders)
        
        # Format response
        total_items = sum(sum(item["quantity"] for item in order["items"]) for order in today_orders)
        total_spent = sum(order["total"] for order in today_orders)
        
        response = f"You placed {len(today_orders)} order{'s' if len(today_orders) > 1 else ''} today "
        response += f"with {total_items} item{'s' if total_items > 1 else ''} totaling ${total_spent:.2f}."
        
        return response
    
    @function_tool()
    async def get_total_spent_today(self) -> str:
        """Calculate total amount spent today."""
        orders = self._load_all_orders()
        
        if not orders:
            return "You haven't placed any orders yet."
        
        # Filter orders from today
        today = datetime.now().date()
        today_orders = [
            order for order in orders
            if datetime.fromisoformat(order["timestamp"]).date() == today
        ]
        
        if not today_orders:
            return "You haven't spent anything today."
        
        total_spent = sum(order["total"] for order in today_orders)
        
        response = f"You've spent ${total_spent:.2f} today across {len(today_orders)} order{'s' if len(today_orders) > 1 else ''}."
        
        return response
    
    def _load_all_orders(self) -> List[Dict]:
        """Load all orders from the orders directory."""
        orders = []
        orders_dir = "orders"
        
        if not os.path.exists(orders_dir):
            return orders
        
        # Load all JSON order files
        for filename in os.listdir(orders_dir):
            if filename.endswith('.json'):
                filepath = os.path.join(orders_dir, filename)
                try:
                    with open(filepath, 'r') as f:
                        order = json.load(f)
                        orders.append(order)
                except Exception as e:
                    logger.error(f"Failed to load order {filename}: {e}")
        
        # Sort by timestamp (newest first)
        orders.sort(key=lambda x: x["timestamp"], reverse=True)
        
        return orders
    
    def _format_date(self, iso_timestamp: str) -> str:
        """Format ISO timestamp to readable date."""
        dt = datetime.fromisoformat(iso_timestamp)
        return dt.strftime("%B %d, %Y at %I:%M %p")
    
    async def _send_order_history(self, orders: List[Dict]):
        """Send order history to frontend via data channel."""
        history_message = {
            "type": "order_history",
            "orders": orders,
            "timestamp": datetime.now().isoformat()
        }
        
        try:
            if self._room:
                data_payload = json.dumps(history_message).encode('utf-8')
                await self._room.local_participant.publish_data(
                    data_payload,
                    reliable=True
                )
                logger.info(f"✅ Sent order history to frontend: {len(orders)} orders")
            else:
                logger.error("❌ Room reference not available for order history")
        except Exception as e:
            logger.error(f"❌ Failed to send order history: {e}")
    
    @function_tool()
    async def checkout_cart(self) -> str:
        """Checkout the cart and create an order. Call this when customer wants to complete purchase."""
        if not self.cart["items"]:
            return "Your cart is empty. Add some products first!"
        
        if not self.customer_name:
            return "I need your name to complete the order. What's your name?"
        
        # Generate order ID
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        order_id = f"ORD-{timestamp}"
        
        # Create order data from cart
        order_data = {
            "order_id": order_id,
            "customer_name": self.customer_name,
            "items": self.cart["items"],
            "total": self.cart["total"],
            "timestamp": datetime.now().isoformat(),
            "status": "confirmed"
        }
        
        # Save to JSON file
        orders_dir = "orders"
        os.makedirs(orders_dir, exist_ok=True)
        filename = f"{orders_dir}/order_{timestamp}_{self.customer_name}.json"
        
        with open(filename, 'w') as f:
            json.dump(order_data, f, indent=2)
        
        logger.info(f"ORDER_SAVED: {json.dumps(order_data)}")
        logger.info(f"Order saved to {filename}")
        
        # Generate HTML receipt
        html_content = self._generate_html_receipt(order_data)
        html_filename = f"{orders_dir}/order_{timestamp}_{self.customer_name}.html"
        with open(html_filename, 'w', encoding='utf-8') as f:
            f.write(html_content)
        
        logger.info(f"HTML_SNIPPET:")
        logger.info(html_content)
        logger.info(f"END_HTML_SNIPPET")
        
        # Send order confirmation to frontend
        order_message = {
            "type": "order_confirmation",
            "order_id": order_id,
            "total": self.cart["total"],
            "timestamp": datetime.now().isoformat()
        }
        
        try:
            if self._room:
                data_payload = json.dumps(order_message).encode('utf-8')
                await self._room.local_participant.publish_data(
                    data_payload,
                    reliable=True
                )
                logger.info(f"✅ Sent order confirmation to frontend")
            else:
                logger.error("❌ Room reference not available for order confirmation")
        except Exception as e:
            logger.error(f"❌ Failed to send order confirmation: {e}")
        
        # Store total before clearing cart
        order_total = self.cart["total"]
        
        # Clear cart
        self.cart = {
            "items": [],
            "total": 0.0
        }
        
        # Send cart update to clear frontend
        await self._send_cart_update()
        
        response = f"Perfect! Your order {order_id} is confirmed. Total: ${order_total:.2f}. "
        response += f"Thank you for shopping with us, {self.customer_name}! "
        response += "Is there anything else I can help you with?"
        
        return response
    
    def _generate_html_receipt(self, order_data: Dict) -> str:
        """Generate an HTML receipt for the order."""
        items_html = ""
        for item in order_data["items"]:
            variant = ""
            if item.get("color"):
                variant += f" - {item['color']}"
            if item.get("size"):
                variant += f" - Size {item['size']}"
            
            items_html += f"""
            <div class="order-item">
                <div class="item-details">
                    <div class="item-name">{item['name']}{variant}</div>
                    <div class="item-quantity">Qty: {item['quantity']}</div>
                </div>
                <div class="item-price">${item['unit_price'] * item['quantity']:.2f}</div>
            </div>
            """
        
        html = f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation - {order_data['order_id']}</title>
    <style>
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            padding: 20px;
        }}
        .receipt {{
            background: white;
            border-radius: 24px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            max-width: 500px;
            width: 100%;
        }}
        .header {{
            text-align: center;
            border-bottom: 3px solid #667eea;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }}
        .header h1 {{
            color: #667eea;
            margin: 0 0 10px 0;
            font-size: 28px;
        }}
        .order-id {{
            background: #667eea;
            color: white;
            padding: 10px 20px;
            border-radius: 25px;
            font-size: 16px;
            font-weight: 700;
            display: inline-block;
            margin-top: 10px;
        }}
        .customer-info {{
            background: #f8f9fa;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 20px;
        }}
        .customer-name {{
            font-size: 20px;
            font-weight: 600;
            color: #1f2937;
        }}
        .order-items {{
            margin: 20px 0;
        }}
        .order-item {{
            display: flex;
            justify-content: space-between;
            padding: 15px 0;
            border-bottom: 1px solid #e5e7eb;
        }}
        .item-details {{
            flex: 1;
        }}
        .item-name {{
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 4px;
        }}
        .item-quantity {{
            font-size: 14px;
            color: #6b7280;
        }}
        .item-price {{
            font-weight: 700;
            color: #667eea;
            font-size: 18px;
        }}
        .total-section {{
            background: #667eea;
            color: white;
            border-radius: 12px;
            padding: 20px;
            margin-top: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }}
        .total-label {{
            font-size: 20px;
            font-weight: 600;
        }}
        .total-amount {{
            font-size: 32px;
            font-weight: 700;
        }}
        .footer {{
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 2px solid #e5e7eb;
        }}
        .footer h2 {{
            color: #667eea;
            margin: 0 0 10px 0;
            font-size: 24px;
        }}
        .footer p {{
            color: #6b7280;
            margin: 5px 0;
            font-size: 14px;
        }}
        .timestamp {{
            text-align: center;
            color: #9ca3af;
            font-size: 12px;
            margin-top: 20px;
        }}
    </style>
</head>
<body>
    <div class="receipt">
        <div class="header">
            <h1>🛍️ Order Confirmed</h1>
            <div class="order-id">{order_data['order_id']}</div>
        </div>
        
        <div class="customer-info">
            <div class="customer-name">👤 {order_data['customer_name']}</div>
        </div>
        
        <div class="order-items">
            {items_html}
        </div>
        
        <div class="total-section">
            <div class="total-label">Total</div>
            <div class="total-amount">${order_data['total']:.2f}</div>
        </div>
        
        <div class="footer">
            <h2>Thank You!</h2>
            <p>Your order has been confirmed</p>
            <p style="color: #667eea; font-weight: 600;">We appreciate your business! 🎉</p>
        </div>
        
        <div class="timestamp">
            Order placed: {order_data['timestamp']}
        </div>
    </div>
</body>
</html>
"""
        return html


def prewarm(proc: JobProcess):
    proc.userdata["vad"] = silero.VAD.load()


async def entrypoint(ctx: JobContext):
    ctx.log_context_fields = {
        "room": ctx.room.name,
    }

    session = AgentSession(
        stt=deepgram.STT(model="nova-3"),
        llm=google.LLM(model="gemini-2.5-flash"),
        tts=murf.TTS(
            voice="anisha", 
            style="Conversation",
            tokenizer=tokenize.basic.SentenceTokenizer(min_sentence_len=2),
            text_pacing=True
        ),
        turn_detection=MultilingualModel(),
        vad=ctx.proc.userdata["vad"],
        preemptive_generation=True,
    )

    usage_collector = metrics.UsageCollector()

    @session.on("metrics_collected")
    def _on_metrics_collected(ev: MetricsCollectedEvent):
        metrics.log_metrics(ev.metrics)
        usage_collector.collect(ev.metrics)

    async def log_usage():
        summary = usage_collector.get_summary()
        logger.info(f"Usage: {summary}")

    ctx.add_shutdown_callback(log_usage)

    await session.start(
        agent=CommerceAgent(room=ctx.room),
        room=ctx.room,
        room_input_options=RoomInputOptions(
            noise_cancellation=noise_cancellation.BVC(),
        ),
    )

    await ctx.connect()


if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint, prewarm_fnc=prewarm))
