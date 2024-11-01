from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit, join_room
import pandas as pd
from datetime import datetime

app = Flask(__name__)
socketio = SocketIO(app)
file_path = 'points_tracking.xlsx'

# Load initial data from the Excel sheet
def load_data():
    return pd.read_excel(file_path)

# Route to render the dashboard
@app.route('/')
def index():
    data = load_data().to_dict(orient='records')
    return render_template('index.html', data=data)

# Add client to "all" room on connect
@socketio.on('connect')
def on_connect():
    join_room('all')

# Endpoint to update points
@app.route('/update_points', methods=['POST'])
def update_points():
    team = request.form.get('team')
    individual = request.form.get('individual')
    event_name = request.form.get('event_name')
    points = int(request.form.get('points'))
    
    # Load existing data
    df = load_data()
    
    # Create a new entry with a string timestamp
    new_entry = pd.DataFrame({
        "Team Name": [team],
        "Individual Name": [individual],
        "Event Name": [event_name],
        "Points": [points],
        "Timestamp": [datetime.now().strftime('%Y-%m-%d %H:%M:%S')]
    })
    
    # Concatenate the new entry and save back to Excel
    df = pd.concat([df, new_entry], ignore_index=True)
    df.to_excel(file_path, index=False)
    
    # Emit an update to all connected clients in the "all" room
    socketio.emit('new_event', new_entry.to_dict(orient='records')[0], to='all')
    
    return "Points updated", 200


if __name__ == '__main__':
    socketio.run(app, debug=True)
