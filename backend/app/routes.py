from flask import request, jsonify
from bson.objectid import ObjectId
from app import app, mongo
from app.firebase_config import messaging

@app.route('/api/flights', methods=['GET'])
def get_flights():
    flights = mongo.db.flights.find()
    flights_list = []
    for flight in flights:
        flight['_id'] = str(flight['_id'])  # Convert ObjectId to string
        flight['subscribed_users'] = [str(user_id) for user_id in flight.get('subscribed_users', [])]  # Convert ObjectIds to strings
        flights_list.append(flight)
    return jsonify(flights_list), 200

@app.route('/api/flights', methods=['POST'])
def add_flight():
    data = request.json
    if not all(key in data for key in ('number', 'status', 'gate', 'time_of_departure', 'from', 'to')):
        return jsonify({'error': 'Invalid data'}), 400
    flight_id = mongo.db.flights.insert_one(data).inserted_id
    return jsonify({'id': str(flight_id)}), 201

@app.route('/api/flights/<id>', methods=['PUT'])
def update_flight(id):
    data = request.json
    if not all(key in data for key in ('status', 'gate', 'time_of_departure')):
        return jsonify({'error': 'Invalid data'}), 400

    flight = mongo.db.flights.find_one({'_id': ObjectId(id)})
    if not flight:
        return jsonify({'error': 'Flight not found'}), 404

    # Update flight information
    mongo.db.flights.update_one(
        {'_id': ObjectId(id)},
        {'$set': {'status': data['status'], 'gate': data['gate'], 'time_of_departure': data['time_of_departure']}}
    )

    # Retrieve tokens for subscribed users
    subscribed_user_ids = flight.get('subscribed_users', [])
    users = mongo.db.users.find({'_id': {'$in': [ObjectId(user_id) for user_id in subscribed_user_ids]}})
    token_list = [user['token'] for user in users]

    # Construct the message body
    message_body = f"Flight {flight['number']} has been updated:\n"
    if flight['status'] != data['status']:
        message_body += f"- Status: {flight['status']} -> {data['status']}\n"
    if flight['gate'] != data['gate']:
        message_body += f"- Gate: {flight['gate']} -> {data['gate']}\n"
    if flight['time_of_departure'] != data['time_of_departure']:
        message_body += f"- Time of Departure: {flight['time_of_departure']} -> {data['time_of_departure']}"

    if token_list:
        # Send notification to subscribed users
        message = messaging.MulticastMessage(
            notification=messaging.Notification(
                title='Flight Status Updated',
                body=message_body,
            ),
            tokens=token_list,
        )

        try:
            response = messaging.send_multicast(message)
            print(f'Successfully sent message: {response}')
        except Exception as e:
            print(f'Error sending message: {e}')

    return jsonify({'message': 'Flight updated'}), 200


@app.route('/api/flights/<id>', methods=['DELETE'])
def delete_flight(id):
    result = mongo.db.flights.delete_one({'_id': ObjectId(id)})
    if result.deleted_count == 0:
        return jsonify({'error': 'Flight not found'}), 404
    return jsonify({'message': 'Flight deleted'}), 200

@app.route('/api/tokens', methods=['POST'])
def register_token():
    data = request.json
    if 'token' not in data:
        return jsonify({'error': 'Token is required'}), 400

    token = data['token']
    user_id = data.get('user_id')  # Optional, if you want to associate tokens with users

    # Store or update the token in your database
    mongo.db.tokens.update_one(
        {'token': token},
        {'$set': {'user_id': user_id}},
        upsert=True
    )

    return jsonify({'message': 'Token registered'}), 200

@app.route('/api/flights/subscribe', methods=['POST'])
def subscribe_to_flight():
    data = request.json
    flight_id = data.get('flightId')
    token = data.get('token')

    if not flight_id or not token:
        return jsonify({'error': 'Flight ID and token are required'}), 400

    # Find the user associated with the token
    user = mongo.db.users.find_one({'token': token})
    if not user:
        return jsonify({'error': 'User not found'}), 404

    user_id = str(user['_id'])

    # Add the user ID (as string) to the flight's subscribed_users list
    result = mongo.db.flights.update_one(
        {'_id': ObjectId(flight_id)},
        {'$addToSet': {'subscribed_users': user_id}}
    )

    if result.matched_count == 0:
        return jsonify({'error': 'Flight not found'}), 404

    return jsonify({'message': 'Successfully subscribed to flight'}), 200

@app.route('/api/users', methods=['POST'])
def register_user():
    data = request.json
    if not all(key in data for key in ('name', 'email', 'token')):
        return jsonify({'error': 'Invalid data'}), 400

    # Check if user already exists
    existing_user = mongo.db.users.find_one({'email': data['email']})
    if existing_user:
        return jsonify({'error': 'User already exists'}), 400

    # Insert new user
    user_id = mongo.db.users.insert_one(data).inserted_id
    return jsonify({'id': str(user_id)}), 201

@app.route('/api/users', methods=['GET'])
def get_user_by_token():
    token = request.args.get('token')
    if not token:
        return jsonify({'error': 'Token is required'}), 400

    user = mongo.db.users.find_one({'token': token})
    if not user:
        return jsonify({'error': 'User not found'}), 404

    user['_id'] = str(user['_id'])
    return jsonify(user), 200

