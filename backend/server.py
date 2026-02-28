"""
Adukala Navigator – Python Flask Backend
Run: pip install flask flask-cors && python server.py
Then open: http://localhost:5000
"""

from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import json, os, time

app = Flask(__name__, static_folder='.')
CORS(app)

DATA_FILE = 'user_spots.json'

def load_spots():
    if not os.path.exists(DATA_FILE):
        return []
    with open(DATA_FILE, 'r') as f:
        return json.load(f)

def save_spots(spots):
    with open(DATA_FILE, 'w') as f:
        json.dump(spots, f, indent=2)

# ── Serve frontend ────────────────────────────────



# ── API: Get all user-submitted spots ─────────────
@app.route('/api/spots', methods=['GET'])
def get_spots():
    return jsonify(load_spots())

# ── API: Add a new spot ───────────────────────────
@app.route('/api/spots', methods=['POST'])
def add_spot():
    data = request.json
    required = ['name', 'area', 'lat', 'lng', 'desc']
    for field in required:
        if not data.get(field):
            return jsonify({'error': f'Missing field: {field}'}), 400

    lat, lng = float(data['lat']), float(data['lng'])
    if not (9 <= lat <= 11 and 75 <= lng <= 77):
        return jsonify({'error': 'Coordinates must be in Kochi region'}), 400

    spot = {
        'id': int(time.time() * 1000),
        'name': data['name'],
        'area': data['area'],
        'lat': lat,
        'lng': lng,
        'type': data.get('type', 'hidden'),
        'desc': data['desc'],
        'price': data.get('price', '₹?'),
        'timing': data.get('timing', 'Unknown'),
        'must': data.get('must', 'Ask the owner'),
        'contact': data.get('contact', ''),
        'rating': float(data.get('rating', 4.0)),
        'photos': data.get('photos', []),
        'menu': data.get('menu', []),
        'reviews': [],
        'emoji': '📍'
    }
    spots = load_spots()
    spots.append(spot)
    save_spots(spots)
    return jsonify(spot), 201

# ── API: Add review to a spot ─────────────────────
@app.route('/api/spots/<int:spot_id>/reviews', methods=['POST'])
def add_review(spot_id):
    data = request.json
    spots = load_spots()
    spot = next((s for s in spots if s['id'] == spot_id), None)
    if not spot:
        return jsonify({'error': 'Spot not found'}), 404
    review = {
        'name': data.get('name', 'Anonymous'),
        'rating': int(data.get('rating', 5)),
        'text': data.get('text', '')
    }
    spot.setdefault('reviews', []).append(review)
    save_spots(spots)
    return jsonify(review), 201

# ── API: Get all spots (combined) ─────────────────
@app.route('/api/all', methods=['GET'])
def get_all():
    return jsonify({'count': len(load_spots()), 'spots': load_spots()})

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 10000))
    print(f"🍛 Adukala Navigator backend running on port {port}")
    app.run(host="0.0.0.0", port=port)