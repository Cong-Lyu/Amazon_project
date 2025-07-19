const express = require('express');
const amazonServer = express();
const mysql2 = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

const pool = mysql2.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
}).promise()

amazonServer.use(express.static('./public'));
amazonServer.use(express.json());

amazonServer.post('/login', async (req, res) => {
  const queryBody = 'INSERT INTO users (userPassword, userEmail, lastLogin) VALUES(?, ?, NOW())';
  const result = await pool.query(queryBody, [req.body.userPassword, req.body.userEmail])
  res.status(200).send(result);
})


amazonServer.listen(5000, () => {
  console.log('Now Amazon server is created and listening requests from port 5000......');
})