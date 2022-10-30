// Connection Setup ////////////////////////////////////////////////

const express = require('express')
const cors = require('cors')
const BodyParser = require('body-parser')
require('dotenv').config()
const app = express()
app.use(cors())
app.use(BodyParser.json())

var mysql = require('mysql')
var con = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'Password@123',
	database: 'fcs',
})

con.connect(function (err) {
	if (err) throw err
})

const port = process.env.PORT || 5000
app.listen(port, (err) => (err ? console.log('Failed to Listen on Port ', port) : console.log('Listening for Port ', port)))


// API Definitions /////////////////////////////////////////////////

app.get('/api/users', (req, res) => {
	con.query('SELECT * FROM users', (err, data) => {
		if (err) throw err
		res.json(data)
	})
})

app.get('/api/search', (req, res) => {
	con.query('SELECT * FROM users', (err, data) => {
		if (err) throw err
		res.json(data)
	})
})