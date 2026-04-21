# Quick Start Guide - SalaryIQ

## Get Started in 3 Minutes

### Step 1: Install Dependencies
```bash
cd d:\salary_prediction_ML
venv\Scripts\activate
pip install -r requirements.txt
```

### Step 2: Run the Application
```bash
python app.py
```

You should see:
```
 * Running on http://127.0.0.1:5000
 * Press CTRL+C to quit
```

### Step 3: Open in Browser
Visit: **http://localhost:5000**

---

## Features at a Glance

### 🎯 Main Features

1. **Predictor Tab**
   - Fill in your details (Age, Gender, Education, Job Title, Experience)
   - Click "Predict Salary"
   - See your predicted salary, salary range, and insights
   - Download or share your results

2. **Compare Tab**
   - Add multiple job scenarios
   - Visualize salary differences
   - Make informed career decisions

3. **History Tab**
   - View all past predictions
   - See trends in your salary predictions
   - Clear history anytime

4. **Insights Tab**
   - Explore salary data by age group
   - See education impact on salaries
   - Discover highest-paying roles

---

## Example Workflow

### Making a Prediction
1. Go to "Predictor" section
2. Enter: Age 30, Gender: Male, Education: Master, Job: Senior Developer, Experience: 5
3. Click "Predict Salary"
4. See result: ~$85,000 with insights and career suggestions

### Comparing Roles
1. Go to "Compare" section
2. Add Scenario 1: Senior Developer
3. Add Scenario 2: Manager (same profile)
4. See chart comparing both salaries
5. Make an informed decision

---

## What's Under the Hood?

### Backend (app.py)
- **Flask Server**: Handles all API requests
- **ML Model**: Predicts salary based on trained model (new_salary_model.pkl)
- **Data Processing**: Encodes categorical variables
- **Insights Generation**: Creates personalized recommendations

### Frontend
- **Modern UI**: Professional design with smooth animations
- **Real-time Updates**: Live calculation and visualization
- **Responsive**: Works on all devices
- **Interactive Charts**: Visual salary comparisons

---

## Input Validation

### Age
- Valid range: 18-75 years

### Education Levels
- High School (avg: $35K)
- Bachelor (avg: $55K)
- Master (avg: $75K)
- PhD (avg: $95K)

### Job Titles
- Junior Developer → ~$45K
- Senior Developer → ~$85K
- Data Scientist → ~$90K
- Manager → ~$100K
- Director → ~$130K

---

## Tips for Better Results

✅ **Do:**
- Enter accurate age and experience
- Select job title that closely matches your role
- Use recent job market data as reference
- Compare multiple scenarios

❌ **Don't:**
- Use inflated numbers
- Misclassify job titles
- Ignore education level impact
- Make decisions based on single prediction

---

## API Usage (Advanced)

### Make a prediction via API
```bash
curl -X POST http://localhost:5000/api/predict \
  -H "Content-Type: application/json" \
  -d '{
    "age": 30,
    "gender": "Male",
    "education": "Master",
    "jobTitle": "Senior Developer",
    "experience": 5
  }'
```

### Get prediction history
```bash
curl http://localhost:5000/api/history
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 5000 in use | Change port in app.py or close other app |
| Module not found | Run `pip install -r requirements.txt` |
| No predictions showing | Ensure Flask server is running |
| Charts not loading | Clear browser cache, reload page |

---

## File Structure

```
📁 salary_prediction_ML/
  ├── 📄 app.py                 ← Flask backend
  ├── 📄 new_salary_model.pkl   ← Trained ML model
  ├── 📄 requirements.txt        ← Dependencies
  ├── 📄 README.md               ← Full documentation
  ├── 📄 QUICKSTART.md           ← This file
  ├── 📁 templates/
  │   └── 📄 index.html          ← Main page
  └── 📁 static/
      ├── 📄 style.css           ← Styling
      └── 📄 script.js           ← JavaScript logic
```

---

## Need Help?

- Check browser console for errors (F12 → Console)
- Look at Flask terminal for server messages
- Verify input values are in valid ranges
- Restart Flask app if something seems wrong

---

**Happy exploring! 🚀**
