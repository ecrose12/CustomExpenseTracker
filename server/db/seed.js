import supabase from './supabase.js';
 
// Category names to seed
const categoryNames = [
  'Food',
  'Transportation',
  'Entertainment',
  'Utilities',
];
 
// Expenses use category names here; they get replaced with UUIDs below
const expenseSeeds = [
  { description: 'Starbucks coffee',      amount: 5.75,   categoryName: 'Food',           date: '2025-04-01' },
  { description: 'Grocery run at Target', amount: 87.42,  categoryName: 'Food',           date: '2025-04-03' },
  { description: 'Gas fill-up',           amount: 42.18,  categoryName: 'Transportation', date: '2025-04-05' },
  { description: 'Netflix subscription',  amount: 15.99,  categoryName: 'Entertainment',  date: '2025-04-06' },
  { description: 'Electric bill',         amount: 112.34, categoryName: 'Utilities',      date: '2025-04-08' },
  { description: 'Lunch with coworkers',  amount: 18.50,  categoryName: 'Food',           date: '2025-04-10' },
  { description: 'Uber to airport',       amount: 32.75,  categoryName: 'Transportation', date: '2025-04-12' },
  { description: 'Movie tickets',         amount: 28.00,  categoryName: 'Entertainment',  date: '2025-04-13' },
  { description: 'Coffee beans',          amount: 14.99,  categoryName: 'Food',           date: '2025-04-14' },
  { description: 'Internet bill',         amount: 79.99,  categoryName: 'Utilities',      date: '2025-04-15' },
];
 
async function seed() {
 
  // --- Step 1: Clear existing expenses ---
  console.log('Clearing existing expenses...');
  const { error: deleteExpensesError } = await supabase
    .from('expenses')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');
 
  if (deleteExpensesError) {
    console.error('Failed to clear expenses:', deleteExpensesError.message);
  process.exit(1);
}

// --- Step 2: Clear existing categories ---
console.log('Clearing existing categories...');
  const { error: deleteCatsError } = await supabase
    .from('category'    )
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');
 
  if (deleteCatsError) {
    console.error('Failed to clear categories:', deleteCatsError.message);
    process.exit(1);
  }
 
  // --- Step 3: Insert categories and capture UUIDs ---
  console.log('Inserting categories...');
  const { data: insertedCategory, error: catInsertError } = await supabase
    .from('category')
    .insert(categoryNames.map(name => ({ name })))
    .select();
 
  if (catInsertError) {
    console.error('Failed to insert categories:', catInsertError.message);
    process.exit(1);
  }
 
  console.log(`✅ Seeded ${insertedCategory.length} category`);
 

  const categoryIdMap = {};
  insertedCategory.forEach(cat => {
    categoryIdMap[cat.name] = cat.id;
  });
 
  // --- Step 4: Build expenses with correct category_id UUIDs ---

  const expensesToInsert = expenseSeeds.map(({ description, amount, categoryName, date }) => {
    const category_id = categoryIdMap[categoryName];
    if (!category_id) {
      console.error(`No UUID found for category: "${categoryName}". Check categoryNames array.`);
      process.exit(1);
    }
    return { description, amount, category_id, date };
  });
 
  // --- Step 5: Insert expenses ---
  console.log(`Inserting ${expensesToInsert.length} expenses...`);
  const { data: insertedExpenses, error: expInsertError } = await supabase
    .from('expenses')
    .insert(expensesToInsert)
    .select();
 
  if (expInsertError) {
    console.error('Seed failed:', expInsertError.message);
    process.exit(1);
  }
 
  console.log(`✅ Seeded ${insertedExpenses.length} expenses`);
  process.exit(0);
}

seed();