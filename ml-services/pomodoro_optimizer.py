#!/usr/bin/env python3
# pomodoro_optimizer.py

import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
import json
from typing import Dict, List, Optional, Tuple, Union
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class PomodoroOptimizer:
    """
    Machine learning model to optimize pomodoro session durations
    based on user study patterns and preferences.
    """
    
    def __init__(self):
        self.model = RandomForestRegressor(
            n_estimators=100,
            max_depth=10,
            random_state=42
        )
        self.scaler = StandardScaler()
        self.is_trained = False
        logger.info("PomodoroOptimizer initialized")
    
    def preprocess_data(self, data: List[Dict]) -> Tuple[np.ndarray, np.ndarray]:
        """
        Preprocess user study data for model training.
        
        Args:
            data: List of study session records
                Each record should have:
                - 'time_of_day': int (0-23)
                - 'day_of_week': int (0-6)
                - 'subject': str
                - 'difficulty': int (1-5)
                - 'energy_level': int (1-5)
                - 'focus_score': int (1-5)
                - 'session_length': int (minutes)
                - 'break_length': int (minutes)
                - 'effectiveness': float (0-1)
        
        Returns:
            Tuple of (X_scaled, y) for model training
        """
        df = pd.DataFrame(data)
        
        # One-hot encode categorical features
        df_encoded = pd.get_dummies(df, columns=['subject'])
        
        # Features and target
        X = df_encoded.drop('effectiveness', axis=1)
        y = df_encoded['effectiveness']
        
        # Scale features
        X_scaled = self.scaler.fit_transform(X)
        
        return X_scaled, y.values
    
    def train(self, data: List[Dict]) -> None:
        """
        Train the pomodoro optimization model.
        
        Args:
            data: List of historical study session records
        """
        if not data:
            logger.warning("Empty training data provided")
            return
        
        try:
            X, y = self.preprocess_data(data)
            self.model.fit(X, y)
            self.is_trained = True
            logger.info(f"Model trained successfully on {len(data)} records")
        except Exception as e:
            logger.error(f"Error training model: {str(e)}")
            raise
    
    def recommend_pomodoro(self, user_context: Dict) -> Dict:
        """
        Recommend optimal pomodoro and break durations.
        
        Args:
            user_context: Dict with context for the study session
                Should include:
                - 'time_of_day': int (0-23)
                - 'day_of_week': int (0-6)
                - 'subject': str
                - 'difficulty': int (1-5)
                - 'energy_level': int (1-5)
        
        Returns:
            Dict with recommended pomodoro settings
        """
        if not self.is_trained:
            logger.warning("Model not trained, returning default recommendations")
            return {
                "pomodoro_minutes": 25,
                "break_minutes": 5,
                "long_break_minutes": 15,
                "sessions_until_long_break": 4,
                "confidence": 0.5  # Medium confidence for default values
            }
        
        try:
            # For real implementation, would need to properly transform the user_context
            # to match the training data structure with one-hot encoding
            # This is simplified for the example
            pomodoro_options = [15, 20, 25, 30, 35, 40, 45]
            break_options = [3, 5, 7, 10]
            
            # Base recommendation on user's energy level and task difficulty
            energy = user_context.get('energy_level', 3)
            difficulty = user_context.get('difficulty', 3)
            
            # Lower energy or higher difficulty → shorter sessions
            energy_difficulty_factor = (energy - difficulty + 5) / 5
            
            # Calculate recommended pomodoro length based on energy and difficulty
            pomodoro_idx = min(
                max(0, int(energy_difficulty_factor * len(pomodoro_options) - 1)),
                len(pomodoro_options) - 1
            )
            pomodoro_minutes = pomodoro_options[pomodoro_idx]
            
            # Calculate break length - more difficult tasks get longer breaks
            break_idx = min(
                max(0, int((6 - energy_difficulty_factor) * len(break_options) / 5)),
                len(break_options) - 1
            )
            break_minutes = break_options[break_idx]
            
            return {
                "pomodoro_minutes": pomodoro_minutes,
                "break_minutes": break_minutes,
                "long_break_minutes": max(15, break_minutes * 2),
                "sessions_until_long_break": 4 if energy > 3 else 3,
                "confidence": 0.7  # Higher confidence for trained model
            }
            
        except Exception as e:
            logger.error(f"Error generating recommendation: {str(e)}")
            # Fallback to default values
            return {
                "pomodoro_minutes": 25,
                "break_minutes": 5,
                "long_break_minutes": 15,
                "sessions_until_long_break": 4,
                "confidence": 0.5
            }

    def add_session_result(self, session_data: Dict) -> None:
        """
        Add completed session results for incremental learning.
        
        Args:
            session_data: Dict with session results including effectiveness
        """
        # In a real implementation, this would store the data
        # and periodically retrain the model
        logger.info(f"Session data received: {json.dumps(session_data)}")
        # Placeholder for incremental learning logic


# Example usage
if __name__ == "__main__":
    # Sample data
    sample_data = [
        {
            "time_of_day": 10, 
            "day_of_week": 1,
            "subject": "math",
            "difficulty": 4,
            "energy_level": 5,
            "focus_score": 4,
            "session_length": 30,
            "break_length": 5,
            "effectiveness": 0.85
        },
        {
            "time_of_day": 14, 
            "day_of_week": 3,
            "subject": "history",
            "difficulty": 2,
            "energy_level": 3,
            "focus_score": 3,
            "session_length": 25,
            "break_length": 5,
            "effectiveness": 0.75
        },
        {
            "time_of_day": 20, 
            "day_of_week": 5,
            "subject": "programming",
            "difficulty": 5,
            "energy_level": 2,
            "focus_score": 2,
            "session_length": 20,
            "break_length": 7,
            "effectiveness": 0.65
        }
    ]
    
    optimizer = PomodoroOptimizer()
    optimizer.train(sample_data)
    
    current_context = {
        "time_of_day": 15,
        "day_of_week": 2,
        "subject": "physics",
        "difficulty": 4,
        "energy_level": 3
    }
    
    recommendation = optimizer.recommend_pomodoro(current_context)
    print(f"Recommended pomodoro settings: {json.dumps(recommendation, indent=2)}") 