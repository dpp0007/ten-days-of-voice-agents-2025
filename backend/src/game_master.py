import json
import random
import logging
from typing import Dict, List, Any
from pathlib import Path

logger = logging.getLogger("game_master")


class GameMaster:
    """Manages the D&D-style game state, character, and world."""
    
    def __init__(self):
        self.world_state = self._initialize_world()
        
    def _initialize_world(self) -> Dict[str, Any]:
        """Initialize a fresh game world state."""
        return {
            "player": {
                "name": "Unknown",
                "class": "Marked One",
                "hp": 20,
                "max_hp": 20,
                "status": "Stable",
                "attributes": {
                    "strength": 12,
                    "intelligence": 12,
                    "luck": 12
                },
                "inventory": []
            },
            "location": {
                "name": "Broken Sky-Temple",
                "description": "A shattered temple floating above the endless storm",
                "visited": True
            },
            "npcs": {},
            "events": [],
            "quests": {
                "active": ["Discover the meaning of the glowing mark"],
                "completed": []
            },
            "turn_count": 0
        }
    
    def get_world_state(self) -> Dict[str, Any]:
        """Get the current world state."""
        return self.world_state
    
    def update_player_hp(self, amount: int) -> str:
        """Update player HP and return status message."""
        old_hp = self.world_state["player"]["hp"]
        self.world_state["player"]["hp"] = max(0, min(
            self.world_state["player"]["max_hp"],
            old_hp + amount
        ))
        new_hp = self.world_state["player"]["hp"]
        
        # Update status
        if new_hp == 0:
            self.world_state["player"]["status"] = "Dead"
            return f"HP changed from {old_hp} to {new_hp}. You have fallen!"
        elif new_hp <= 5:
            self.world_state["player"]["status"] = "Critical"
        elif new_hp <= 10:
            self.world_state["player"]["status"] = "Injured"
        else:
            self.world_state["player"]["status"] = "Healthy"
        
        change = "gained" if amount > 0 else "lost"
        return f"You {change} {abs(amount)} HP. Current HP: {new_hp}/{self.world_state['player']['max_hp']}"
    
    def add_to_inventory(self, item: str) -> str:
        """Add an item to player inventory."""
        self.world_state["player"]["inventory"].append(item)
        return f"Added {item} to your inventory."
    
    def remove_from_inventory(self, item: str) -> str:
        """Remove an item from player inventory."""
        if item in self.world_state["player"]["inventory"]:
            self.world_state["player"]["inventory"].remove(item)
            return f"Removed {item} from your inventory."
        return f"You don't have {item} in your inventory."
    
    def get_inventory(self) -> str:
        """Get player inventory as a string."""
        items = self.world_state["player"]["inventory"]
        if not items:
            return "Your inventory is empty."
        return f"You are carrying: {', '.join(items)}"
    
    def get_character_sheet(self) -> str:
        """Get full character information."""
        player = self.world_state["player"]
        attrs = player["attributes"]
        return (
            f"Character: {player['name']} the {player['class']}\n"
            f"HP: {player['hp']}/{player['max_hp']} ({player['status']})\n"
            f"Strength: {attrs['strength']}, Intelligence: {attrs['intelligence']}, Luck: {attrs['luck']}\n"
            f"Inventory: {', '.join(player['inventory']) if player['inventory'] else 'Empty'}"
        )
    
    def roll_dice(self, sides: int = 20, modifier: int = 0) -> Dict[str, Any]:
        """Roll a dice and return result with modifier."""
        roll = random.randint(1, sides)
        total = roll + modifier
        
        # Determine success level (for d20)
        if sides == 20:
            if roll == 20:
                result = "Critical Success"
            elif roll == 1:
                result = "Critical Failure"
            elif total >= 15:
                result = "Success"
            elif total >= 10:
                result = "Partial Success"
            else:
                result = "Failure"
        else:
            result = "Roll"
        
        return {
            "roll": roll,
            "modifier": modifier,
            "total": total,
            "result": result
        }
    
    def make_check(self, attribute: str, difficulty: int = 10) -> Dict[str, Any]:
        """Make an attribute check (Strength, Intelligence, or Luck)."""
        attr_value = self.world_state["player"]["attributes"].get(attribute.lower(), 10)
        modifier = (attr_value - 10) // 2  # D&D-style modifier
        
        dice_result = self.roll_dice(20, modifier)
        dice_result["attribute"] = attribute
        dice_result["difficulty"] = difficulty
        dice_result["success"] = dice_result["total"] >= difficulty
        
        return dice_result
    
    def update_location(self, name: str, description: str) -> str:
        """Update the current location."""
        self.world_state["location"] = {
            "name": name,
            "description": description,
            "visited": True
        }
        return f"You have arrived at: {name}"
    
    def add_event(self, event: str) -> None:
        """Record an important event."""
        self.world_state["events"].append({
            "turn": self.world_state["turn_count"],
            "description": event
        })
    
    def add_npc(self, name: str, role: str, attitude: str = "neutral") -> str:
        """Add or update an NPC."""
        self.world_state["npcs"][name] = {
            "role": role,
            "attitude": attitude,
            "alive": True
        }
        return f"Met {name}, a {role} who seems {attitude}."
    
    def complete_quest(self, quest: str) -> str:
        """Mark a quest as completed."""
        if quest in self.world_state["quests"]["active"]:
            self.world_state["quests"]["active"].remove(quest)
            self.world_state["quests"]["completed"].append(quest)
            return f"Quest completed: {quest}"
        return "Quest not found in active quests."
    
    def add_quest(self, quest: str) -> str:
        """Add a new quest."""
        self.world_state["quests"]["active"].append(quest)
        return f"New quest: {quest}"
    
    def increment_turn(self) -> None:
        """Increment the turn counter."""
        self.world_state["turn_count"] += 1
    
    def save_game(self, filepath: str = "game_save.json") -> str:
        """Save the current game state to a file."""
        save_path = Path("src/saves") / filepath
        save_path.parent.mkdir(exist_ok=True)
        
        with open(save_path, 'w') as f:
            json.dump(self.world_state, f, indent=2)
        
        logger.info(f"Game saved to {save_path}")
        return f"Game saved successfully to {filepath}"
    
    def load_game(self, filepath: str = "game_save.json") -> str:
        """Load a game state from a file."""
        save_path = Path("src/saves") / filepath
        
        if not save_path.exists():
            return f"Save file {filepath} not found."
        
        with open(save_path, 'r') as f:
            self.world_state = json.load(f)
        
        logger.info(f"Game loaded from {save_path}")
        return f"Game loaded successfully from {filepath}"
    
    def reset_game(self) -> str:
        """Reset the game to initial state."""
        self.world_state = self._initialize_world()
        return "Game has been reset. A new adventure begins!"
