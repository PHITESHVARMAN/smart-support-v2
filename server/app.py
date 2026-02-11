from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime
from werkzeug.security import check_password_hash

app = Flask(__name__)

# Allowed methods for Admin updates
CORS(app, resources={r"/api/*": {"origins": "*"}}, methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:@localhost/smart_support_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# ---------------------------------
# 1. DATABASE MODELS
# ---------------------------------

class User(db.Model):
    __tablename__ = 'users'
    user_id = db.Column(db.Integer, primary_key=True) 
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role_id = db.Column(db.Integer, nullable=False)

class Ticket(db.Model):
    __tablename__ = 'tickets'
    ticket_id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(50))
    priority = db.Column(db.String(20))
    status = db.Column(db.String(20), default='Open')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    created_by = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=True)

class Message(db.Model):
    __tablename__ = 'comments' 
    id = db.Column(db.Integer, primary_key=True)
    ticket_id = db.Column(db.Integer, db.ForeignKey('tickets.ticket_id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    message = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# ---------------------------------
# 2. API ROUTES
# ---------------------------------

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(username=data['username']).first()
    if user and (user.password_hash == data['password'] or check_password_hash(user.password_hash, data['password'])):
        return jsonify({
            'user': {'id': user.user_id, 'username': user.username, 'role_id': user.role_id}
        }), 200
    return jsonify({'message': 'Invalid credentials'}), 401

@app.route('/api/tickets', methods=['POST'])
def create_ticket():
    data = request.json
    try:
        new_ticket = Ticket(
            title=data['title'], description=data['description'],
            category=data['category'], priority=data['priority'],
            created_by=data['user_id'] 
        )
        db.session.add(new_ticket)
        db.session.commit()
        return jsonify({'message': 'Ticket created'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/my_tickets', methods=['GET'])
def get_my_tickets():
    u_id = request.args.get('user_id')
    tickets = Ticket.query.filter_by(created_by=u_id).all()
    # Map ticket_id to 'id' so Frontend React code works
    return jsonify([{'id': t.ticket_id, 'title': t.title, 'status': t.status, 'priority': t.priority, 'category': t.category, 'description': t.description} for t in tickets]), 200

@app.route('/api/tickets', methods=['GET'])
def get_all_tickets():
    tickets = Ticket.query.all()
    return jsonify([{'id': t.ticket_id, 'title': t.title, 'status': t.status, 'priority': t.priority, 'category': t.category, 'description': t.description} for t in tickets]), 200

@app.route('/api/tickets/<int:t_id>', methods=['PUT'])
def update_ticket(t_id):
    data = request.json
    try:
        # Use filter_by to ensure we hit the correct ticket_id
        ticket = Ticket.query.filter_by(ticket_id=t_id).first()
        if not ticket:
            return jsonify({'message': 'Ticket not found'}), 404
        
        if 'status' in data: ticket.status = data['status']
        if 'priority' in data: ticket.priority = data['priority']
        
        db.session.commit()
        return jsonify({'message': 'Ticket updated'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# NEW: Route to allow Admin to post a resolution comment
@app.route('/api/comments', methods=['POST'])
def add_comment():
    data = request.json
    try:
        new_msg = Message(ticket_id=data['ticket_id'], user_id=data['user_id'], message=data['message'])
        db.session.add(new_msg)
        db.session.commit()
        return jsonify({'message': 'Comment added'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5000)