// Connection Setup ////////////////////////////////////////////////

const express = require('express')
const cors = require('cors')
const bcrypt = require('bcrypt')
const BodyParser = require('body-parser')
const shortid = require('shortid')
const Razorpay = require('razorpay')
const multer = require('multer')
const jwt = require('jsonwebtoken')
const otpGenerator = require('otp-generator')
const nodemailer = require('nodemailer')
const rateLimit = require('express-rate-limit')
const requestIp = require('request-ip')

require('dotenv').config()

const app = express()
app.use(requestIp.mw())
app.use(cors())
app.use(BodyParser.json())

// Rate Limiting ////////////////////////////////////////////////
app.use(
	rateLimit({
		windowMs: 60 * 1000, // 1 minute
		max: 20, // limit each IP to 30 requests per windowMs
		keyGenerator: (req, res) => {
			return req.clientIp // IP address from requestIp.mw(), as opposed to req.ip
		},
	})
)

// Connection Setup ////////////////////////////////////////////////
var mysql = require('mysql')
var con = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'Password@123',
	database: 'fcs',
})
con.on('error', function (err) {
	console.log('[mysql error]', err)
})

const JWT_SECRET = 'mq0g8!0f^DsHYjlq1G^nX0it&E384isrWOiTY05q&M!#RPSrM!'

const razorpay = new Razorpay({
	key_id: 'rzp_test_lzmoFzw17LDqLa',
	key_secret: '6GBr3MchuCrHvUoOwOT5NMfq',
})

var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'wbciiitd2021@gmail.com',
		pass: 'tliyahfrnskdosty',
	},
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
function sendOTPviaMail(receiverEmail, otp) {
	const mail = {
		from: 'wbciiitd2021@gmail.com',
		to: receiverEmail,
		subject: `OTP for 6ix Portal`,
		text: `Hi,\n\nYour OTP for 6ix Portal is ${otp}\nPlease do not share this with anyone.\n\nRegards,\nTeam 6ix`,
	}
	transporter.sendMail(mail, function (err, data) {
		if (err) {
			console.log('Error Occurs', err)
		} else {
			console.log('Email sent successfully')
		}
	})
}

function generateOTP(id, user_email) {
	const otp = otpGenerator.generate(8)
	console.log(otp)
	const expiry = 5 * 60 * 1000 //5 mins
	const expiry_time = Date.now() + expiry
	con.query(`INSERT into otpTable (id, otp, expiry) values("${id}", "${otp}", ${expiry_time}) ON DUPLICATE KEY UPDATE otp="${otp}", expiry=${expiry_time}`, (err, data) => {
		if (err) throw err
	})
	// sendOTPviaMail('shrey19334@iiitd.ac.in', otp)
	sendOTPviaMail(user_email, otp)
}

app.get('/api/test', (req, res) => {
	console.log('test api')
	con.query(`SELECT * FROM users`, (err, data) => {
		if (err) throw err
		if (data.length > 0) res.send('working')
		else res.send('you should not be here')
	})
})

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

app.get('/api/searchdocs', (req, res) => {
	let decoded_token
	try {
		decoded_token = verify_jwt_signature(req.query.jwt)
	} catch (err) {
		res.json({err})
		return
	}
	if (decoded_token.role == 'patient') {
		const val = req.query.name
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
		const val = req.query.name
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
		const val = req.query.name
		con.query(`SELECT name, id FROM pharmacy WHERE name LIKE '%${val}%'`, (err, data) => {
			if (err) throw err
			res.json({data})
		})
	}
})

app.get('/api/detailsdoc', (req, res) => {
	const val = req.query.id
	con.query(`SELECT doctors.name, doctors.city, doctors.state, hospitals.name as hospital FROM doctors LEFT JOIN hospitals ON doctors.hospital_id=hospitals.id WHERE doctors.id=${val}`, (err, data) => {
		if (err) throw err
		res.json({data})
	})
})
app.get('/api/detailshos', (req, res) => {
	const val = req.query.id
	con.query(`SELECT name, city, state FROM hospitals WHERE id=${val}`, (err, data) => {
		if (err) throw err
		res.json({data})
	})
})
app.get('/api/detailspha', (req, res) => {
	const val = req.query.id
	con.query(`SELECT name, city, state FROM pharmacy WHERE id=${val}`, (err, data) => {
		if (err) throw err
		res.json({data})
	})
})
app.get('/api/detailsUser', (req, res) => {
	let decoded_token
	try {
		decoded_token = verify_jwt_signature(req.query.jwt)
	} catch (err) {
		res.json({err})
		return
	}
	if (decoded_token.role == 'admin') {
		const val = req.query.id
		con.query(`SELECT id, email, role, city, state, phone FROM users WHERE id=${val}`, (err, data) => {
			if (err) throw err
			res.json({data})
		})
	}
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
		const val = req.query.id
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
		const val = req.query.id
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
		const val = req.query.id
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
			if (req.body.registration_type === 'doctor' || req.body.registration_type === 'hospital' || req.body.registration_type === 'pharmacy' || req.body.registration_type === 'patient') {
				con.query(`INSERT INTO users (id, name, email, role, password, salt) VALUES ('${req.body.uuid}','${req.body.name}', '${req.body.email}', '${req.body.registration_type}', '${password}', '${salt}')`, (err) => {
					if (err) throw err
					res.status(200)
				})
			} else {
				res.status(400)
			}
		} else {
			res.json({message: 'User already exists'})
		}
	})
})

app.post('/api/authToLogin', (req, res) => {
	console.log('API: authToLogin')
	const email = req.body.email
	const entered_password = req.body.password
	con.query(`SELECT id, role, password, salt, status FROM users WHERE email="${email}"`, (err, data) => {
		if (err) throw err
		if (data.length > 0) {
			const password = bcrypt.hashSync(entered_password, data[0].salt)
			if (password === data[0].password) {
				console.log('password correct')
				// unverified user, blocked users
				if (data[0].status === 1) {
					console.log('generate otp')
					generateOTP(data[0].id, email)
				}
				res.json({
					authentication: 'success',
					status: data[0].status,
				})
			} else {
				console.log('wrong password')
				res.json({
					authentication: 'failed',
				})
				return
			}
		} else {
			res.json({status: 'user not found'})
		}
	})
})

app.post('/api/authenticate', (req, res) => {
	const email = req.body.email
	const entered_password = req.body.password
	const otp = req.body.otp
	console.log('API: authenticate')
	console.log(req.body)
	con.query(`SELECT id, role, password, salt, status FROM users WHERE email="${email}"`, (err, data) => {
		if (err) throw err
		console.log('query1', data)
		if (data.length > 0) {
			console.log('user found')
			const password = bcrypt.hashSync(entered_password, data[0].salt)
			if (password === data[0].password) {
				console.log('password correct')
				// unverified user, blocked users
				if (data[0].status !== 1) {
					console.log('user not verified/blocked', data[0].status)
					res.json({
						authentication: 'success',
						status: data[0].status,
					})
					return
				}
				console.log('user verified')
				con.query(`SELECT otp, expiry FROM otpTable WHERE id="${data[0].id}"`, (err, data2) => {
					console.log('query2', data2)
					if (data2[0].otp === otp && data2[0].expiry > Date.now()) {
						console.log('otp correct')
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
						res.json({
							authentication: 'success',
							status: data[0].status,
							data: {
								userId: data[0].id,
								role: data[0].role,
								email: email,
								token: jwt_token,
							},
						})
					} else if (data2[0].otp === otp && data2[0].expiry < Date.now()) {
						console.log('otp expired')
						res.json({error: 'otp expired'})
					} else {
						console.log('otp incorrect')
						console.log('OTP user:server', otp, data2[0].otp)
						console.log(typeof otp, typeof data2[0].otp)
						console.log(data2[0].length, otp.length)
						console.log('contents match?', data2[0].otp == otp)
						res.json({error: 'otp invalid'})
					}
				})
			} else {
				console.log('wrong password')
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
		con.query('SELECT id, email, role, city, state, phone FROM users WHERE status = 0', (err, data) => {
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
		const query = `SELECT medicines.name AS 'Medicine', medicines.dosage, medicines.price, pharmacy.name AS 'Pharmacy', pharmacy.city, pharmacy.state FROM medicines INNER JOIN pharmacy ON medicines.pharmacy_id = pharmacy.id WHERE medicines.name LIKE "%${value}%"`
		console.log(query)
		con.query(query, (err, data) => {
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

app.get('/api/approveuser', (req, res) => {
	let decoded_token
	try {
		decoded_token = verify_jwt_signature(req.query.jwt)
	} catch (err) {
		res.json({err})
		return
	}
	if (decoded_token.role == 'admin') {
		const id = req.query.id
		const query = 'UPDATE users SET status = 1 WHERE id = ?'
		con.query(query, [id], (err, data) => {
			if (err) throw err
			res.send('User Approved with id ' + id)
		})
	} else res.send('Not authorized to approve user.')
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
		con.query(`SELECT name, email FROM users WHERE email=${value} AND status=1 AND role="patient"`, (err, data) => {
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
	console.log(req.body)
	con.query(`SELECT * FROM prescriptions WHERE patient_email='${email}'`, (err, data) => {
		if (err) throw err
		con.query(`INSERT INTO prescriptions (id, doctor_id, date, patient_email, patient_name, prescription) VALUES ('${prescriptionId}','${doctorId}', ${date}, '${email}', '${name}', '${prescription}')`, (err) => {
			if (err) throw err
			res.status(200)
			res.json({message: 'Prescription made Successfully!'})
		})
	})
})
