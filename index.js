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
// const form            = document.getElementById("expense-Form");
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

// Receipt picker 
receiptBtn.addEventListener("click", () => receiptInput.click());

receiptInput.addEventListener("change", () => {
  const file = receiptInput.files[0];
  if (!file) return;
  receiptFileName.textContent = file.name;
  compressImage(file).then(dataURL => { receiptDataURL = dataURL; });
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
const user = {"id": 1, "name": "Rodrigo"};
let currentUser = user;

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
  setUserInLocalStorage();
  setTimeout(() => {
    console.log('loading...');
  }, 2000)
  getUserFromLocalStorage();
  loadCategories(); // This will call the async version, which is correct for your backend
  // Optionally, you can call loadCategoriesStatic() if you want static categories
  loadExpenses(); // This will call the async version, which is correct for your backend
});

function setUserInLocalStorage(){
   localStorage.setItem("user", JSON.stringify(user))
}

function getUserFromLocalStorage(){
  const user = localStorage.getItem("user")
  console.log('user', user)
  
  if(!user || user === '{}'){
    console.error('could not find user object in local storage')
  }
  
  currentUser = JSON.parse(user)
  
}



/*************************************/




/****** CRUD - expenses ********************/
const form = document.querySelector("#expense-form");

// listen for form submission event
form.addEventListener("submit", function(event){
  event.preventDefault();  // prevents page refresh

  const description = document.querySelector("#description").value;
  console.log('description', description)
  const amount = document.querySelector("#amount").value;
  console.log('amount', amount);
  const category = document.querySelector("#category").value;
  console.log('category', category)

  //edit
  if(editingID !== null){
    console.log('editingID in submit', editingID);

    for(let i=0; i < expenses.length; i++){
      if(expenses[i].id === editingID){
        expenses[i].description = description;
        expenses[i].amount = amount;
        expenses[i].category = category;
      }
      break;
    }

    document.querySelector("#expense-form button[type='submit']").textContent = "Add Expense";
    editingID = null;
  }
  //add
  else{
    //validate expense
    console.log(validateExpenses(description, amount, category))

    // add data to expense
    addExpense(description, amount, category);
  }

  // render to page
  renderExpenses()
})


// CREATE/POST
async function addExpense(description, amount, category){
  console.log(`incoming expense => description: ${description}, amount: ${amount}, category: ${category}`)
  

  const expense = {
    description: description,
    amount: amount,
    category_id: category,
    date: dateFormating(new Date())
  }
  console.log('created expense', expense)

  try {
    // TODO: complete server route and database insert
    // POST request to create expense record in database
    const response = await fetch(`http://localhost:3001/expenses`, {
      method: 'POST',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({expense})
    });
    if (!response.ok) {
        throw new Error("Failed to fetch expenses");
    }
   

  } catch (error) {
    console.error(error)
  }

}

//  READ/GET
async function loadExpenses(){
  try {
    // GET request to get all expenses from database
    const response = await fetch(`http://localhost:3001/expenses/${currentUser.id}`);
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
  document.querySelector('#amount').value = expenseToEdit.amount;
  document.querySelector('#category').value = expenseToEdit.category;

  editingID = expenseToEdit.id;

  //update button to say edit expense

  saveExpenses();

  document.querySelector("#expense-form button[type='submit']").textContent = 'Update Expense';
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

  renderExpenses();

}

/*************************************/



/****** CRUD - categories ********************/

// READ/GET
async function loadCategories(){

  console.log('currentUser in loadCategories()', currentUser)

  let categoriesArray = [];

  try {
    // GET request to get all categories from database
    const response = await fetch(`http://localhost:3001/categories/${currentUser.id}`);
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
    return 'Description is requred';
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

// render expenses on page
function renderExpenses(expenses){

  const tbody = document.querySelector("#expense-tbody");
  tbody.innerHTML = "";

  if(!expenses || expenses.length === 0){
    console.log('no more expenses')
    tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted py-5">No expenses yet!</td></tr>';
    const totalElement = document.querySelector("#total");
    totalElement.textContent = `$0.00`;
  }
  else {
    // loop through expenses and build table

    for(let i = 0; i < expenses.length; i++){
      const currentExpense = expenses[i];

      const tr = document.createElement('tr');

      tr.innerHTML = `
        <th scope="row">${currentExpense.id}</th>
        <td>${currentExpense.date}</td>
        <td>${currentExpense.description}</td>
        <td>${currentExpense.category}</td>
        <td>$${parseFloat(currentExpense.amount).toFixed(2)}</td>
        <td>
          <button class="btn btn-warning btn-sm" onclick="editExpense(${currentExpense.id})">
            Edit
          </button>
          <button class="btn btn-danger btn-sm" onclick="deleteExpense(${currentExpense.id})">
            Delete
          </button>
        </td>
      `;

      tbody.appendChild(tr)
    }

    // get total 
    // const total = getTotal();

    // //display total on page
    // const totalElement = document.querySelector("#total");
    // totalElement.textContent = `$${total.toFixed(2)}`;
  }

  form.reset();
}

/*****************************************/












// function getTotal(){
//   let sum = 0;
//   for (let index = 0; index < expenses.length; index++) {
//     const currentExpense = expenses[index];
//     console.log('current expense amount', currentExpense.amount)
//     // sum = sum + currentExpense[index].amount;
//     sum += parseFloat(currentExpense.amount);
//   }
  
//   return sum;
// }


