const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Mock data user details ke liye
const user = {
    user_id: process.env.USER_ID,
    email: process.env.EMAIL,
    roll_number: process.env.ROLL_NUMBER
};

// Prime numbers check karne ke liye utility function
const isPrime = (num) => {
    if (num < 2) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false;
    }
    return true;
};

// POST Endpoint
app.post('/bfhl', (req, res) => {
    const { data, file_b64 } = req.body;

    // Agar data valid nahi hai to error return karo
    if (!data || !Array.isArray(data)) {
        return res.status(400).json({ is_success: false, message: "Invalid input" });
    }

    const numbers = [];
    const alphabets = [];
    let highestLowercase = null;

    // Data ko process kar rahe hain
    data.forEach((item) => {
        if (!isNaN(item)) {
            numbers.push(parseInt(item));
        } else if (typeof item === 'string' && /^[a-zA-Z]$/.test(item)) {
            alphabets.push(item);
            
            if (/[a-z]/.test(item) && (!highestLowercase || item > highestLowercase)) {
                highestLowercase = item;
            }
        }
    });

    const primeFound = numbers.some(isPrime);

    // File validation ki logic
    const fileDetails = {
        file_valid: !!file_b64,
        file_mime_type: file_b64 ? "unknown/mime" : null, 
        file_size_kb: file_b64 ? Math.ceil(Buffer.from(file_b64, 'base64').length / 1024) : null
    };

    // Response object ready kar rahe hain
    const response = {
        is_success: true,
        user_id: user.user_id,
        email: user.email,
        roll_number: user.roll_number,
        numbers,
        alphabets,
        highest_lowercase_alphabet: highestLowercase ? [highestLowercase] : [],
        is_prime_found: primeFound,
        file_valid: fileDetails.file_valid,
        file_mime_type: fileDetails.file_mime_type,
        file_size_kb: fileDetails.file_size_kb
    };

    // Final response send karte hain
    res.json(response);
});

// GET Endpoint
app.get('/bfhl', (req, res) => {
    res.json({
        operation_code: 1
    });
});

// Server start kar rahe hain
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});