const db = require('../db'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    // Added 'role' to destructuring
    const { email, password, role } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Updated SQL to include 'role'
        const sql = 'INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING id, email, role';
        const result = await db.query(sql, [email, hashedPassword, role || 'User']);
        
        res.status(201).json({ 
            message: "User registered!", 
            user: result.rows[0] 
        });
    } catch (error) {
        console.error("Registration Error:", error.message);
        if (error.code === '23505') { 
            return res.status(400).json({ message: "Email already exists" });
        }
        res.status(500).json({ message: "Registration failed" });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) return res.status(401).json({ message: "User not found" });

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid password" });

        // Included 'role' in the JWT payload for frontend access control
        const token = jwt.sign(
            { id: user.id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' }
        );

        res.json({ 
            token, 
            user: { 
                id: user.id, 
                email: user.email, 
                role: user.role 
            } 
        });
    } catch (error) {
        console.error("Login Error:", error.message);
        res.status(500).json({ message: "Login error" });
    }
};