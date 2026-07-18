const supabase = require('./supabase');

const CURRENT_USER_ID = "ee7710d9-b475-4fa9-bb4e-39cb93707e83";
const CURRENT_USER_NAME = "Elizabeth C.";

const categoryNames = [
  'Maintenance',
  'Material Cost',
  'Fuel',
  'Other Business Costs',
  'Federal or State Licensing',
  'Truck Parts/Maintenance',
  'Advertising',
  'Insurance'
];

const expenseSeeds = [
  { description: 'Advance Auto Parts',  details: 'Oil Change Supplies for Truck 626',      amount: 75.32,   category: 'Maintenance',           date: '2025-04-01' },
  { description: 'APAC Bill',           details: 'Material for Job #12345',                amount: 387.42,  category: 'Material Cost',         date: '2025-04-03' },
  { description: 'Conoco',              details: 'Fuel for Truck 626',                     amount: 42.18,   category: 'Fuel',                  date: '2025-04-05' },
  { description: 'Atlas Broadband',     details: 'Wifi service',                           amount: 15.99,   category: 'Other Business Costs',  date: '2025-04-06' },
  { description: 'State of Oklahoma',   details: 'Tag Fee for Truck 626',                  amount: 562.81,  category: 'Federal or State Licensing',  date: '2025-04-08' },
  { description: '370 Truck & Trailer', details: 'Drive Tire Repair Truck 626',            amount: 235.46,  category: 'Truck Parts/Maintenance', date: '2025-04-10' },
  { description: 'DOT',                 details: 'HRU Tag/Tax Truck 626',                  amount: 47.96,   category: 'Federal or State Licensing',  date: '2025-04-12' },
  { description: 'Quickbooks',          details: 'Billing software subscription',          amount: 58.00,   category: 'Other Business Costs',  date: '2025-04-13' },
  { description: 'VistaPrint',          details: 'Business cards',                         amount: 24.68,   category: 'Advertising',           date: '2025-04-14' },
  { description: 'Progressive',         details: 'Monthly insurance',                      amount: 1879.29, category: 'Insurance',             date: '2025-04-15' },
];

async function seed() {
  // --- Step 0: Ensure the current user row exists ---
  // Uses upsert so re-running seed.js is always safe — it won't duplicate
  // or error out on the user row.
  console.log("Upserting current user...");
  const { error: userUpsertError } = await supabase
    .from("users")
    .upsert({ id: CURRENT_USER_ID, name: CURRENT_USER_NAME });
  if (userUpsertError) {
    console.error("Failed to upsert user:", userUpsertError.message);
    process.exit(1);
  }
  console.log(`✅ User "${CURRENT_USER_NAME}" ready`);
 
  // --- Step 1: Clear existing expenses ---
  console.log("Clearing existing expenses...");
  const { error: deleteExpensesError } = await supabase
    .from("expenses")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
  if (deleteExpensesError) {
    console.error("Failed to clear expenses:", deleteExpensesError.message);
    process.exit(1);
  }
 
  // --- Step 2: Clear existing categories ---
  console.log("Clearing existing categories...");
  const { error: deleteCatsError } = await supabase
    .from("category")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
  if (deleteCatsError) {
    console.error("Failed to clear categories:", deleteCatsError.message);
    process.exit(1);
  }
 
  // --- Step 3: Insert categories and capture UUIDs ---
  console.log("Inserting categories...");
  const { data: insertedCategory, error: catInsertError } = await supabase
    .from("category")
    .insert(categoryNames.map((name) => ({ name, user_id: CURRENT_USER_ID })))
    .select();
  if (catInsertError) {
    console.error("Failed to insert categories:", catInsertError.message);
    process.exit(1);
  }
  console.log(`✅ Seeded ${insertedCategory.length} category`);
 
  const categoryIdMap = {};
  insertedCategory.forEach((cat) => {
    categoryIdMap[cat.name] = cat.id;
  });
 
  // --- Step 4: Build expenses with correct category_id UUIDs ---
  const expensesToInsert = expenseSeeds.map(({ description, details, amount, category, date }) => {
    const category_id = categoryIdMap[category];
    if (!category_id) {
      console.error(`No UUID found for category: "${category}". Check categoryNames array.`);
      process.exit(1);
    }
    return { description, details, amount, category_id, date, user_id: CURRENT_USER_ID };
  });
 
  // --- Step 5: Insert expenses ---
  console.log(`Inserting ${expensesToInsert.length} expenses...`);
  const { data: insertedExpenses, error: expInsertError } = await supabase
    .from("expenses")
    .insert(expensesToInsert)
    .select();
  if (expInsertError) {
    console.error("Seed failed:", expInsertError.message);
    process.exit(1);
  }
  console.log(`✅ Seeded ${insertedExpenses.length} expenses`);
  process.exit(0);
}
 
seed();
 