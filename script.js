let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let chart;

//  ADD EXPENSE
function addExpense() {
  const name = document.getElementById("expenseName").value.trim();
  const amount = Number(document.getElementById("expenseAmount").value);

  if (!name || amount <= 0) {
    alert("Enter valid data");
    return;
  }

  expenses.push({ name, amount });

  localStorage.setItem("expenses", JSON.stringify(expenses));

  document.getElementById("expenseName").value = "";
  document.getElementById("expenseAmount").value = "";

  updateUI();
}

//  DELETE
function deleteExpense(index) {
  expenses.splice(index, 1);
  localStorage.setItem("expenses", JSON.stringify(expenses));
  updateUI();
}

//  UPDATE UI
function updateUI() {
  const list = document.getElementById("expenseList");
  list.innerHTML = "";

  let totalExpenses = 0;

  expenses.forEach((exp, index) => {
    totalExpenses += exp.amount;

    const li = document.createElement("li");
    li.className = "flex justify-between bg-gray-100 p-2 rounded";

    li.innerHTML = `
      <span>${exp.name} - $${exp.amount}</span>
      <button onclick="deleteExpense(${index})" class="text-red-500">🗑</button>
    `;

    list.appendChild(li);
  });

  const salary = Number(document.getElementById("salary").value);
  const balance = salary - totalExpenses;

  document.getElementById("totalSalary").innerText = salary;
  document.getElementById("totalExpenses").innerText = totalExpenses;
  document.getElementById("balance").innerText = balance;

  updateCharts(totalExpenses, balance);
}

// CHARTS
function updateCharts(totalExpenses, balance) {
  const pieCtx = document.getElementById("myChart").getContext("2d");
  const labels = expenses.map(e => e.name);
  const data = expenses.map(e => e.amount, q => q.salary);
  // destroy old charts
  if (chart) chart.destroy();

  // PIE
  chart = new Chart(pieCtx, {
    type: "pie",
    data: {
      labels: ["expenses", "Balance"],
      datasets: [{
        data: [totalExpenses, balance],
        backgroundColor: ["#fbcfe8" , "#ddd6fe"]
      }]
    }
  }); 
}

//  INITIAL LOAD
window.onload = function () {
  // load saved salary
  const savedSalary = localStorage.getItem("salary");

  if (savedSalary) {
    document.getElementById("salary").value = savedSalary;
  }

  // save salary on input change
  document.getElementById("salary").addEventListener("input", function () {
    localStorage.setItem("salary", this.value);
  });

  updateUI();
};
function clearAllData() {
  // confirm before deleting
  if (!confirm("Are you sure you want to delete all data?")) return;

  // clear array
  expenses = [];
  

  // remove from localStorage
  localStorage.removeItem("expenses");
  localStorage.removeItem("salary");
  document.getElementById("salary").value = 0;
  // update UI
  updateUI();
}