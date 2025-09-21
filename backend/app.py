# backend/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS

# Initialize the Flask application
app = Flask(__name__)

# Enable Cross-Origin Resource Sharing (CORS)
# This is crucial to allow your React frontend (running on a different port)
# to communicate with this Python backend.
CORS(app)

@app.route('/api/battle/resolve-turn', methods=['POST'])
def resolve_quiz_turn():
    """
    This endpoint resolves a single turn of the quiz battle.
    It takes the current game state and whether the user's answer was correct,
    then returns the updated game state.
    """
    # 1. Get the data sent from the frontend's request body
    data = request.get_json()

    # --- Input Validation ---
    # Ensure all required data is present
    required_keys = ['wasAnswerCorrect', 'playerHealth', 'bossHealth']
    if not all(key in data for key in required_keys):
        return jsonify({"error": "Missing required data"}), 400

    was_answer_correct = data.get('wasAnswerCorrect')
    player_health = data.get('playerHealth')
    boss_health = data.get('bossHealth')
    
    # 2. Apply the Battle Logic based on your rules
    if was_answer_correct:
        # If the answer is correct, the boss takes 1 damage
        boss_health -= 1
        message = "Correct! The opponent takes 1 point of damage."
        target = "boss"
    else:
        # If the answer is incorrect, the player takes 1 damage
        player_health -= 1
        message = "Incorrect! You take 1 point of damage."
        target = "player"

    # 3. Prepare the response to send back to the frontend
    response_data = {
        'newPlayerHealth': max(0, player_health), # Ensure health doesn't go below 0
        'newBossHealth': max(0, boss_health),   # Ensure health doesn't go below 0
        'target': target,
        'damageDealt': 1,
        'message': message,
    }

    # Return the response as a JSON object
    return jsonify(response_data)


# This block allows you to run the server directly from the command line
if __name__ == '__main__':
    # The server will run in debug mode on http://127.0.0.1:5000
    app.run(debug=True, port=5000)