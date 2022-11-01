// Connection Setup ////////////////////////////////////////////////

const express = require('express')
const cors = require('cors')
const bcrypt = require('bcrypt')
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
	con.query(`SELECT * FROM users`, (err, data) => {
		if (err) throw err
		res.json({data})
	})
})

app.get('/api/searchdocs', (req, res) => {
	val = req.query.name
	con.query(`SELECT name, id FROM doctors WHERE name LIKE '%${val}%'`, (err, data) => {
		if (err) throw err
		res.json({data})
	})
})
app.get('/api/searchhospitals', (req, res) => {
	val = req.query.name
	con.query(`SELECT name, id FROM hospitals WHERE name LIKE '%${val}%'`, (err, data) => {
		if (err) throw err
		res.json({data})
	})
})
app.get('/api/searchpharmacy', (req, res) => {
	val = req.query.name
	con.query(`SELECT name, id FROM pharmacy WHERE name LIKE '%${val}%'`, (err, data) => {
		if (err) throw err
		res.json({data})
	})
})

app.get('/api/detailsdoc', (req, res) => {
	val = req.query.id
	con.query(`SELECT doctors.name, doctors.city, doctors.state, hospitals.name as hospital FROM doctors LEFT JOIN hospitals ON doctors.hospital_id=hospitals.id WHERE doctors.id=${val}`, (err, data) => {
		if (err) throw err
		res.json({data})
	})
})
app.get('/api/detailshos', (req, res) => {
	val = req.query.id
	con.query(`SELECT name, city, state FROM hospitals WHERE id=${val}`, (err, data) => {
		if (err) throw err
		res.json({data})
	})
})
app.get('/api/detailspha', (req, res) => {
	val = req.query.id
	con.query(`SELECT name, city, state FROM pharmacy WHERE id=${val}`, (err, data) => {
		if (err) throw err
		res.json({data})
	})
})

app.get('/api/deletedoc', (req, res) => {
	val = req.query.id
	con.query(`DELETE FROM doctors WHERE id=${val}`, (err, data) => {
		if (err) throw err
		res.json({data})
	})
})
app.get('/api/deletehos', (req, res) => {
	val = req.query.id
	con.query(`DELETE FROM hospitals WHERE id=${val}`, (err, data) => {
		if (err) throw err
		res.json({data})
	})
})
app.get('/api/deletepha', (req, res) => {
	val = req.query.id
	con.query(`DELETE FROM pharmacy WHERE id=${val}`, (err, data) => {
		if (err) throw err
		res.json({data})
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
app.post('/api/authenticate', (req, res) => {
	const email = req.body.email
	const entered_password = req.body.password
	con.query(`SELECT password, salt FROM users WHERE email="${email}"`, (err, data) => {
		if (err) throw err
		if (data.length === 0) res.json({status: 'user not found'})

		const salt = data[0].salt
		const password = bcrypt.hashSync(entered_password, salt)
		if (password === data[0].password) {
			res.json({status: 'success'})
		} else {
			res.json({status: 'failed'})
		}
	})
})
