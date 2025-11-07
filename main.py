from flask import Flask, render_template, request, redirect, url_for, session
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3

app = Flask(__name__)
app.secret_key = 'change-this-secret'

def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/index', methods=['GET'])
def show_index_page():
    return render_template('index.html')

@app.route('/process_register', methods=['POST'])
def register_user():
    name = request.form['username']
    email = request.form['email']
    password = request.form['password']

    hashed_password = generate_password_hash(password)
    conn = get_db_connection()
    try:
        conn.execute(
            "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
            (name, email, hashed_password)
        )
        conn.commit()
        return redirect(url_for('show_index_page'))
    except sqlite3.IntegrityError:
        # e.g. username/email already exists
        return redirect(url_for('show_index_page', error="Error: Username may be taken."))
    finally:
        conn.close()

@app.route('/process_login', methods=['POST'])
def login_user():
    # accept either 'username' or legacy 'name' field
    name = request.form.get('username') or request.form.get('name')
    password = request.form['password']

    conn = get_db_connection()
    user = conn.execute("SELECT id, password FROM users WHERE username = ?", (name,)).fetchone()
    conn.close()
    if user and check_password_hash(user['password_hash'], password):
        session['user_id'] = user['id']
        return redirect(url_for('show_index_page'))
    return redirect(url_for('show_index_page', error="Invalid credentials"))
          
               



