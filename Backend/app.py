from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import sqlite3
import csv

app = Flask(__name__)
CORS(app)  # Allow frontend to access backend


# -----------------------------------------
# 🔹 Database Connection with WAL (Power BI Safe)
# -----------------------------------------
def get_db_connection():
    conn = sqlite3.connect("expenses.db", check_same_thread=False)
    conn.execute("PRAGMA journal_mode=WAL;")  # Enables non-blocking reads
    return conn


# -----------------------------------------
# 🔹 Initialize Database
# -----------------------------------------
def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS expenses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT NOT NULL,
            category TEXT NOT NULL,
            amount INTEGER NOT NULL,
            notes TEXT
        )
    ''')
    conn.commit()
    conn.close()


init_db()


# -----------------------------------------
# 🔹 API: Add Expense
# -----------------------------------------
@app.route('/add-expense', methods=['POST'])
def add_expense():
    data = request.get_json()

    date = data.get('date')
    category = data.get('category')
    amount = data.get('amount')
    notes = data.get('notes', '')

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO expenses (date, category, amount, notes)
        VALUES (?, ?, ?, ?)
    ''', (date, category, amount, notes))
    conn.commit()
    conn.close()

    return jsonify({'message': 'Expense added successfully'}), 201


# -----------------------------------------
# 🔹 API: Get All Expenses
# -----------------------------------------
@app.route('/expenses', methods=['GET'])
def get_expenses():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM expenses')
    rows = cursor.fetchall()
    conn.close()

    expenses = [{
        'id': row[0],
        'date': row[1],
        'category': row[2],
        'amount': row[3],
        'notes': row[4]
    } for row in rows]

    return jsonify(expenses)


# -----------------------------------------
# 🔹 API: Export CSV
# -----------------------------------------
@app.route('/export-csv', methods=['GET'])
def export_csv():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM expenses')
    rows = cursor.fetchall()
    conn.close()

    # Create CSV file
    with open('exported_expenses.csv', 'w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(['ID', 'Date', 'Category', 'Amount', 'Notes'])  # Header
        writer.writerows(rows)

    return send_file('exported_expenses.csv', as_attachment=True)


# -----------------------------------------
# 🔹 Run Flask Server
# -----------------------------------------
if __name__ == '__main__':
    app.run(debug=True)
