from flask import Flask, render_template, request, jsonify
import os
import re

# Create Flask application
app = Flask(__name__)

# Route for the main page
@app.route('/')
def index():
    """Render the main index page"""
    return render_template('index.html')

# Route for API endpoints (if needed)
@app.route('/api/status')
def status():
    """Return the status of the application"""
    return jsonify({
        'status': 'running',
        'message': 'Flask app is working correctly!'
    })

# Sentiment analysis endpoint
@app.route('/emotionDetector')
def emotion_detector():
    """Analyze text sentiment and return emotion detection results"""
    text = request.args.get('textToAnalyze', '')
    
    if not text:
        return jsonify({'error': 'No text provided'}), 400
    
    # Simple sentiment analysis using keyword matching
    positive_words = ['happy', 'joy', 'good', 'great', 'excellent', 'love', 'amazing', 'wonderful', 'fantastic', 'awesome', 'beautiful', 'nice', 'perfect', 'brilliant', 'outstanding']
    negative_words = ['sad', 'bad', 'terrible', 'hate', 'awful', 'horrible', 'angry', 'disgusting', 'fear', 'anxious', 'worst', 'ugly', 'disappointing', 'frustrating', 'annoying']
    
    text_lower = text.lower()
    
    # Count positive and negative words
    positive_count = sum(1 for word in positive_words if word in text_lower)
    negative_count = sum(1 for word in negative_words if word in text_lower)
    
    # Determine sentiment and emotion
    if positive_count > negative_count:
        sentiment = 'Positive'
        emotion = 'Joy/Happiness'
        confidence = min(positive_count * 20, 100)
    elif negative_count > positive_count:
        sentiment = 'Negative'
        emotion = 'Sadness/Anger'
        confidence = min(negative_count * 20, 100)
    else:
        sentiment = 'Neutral'
        emotion = 'Neutral'
        confidence = 50
    
    # Return the analysis results
    return jsonify({
        'sentiment': sentiment,
        'emotion': emotion,
        'confidence': confidence,
        'text_analyzed': text
    })

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    # Get port from environment variable or use default 5000
    port = int(os.environ.get('PORT', 5000))
    
    # Run the application
    app.run(host='0.0.0.0', port=port, debug=True)
