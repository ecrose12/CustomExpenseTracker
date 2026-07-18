const express = require("express");
const supabase = require("./db/supabase.js");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Fallback user — used only if a request doesn't specify a user_id at all
// (keeps things from breaking if the frontend ever forgets to pass one).
const DEFAULT_USER_ID = "c2f80108-3f70-4316-b505-b2cdef4cff08";

// Pulls the active user's id from the request: query string for GET/DELETE,
// request body for POST/PUT. Falls back to DEFAULT_USER_ID if neither is set.
function getUserId(req) {
  return req.query.user_id || req.body?.user_id || DEFAULT_USER_ID;
}

// TEST ROUTE
app.get("/test", (_, res) => {
  res.json({ message: "Server is working!" });
});

// USERS

// GET all users, for the "log in as" picker
app.get("/users", async (_, res) => {
  const { data, error } = await supabase
    .from("users")
    .select("id, name")
    .order("name", { ascending: true });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// EXPENSES

// GET all expenses for the selected user
app.get("/expenses", async (req, res) => {
  const userId = getUserId(req);
  const { data, error } = await supabase
    .from("expenses")
    .select("*, category(name), users(name)")
    .eq("user_id", userId)
    .order("date", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// GET single expense
app.get("/expenses/:id", async (req, res) => {
  const userId = getUserId(req);
  const { data, error } = await supabase
    .from("expenses")
    .select("*, category(name), users(name)")
    .eq("id", req.params.id)
    .eq("user_id", userId)
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// POST new expense
app.post("/expenses", async (req, res) => {
  const userId = getUserId(req);
  const { description, details, amount, category_id, date, receipt_url } = req.body;

  const { data, error } = await supabase
    .from("expenses")
    .insert([
      {
        description,
        details,
        amount,
        category_id,
        date,
        receipt_url,
        user_id: userId,
      },
    ])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

// PUT update expense
app.put("/expenses/:id", async (req, res) => {
  const userId = getUserId(req);
  const { description, details, amount, category_id, date, receipt_url } = req.body;

  const { data, error } = await supabase
    .from("expenses")
    .update({ description, details, amount, category_id, date, receipt_url })
    .eq("id", req.params.id)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// DELETE expense
app.delete("/expenses/:id", async (req, res) => {
  const userId = getUserId(req);
  const { error } = await supabase
    .from("expenses")
    .delete()
    .eq("id", req.params.id)
    .eq("user_id", userId);

  if (error) return res.status(500).json({ error: error.message });
  res.status(204).send();
});

// CATEGORIES

// GET all categories for the selected user
app.get("/category", async (_, res) => {
  const { data, error } = await supabase
    .from("category")
    .select("*")
    .order("name", { ascending: true });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// POST new category
app.post("/category", async (req, res) => {
  const userId = getUserId(req);
  const { name } = req.body;
  const { data, error } = await supabase
    .from("category")
    .insert([{ name, user_id: userId }])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});