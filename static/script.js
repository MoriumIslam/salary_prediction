let comparisonData = [];
let currentPrediction = null;
let comparisonChart = null;
let ageChart = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    loadHistory();
    initializeInsightsCharts();
});

function setupEventListeners() {
    // Prediction form
    document.getElementById('predictionForm').addEventListener('submit', handlePrediction);

    // Comparison form
    document.getElementById('comparisonForm').addEventListener('submit', handleAddComparison);

    // Nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

async function handlePrediction(e) {
    e.preventDefault();

    const age = document.getElementById('age').value;
    const gender = document.getElementById('gender').value;
    const education = document.getElementById('education').value;
    const jobTitle = document.getElementById('jobTitle').value;
    const experience = document.getElementById('experience').value;

    if (!gender || !education || !jobTitle) {
        showToast('Please select all required fields', 'error');
        return;
    }

    try {
        const response = await fetch('/api/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                age,
                gender,
                education,
                jobTitle,
                experience
            })
        });

        if (!response.ok) {
            throw new Error('Prediction failed');
        }

        const result = await response.json();
        displayResults(result);
        showToast('Prediction successful!', 'success');
    } catch (error) {
        console.error('Error:', error);
        showToast('Error making prediction', 'error');
    }
}

function displayResults(result) {
    const container = document.getElementById('resultsContainer');
    currentPrediction = result;

    // Update salary display
    const salary = result.predictedSalary.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
    });
    document.getElementById('salaryDisplay').textContent = salary;

    // Update range
    const rangeText = `Range: $${result.salaryRange.min.toLocaleString()} - $${result.salaryRange.max.toLocaleString()}`;
    document.getElementById('salaryRange').textContent = rangeText;

    // Update percentile
    const percentile = result.percentile;
    document.getElementById('percentileFill').style.width = percentile + '%';
    document.getElementById('percentileText').textContent = `${percentile}th Percentile - You're in the top ${(100 - percentile).toFixed(0)}% of earners`;

    // Update insights
    const insightsList = document.getElementById('insightsList');
    insightsList.innerHTML = result.insights.map(insight => `<li>${insight}</li>`).join('');

    // Update career path
    const careerPath = document.getElementById('careerPath');
    careerPath.innerHTML = result.careerPath.map(path => `
        <div class="career-item">
            <div class="career-item-title">${path.title}</div>
            <div class="career-item-subtitle">${path.years}</div>
            <div class="career-item-action">${path.action}</div>
        </div>
    `).join('');

    // Show results
    container.style.display = 'block';

    // Scroll to results
    setTimeout(() => {
        container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

async function handleAddComparison(e) {
    e.preventDefault();

    const age = document.getElementById('compAge').value;
    const gender = document.getElementById('compGender').value;
    const education = document.getElementById('compEducation').value;
    const jobTitle = document.getElementById('compJobTitle').value;
    const experience = document.getElementById('compExperience').value;
    const label = document.getElementById('compLabel').value || jobTitle;

    comparisonData.push({
        age,
        gender,
        education,
        jobTitle,
        experience,
        label
    });

    if (comparisonData.length >= 2) {
        await performComparison();
    }

    showToast(`Added "${label}" to comparison. Add more scenarios or click Compare.`, 'success');

    // Reset form
    document.getElementById('comparisonForm').reset();
    document.getElementById('compLabel').value = '';
}

async function performComparison() {
    try {
        const response = await fetch('/api/compare', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                predictions: comparisonData
            })
        });

        if (!response.ok) {
            throw new Error('Comparison failed');
        }

        const result = await response.json();
        displayComparison(result);
    } catch (error) {
        console.error('Error:', error);
        showToast('Error comparing salaries', 'error');
    }
}

function displayComparison(result) {
    const container = document.getElementById('comparisonResults');
    container.style.display = 'block';

    // Create chart
    const ctx = document.getElementById('comparisonChart').getContext('2d');

    if (comparisonChart) {
        comparisonChart.destroy();
    }

    const labels = result.comparisons.map(c => c.label);
    const data = result.comparisons.map(c => c.salary);
    const colors = [
        '#2563eb', '#7c3aed', '#10b981', '#f59e0b', '#ef4444', '#06b6d4'
    ];

    comparisonChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Predicted Salary',
                data,
                backgroundColor: colors.slice(0, data.length),
                borderRadius: 8,
                borderSkipped: false
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });

    // Display stats
    const statsContainer = document.getElementById('comparisonStats');
    const highest = result.highest;
    const average = result.average;

    statsContainer.innerHTML = `
        <div class="stat-box">
            <div class="stat-box-label">Highest Salary</div>
            <div class="stat-box-value">${highest.label}</div>
            <div class="stat-box-label">${highest.salary.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}</div>
        </div>
        <div class="stat-box">
            <div class="stat-box-label">Average Salary</div>
            <div class="stat-box-value">$${average.toLocaleString()}</div>
            <div class="stat-box-label">Across all scenarios</div>
        </div>
    `;

    // Scroll to results
    setTimeout(() => {
        container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

async function loadHistory() {
    try {
        const response = await fetch('/api/history');
        const data = await response.json();

        const tbody = document.getElementById('historyBody');

        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="no-data">No history yet. Make a prediction to get started!</td></tr>';
            return;
        }

        tbody.innerHTML = data.map(record => {
            const date = new Date(record.timestamp).toLocaleString();
            return `
                <tr>
                    <td>${date}</td>
                    <td>${record.age}</td>
                    <td>${record.gender}</td>
                    <td>${record.education}</td>
                    <td>${record.jobTitle}</td>
                    <td>${record.experience}</td>
                    <td>${record.predictedSalary.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                </tr>
            `;
        }).join('');
    } catch (error) {
        console.error('Error loading history:', error);
    }
}

function refreshHistory() {
    loadHistory();
    showToast('History refreshed', 'success');
}

async function clearHistory() {
    if (confirm('Are you sure you want to clear all prediction history?')) {
        try {
            await fetch('/api/clear-history', { method: 'POST' });
            loadHistory();
            showToast('History cleared', 'success');
        } catch (error) {
            console.error('Error clearing history:', error);
            showToast('Error clearing history', 'error');
        }
    }
}

function initializeInsightsCharts() {
    // Age chart
    const ageCtx = document.getElementById('ageChartCanvas');
    if (ageCtx) {
        ageChart = new Chart(ageCtx, {
            type: 'line',
            data: {
                labels: ['20-25', '25-30', '30-35', '35-40', '40-45', '45-50', '50+'],
                datasets: [{
                    label: 'Average Salary',
                    data: [35000, 50000, 65000, 75000, 85000, 90000, 95000],
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true,
                    pointRadius: 6,
                    pointBackgroundColor: '#2563eb',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + (value / 1000) + 'k';
                            }
                        }
                    }
                }
            }
        });
    }
}

function downloadReport() {
    if (!currentPrediction) {
        showToast('Make a prediction first', 'error');
        return;
    }

    const formData = {
        age: document.getElementById('age').value,
        gender: document.getElementById('gender').value,
        education: document.getElementById('education').value,
        jobTitle: document.getElementById('jobTitle').value,
        experience: document.getElementById('experience').value
    };

    const report = `
SALARY PREDICTION REPORT
========================
Generated: ${new Date().toLocaleString()}

PERSONAL PROFILE
================
Age: ${formData.age}
Gender: ${formData.gender}
Education Level: ${formData.education}
Job Title: ${formData.jobTitle}
Years of Experience: ${formData.experience}

PREDICTION RESULTS
==================
Predicted Salary: ${currentPrediction.predictedSalary.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
Salary Range: $${currentPrediction.salaryRange.min.toLocaleString()} - $${currentPrediction.salaryRange.max.toLocaleString()}
Average for Age Group: $${currentPrediction.salaryRange.avg.toLocaleString()}
Percentile: ${currentPrediction.percentile}th

KEY INSIGHTS
============
${currentPrediction.insights.map(i => '• ' + i).join('\n')}

CAREER PATH RECOMMENDATIONS
============================
${currentPrediction.careerPath.map(p => `\nRole: ${p.title}
Timeline: ${p.years}
Action: ${p.action}`).join('\n')}

---
This report was generated by SalaryIQ - Intelligent Salary Prediction
    `;

    downloadTextFile(report, 'salary_report.txt');
    showToast('Report downloaded', 'success');
}

function downloadTextFile(text, filename) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

function shareResult() {
    if (!currentPrediction) {
        showToast('Make a prediction first', 'error');
        return;
    }

    const text = `I just got my salary prediction from SalaryIQ! My predicted salary is ${currentPrediction.predictedSalary.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}. Find out your market value now!`;

    if (navigator.share) {
        navigator.share({
            title: 'SalaryIQ Prediction',
            text: text,
            url: window.location.href
        }).catch(err => console.log('Error sharing:', err));
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(text).then(() => {
            showToast('Prediction text copied to clipboard!', 'success');
        }).catch(err => {
            showToast('Error copying to clipboard', 'error');
        });
    }
}

function scrollToPredictor() {
    document.getElementById('predictor').scrollIntoView({ behavior: 'smooth' });
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'} ${message}`;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Add slideOut animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
