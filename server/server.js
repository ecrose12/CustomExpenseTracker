import express from "express";
import supabase from './db/supabase.js';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());


const CURRENT_USER_ID = "your-user-uuid-here";   // ← CHANGE THIS

// TEST ROUTE
app.get("/test", (_, res) => {
    res.json({ message: "Server is working!" });
});

// EXPENSES

// GET all expenses for current user
app.get("/expenses", async (_, res) => {
    const { data, error } = await supabase
        .from('expenses')
        .select('*, category(name)')
        .eq('user_id', CURRENT_USER_ID)
        .order('date', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// GET single expense
app.get("/expenses/:id", async (req, res) => {
    const { data, error } = await supabase
        .from('expenses')
        .select('*, category(name)')
        .eq('id', req.params.id)
        .eq('user_id', CURRENT_USER_ID)
        .single();

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// POST new expense
app.post('/expenses', async (req, res) => {
    const { description, details, amount, category_id, date, receipt_url } = req.body;

    const { data, error } = await supabase
        .from('expenses')
        .insert([{
            description,
            details,
            amount,
            category_id,
            date,
            receipt_url,
            user_id: CURRENT_USER_ID
        }])
        .select()
        .single();

    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data);
});

// PUT update expense
app.put("/expenses/:id", async (req, res) => {
    const { description, details, amount, category_id, date, receipt_url } = req.body;

    const { data, error } = await supabase
        .from('expenses')
        .update({ description, details, amount, category_id, date, receipt_url })
        .eq('id', req.params.id)
        .eq('user_id', CURRENT_USER_ID)
        .select()
        .single();

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// DELETE expense
app.delete("/expenses/:id", async (req, res) => {
    const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', req.params.id)
        .eq('user_id', CURRENT_USER_ID);

    if (error) return res.status(500).json({ error: error.message });
    res.status(204).send();
});

// CATEGORIES

// GET all categories for user
app.get("/category", async (_, res) => {
    const { data, error } = await supabase
        .from('category')
        .select('*')
        .eq('user_id', CURRENT_USER_ID)
        .order('date', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// POST new category
app.post('/category', async (req, res) => {
    const { name } = req.body;
    const { data, error } = await supabase
        .from('category')
        .insert([{ name, user_id: CURRENT_USER_ID }])
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