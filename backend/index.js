// Connection Setup ////////////////////////////////////////////////

const express = require('express')
const cors = require('cors')
const bcrypt = require('bcrypt')
const BodyParser = require('body-parser')
const shortid = require('shortid')
const Razorpay = require('razorpay')
const multer = require('multer')
const jwt = require('jsonwebtoken')

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
const JWT_SECRET = 'mq0g8!0f^DsHYjlq1G^nX0it&E384isrWOiTY05q&M!#RPSrM!'

const razorpay = new Razorpay({
	key_id: 'rzp_test_lzmoFzw17LDqLa',
	key_secret: '6GBr3MchuCrHvUoOwOT5NMfq',
})

con.connect(function (err) {
	if (err) throw err
})

const port = process.env.PORT || 5000
app.listen(port, (err) => (err ? console.log('Failed to Listen on Port ', port) : console.log('Listening for Port ', port)))

// API Definitions /////////////////////////////////////////////////
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, '/uploads/')
	},

	// By default, adding them back
	filename: function (req, file, cb) {
		cb(null, Date.now() + '-' + file.originalname)
	},
})

var upload = multer({storage: storage}).single('file')

function verify_jwt_signature(token) {
	try {
		const decodedToken = jwt.verify(token, JWT_SECRET)
		return decodedToken
	} catch (err) {
		throw 'Token not verified'
	}
}

app.post('/api/upload_document', function (req, res) {
	upload(req, res, function (err) {
		if (err instanceof multer.MulterError) {
			return res.status(500).json(err)
		} else if (err) {
			return res.status(500).json(err)
		}
		return res.status(200).send(req.file)
	})
})

app.get('/api/users', (req, res) => {
	con.query(`SELECT * FROM users`, (err, data) => {
		if (err) throw err
		res.json({data})
	})
})

app.get('/api/searchdocs', (req, res) => {
	let decoded_token
	try {
		decoded_token = verify_jwt_signature(req.query.jwt)
	} catch (err) {
		res.json({err})
		return
	}
	if (decoded_token.role == 'patient') {
		val = req.query.name
		con.query(`SELECT name, id FROM doctors WHERE name LIKE '%${val}%'`, (err, data) => {
			if (err) throw err
			res.json({data})
		})
	}
})
app.get('/api/searchhospitals', (req, res) => {
	let decoded_token
	try {
		decoded_token = verify_jwt_signature(req.query.jwt)
	} catch (err) {
		res.json({err})
		return
	}
	if (decoded_token.role == 'patient') {
		val = req.query.name
		con.query(`SELECT name, id FROM hospitals WHERE name LIKE '%${val}%'`, (err, data) => {
			if (err) throw err
			res.json({data})
		})
	}
})
app.get('/api/searchpharmacy', (req, res) => {
	let decoded_token
	try {
		decoded_token = verify_jwt_signature(req.query.jwt)
	} catch (err) {
		res.json({err})
		return
	}
	if (decoded_token.role == 'patient') {
		val = req.query.name
		con.query(`SELECT name, id FROM pharmacy WHERE name LIKE '%${val}%'`, (err, data) => {
			if (err) throw err
			res.json({data})
		})
	}
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
	let decoded_token
	try {
		decoded_token = verify_jwt_signature(req.query.jwt)
	} catch (err) {
		res.json({err})
		return
	}
	if (decoded_token.role == 'doctor' && decoded_token.id == req.query.id) {
		val = req.query.id
		con.query(`DELETE FROM doctors WHERE id=${val}`, (err, data) => {
			if (err) throw err
			res.json({data})
		})
	}
})
app.get('/api/deletehos', (req, res) => {
	let decoded_token
	try {
		decoded_token = verify_jwt_signature(req.query.jwt)
	} catch (err) {
		res.json({err})
		return
	}
	if (decoded_token.role == 'hospital' && decoded_token.id == req.query.id) {
		val = req.query.id
		con.query(`DELETE FROM hospitals WHERE id=${val}`, (err, data) => {
			if (err) throw err
			res.json({data})
		})
	}
})

app.get('/api/deletepha', (req, res) => {
	let decoded_token
	try {
		decoded_token = verify_jwt_signature(req.query.jwt)
	} catch (err) {
		res.json({err})
		return
	}
	if (decoded_token.role == 'patient' && decoded_token.id == req.query.id) {
		val = req.query.id
		con.query(`DELETE FROM pharmacy WHERE id=${val}`, (err, data) => {
			if (err) throw err
			res.json({data})
		})
	}
})

app.post('/api/signup', (req, res) => {
	const salt = bcrypt.genSaltSync(10)
	const password = bcrypt.hashSync(req.body.password, salt)
	con.query(`SELECT * FROM users WHERE email='${req.body.email}'`, (err, data) => {
		if (err) throw err
		if (data.length === 0) {
			con.query(`INSERT INTO users (id, name, email, role, password, salt) VALUES ('${req.body.uuid}','${req.body.name}', '${req.body.email}', '${req.body.registration_type}', '${password}', '${salt}')`, (err) => {
				if (err) throw err
				res.status(200)
			})
		} else {
			res.json({message: 'User already exists'})
			res.status(200)
		}
	})
})

app.post('/api/authenticate', (req, res) => {
	const email = req.body.email
	const entered_password = req.body.password
	con.query(`SELECT id, role, password, salt, status FROM users WHERE email="${email}"`, (err, data) => {
		if (err) throw err
		if (data.length > 0) {
			const password = bcrypt.hashSync(entered_password, data[0].salt)
			if (password === data[0].password) {
				// unverified user, blocked users
				if (data[0].status !== 1) {
					res.status(200).json({
						authentication: 'success',
						status: data[0].status,
					})
					return
				}

				// verified users
				let jwt_token
				try {
					//Creating jwt token
					jwt_token = jwt.sign({userId: data[0].id, role: data[0].role, email: email}, JWT_SECRET, {expiresIn: '1h'})
				} catch (err) {
					console.log(err)
					const error = new Error('Error! Something went wrong.')
					return next(error)
				}
				// sending jwt token
				res.status(200).json({
					authentication: 'success',
					status: data[0].status,
					data: {
						userId: data[0].id,
						role: data[0].role,
						email: email,
						token: jwt_token,
					},
				})
			} else {
				res.json({authentication: 'failed'})
			}
		} else {
			res.json({status: 'user not found'})
		}
	})
})

app.post('/api/razorpay', async (req, res) => {
	const payment_capture = 1
	const medicine_id = req.body.medicine_id
	//add api to get medicine price
	const amount = 499
	const currency = 'INR'

	const options = {
		amount: amount * 100,
		currency,
		receipt: shortid.generate(),
		payment_capture,
	}

	try {
		const response = await razorpay.orders.create(options)
		res.json({
			id: response.id,
			currency: response.currency,
			amount: response.amount,
		})
	} catch (error) {
		console.log(error)
		res.json({status: 'failed'})
	}
})

app.get('/api/normalusers', (req, res) => {
	let decoded_token
	try {
		decoded_token = verify_jwt_signature(req.query.jwt)
	} catch (err) {
		res.json({err})
		return
	}
	if (decoded_token.role == 'admin') {
		con.query(`SELECT email, role, city, state, phone FROM users WHERE status = 1 AND role != "admin"`, (err, data) => {
			if (err) throw err
			res.json({data})
		})
	}
})

app.get('/api/blockedusers', (req, res) => {
	let decoded_token
	try {
		decoded_token = verify_jwt_signature(req.query.jwt)
	} catch (err) {
		res.json({err})
		return
	}
	if (decoded_token.role == 'admin') {
		con.query(`SELECT email, role, city, state, phone FROM users WHERE status = 2`, (err, data) => {
			if (err) throw err
			res.json({data})
		})
	}
})

app.get('/api/unverifiedusers', (req, res) => {
	let decoded_token
	try {
		decoded_token = verify_jwt_signature(req.query.jwt)
	} catch (err) {
		res.json({err})
		return
	}
	if (decoded_token.role == 'admin') {
		con.query('SELECT email, role, city, state, phone FROM users WHERE status = 0', (err, data) => {
			if (err) throw err
			res.json({data})
		})
	}
})

app.get('/api/viewpatients', (req, res) => {
	let decoded_token
	try {
		decoded_token = verify_jwt_signature(req.query.jwt)
	} catch (err) {
		res.json({err})
		return
	}
	if (decoded_token.role == 'doctor') {
		con.query('SELECT email, name, city, state, phone FROM users WHERE status = 1 AND role = "patient"', (err, data) => {
			if (err) throw err
			res.json({data})
		})
	}
})

app.get('/api/searchmedicine', (req, res) => {
	let decoded_token
	try {
		decoded_token = verify_jwt_signature(req.query.jwt)
	} catch (err) {
		res.json({err})
		return
	}
	if (decoded_token.role == 'admin' || decoded_token.role == 'patient' || decoded_token.role == 'doctor' || decoded_token.role == 'hospital' || decoded_token.role == 'pharmacy') {
		const value = req.query.name
		con.query(`SELECT medicines.name AS 'Medicine', medicines.dosage, medicines.price, pharmacy.name AS 'Pharmacy', pharmacy.city, pharmacy.state FROM medicines INNER JOIN pharmacy ON medicines.pharmacy_id = pharmacy.id WHERE medicines.name LIKE "%${value}%"`, (err, data) => {
			if (err) throw err
			res.json({data})
		})
	}
})

app.get('/api/searchmedicinebyid', (req, res) => {
	let decoded_token
	try {
		decoded_token = verify_jwt_signature(req.query.jwt)
	} catch (err) {
		res.json({err})
		return
	}
	if (decoded_token.role == 'admin' || decoded_token.role == 'patient' || decoded_token.role == 'doctor' || decoded_token.role == 'hospital' || decoded_token.role == 'pharmacy') {
		const value = req.query.id
		con.query(`SELECT DISTINCT medicines.id, medicines.name AS 'Medicine', medicines.price AS 'Price' FROM medicines WHERE medicines.id = ${value}`, (err, data) => {
			if (err) throw err
			res.json({data})
		})
	}
})

app.get('/api/searchpatientbyemail', (req, res) => {
	let decoded_token
	try {
		decoded_token = verify_jwt_signature(req.query.jwt)
	} catch (err) {
		res.json({err})
		return
	}
	if (decoded_token.role == 'admin' || decoded_token.role == 'doctor' || decoded_token.role == 'hospital') {
		const value = req.query.name
		con.query(`SELECT  name, email FROM users WHERE email = "%${value}%" AND status = 1 AND role = "patient"`, (err, data) => {
			if (err) throw err
			res.json({data})
		})
	}
})

app.post('/api/makeprescription', (req, res) => {
	const prescriptionId = req.body.id
	const doctorId = req.body.doctorId
	const date = req.body.date
	const email = req.body.email
	const name = req.body.name
	const prescription = req.body.prescription

	con.query(`INSERT INTO prescriptions (id, doctor_id, date, patient_email, patient_name, prescription) VALUES ('${prescriptionId}','${doctorId}', ${date}, '${email}', '${password}', '${name}', '${prescription}')`, (err) => {
		if (err) throw err
		res.status(200)
		res.json({message: 'Prescription made Successfully!'})
	})
})

app.get('/api/viewmywallet', (req, res) => {
	let decoded_token
	try {
		decoded_token = verify_jwt_signature(req.query.jwt)
	} catch (err) {
		res.json({err})
		return
	}
	if (decoded_token.role == 'doctor' || decoded_token.role == 'patient' || decoded_token.role == 'pharmacy' || decoded_token.role == 'hospital') {
		const value = req.query.name
		const email = req.query.email
		const query = `SELECT  name, email, balance AS 'Wallet Balance' FROM wallet WHERE name LIKE ? AND email = ?`
		con.query(query,value,email, (err, data) => {
			if (err) throw err
			res.json({data})
		})
	}
})

app.get('/api/fetchbalance', (req, res) => {
	let decoded_token
	try {
		decoded_token = verify_jwt_signature(req.query.jwt)
	} catch (err) {
		res.json({err})
		return
	}
	if (decoded_token.role == 'doctor' || decoded_token.role == 'patient' || decoded_token.role == 'pharmacy' || decoded_token.role == 'hospital') {
		const name = req.query.name
		const email = req.query.email
		const query = `SELECT balance FROM wallet WHERE name LIKE ? AND email = ?`
		con.query(query,name,email, (err, data) => {
			if (err) throw err
			res.json({data})
		})
	}
})

app.post('/api/updatebalance', (req, res) => {
	let decoded_token
	try {
		decoded_token = verify_jwt_signature(req.query.jwt)
	} catch (err) {
		res.json({err})
		return
	}
	if (decoded_token.role == 'doctor' || decoded_token.role == 'patient' || decoded_token.role == 'pharmacy' || decoded_token.role == 'hospital') {
		const name = req.body.name
		const email = req.body.email
		const balance = req.body.balance
		const query = `UPDATE wallet SET balance = ? WHERE name LIKE ? and email = ?`

		con.query(query,balance,name,email, (err) => {
			if (err) throw err
			res.status(200)
			res.json({message: 'Balance Updated Successfully!'})
		})
	}
})