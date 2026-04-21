# SalaryIQ - Intelligent Salary Prediction Frontend

A professional, feature-rich web application for predicting salaries based on professional attributes using Machine Learning.

## Features

### Core Features
- **🎯 Salary Prediction**: Get instant salary predictions based on age, gender, education level, job title, and experience
- **📊 Salary Comparison**: Compare predicted salaries across different job roles and career paths
- **📈 Career Path Guidance**: Get personalized career development recommendations
- **📝 Prediction History**: View and track all your previous predictions
- **📉 Industry Insights**: Explore salary trends by age, education level, and job role

### Extra Features
- **Real-time Predictions**: Instant results with visual insights
- **Percentile Analysis**: Understand where you stand relative to peers
- **Salary Range Visualization**: See min/max/average salaries for your profile
- **Download Reports**: Export detailed prediction reports as text files
- **Share Results**: Share your predictions on social media
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Professional UI**: Modern, clean interface with smooth animations
- **Interactive Charts**: Visual representation of salary trends and comparisons

## Technology Stack

**Backend:**
- Flask (Python Web Framework)
- scikit-learn (Machine Learning)
- pandas & numpy (Data Processing)
- Flask-CORS (Cross-Origin Resource Sharing)

**Frontend:**
- HTML5
- CSS3 (with responsive design)
- Vanilla JavaScript
- Chart.js (Data Visualization)
- Font Awesome (Icons)

## Installation

### Prerequisites
- Python 3.8+
- pip (Python package manager)

### Setup Instructions

1. **Navigate to the project directory:**
   ```bash
   cd d:\salary_prediction_ML
   ```

2. **Create and activate a virtual environment:**
   ```bash
   # On Windows
   python -m venv venv
   venv\Scripts\activate
   
   # On macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install required packages:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the Flask application:**
   ```bash
   python app.py
   ```

5. **Open your browser and navigate to:**
   ```
   http://localhost:5000
   ```

## Project Structure

```
salary_prediction_ML/
├── app.py                 # Flask backend application
├── new_salary_model.pkl   # Trained ML model
├── requirements.txt       # Python dependencies
├── templates/
│   └── index.html        # Main HTML template
└── static/
    ├── style.css         # Styling
    └── script.js         # Frontend JavaScript
```

## API Endpoints

### POST `/api/predict`
Make a salary prediction based on user profile.

**Request:**
```json
{
  "age": 30,
  "gender": "Male",
  "education": "Master",
  "jobTitle": "Senior Developer",
  "experience": 5
}
```

**Response:**
```json
{
  "predictedSalary": 85000,
  "salaryRange": {
    "min": 55000,
    "max": 120000,
    "avg": 75000
  },
  "percentile": 75.5,
  "insights": ["Career milestone achieved", "Room for growth"],
  "careerPath": [{"title": "Lead Developer", "years": "3-5 years", "action": "Lead team projects"}]
}
```

### GET `/api/history`
Retrieve prediction history (last 20 records).

### POST `/api/clear-history`
Clear all prediction history.

### GET `/api/salary-stats`
Get salary statistics by age, education, and job title.

### POST `/api/compare`
Compare salaries across multiple scenarios.

**Request:**
```json
{
  "predictions": [
    {"age": 30, "gender": "Male", "education": "Master", "jobTitle": "Senior Developer", "experience": 5, "label": "Current Role"},
    {"age": 30, "gender": "Male", "education": "Master", "jobTitle": "Manager", "experience": 5, "label": "Manager Position"}
  ]
}
```

## Features Explained

### 1. Salary Prediction
- Enter your professional details
- Get instant AI-powered salary prediction
- View salary range for your profile
- See percentile ranking compared to peers

### 2. Career Path Guidance
- Personalized recommendations based on experience
- Timeline suggestions for career progression
- Actionable steps for growth

### 3. Comparison Tool
- Compare salaries across different job roles
- Analyze career transition impacts
- Visualize salary differences with charts

### 4. Prediction History
- Track all predictions over time
- View details of each prediction
- Clear history as needed

### 5. Industry Insights
- Salary trends by age group
- Education impact on earnings
- Highest-paying job roles

## Usage Tips

1. **For Accurate Predictions:**
   - Provide accurate age and experience
   - Select the job title that best matches your role
   - Choose your current education level

2. **For Career Planning:**
   - Use the comparison tool to evaluate job transitions
   - Check career path recommendations regularly
   - Compare scenarios before making decisions

3. **Data Privacy:**
   - All predictions are stored locally in your session
   - No personal data is shared externally
   - Clear history to remove your predictions

## Supported Job Titles

- Junior Developer
- Senior Developer
- Data Scientist
- Product Manager
- Data Engineer
- DevOps Engineer
- Manager
- Director
- Data Analyst
- ML Engineer

## Supported Education Levels

- High School
- Bachelor's Degree
- Master's Degree
- PhD

## Troubleshooting

### Application won't start
- Ensure virtual environment is activated
- Check all dependencies are installed: `pip install -r requirements.txt`
- Verify port 5000 is not in use

### Predictions seem incorrect
- Double-check input values
- Ensure job title matches your role closely
- The model is trained on historical data patterns

### Frontend not loading
- Clear browser cache
- Check browser console for errors
- Verify Flask server is running

## Future Enhancements

- User authentication and accounts
- Advanced filtering and search
- Export to PDF/Excel
- Integration with job boards
- Real-time market data updates
- More detailed industry analytics
- Salary negotiation tips
- Benefit comparison tools

## License

This project is provided as-is for educational and professional use.

## Support

For issues or suggestions, please check the Flask terminal for error messages.

---

**SalaryIQ** - Empowering professionals with data-driven salary insights.
"# salary_prediction" 
# salary_prediction
