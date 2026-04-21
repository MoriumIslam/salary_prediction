from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import pickle
import numpy as np
import pandas as pd
from datetime import datetime
import json
import os

app = Flask(__name__, template_folder='templates', static_folder='static')
CORS(app)

# Load the trained model
with open('new_salary_model.pkl', 'rb') as f:
    model = pickle.load(f)

# Store prediction history
prediction_history = []
MAX_HISTORY = 100

# Salary statistics for recommendations
SALARY_STATS = {
    'age_ranges': {
        '20-25': {'avg': 35000, 'min': 25000, 'max': 50000},
        '25-30': {'avg': 50000, 'min': 35000, 'max': 75000},
        '30-35': {'avg': 65000, 'min': 45000, 'max': 95000},
        '35-40': {'avg': 75000, 'min': 55000, 'max': 120000},
        '40-45': {'avg': 85000, 'min': 65000, 'max': 140000},
        '45-50': {'avg': 90000, 'min': 70000, 'max': 150000},
        '50+': {'avg': 95000, 'min': 75000, 'max': 180000}
    },
    'education': {
        'High School': 35000,
        'Bachelor': 55000,
        'Master': 75000,
        'PhD': 95000
    },
    'job_titles': {
        'Junior Developer': 45000,
        'Senior Developer': 85000,
        'Data Scientist': 90000,
        'Product Manager': 95000,
        'Data Engineer': 88000,
        'DevOps Engineer': 92000,
        'Manager': 100000,
        'Director': 130000
    }
}

# Encode categorical variables
EDUCATION_MAPPING = {
    'High School': 0,
    'Bachelor': 1,
    'Master': 2,
    'PhD': 3
}

GENDER_MAPPING = {
    'Male': 0,
    'Female': 1,
    'Other': 2
}

JOB_TITLE_MAPPING = {
    'Junior Developer': 0,
    'Senior Developer': 1,
    'Data Scientist': 2,
    'Product Manager': 3,
    'Data Engineer': 4,
    'DevOps Engineer': 5,
    'Manager': 6,
    'Director': 7,
    'Data Analyst': 8,
    'ML Engineer': 9
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        
        # Extract and encode features
        age = float(data['age'])
        gender = GENDER_MAPPING[data['gender']]
        education = EDUCATION_MAPPING[data['education']]
        job_title = JOB_TITLE_MAPPING[data['jobTitle']]
        experience = float(data['experience'])
        
        # Create a combined feature score for the model (since it expects 1 feature)
        # Weighted calculation based on all input attributes
        feature_score = (
            (age / 75) * 0.25 +           # Age (0-1 normalized)
            (gender * 0.5) * 0.05 +       # Gender
            (education / 3) * 0.30 +      # Education (highest weight)
            (job_title / 9) * 0.25 +      # Job title
            (experience / 60) * 0.15      # Experience
        ) * 100  # Scale to 0-100
        
        # Prepare input for model
        features = np.array([[feature_score]])
        
        # Make prediction
        predicted_salary = model.predict(features)[0]
        predicted_salary = max(20000, predicted_salary)  # Ensure minimum salary
        
        # Calculate additional insights
        age_range = get_age_range(age)
        salary_range = SALARY_STATS['age_ranges'][age_range]
        percentile = calculate_percentile(predicted_salary, salary_range)
        
        # Prepare response
        response_data = {
            'predictedSalary': round(predicted_salary, 2),
            'salaryRange': {
                'min': salary_range['min'],
                'max': salary_range['max'],
                'avg': salary_range['avg']
            },
            'percentile': percentile,
            'insights': generate_insights(age, experience, education, predicted_salary, job_title),
            'careerPath': generate_career_path(experience, education),
            'timestamp': datetime.now().isoformat()
        }
        
        # Store in history
        store_prediction(data, predicted_salary)
        
        return jsonify(response_data)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/history', methods=['GET'])
def get_history():
    return jsonify(prediction_history[-20:])

@app.route('/api/clear-history', methods=['POST'])
def clear_history():
    global prediction_history
    prediction_history = []
    return jsonify({'status': 'success'})

@app.route('/api/salary-stats', methods=['GET'])
def get_salary_stats():
    return jsonify(SALARY_STATS)

@app.route('/api/compare', methods=['POST'])
def compare_salaries():
    try:
        predictions = request.json.get('predictions', [])
        
        if not predictions:
            return jsonify({'error': 'No predictions to compare'}), 400
        
        results = []
        for pred in predictions:
            # Create combined feature score (same calculation as predict endpoint)
            feature_score = (
                (float(pred['age']) / 75) * 0.25 +
                (GENDER_MAPPING[pred['gender']] * 0.5) * 0.05 +
                (EDUCATION_MAPPING[pred['education']] / 3) * 0.30 +
                (JOB_TITLE_MAPPING[pred['jobTitle']] / 9) * 0.25 +
                (float(pred['experience']) / 60) * 0.15
            ) * 100
            
            features = np.array([[feature_score]])
            salary = model.predict(features)[0]
            results.append({
                'jobTitle': pred['jobTitle'],
                'salary': round(salary, 2),
                'label': pred.get('label', pred['jobTitle'])
            })
        
        return jsonify({
            'comparisons': results,
            'highest': max(results, key=lambda x: x['salary']),
            'average': round(np.mean([r['salary'] for r in results]), 2)
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 400

def get_age_range(age):
    if age < 25:
        return '20-25'
    elif age < 30:
        return '25-30'
    elif age < 35:
        return '30-35'
    elif age < 40:
        return '35-40'
    elif age < 45:
        return '40-45'
    elif age < 50:
        return '45-50'
    else:
        return '50+'

def calculate_percentile(salary, salary_range):
    min_sal = salary_range['min']
    max_sal = salary_range['max']
    percentile = ((salary - min_sal) / (max_sal - min_sal)) * 100
    return min(100, max(0, round(percentile, 1)))

def generate_insights(age, experience, education, salary, job_title):
    insights = []
    
    if age < 25:
        insights.append("You're starting your career - focus on building skills and gaining experience.")
    elif experience < 2:
        insights.append("Early career stage - this is a good time to upskill and network.")
    elif experience > 10:
        insights.append("Experienced professional - consider leadership or specialized roles.")
    
    if education >= 2:
        insights.append("Your education level is a strong asset in the job market.")
    
    if salary > SALARY_STATS['age_ranges'][get_age_range(age)]['avg']:
        insights.append("Your predicted salary is above average for your age group!")
    else:
        insights.append("Room for growth - consider upskilling or job transitions.")
    
    return insights

def generate_career_path(experience, education):
    paths = []
    
    if experience < 2:
        paths = [
            {'title': 'Intermediate Role', 'years': '2-5 years', 'action': 'Build expertise in your current domain'},
            {'title': 'Senior Role', 'years': '5-10 years', 'action': 'Lead projects and mentor juniors'}
        ]
    elif experience < 5:
        paths = [
            {'title': 'Senior Position', 'years': 'Next 3-5 years', 'action': 'Move to senior/lead roles'},
            {'title': 'Management Track', 'years': '5+ years', 'action': 'Transition to management'}
        ]
    else:
        paths = [
            {'title': 'Leadership Role', 'years': 'Next 2-3 years', 'action': 'Pursue management positions'},
            {'title': 'C-Suite Track', 'years': '10+ years', 'action': 'Executive leadership opportunities'}
        ]
    
    return paths

def store_prediction(data, salary):
    global prediction_history
    prediction_history.append({
        'age': data['age'],
        'gender': data['gender'],
        'education': data['education'],
        'jobTitle': data['jobTitle'],
        'experience': data['experience'],
        'predictedSalary': round(salary, 2),
        'timestamp': datetime.now().isoformat()
    })
    
    if len(prediction_history) > MAX_HISTORY:
        prediction_history = prediction_history[-MAX_HISTORY:]

if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
