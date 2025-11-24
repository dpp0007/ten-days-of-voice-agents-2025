"""Notion integration handler for wellness check-ins."""

import logging
from datetime import datetime
from notion_client import Client

logger = logging.getLogger("notion_handler")


class NotionHandler:
    """Handler for saving wellness check-ins to Notion database."""
    
    def __init__(self, api_key: str, database_id: str):
        """Initialize Notion API client.
        
        Args:
            api_key: Notion integration token
            database_id: Notion database ID
        """
        self.client = Client(auth=api_key)
        self.database_id = database_id
        logger.info("Notion handler initialized")
    
    async def save_wellness_entry(self, entry: dict) -> dict:
        """Save wellness entry to Notion database.
        
        Args:
            entry: Wellness entry dict with datetime, mood, energy, objectives, summary
            
        Returns:
            dict with 'success' bool and 'page_id' string
        """
        try:
            # Format data for Notion
            properties = self._format_properties(entry)
            
            # Create page in database
            response = self.client.pages.create(
                parent={"database_id": self.database_id},
                properties=properties
            )
            
            page_id = response["id"]
            logger.info(f"✅ Created Notion page: {page_id}")
            
            return {
                "success": True,
                "page_id": page_id
            }
            
        except Exception as e:
            logger.error(f"❌ Failed to save to Notion: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    def _format_properties(self, entry: dict) -> dict:
        """Format wellness entry for Notion properties.
        
        Uses rich_text format for all fields - compatible with Text/Rich Text properties.
        """
        # Parse datetime for title
        dt = datetime.fromisoformat(entry["datetime"])
        title = f"Check-in - {dt.strftime('%Y-%m-%d %H:%M')}"
        
        # Build properties
        properties = {
            "Name": {
                "title": [{"text": {"content": title}}]
            }
        }
        
        # Add Date (required)
        properties["Date"] = {
            "date": {"start": entry["datetime"]}
        }
        
        # Add Mood (optional)
        if entry.get("mood"):
            properties["Mood"] = {
                "rich_text": [{"text": {"content": entry["mood"]}}]
            }
        
        # Add Energy (optional)
        if entry.get("energy"):
            properties["Energy"] = {
                "rich_text": [{"text": {"content": entry["energy"]}}]
            }
        
        # Add Objectives (optional)
        if entry.get("objectives"):
            # Convert list to comma-separated string
            objectives_text = ", ".join(entry["objectives"])
            properties["Objectives"] = {
                "rich_text": [{"text": {"content": objectives_text}}]
            }
        
        # Add Summary (optional)
        if entry.get("summary"):
            properties["Summary"] = {
                "rich_text": [{"text": {"content": entry["summary"]}}]
            }
        
        return properties
