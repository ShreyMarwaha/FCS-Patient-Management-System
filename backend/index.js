const express = require('express')
const cors = require('cors')
const bcrypt = require('bcrypt')
const BodyParser = require('body-parser')
require('dotenv').config()
const app = express()
app.use(cors())
app.use(BodyParser.json())

// Connection Setup ////////////////////////////////////////////////
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
app.listen(port, (err) => (err ? console.log('Failed to Listen on Port', port) : console.log('Listing for Port', port)))

// API Definitions /////////////////////////////////////////////////

app.get('/api/users', (req, res) => {
	con.query('SELECT * FROM users', (err, data) => {
		if (err) throw err
		res.json(data)
	})
})

app.post('/api/signup', (req, res) => {
	const salt = bcrypt.genSaltSync(10)
	const password = bcrypt.hashSync(req.body.password, salt)
	con.query(`INSERT INTO users (id, name, email, role, password, salt) VALUES ('${req.body.uuid}','${req.body.name}', '${req.body.email}', '${req.body.registration_type}', '${password}', '${salt}')`, (err) => {
		if (err) throw err
		res.status(400)
	})
})

app.get('/api/authenticate', (req, res) => {
	con.query(`SELECT password, salt FROM users WHERE email="abc@gmail.com"`, (err, data) => {
		if (err) throw err
		res.json(data)
		// const salt = data.salt
		// const password = bcrypt.hashSync(req.body.password, salt)
		// if (password === data.password) {
		// 	res.json({status: 'success'})
		// } else {
		// 	res.json({status: 'failed', p_in_db: data.password, p_enter_hash: password})
		// }
	})
})
