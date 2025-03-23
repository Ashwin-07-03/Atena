#!/usr/bin/env python3
"""
Simple mock server for the Pomodoro ML service
"""
import os
import json
import logging
import http.server
import time
from datetime import datetime

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger("mock-ml-server")

# Ensure data directory exists
os.makedirs("data", exist_ok=True)

# Default recommendation
DEFAULT_RECOMMENDATION = {
    "pomodoro_minutes": 25,
    "break_minutes": 5,
    "long_break_minutes": 15,
    "sessions_until_long_break": 4,
    "confidence": 0.8
}

class MockMLHandler(http.server.BaseHTTPRequestHandler):
    def _set_headers(self, status_code=200, content_type="application/json"):
        self.send_response(status_code)
        self.send_header("Content-type", content_type)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_OPTIONS(self):
        self._set_headers()
        
    def do_GET(self):
        if self.path == "/health":
            # Health check endpoint
            response = {
                "status": "healthy",
                "model_trained": True,
                "timestamp": datetime.now().isoformat()
            }
            self._set_headers()
            self.wfile.write(json.dumps(response).encode())
            return

        # Not found
        self._set_headers(404)
        self.wfile.write(json.dumps({"error": "Not found"}).encode())

    def do_POST(self):
        content_length = int(self.headers["Content-Length"])
        post_data = self.rfile.read(content_length)
        
        # Parse JSON data
        try:
            data = json.loads(post_data.decode("utf-8"))
        except json.JSONDecodeError:
            self._set_headers(400)
            self.wfile.write(json.dumps({"error": "Invalid JSON"}).encode())
            return

        # Handle API endpoints
        if self.path == "/api/pomodoro/recommend":
            self._handle_recommend(data)
        elif self.path == "/api/pomodoro/feedback":
            self._handle_feedback(data)
        elif self.path == "/api/pomodoro/retrain":
            self._handle_retrain()
        else:
            # Not found
            self._set_headers(404)
            self.wfile.write(json.dumps({"error": "Not found"}).encode())

    def _handle_recommend(self, data):
        """Handle recommendation requests"""
        logger.info(f"Recommendation request: {data}")
        
        # Generate a mock recommendation based on input
        context = data.get("context", {})
        difficulty = context.get("difficulty", 3)
        energy_level = context.get("energy_level", 3)
        
        # Adjust recommendation based on context
        recommendation = dict(DEFAULT_RECOMMENDATION)
        
        # More difficult tasks get slightly longer sessions
        if difficulty > 3:
            recommendation["pomodoro_minutes"] += min(difficulty - 3, 2) * 5
        
        # Low energy gets shorter sessions
        if energy_level < 3:
            recommendation["pomodoro_minutes"] = max(15, recommendation["pomodoro_minutes"] - 5)
            recommendation["break_minutes"] += 2
        
        response = {
            "success": True,
            "recommendation": recommendation,
            "user_context": context
        }
        
        self._set_headers()
        self.wfile.write(json.dumps(response).encode())

    def _handle_feedback(self, data):
        """Handle feedback submissions"""
        logger.info(f"Feedback received: {data}")
        
        # In a real implementation, we would store this feedback for model training
        # Here we just acknowledge receipt
        
        # Save to a feedback log
        with open("data/feedback_log.jsonl", "a") as f:
            f.write(json.dumps(data) + "\n")
            
        response = {
            "success": True,
            "message": "Feedback recorded"
        }
        
        self._set_headers()
        self.wfile.write(json.dumps(response).encode())

    def _handle_retrain(self):
        """Handle retrain requests"""
        logger.info("Retraining requested")
        
        # Simulate retraining delay
        time.sleep(1)
        
        response = {
            "success": True,
            "message": "Model retrained successfully"
        }
        
        self._set_headers()
        self.wfile.write(json.dumps(response).encode())

def run(server_class=http.server.HTTPServer, handler_class=MockMLHandler, port=5050):
    server_address = ("", port)
    httpd = server_class(server_address, handler_class)
    logger.info(f"Starting Mock ML server on port {port}")
    httpd.serve_forever()

if __name__ == "__main__":
    run() 