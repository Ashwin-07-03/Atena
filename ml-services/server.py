#!/usr/bin/env python3
# server.py - ML Microservice for Atena

from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
import json
import traceback
from pomodoro_optimizer import PomodoroOptimizer

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize ML models
pomodoro_optimizer = PomodoroOptimizer()

# Load initial training data (in production, would load from database)
try:
    with open('data/pomodoro_training_data.json', 'r') as f:
        training_data = json.load(f)
    pomodoro_optimizer.train(training_data)
    logger.info(f"Loaded initial training data for pomodoro optimizer")
except Exception as e:
    logger.warning(f"Could not load initial training data: {str(e)}")
    # Create fake sample data for testing
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
    pomodoro_optimizer.train(sample_data)
    logger.info("Using sample training data for pomodoro optimizer")


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "models": {
            "pomodoro_optimizer": pomodoro_optimizer.is_trained
        }
    })


@app.route('/api/pomodoro/recommend', methods=['POST'])
def recommend_pomodoro():
    """Endpoint to recommend pomodoro settings"""
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No data provided"}), 400
            
        # Validate required fields
        required_fields = ['time_of_day', 'day_of_week', 'subject', 'difficulty', 'energy_level']
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({
                "error": f"Missing required fields: {', '.join(missing_fields)}"
            }), 400
            
        # Get recommendations
        recommendation = pomodoro_optimizer.recommend_pomodoro(data)
        
        # Add user data to response for context
        response = {
            "user_context": data,
            "recommendation": recommendation
        }
        
        return jsonify(response)
    except Exception as e:
        logger.error(f"Error processing recommend_pomodoro: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({
            "error": "Internal server error", 
            "details": str(e)
        }), 500


@app.route('/api/pomodoro/feedback', methods=['POST'])
def pomodoro_feedback():
    """Endpoint to submit session feedback for model improvement"""
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No data provided"}), 400
            
        # Validate required fields
        required_fields = ['time_of_day', 'day_of_week', 'subject', 
                          'difficulty', 'energy_level', 'session_length', 
                          'break_length', 'effectiveness']
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({
                "error": f"Missing required fields: {', '.join(missing_fields)}"
            }), 400
        
        # Add feedback to model
        pomodoro_optimizer.add_session_result(data)
        
        return jsonify({"status": "success", "message": "Feedback recorded"})
    except Exception as e:
        logger.error(f"Error processing pomodoro_feedback: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({
            "error": "Internal server error", 
            "details": str(e)
        }), 500


@app.route('/api/pomodoro/retrain', methods=['POST'])
def retrain_pomodoro():
    """Endpoint to retrain the pomodoro model with new data"""
    try:
        data = request.json
        if not data or not isinstance(data, list):
            return jsonify({"error": "Invalid data format. Expected a list of session records"}), 400
            
        # Retrain model
        pomodoro_optimizer.train(data)
        
        return jsonify({
            "status": "success", 
            "message": f"Model retrained with {len(data)} records"
        })
    except Exception as e:
        logger.error(f"Error processing retrain_pomodoro: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({
            "error": "Internal server error", 
            "details": str(e)
        }), 500


if __name__ == '__main__':
    # Create data directory if it doesn't exist
    import os
    os.makedirs('data', exist_ok=True)
    
    logger.info("Starting ML Microservice for Atena")
    app.run(host='0.0.0.0', port=5050, debug=True) 