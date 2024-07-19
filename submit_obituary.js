const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');

const app = express();
const PORT = 8080;


app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'obituary_form.html'));
});
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'obituary_platform'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database.');
});

app.post('/submit_obituary', (req, res) => {
    const { name, dob, dod, content, author } = req.body;

    const sql = 'INSERT INTO obituaries (name, date_of_birth, date_of_death, content, author) VALUES (?, ?, ?, ?, ?)';
    const values = [name, dob, dod, content, author];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error inserting data into database:', err);
            res.status(500).send('There was an error processing your request. Please try again later.');
            return;
        }
        res.send('Obituary submitted successfully.');
    });
});

db.on('error', (err) => {
    console.error('Database error:', err);
});

app.listen(PORT, () => {
    console.log('Server is running on http://localhost:${PORT}');
});
