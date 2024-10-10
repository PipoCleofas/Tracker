const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());


const connection = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'Jacob17_jacob',
    database: 'tracker'
  });
  
connection.connect((err) => {
if (err) {
    console.error('Error connecting to the database:', err);
    process.exit(1);
}
console.log('Connected to the database');
});


function validateMarker(req, res, next) {
    const { latitude, longitude, title, description } = req.body;
  
    if (!latitude || !longitude || !title || !description) {
      return res.status(400).send('latitude, longitude, title, and description are required');
    }
  
    next();
  }
  
  
  app.post('/submit', validateMarker ,(req, res) => {
    const { latitude, longitude, title, description } = req.body;``
    
    console.log('Received data:', { latitude, longitude, title, description });
  
    const query = 'INSERT INTO marker (latitude, longitude, title, description) VALUES (?, ?, ?, ?)';
  
    connection.query(query, [latitude, longitude, title, description], (error, results) => {
      if (error) {
        console.error('Database error:', error.message);
        return res.status(500).send('Database error');
      }
      console.log('Query results:', results);
      res.status(200).json({
         message: 'Data saved successfully',
         id: results.insertId 
      });
    });
  });
  


  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });