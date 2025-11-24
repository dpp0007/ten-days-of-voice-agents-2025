"""Todoist integration handler for wellness goals."""

import os
from typing import Optional
from todoist_api_python.api import TodoistAPI
import logging

logger = logging.getLogger("todoist_handler")


class TodoistHandler:
    """Handler for creating and managing Todoist tasks from wellness goals."""
    
    def __init__(self, api_token: str, project_id: Optional[str] = None):
        """Initialize Todoist API client.
        
        Args:
            api_token: Todoist API token
            project_id: Optional project ID to add tasks to
        """
        self.api = TodoistAPI(api_token)
        self.project_id = project_id
        logger.info("Todoist handler initialized")
    
    async def create_tasks(self, objectives: list[str]) -> dict:
        """Create Todoist tasks from objectives.
        
        Args:
            objectives: List of goal strings
            
        Returns:
            dict with 'created' count and 'task_ids' list
        """
        created_tasks = []
        
        for objective in objectives:
            try:
                # Format task content
                content = self._format_task_content(objective)
                
                # Prepare task parameters
                task_params = {
                    "content": content,
                    "due_string": "today",
                    "priority": 2,  # Medium priority (1=lowest, 4=highest)
                }
                
                # Add project if specified
                if self.project_id:
                    task_params["project_id"] = self.project_id
                
                # Create task
                task = self.api.add_task(**task_params)
                
                created_tasks.append(task.id)
                logger.info(f"✅ Created Todoist task: {content} (ID: {task.id})")
                
            except Exception as e:
                logger.error(f"❌ Failed to create task for '{objective}': {e}")
                continue
        
        return {
            "created": len(created_tasks),
            "task_ids": created_tasks
        }
    
    def _format_task_content(self, objective: str) -> str:
        """Format objective as task content.
        
        Args:
            objective: Raw objective string
            
        Returns:
            Formatted task content
        """
        # Clean up the objective
        content = objective.strip()
        
        # Capitalize first letter if needed
        if content and content[0].islower():
            content = content[0].upper() + content[1:]
        
        # Add wellness emoji if not too long
        if len(content) < 50:
            content = f"💚 {content}"
        
        return content
