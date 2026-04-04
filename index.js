//Button Styles

function applySubmitStyle(btn, mode) {
  Object.assign(btn.style, {
    flex: '1',
    padding: '11px 18px',
    fontFamily: "'Oswald', sans-serif",
    fontSize: '0.9rem',
    fontWeight: '500',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'background 0.15s, transform 0.1s, box-shadow 0.15s',
    background: mode === 'editing' ? '#888888' : '#c0392b',
    boxShadow: mode === 'editing'
      ? '0 3px 10px rgba(136,136,136,0.4)'
      : '0 3px 10px rgba(192,57,43,0.4)',
  });
}
 
function applyCancelStyle(btn, visible) {
  Object.assign(btn.style, {
    padding: '11px 14px',
    fontFamily: "'DM Mono', monospace",
    fontSize: '0.82rem',
    background: 'transparent',
    border: '1px solid #444',
    borderRadius: '5px',
    color: '#999999',
    cursor: 'pointer',
    flexShrink: '0',
    transition: 'border-color 0.12s, color 0.12s',
    display: visible ? 'block' : 'none',
  });
}
 
function applyRowBtnStyle(btn, type) {
  Object.assign(btn.style, {
    padding: '5px 12px',
    fontFamily: "'DM Mono', monospace",
    fontSize: '0.72rem',
    fontWeight: '500',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '6px',
    transition: 'background 0.12s, border-color 0.12s, transform 0.1s',
    background: 'transparent',
    border: type === 'edit' ? '1px solid #444' : '1px solid rgba(255,68,68,0.35)',
    color: type === 'edit' ? '#999999' : '#ff6666',
  });
 
  btn.addEventListener('mouseenter', () => {
    if (type === 'edit') {
      btn.style.background = 'rgba(192,57,43,0.12)';
      btn.style.borderColor = '#c0392b';
      btn.style.color = '#c0392b';
    } else {
      btn.style.background = 'rgba(255,68,68,0.15)';
      btn.style.borderColor = '#ff4444';
      btn.style.color = '#ff4444';
    }
    btn.style.transform = 'translateY(-1px)';
  });
 
  btn.addEventListener('mouseleave', () => {
    btn.style.background = 'transparent';
    btn.style.borderColor = type === 'edit' ? '#444' : 'rgba(255,68,68,0.35)';
    btn.style.color = type === 'edit' ? '#999999' : '#ff6666';
    btn.style.transform = 'translateY(0)';
  });
}

// Local Storage

const STORAGE_KEY = "fit_expenses";
 
function saveExpenses() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  } catch (e) {
    console.warn("localStorage save failed:", e);
  }
}
 
function loadExpenses() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn("localStorage load failed:", e);
    return [];
  }
}

// Application State

let expenses  = [];
let editingID = null;
 
const categories = [
  "Fuel",
  "Material Cost",
  "Insurance",
  "Loan Payment",
  "Advertising",
  "Maintenance",
  "Parts &/or Repairs",
  "Federal or State Licensing",
  "Other Business Cost"
];
 
// DOM References

const form = document.getElementById("expenseForm");
const descInput = document.getElementById("description");
const detailsInput = document.getElementById("details");
const amountInput = document.getElementById("amount");
const categorySelect = document.getElementById("category");
const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");
const errorMsg = document.getElementById("errorMsg");
const tbody = document.getElementById("expenseTableBody");
const totalAmountEl = document.getElementById("totalAmount");
const totalFootEl = document.getElementById("totalAmountFoot");
const emptyMsg = document.getElementById("emptyMsg");

//Applying Button Styles

applySubmitStyle(submitBtn, 'add');
applyCancelStyle(cancelBtn, false);
 

//Submit Button Hover Action

submitBtn.addEventListener('mouseenter', () => {
  submitBtn.style.background = submitBtn.classList.contains('editing') ? '#aaaaaa' : '#e84c3d';
  submitBtn.style.transform = 'translateY(-1px)';
  submitBtn.style.boxShadow = submitBtn.classList.contains('editing')
    ? '0 5px 14px rgba(136,136,136,0.5)'
    : '0 5px 14px rgba(192,57,43,0.5)';
});
submitBtn.addEventListener('mouseleave', () => {
  submitBtn.style.background = submitBtn.classList.contains('editing') ? '#888888' : '#c0392b';
  submitBtn.style.transform = 'translateY(0)';
  submitBtn.style.boxShadow = submitBtn.classList.contains('editing')
    ? '0 3px 10px rgba(136,136,136,0.4)'
    : '0 3px 10px rgba(192,57,43,0.4)';
});
submitBtn.addEventListener('mousedown', () => {
  submitBtn.style.transform = 'translateY(1px)';
  submitBtn.style.boxShadow = '0 1px 4px rgba(192,57,43,0.3)';
});
submitBtn.addEventListener('mouseup', () => {
  submitBtn.style.transform = 'translateY(-1px)';
});

//Cancel Button Hover Action

cancelBtn.addEventListener('mouseenter', () => {
  cancelBtn.style.borderColor = '#c0392b';
  cancelBtn.style.color = '#c0392b';
});
cancelBtn.addEventListener('mouseleave', () => {
  cancelBtn.style.borderColor = '#444';
  cancelBtn.style.color = '#999999';
});
 
// Load Categories

function loadCategories() {
  categories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    categorySelect.appendChild(opt);
  });
}
 
// CSS Class Category Helper

function categoryClass(cat) {
  const map = {
    "Fuel":                 "fuel",
    "Material Cost":        "material-cost",
    "Insurance":            "insurance",
    "Loan Payment":         "loan-payment",
    "Advertising":                   "advertising",
    "Maintenance":                    "maintenance",
    "Parts &/or Repairs":             "parts-repairs",
    "Federal or State Licensing":     "federal-licensing",
    "Other Business Cost":            "other-business"
  };
  return map[cat] || "other-business";
}

// Validate Expenses

function validateExpenses(description, amount, category) {
  if (!description) {
    showError("Please enter an expense description.");
    return false;
  }
  if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
    showError("Please enter a valid amount greater than zero.");
    return false;
  }
  if (!category) {
    showError("Please select a category.");
    return false;
  }
  hideError();
  return true;
}
 
function showError(msg) {
  errorMsg.textContent   = msg;
  errorMsg.style.display = "block";
}

function hideError() {
  errorMsg.textContent   = "";
  errorMsg.style.display = "none";
}

// Add Expense

function addExpense(description, details, amount, category) {
  expenses.push({
    id: Date.now(),
    description,
    details,
    amount: parseFloat(amount),
    category
  });
}
 
// Render Expenses

function renderExpenses() {
  tbody.innerHTML = "";
 
  expenses.forEach((exp, i) => {
    const row = document.createElement("tr");
 
    const detailsDisplay = exp.details
      ? `<span class="details-cell">${escapeHTML(exp.details)}</span>`
      : `<span class="details-cell empty">—</span>`;
 
    row.innerHTML = `
      <td class="row-num">${i + 1}</td>
      <td>${escapeHTML(exp.description)}</td>
      <td>${detailsDisplay}</td>
      <td class="amount-cell">$${exp.amount.toFixed(2)}</td>
      <td>
        <span class="category-pill ${categoryClass(exp.category)}">
          ${escapeHTML(exp.category)}
        </span>
      </td>
      <td class="actions-cell">
        <button class="btn-edit"   onclick="editExpense(${exp.id})">Edit</button>
        <button class="btn-delete" onclick="deleteExpense(${exp.id})">Delete</button>
      </td>
    `;
 
   applyRowBtnStyle(row.querySelector('.btn-edit'),   'edit');
    applyRowBtnStyle(row.querySelector('.btn-delete'), 'delete');
 
    tbody.appendChild(row);
  });
 
  emptyMsg.style.display = expenses.length === 0 ? "block" : "none";
  updateTotal();
}
 
// Calculate Total

function updateTotal() {
  const total     = expenses.reduce((sum, e) => sum + e.amount, 0);
  const formatted = "$" + total.toFixed(2);
  totalAmountEl.textContent = formatted;
  totalFootEl.textContent   = formatted;
}

// Delete Expense

function deleteExpense(id) {
  expenses = expenses.filter(e => e.id !== id);
  if (editingID === id) cancelEdit();
  renderExpenses();
}
 
// Edit Expense

function editExpense(id) {
  const expense = expenses.find(e => e.id === id);
  if (!expense) return;
 
  descInput.value      = expense.description;
  detailsInput.value   = expense.details || "";
  amountInput.value    = expense.amount;
  categorySelect.value = expense.category;
 
  editingID = id;
  submitBtn.textContent = "Update Expense";
  submitBtn.classList.add("editing");
  applySubmitStyle(submitBtn, 'editing');
  applyCancelStyle(cancelBtn, true);
  hideError();
  descInput.focus();
}
 
// Cancel Edit

function cancelEdit() {
  editingID = null;
  submitBtn.textContent = "Add Expense";
  submitBtn.classList.remove("editing");
  applySubmitStyle(submitBtn, 'add');
  applyCancelStyle(cancelBtn, false);
  form.reset();
  hideError();
}
 
cancelBtn.addEventListener("click", cancelEdit);
 
// Form Submit

form.addEventListener("submit", function (e) {
  e.preventDefault();
 
  const description = descInput.value.trim();
  const details     = detailsInput.value.trim();
  const amount      = amountInput.value.trim();
  const category    = categorySelect.value;
 
  if (!validateExpenses(description, amount, category)) return;
 
  if (editingID !== null) {
    const expense = expenses.find(e => e.id === editingID);
    if (expense) {
      expense.description = description;
      expense.details     = details;
      expense.amount      = parseFloat(amount);
      expense.category    = category;
    }
    cancelEdit();
  } else {
    addExpense(description, details, amount, category);
    form.reset();
    hideError();
  }
 
  renderExpenses();
});

// XSS Helper

function escapeHTML(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
 
// Initial load
loadCategories();
renderExpenses();