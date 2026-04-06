const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_DIR = path.join(__dirname, '.data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

// Ensure .data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
}

// Middleware
app.use(cors());
app.use(express.json());

// Helper to read DB
const readDB = () => {
    try {
        if (!fs.existsSync(DB_FILE)) {
            return { visitors: [], messages: [] };
        }
        const data = fs.readFileSync(DB_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading DB:', err);
        return { visitors: [], messages: [] };
    }
};

// Helper to write DB
const writeDB = (data) => {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
    } catch (err) {
        console.error('Error writing DB:', err);
    }
};

// 1. Log a new visitor
app.post('/api/visitors', (req, res) => {
    const { name, email, phone, date } = req.body;
    if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
    }
    
    const db = readDB();
    const newVisitor = { 
        id: Date.now().toString(), 
        name, 
        email, 
        phone, 
        date: date || new Date().toLocaleString() 
    };
    db.visitors.push(newVisitor);
    writeDB(db);
    
    res.status(201).json({ success: true, visitor: newVisitor });
});

// 2. Submit contact message
app.post('/api/messages', (req, res) => {
    const { name, email, phone, service, msg, date } = req.body;
    if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
    }
    
    const db = readDB();
    const newMessage = {
        id: Date.now().toString(),
        name,
        email,
        phone,
        service,
        msg,
        date: date || new Date().toLocaleString()
    };
    db.messages.push(newMessage);
    writeDB(db);
    
    res.status(201).json({ success: true, message: newMessage });
});

// 3. Get all visitors (Admin Panel)
app.get('/api/visitors', (req, res) => {
    const db = readDB();
    res.json(db.visitors);
});

// 4. Get all messages (Admin Panel)
app.get('/api/messages', (req, res) => {
    const db = readDB();
    res.json(db.messages);
});

// 5. Clear database (Admin Panel)
app.delete('/api/clear', (req, res) => {
    writeDB({ visitors: [], messages: [] });
    res.json({ success: true, message: 'Database cleared successfully' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
    console.log(`Data will be saved to ${DB_FILE}`);
});
