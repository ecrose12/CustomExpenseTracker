//Button Styles

function applySubmitStyle(btn, mode) {
  Object.assign(btn.style, {
    flex: '1', padding: '11px 18px',
    fontFamily: "'Oswald', sans-serif", fontSize: '0.9rem',
    fontWeight: '500', letterSpacing: '0.06em',
    textTransform: 'uppercase', color: '#fff',
    border: 'none', borderRadius: '5px', cursor: 'pointer',
    whiteSpace: 'nowrap', transition: 'background 0.15s, transform 0.1s, box-shadow 0.15s',
    background: mode === 'editing' ? '#888888' : '#c0392b',
    boxShadow: mode === 'editing'
      ? '0 3px 10px rgba(136,136,136,0.4)'
      : '0 3px 10px rgba(192,57,43,0.4)',
  });
}

function applyReceiptStyle(btn) {
  Object.assign(btn.style, {
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
    background: '#555555',
    boxShadow: '0 3px 10px rgba(85,85,85,0.4)',
  });
}

function applyCancelStyle(btn, visible) {
  Object.assign(btn.style, {
    padding: '11px 14px', fontFamily: "'DM Mono', monospace",
    fontSize: '0.82rem', background: 'transparent',
    border: '1px solid #444', borderRadius: '5px',
    color: '#999999', cursor: 'pointer', flexShrink: '0',
    transition: 'border-color 0.12s, color 0.12s',
    display: visible ? 'block' : 'none',
  });
}

function applyRowBtnStyle(btn, type) {
  Object.assign(btn.style, {
    padding: '5px 12px', fontFamily: "'DM Mono', monospace",
    fontSize: '0.72rem', fontWeight: '500', borderRadius: '4px',
    cursor: 'pointer', marginRight: '6px',
    transition: 'background 0.12s, border-color 0.12s, transform 0.1s',
    background: 'transparent',
    border: type === 'edit' ? '1px solid #444' : '1px solid rgba(255,68,68,0.35)',
    color: type === 'edit' ? '#999999' : '#ff6666',
  });

  btn.addEventListener('mouseenter', () => {
    btn.style.background  = type === 'edit' ? 'rgba(192,57,43,0.12)' : 'rgba(255,68,68,0.15)';
    btn.style.borderColor = type === 'edit' ? '#c0392b' : '#ff4444';
    btn.style.color       = type === 'edit' ? '#c0392b' : '#ff4444';
    btn.style.transform   = 'translateY(-1px)';
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.background  = 'transparent';
    btn.style.borderColor = type === 'edit' ? '#444' : 'rgba(255,68,68,0.35)';
    btn.style.color       = type === 'edit' ? '#999999' : '#ff6666';
    btn.style.transform   = 'translateY(0)';
  });
}

const categories = [
  "Fuel", "Material Cost", "Insurance", "Loan Payment",
  "Advertising", "Truck Parts/Maintenance", "Property Dmg/Repair Cost",
  "Federal Licensing", "State Licensing", "Other Business Cost"
];

// localStorage
const STORAGE_KEY = "fit_expenses";

function saveExpenses() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses)); }
  catch (e) { console.warn("localStorage save failed:", e); }
}

function loadExpensesFromLocalStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) { return []; }
}

// DOM refs
// NOTE: form is declared later, right before it's used, to match the
// #expenseForm id fix (see FIX #1 below).
const descInput       = document.getElementById("description");
const detailsInput    = document.getElementById("details");
const amountInput     = document.getElementById("amount");
const categorySelect  = document.getElementById("category");
const submitBtn       = document.getElementById("submitBtn");
const cancelBtn       = document.getElementById("cancelBtn");
const errorMsg        = document.getElementById("errorMsg");
const tbody           = document.getElementById("expenseTableBody");
const totalAmountEl   = document.getElementById("totalAmount");
const totalFootEl     = document.getElementById("totalAmountFoot");
const emptyMsg        = document.getElementById("emptyMsg");
const receiptBtn      = document.getElementById("receiptBtn");
const receiptInput    = document.getElementById("receipt");
const receiptFileName = document.getElementById("receiptFileName");

// applyReceiptStyle
applyReceiptStyle(receiptBtn);
applySubmitStyle(submitBtn, 'add');
applyCancelStyle(cancelBtn, false);

// Receipt hover / press listeners
receiptBtn.addEventListener('mouseenter', () => {
  receiptBtn.style.background = '#777777';
  receiptBtn.style.transform  = 'translateY(-1px)';
  receiptBtn.style.boxShadow  = '0 5px 14px rgba(85,85,85,0.5)';
});
receiptBtn.addEventListener('mouseleave', () => {
  receiptBtn.style.background = '#555555';
  receiptBtn.style.transform  = 'translateY(0)';
  receiptBtn.style.boxShadow  = '0 3px 10px rgba(85,85,85,0.4)';
});
receiptBtn.addEventListener('mousedown', () => {
  receiptBtn.style.transform  = 'translateY(1px)';
  receiptBtn.style.boxShadow  = '0 1px 4px rgba(85,85,85,0.3)';
});
receiptBtn.addEventListener('mouseup', () => {
  receiptBtn.style.transform  = 'translateY(-1px)';
});

// Submit hover / press listeners
submitBtn.addEventListener('mouseenter', () => {
  submitBtn.style.background = submitBtn.classList.contains('editing')
    ? '#aaaaaa' : '#e84c3d';
  submitBtn.style.transform  = 'translateY(-1px)';
  submitBtn.style.boxShadow  = submitBtn.classList.contains('editing')
    ? '0 5px 14px rgba(136,136,136,0.5)'
    : '0 5px 14px rgba(192,57,43,0.5)';
});
submitBtn.addEventListener('mouseleave', () => {
  submitBtn.style.background = submitBtn.classList.contains('editing')
    ? '#888888' : '#c0392b';
  submitBtn.style.transform  = 'translateY(0)';
  submitBtn.style.boxShadow  = submitBtn.classList.contains('editing')
    ? '0 3px 10px rgba(136,136,136,0.4)'
    : '0 3px 10px rgba(192,57,43,0.4)';
});
submitBtn.addEventListener('mousedown', () => {
  submitBtn.style.transform  = 'translateY(1px)';
  submitBtn.style.boxShadow  = '0 1px 4px rgba(192,57,43,0.3)';
});
submitBtn.addEventListener('mouseup', () => {
  submitBtn.style.transform  = 'translateY(-1px)';
});

// Cancel hover listeners
cancelBtn.addEventListener('mouseenter', () => {
  cancelBtn.style.borderColor = '#c0392b';
  cancelBtn.style.color       = '#c0392b';
});
cancelBtn.addEventListener('mouseleave', () => {
  cancelBtn.style.borderColor = '#444';
  cancelBtn.style.color       = '#999999';
});

// Cancel editing: clear the form, exit edit mode, hide this button again
cancelBtn.addEventListener('click', () => {
  editingID = null;
  form.reset();
  document.querySelector("#expenseForm #submitBtn").textContent = 'Add Expense';
  applyCancelStyle(cancelBtn, false);
  errorMsg.textContent = '';
  receiptDataURL = null;
  receiptFileName.textContent = '';
});

// Receipt picker
receiptBtn.addEventListener("click", () => receiptInput.click());

let receiptCompressionPromise = null;

receiptInput.addEventListener("change", () => {
  const file = receiptInput.files[0];
  if (!file) return;
  receiptFileName.textContent = file.name;
  receiptCompressionPromise = compressImage(file).then(dataURL => {
    receiptDataURL = dataURL;
    receiptCompressionPromise = null;
  });
});

function compressImage(file, maxWidth = 800, quality = 0.7) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const scale  = Math.min(1, maxWidth / img.width);
        canvas.width  = img.width  * scale;
        canvas.height = img.height * scale;
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

// State
let expenses   = [];
let editingID  = null;
let currentUser = null; // set once the user picks a name from the login picker
let usersList   = [];

let receiptDataURL = null;


// Categories
function loadCategoriesStatic() {
  categories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat; opt.textContent = cat;
    categorySelect.appendChild(opt);
  });
}

function categoryClass(cat) {
  const map = {
    "Fuel": "fuel", "Material Cost": "material-cost",
    "Insurance": "insurance", "Loan Payment": "loan-payment",
    "Advertising": "advertising", "Truck Parts/Maintenance": "truck-parts-maintenance",
    "Property Dmg/Repair Cost": "property-dmg-costs",
    "Federal Licensing": "federal-licensing",
    "State Licensing": "state-licensing",
    "Other Business Cost": "other-business"
  };
  return map[cat] || "other-business";
}


/****** ON PAGE LOAD ********************/
document.addEventListener('DOMContentLoaded', () => {
  console.log('page loaded');
  initUserPicker();
});

const USER_STORAGE_KEY = "fit_current_user";

function saveCurrentUserToLocalStorage(){
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(currentUser));
}

function getSavedUserFromLocalStorage(){
  const raw = localStorage.getItem(USER_STORAGE_KEY);
  if(!raw) return null;
  try { return JSON.parse(raw); }
  catch(e) { return null; }
}

// Fetch the list of users, populate the picker, and either restore a
// previously-selected user or wait for the person to pick one.
async function initUserPicker(){
  const userSelect = document.querySelector("#userSelect");
  const loginBtn    = document.querySelector("#loginBtn");
  const currentUserLabel = document.querySelector("#currentUserLabel");

  try {
    const response = await fetch(`http://localhost:3001/users`);
    if (!response.ok) throw new Error("Failed to fetch users");
    usersList = await response.json();
  } catch (error) {
    console.error(error);
    usersList = [];
  }

  userSelect.innerHTML = '<option value="" disabled selected>Select your name…</option>';
  usersList.forEach(u => {
    const opt = document.createElement("option");
    opt.value = u.id;
    opt.textContent = u.name;
    userSelect.appendChild(opt);
  });

  const savedUser = getSavedUserFromLocalStorage();
  const savedUserStillValid = savedUser && usersList.some(u => u.id === savedUser.id);

  if (savedUserStillValid) {
    currentUser = savedUser;
    userSelect.value = currentUser.id;
    onUserLoggedIn();
  } else {
    // No valid saved user — show the picker and wait for a selection.
    currentUser = null;
    currentUserLabel.textContent = "Not logged in";
  }

  loginBtn.addEventListener("click", () => {
    const selectedId = userSelect.value;
    if (!selectedId) return;
    const selected = usersList.find(u => u.id === selectedId);
    if (!selected) return;

    currentUser = selected;
    saveCurrentUserToLocalStorage();
    onUserLoggedIn();
  });
}

// Called once we have a confirmed currentUser — loads their data
function onUserLoggedIn(){
  const currentUserLabel = document.querySelector("#currentUserLabel");
  currentUserLabel.textContent = `Logged in as: ${currentUser.name}`;

  loadCategories();
  loadExpenses();
}



/*************************************/




/****** CRUD - expenses ********************/

// FIX #1: id now matches index.html's <form id="expenseForm">
const form = document.querySelector("#expenseForm");

// listen for form submission event
form.addEventListener("submit", async function(event){
  event.preventDefault();  // prevents page refresh

  if (!currentUser) {
    errorMsg.textContent = "Please select your name and log in before adding an expense.";
    return;
  }

  // If a receipt was just attached, make sure compression has actually
  // finished before we build the payload — otherwise receiptDataURL can
  // still be stale/null at this exact moment.
  if (receiptCompressionPromise) {
    submitBtn.textContent = "Processing receipt…";
    await receiptCompressionPromise;
    submitBtn.textContent = editingID !== null ? "Update Expense" : "Add Expense";
  }

  const description = document.querySelector("#description").value;
  console.log('description', description)
  const details = document.querySelector("#details").value;
  console.log('details', details)
  const amount = document.querySelector("#amount").value;
  console.log('amount', amount);
  const category = document.querySelector("#category").value;
  console.log('category', category)

  // FIX #9: validate before doing anything else, and surface the error
  const validationResult = validateExpenses(description, amount, category);
  if (validationResult !== 'Valid') {
    errorMsg.textContent = validationResult;
    return;
  }
  errorMsg.textContent = '';

  //edit
  if(editingID !== null){
    console.log('editingID in submit', editingID);

    await updateExpense(editingID, description, details, amount, category);

    document.querySelector("#expenseForm #submitBtn").textContent = "Add Expense";
    applyCancelStyle(cancelBtn, false);
    editingID = null;
  }
  //add
  else{
    // add data to expense
    await addExpense(description, details, amount, category);
  }

  // reset receipt state so it doesn't leak into the next expense
  receiptDataURL = null;
  receiptFileName.textContent = '';

  // addExpense/updateExpense already reload + re-render from the server,
  // so no extra render call is needed here.
})


// CREATE/POST
async function addExpense(description, details, amount, category){
  console.log(`incoming expense => description: ${description}, details: ${details}, amount: ${amount}, category: ${category}`)
  console.log('receiptDataURL at submit time:', receiptDataURL ? `present (${receiptDataURL.length} chars)` : receiptDataURL)


  const expense = {
    description: description,
    details: details,
    amount: amount,
    category_id: category,
    date: dateFormating(new Date()),
    user_id: currentUser.id,
    receipt_url: receiptDataURL,
  }
  console.log('created expense', expense)

  try {
    // FIX #4: send the expense fields directly — the server expects a flat
    // body ({ description, details, amount, category_id, date, receipt_url }),
    // not { expense: {...} }
    const response = await fetch(`http://localhost:3001/expenses`, {
      method: 'POST',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(expense)
    });
    if (!response.ok) {
        throw new Error("Failed to fetch expenses");
    }

    // refresh local list from the server after a successful add
    await loadExpenses();

  } catch (error) {
    console.error(error)
  }

}

// UPDATE/PUT — actually persists an edit to the database
async function updateExpense(expenseId, description, details, amount, category){
  const updatedFields = {
    description: description,
    details: details,
    amount: amount,
    category_id: category,
    user_id: currentUser.id,
    receipt_url: receiptDataURL,
  }
  console.log('updating expense', expenseId, updatedFields)

  try {
    const response = await fetch(`http://localhost:3001/expenses/${expenseId}`, {
      method: 'PUT',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(updatedFields)
    });
    if (!response.ok) {
      throw new Error("Failed to update expense");
    }

    // refresh local list from the server so the table reflects what's
    // actually saved, not just what we think we sent
    await loadExpenses();

  } catch (error) {
    console.error(error)
  }
}

//  READ/GET
async function loadExpenses(){
  try {
    // GET /expenses filters by user server-side; pass the selected user's id
    const response = await fetch(`http://localhost:3001/expenses?user_id=${currentUser.id}`);
    if (!response.ok) {
        throw new Error("Failed to fetch expenses");
    }
    expenses = await response.json();

    renderExpenses(expenses)

  } catch (error) {
    console.error(error)
  }

}

// UPDATE/PUT
function editExpense(expenseID){
  console.log('editExpense id ', expenseID)

  let expenseToEdit = null;

  for(let i=0; i < expenses.length; i++){
    if(expenses[i].id === expenseID){
      expenseToEdit = expenses[i];
    }
  }

  if(expenseToEdit === null){
    console.log('no expense found')
    return;
  }

  document.querySelector('#description').value = expenseToEdit.description;
  document.querySelector('#details').value = expenseToEdit.details ?? '';
  document.querySelector('#amount').value = expenseToEdit.amount;
  // FIX #7: the <select> options are keyed by category_id, not the nested
  // category object returned by the "*, category(name)" select
  document.querySelector('#category').value = expenseToEdit.category_id;

  // Pre-load the existing receipt (if any) so it's preserved on update
  // unless the person attaches a new one, which overwrites receiptDataURL
  // via the receiptInput "change" listener.
  receiptDataURL = expenseToEdit.receipt_url ?? null;
  receiptFileName.textContent = expenseToEdit.receipt_url ? 'Existing receipt attached' : '';

  editingID = expenseToEdit.id;

  // show the cancel button so the person can back out of editing
  applyCancelStyle(cancelBtn, true);

  // FIX #1: id now matches #expenseForm
  document.querySelector("#expenseForm #submitBtn").textContent = 'Update Expense';
}

// Opens a stored receipt in a new tab. Receipts are stored as base64
// data: URLs, and modern browsers block top-level navigation directly to
// data: URLs (they silently do nothing). Converting to a blob: URL first
// works around that restriction.
function viewReceipt(expenseID){
  const expense = expenses.find(e => e.id === expenseID);
  if (!expense || !expense.receipt_url) return;

  fetch(expense.receipt_url)
    .then(res => res.blob())
    .then(blob => {
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, '_blank');
      // revoke after a delay so the new tab has time to load it
      setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
    })
    .catch(err => console.error('Failed to open receipt:', err));
}

// DELETE/DELETE
function deleteExpense(expenseID){
  console.log('delete function expense ID', expenseID)
  console.log('expenses', expenses)

  let indexToDelete = -1;

  // loop through to get index of expense we want to delete
  for(let i=0; i < expenses.length; i++){
    if(expenses[i].id === expenseID){
      console.log('found correct expense ', expenses[i])
      indexToDelete = i;
      break;
    }
  }

  // remove the expense from the expenses array
  if(indexToDelete !== -1){
    expenses.splice(indexToDelete, 1)
  }

  console.log('expenses with expense deleted', expenses)

  saveExpenses();

  renderExpenses(expenses); // FIX #3

}

/*************************************/



/****** CRUD - categories ********************/

// READ/GET
async function loadCategories(){

  console.log('currentUser in loadCategories()', currentUser)

  let categoriesArray = [];

  try {
    // categories are shared across all users — no user_id filter needed
    const response = await fetch(`http://localhost:3001/category`);
    if (!response.ok) {
        throw new Error("Failed to fetch categories");
    }
    categoriesArray =  await response.json();
    console.log('categoriesArray', categoriesArray)

  } catch (error) {
    console.error(error)
  }

  const selectElement = document.querySelector('#category');

  selectElement.innerHTML = '<option value="" disabled selected>Select a category</option>';

  for(let i=0; i < categoriesArray.length; i++){
    const optionElement = document.createElement('option');
    optionElement.textContent = categoriesArray[i].name;
    optionElement.value = categoriesArray[i].id;
    selectElement.appendChild(optionElement);
  }
}





/************** HELPER FUNCTIONS *********/

// validation
function validateExpenses(description, amount, category){
  console.log('inside validate', description.trim())
  if(!description || description.trim() === ""){
    return 'Description is required';
  }

  if(!amount || amount <= 0){
    return 'Amount must be greater than 0';
  }

  if(!category){
    return 'Category is required';
  }

  return 'Valid';
}

// format date
function dateFormating(date){
  const dateObj = new Date(date) //create a date object so we have access to Date methods
  return dateObj.toLocaleDateString(); //format like 1/16/2025
}

// format date + time for display in the expense table
// prefers created_at (full timestamp) since the "date" column only stores
// a calendar date with no time component
function formatExpenseTimestamp(expense){
  const raw = expense.created_at ?? expense.date;
  if (!raw) return '';
  const dateObj = new Date(raw);
  if (isNaN(dateObj.getTime())) return '';
  return dateObj.toLocaleString(undefined, {
    dateStyle: 'short',
    timeStyle: expense.created_at ? 'short' : undefined,
  });
}

// render expenses on page
function renderExpenses(expenses){

  // FIX #2: match the real ids in index.html (#expenseTableBody,
  // #totalAmount / #totalAmountFoot) instead of the non-existent
  // #expense-tbody / #total
  const tbody = document.querySelector("#expenseTableBody");
  tbody.innerHTML = "";

  const totalAmountEl = document.querySelector("#totalAmount");
  const totalFootEl   = document.querySelector("#totalAmountFoot");

  if(!expenses || expenses.length === 0){
    console.log('no more expenses')
    tbody.innerHTML = '<tr><td colspan="8" class="text-center text-muted py-5">No expenses yet!</td></tr>';
    totalAmountEl.textContent = `$0.00`;
    totalFootEl.textContent = `$0.00`;
  }
  else {
    // loop through expenses and build table
    let total = 0;

    for(let i = 0; i < expenses.length; i++){
      const currentExpense = expenses[i];
      total += parseFloat(currentExpense.amount) || 0;

      const tr = document.createElement('tr');

      tr.innerHTML = `
        <th scope="row">${formatExpenseTimestamp(currentExpense)}</th>
        <td>${currentExpense.description}</td>
        <td>${currentExpense.details ?? ''}</td>
        <td>$${parseFloat(currentExpense.amount).toFixed(2)}</td>
        <td>${currentExpense.category?.name ?? ''}</td>
        <td>${currentExpense.users?.name ?? ''}</td>
        <td>${currentExpense.receipt_url ? `<a href="#" onclick="viewReceipt('${currentExpense.id}'); return false;">View</a>` : ''}</td>
        <td>
          <button class="btn btn-warning btn-sm" onclick="editExpense('${currentExpense.id}')">
            Edit
          </button>
          <button class="btn btn-danger btn-sm" onclick="deleteExpense('${currentExpense.id}')">
            Delete
          </button>
        </td>
      `;

      tbody.appendChild(tr)
    }

    // get total
    totalAmountEl.textContent = `$${total.toFixed(2)}`;
    totalFootEl.textContent = `$${total.toFixed(2)}`;
  }

  form.reset();
}

/*****************************************/