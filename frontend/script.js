const form = document.getElementById("expenseForm");
const totalDisplay = document.getElementById("totalDisplay");
const ctx = document.getElementById("expenseChart").getContext("2d");

let expenses = [];

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const date = document.getElementById("date").value;
  const category = document.getElementById("category").value;
  const amount = parseInt(document.getElementById("amount").value);
  const notes = document.getElementById("notes").value;

  if (!date || !category || isNaN(amount)) {
    alert("❗ Please fill all required fields.");
    return;
  }

  try {
    const response = await fetch("http://127.0.0.1:5000/add-expense", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ date, category, amount, notes }),
    });

    if (response.ok) {
      alert("✅ Expense added successfully!");
      form.reset();
      await fetchAndRenderExpenses();
    } else {
      alert("❌ Failed to save expense.");
    }
  } catch (error) {
    console.error("Fetch error while submitting expense:", error);
    alert("🚫 Could not connect to backend. Is Flask running?");
  }
});

async function fetchAndRenderExpenses() {
  try {
    const response = await fetch("http://127.0.0.1:5000/expenses");
    const data = await response.json();
    expenses = data;

    const total = expenses.reduce((sum, item) => sum + item.amount, 0);
    totalDisplay.textContent = `Total Spent: ₹${total}`;

    const categoryTotals = {};
    expenses.forEach(item => {
      categoryTotals[item.category] = (categoryTotals[item.category] || 0) + item.amount;
    });

    const labels = Object.keys(categoryTotals);
    const values = Object.values(categoryTotals);
    const backgroundColors = [
      "#f39c12", "#e74c3c", "#2ecc71", "#9b59b6", "#3498db", "#1abc9c",
      "#ff6f61", "#8e44ad", "#e67e22", "#00b894", "#ff4757"
    ];

    if (window.myChart) {
      window.myChart.destroy();
    }

    window.myChart = new Chart(ctx, {
      type: "pie",
      data: {
        labels: labels,
        datasets: [{
          data: values,
          backgroundColor: backgroundColors.slice(0, labels.length),
        }]
      },
      options: {
        plugins: {
          legend: {
            position: 'right',
            labels: {
              color: '#f5f5f5',
              font: {
                size: 14,
                weight: 'bold',
              },
              padding: 15,
            }
          },
          tooltip: {
            backgroundColor: '#0d47a1',
            titleColor: '#ffffff',
            bodyColor: '#f5f5f5',
            borderColor: '#f5f5f5',
            borderWidth: 1,
            callbacks: {
              label: function (context) {
                const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                const percentage = ((context.raw / total) * 100).toFixed(1);
                return ` ${context.label}: ₹${context.raw} (${percentage}%)`;
              }
            }
          }
        }
      }
    });

    // ✨ Show AI insights after data is loaded
    showAIInsights();

  } catch (error) {
    console.error("Fetch error while loading expenses:", error);
    alert("🚫 Could not fetch expenses. Is Flask still running?");
  }
}

// Download CSV export
function downloadCSV() {
  fetch('http://127.0.0.1:5000/export-csv')
    .then(response => {
      if (!response.ok) {
        throw new Error('Download failed');
      }
      return response.blob();
    })
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'expenses.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
    })
    .catch(error => {
      alert('❌ Failed to download CSV. Is Flask running?');
      console.error(error);
    });
}

// 🤖 AI Insight Generator
function showAIInsights() {
  const insights = [];
  const categories = {};

  expenses.forEach(exp => {
    categories[exp.category] = (categories[exp.category] || 0) + exp.amount;
  });

  const sorted = Object.entries(categories).sort((a, b) => b[1] - a[1]);

  if (sorted.length > 0) {
    insights.push(`🔝 You spent the most on <b>${sorted[0][0]}</b> - ₹${sorted[0][1]}`);
  }

  if (sorted.length > 2) {
    insights.push(`💡 Try reducing <b>${sorted[1][0]}</b> to save more.`);
  }

  insights.push(`✅ Great job tracking your spending!`);

  const ul = document.getElementById("insightList");
  ul.innerHTML = "";
  insights.forEach(item => {
    const li = document.createElement("li");
    li.innerHTML = item;
    ul.appendChild(li);
  });
}

// Load data when page loads
fetchAndRenderExpenses();
