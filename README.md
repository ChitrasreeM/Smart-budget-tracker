<h1 align="center">Smart Budget Tracker</h1>
<h3 align="center">by Chitra Sree M</h3>

---

## Introduction

Smart Budget Tracker is a full-stack web application designed to record, manage, and analyze daily expenses. The system provides visual insights, category-wise breakdowns, and data export options. It also integrates with Power BI for enhanced analytics and reporting.

---

## Features

### 1. Frontend
- User-friendly interface for adding daily expenses  
- Category-wise input with amount, date, and description  
- Responsive design using HTML, CSS, and JavaScript  
- Dynamic pie chart for category distribution using Chart.js  
- Automatic total expense calculation  

### 2. Backend (Flask)
- REST API developed using Python and Flask  
- Handles form submissions and validations  
- Stores all expense data in a SQLite database  
- Supports CSV/Excel export functionality  

### 3. Database (SQLite)
- Centralized database stored inside `Backend/`  
- Data fields: date, category, amount, description  
- Fully compatible with ODBC for Power BI integration  

### 4. Export Features
- Download complete expense data as CSV (`exported_expenses.csv`)  
- Exported data can be directly analyzed using Power BI or Excel  

### 5. Power BI Integration
- SQLite database connected to Power BI via ODBC  
- Dashboards built for:  
  - Monthly spending summary  
  - Category-wise analysis  
  - Spending trends and patterns  
- Suitable for academic presentations and portfolio demonstrations  



## Project Structure
```
Smart-Budget-Tracker/
│
├── Frontend/
│ ├── index.html
│ ├── styles.css
│ └── script.js
│
├── Backend/
│ ├── app.py
│ ├── expenses.db
│ └── exported_expenses.csv
│
└── README.md
```


## How It Works

1. The user enters an expense through the frontend interface.  
2. The frontend sends the data to the backend using an API request.  
3. Flask processes the request and stores the data in SQLite.  
4. The frontend updates the total and pie chart in real time.  
5. Users can export the full dataset as a CSV file.  
6. Power BI reads the SQLite database for advanced visual analytics.

---

## Technologies Used

- **Frontend:** HTML, CSS, JavaScript  
- **Backend:** Python, Flask  
- **Database:** SQLite  
- **Visualization:** Chart.js  
- **Analytics:** Power BI  
- **Version Control:** Git and GitHub  

---

## Future Enhancements

- User authentication system  
- Multi-page dashboard layout  
- AI-based insights generation  
- Monthly budget predictions  
- Dark and light mode support  

---

## Author

**Chitra Sree M**  
Developer and creator of the Smart Budget Tracker application.

