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
const {v4: uuidv4} = require('uuid')
var fs = require('fs')
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
const base_dir = '/var/www/uploads'
const roles = ['admin', 'patient', 'doctor', 'pharmacy', 'insurance', 'hospital']
const doc_type_supported = ['identity', 'prescription', 'bills', 'reports']
const razorpay = new Razorpay({
	key_id: 'rzp_test_lzmoFzw17LDqLa',
	key_secret: '6GBr3MchuCrHvUoOwOT5NMfq',
})

var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'browniemailer01@gmail.com',
		pass: 'omxdmgpjneaqsnyz',
	},
})

function checkParameters(query) {
	console.log(query)
	const {userQuery} = query
	const onlyLettersPattern = /^[a-zA-Z]([\w -]*[a-zA-Z])?$/

	if (!userQuery.match(onlyLettersPattern)) {
		console.log('cbuberjh')
		return res.json({err: 'No special characters and no numbers!'})
	} else return true
}

const port = process.env.PORT || 5000
app.listen(port, (err) => (err ? console.log('Failed to Listen on Port ', port) : console.log('Listening for Port ', port)))

// Util Functions /////////////////////////////////////////////////
function addDocumentDetails(doc_id, issued_by, issued_to, doc_type, path) {
	console.log('FUNC: addDocumentDetails', doc_id)
	if (validateParameters([doc_id, issued_by, issued_to, doc_type, path])) {
		console.log('valid params')
		con.query(`INSERT INTO documents (id, issued_by, issued_to, doc_type, path) VALUES ("${doc_id}", "${issued_by}", "${issued_to}", "${doc_type}", "${path}")`, (err, data) => {
			if (err) throw err
		})
	} else console.log('missing params')
}

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		console.log('FUNC: storage')
		if (!file.originalname.match(/\.(pdf|jpg|jpeg)$/)) {
			console.log('Not a supported file extension')
			deleteUser(req.body.uuid)
			return cb(new Error('Not a supported file extension'))
		} else if (doc_type_supported.includes(req.body.doc_type) && validateParameters([req.body.doc_id, req.body.uuid, req.body.issued_to, req.body.doc_type, req.body.uuid])) {
			const path = `${base_dir}/${req.body.uuid}`
			console.log('Path: ', path)
			addDocumentDetails(req.body.doc_id, req.body.uuid, req.body.issued_to, req.body.doc_type, req.body.uuid + '/' + req.body.doc_id + '.' + file.originalname.split('.').pop())
			cb(null, path)
		} else {
			console.log('Missing paramerer while storing file')
			console.log('PARAMS:', req.body.doc_id, req.body.uuid, req.body.issued_to, req.body.doc_type)
			deleteUser(req.body.uuid)
			return cb(new Error('Invalid Document Type'))
		}
	},

	// By default, adding them back
	filename: function (req, file, cb) {
		cb(null, req.body.doc_id + '.' + file.originalname.split('.').pop())
	},
})

var upload = multer({storage: storage}).single('file')
function validateParameters(params) {
	for (var i in params) {
		if (i === undefined) {
			return false
		}
	}
	return true
}
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

function deleteUser(uuid) {
	console.log('FUNC: deleteUser', uuid)
	con.query(`DELETE FROM users WHERE id="${uuid}"`, (err, data) => {
		if (err) throw err
		console.log('User deleted')
		const dir = base_dir + '/' + uuid
		fs.rmdir(dir, {recursive: true}, (err) => {
			if (err) {
				console.log(`Error deleting ${dir}`)
			}
			console.log(`Deleted dir ${dir}`)
		})
	})
}

function deleteClaim(uuid) {
	console.log('FUNC: deleteClaim', uuid)
	con.query(`DELETE FROM claims WHERE id="${uuid}"`, (err, data) => {
		if (err) throw err
		console.log('Claim deleted')
	})
}

function makeUserDirectoryStructure(uuid) {
	console.log('FUNC: makeUserDirectoryStructure', uuid)
	const dir = `${base_dir}/${uuid}`
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, {recursive: true})
	}
}

// API Definitions /////////////////////////////////////////////////

app.get('/api/test', (req, res) => {
	console.log('test api')

	con.query(`SELECT * FROM users`, (err, data) => {
		if (err) throw err
		if (data.length > 0) res.send('working')
		else res.send('you should not be here')
	})
})

app.post('/api/upload_identity', function (req, res) {
	console.log('API: upload_identity')
	upload(req, res, (err) => {
		if (err) {
			console.log('Error Occurs', err)
			res.send('Something went wrong!')
		} else if (req.file === undefined || req.body.uuid === undefined || req.body.doc_type === undefined || req.body.issued_to === undefined || req.body.doc_id === undefined) {
			console.log('missing parameters')
			deleteUser(req.body.uuid)
			res.send('missing parameters')
		} else {
			console.log('File Uploaded')
			res.send(req.file)
		}
	})
})

app.post('/api/upload_document', function (req, res) {
	console.log('API: upload_document')
	upload(req, res, (err) => {
		if (err) {
			console.log('Error Occurs', err)
			res.send('Something went wrong!')
		} else if (req.file === undefined || req.body.uuid === undefined || req.body.doc_type === undefined || req.body.issued_to === undefined || req.body.doc_id === undefined) {
			console.log('missing parameters')
			res.send('missing parameters')
		} else {
			console.log('File Uploaded')
			res.send(req.file)
		}
	})
})

app.get('/api/searchdocs', (req, res) => {
	console.log('API: searchdocs')
	const val = '%' + req.query.name + '%'

	if (!validateParameters([val])) {
		res.json({status: 'missing parameters'})
		return
	}
	let decoded_token
	try {
		decoded_token = verify_jwt_signature(req.query.jwt)
	} catch (err) {
		res.json({err})
		return
	}
	if (decoded_token.role == 'patient') {
		const query = 'SELECT name, id FROM doctors WHERE name LIKE ?'
		con.query(query, [val], (err, data) => {
			console.log(query.sql, val)
			if (err) throw err
			res.json({data})
		})
	}
})
app.get('/api/searchhospitals', (req, res) => {
	const val = '%' + req.query.name + '%'
	if (!validateParameters([val])) {
		res.json({status: 'missing parameters'})
		return
	}
	let decoded_token
	try {
		decoded_token = verify_jwt_signature(req.query.jwt)
	} catch (err) {
		res.json({err})
		return
	}
	if (decoded_token.role == 'patient') {
		const query = 'SELECT name, id FROM hospitals WHERE name LIKE ?'
		con.query(query, [val], (err, data) => {
			if (err) throw err
			res.json({data})
		})
	}
})
app.get('/api/searchpharmacy', (req, res) => {
	const val = '%' + req.query.name + '%'
	if (!validateParameters([val])) {
		res.json({status: 'missing parameters'})
	}
	let decoded_token
	try {
		decoded_token = verify_jwt_signature(req.query.jwt)
	} catch (err) {
		res.json({err})
		return
	}
	if (decoded_token.role == 'patient') {
		const query = 'SELECT name, id FROM pharmacy WHERE name LIKE ?'
		con.query(query, [val], (err, data) => {
			if (err) throw err
			res.json({data})
		})
	}
})

app.get('/api/detailsdoc', (req, res) => {
	const val = req.query.id
	if (!validateParameters(params)) {
		res.json({status: 'missing parameters'})
		return
	}
	const query = 'SELECT doctors.name, doctors.city, doctors.state, hospitals.name as hospital FROM doctors LEFT JOIN hospitals ON doctors.hospital_id=hospitals.id WHERE doctors.id = ?'
	con.query(query, [val], (err, data) => {
		if (err) throw err
		res.json({data})
	})
})
app.get('/api/detailshos', (req, res) => {
	const val = req.query.id
	if (val === undefined) {
		res.json({status: 'missing parameters'})
		return
	}
	const query = 'SELECT name, city, state FROM hospitals WHERE id = ?'
	con.query(query, [val], (err, data) => {
		if (err) throw err
		res.json({data})
	})
})
app.get('/api/detailspha', (req, res) => {
	const val = req.query.id
	if (val === undefined) {
		res.json({status: 'missing parameters'})
		return
	}
	const query = 'SELECT name, city, state FROM pharmacy WHERE id = ?'
	con.query(query, [val], (err, data) => {
		if (err) throw err
		res.json({data})
	})
})
app.get('/api/detailsUser', (req, res) => {
	const val = req.query.id
	if (val === undefined) {
		res.json({status: 'missing parameters'})
		return
	}
	let decoded_token
	try {
		decoded_token = verify_jwt_signature(req.query.jwt)
	} catch (err) {
		res.json({err})
		return
	}
	if (decoded_token.role == 'admin') {
		const query = 'SELECT id, email, role, city, state, phone FROM users WHERE id = ?'
		con.query(query, [val], (err, data) => {
			if (err) throw err
			res.json({data})
		})
	} else {
		res.json({status: 'unauthorized'})
	}
})

app.get('/api/deletedoc', (req, res) => {
	const val = req.query.id
	if (val === undefined) {
		res.json({status: 'missing parameters'})
		return
	}
	let decoded_token
	try {
		decoded_token = verify_jwt_signature(req.query.jwt)
	} catch (err) {
		res.json({err})
		return
	}
	if (decoded_token.role == 'doctor' && decoded_token.userId == req.query.id) {
		con.query(`DELETE FROM doctors WHERE id=${val}`, (err, data) => {
			if (err) throw err
			res.json({data})
		})
	} else {
		res.json({status: 'unauthorized'})
	}
})
app.get('/api/deletehos', (req, res) => {
	const val = req.query.id
	if (val === undefined) {
		res.json({status: 'missing parameters'})
		return
	}
	let decoded_token
	try {
		decoded_token = verify_jwt_signature(req.query.jwt)
	} catch (err) {
		res.json({err})
		return
	}
	if (decoded_token.role == 'hospital' && decoded_token.userId == req.query.id) {
		con.query(`DELETE FROM hospitals WHERE id=${val}`, (err, data) => {
			if (err) throw err
			res.json({data})
		})
	} else {
		res.json({status: 'unauthorized'})
	}
})

app.get('/api/deletepha', (req, res) => {
	const val = req.query.id
	if (val === undefined) {
		res.json({status: 'missing parameters'})
		return
	}
	let decoded_token
	try {
		decoded_token = verify_jwt_signature(req.query.jwt)
	} catch (err) {
		res.json({err})
		return
	}
	if (decoded_token.role == 'patient' && decoded_token.userId == req.query.id) {
		con.query(`DELETE FROM pharmacy WHERE id=${val}`, (err, data) => {
			if (err) throw err
			res.json({data})
		})
	} else {
		res.json({status: 'unauthorized'})
	}
})

app.post('/api/signup', (req, res) => {
	console.log('API: signup')
	console.log(req.body)
	const uuid = req.body.uuid
	const name = req.body.name
	const email = req.body.email
	const state = req.body.state
	const city = req.body.city
	const phone = req.body.phone
	let password = req.body.password
	const user_type = req.body.registration_type
	if (!validateParameters([uuid, name, email, password, user_type, state, city, phone])) {
		console.log('missing parameters')
		res.json({status: 'missing parameters'})
		return
	}
	const salt = bcrypt.genSaltSync(10)
	password = bcrypt.hashSync(password, salt)
	const query = 'SELECT * FROM users WHERE email = ?'
	con.query(query, [email], (err, data) => {
		if (err) throw err
		if (data.length === 0) {
			if (roles.includes(user_type)) {
				const query = `INSERT INTO users VALUES ('${uuid}', '${email}', '${user_type}', '${city}', '${state}', '${phone}', 0, '${password}', '${salt}', '${name}')`
				con.query(query, (err) => {
					if (err) throw err
					makeUserDirectoryStructure(uuid)
					res.json({message: 'successfully registered'})
				})
			} else {
				console.log('invalid user type')
				res.json({message: 'invalid user type'})
			}
		} else {
			console.log('email already exists')
			res.json({message: 'user already exists'})
		}
	})
})

app.post('/api/authToLogin', (req, res) => {
	console.log('API: authToLogin')
	const email = req.body.email
	const entered_password = req.body.password
	if (email === undefined && entered_password === undefined) {
		res.json({status: 'missing parameters'})
	}
	const query = 'SELECT id, role, password, salt, status FROM users WHERE email = ?'
	con.query(query, [email], (err, data) => {
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
	console.log('API: authenticate')
	const email = req.body.email
	const entered_password = req.body.password
	const otp = req.body.otp
	if (otp === undefined || email === undefined || entered_password === undefined) {
		res.json({status: 'missing parameters'})
		return
	}
	console.log(req.body)
	const query1 = 'SELECT id, role, password, salt, status FROM users WHERE email = ?'
	con.query(query1, [email], (err, data) => {
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
				const query2 = 'SELECT otp, expiry FROM otpTable WHERE id = ?'
				con.query(query2, [data[0].id], (err, data2) => {
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
						console.log(data2[0].otp.length, otp.length)
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

app.get('/api/users', (req, res) => {
	let decoded_token
	try {
		decoded_token = verify_jwt_signature(req.query.jwt)
	} catch (err) {
		res.json({err})
		return
	}
	if (decoded_token.role === 'admin') {
		con.query('SELECT id, email, role, city, state, phone, status FROM users', (err, data) => {
			if (err) throw err
			res.json({data})
		})
	}
})

app.get('/api/usersWithIdentities', (req, res) => {
	let decoded_token
	try {
		decoded_token = verify_jwt_signature(req.query.jwt)
	} catch (err) {
		res.json({err})
		return
	}
	if (decoded_token.role === 'admin') {
		con.query(`SELECT users.id, users.email, users.role, users.city, users.state, users.phone, users.status, documents.path from users LEFT JOIN documents ON users.id=documents.issued_by WHERE documents.doc_type='identity'`, (err, data) => {
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
	const value = '%' + req.query.name + '%'
	if (value === undefined) {
		res.json({status: 'missing parameters'})
	}
	let decoded_token
	try {
		decoded_token = verify_jwt_signature(req.query.jwt)
	} catch (err) {
		res.json({err})
		return
	}
	if (decoded_token.role == 'admin' || decoded_token.role == 'patient' || decoded_token.role == 'doctor' || decoded_token.role == 'hospital' || decoded_token.role == 'pharmacy') {
		const query = `SELECT medicines.name AS 'Medicine', medicines.dosage, medicines.price, pharmacy.name AS 'Pharmacy', pharmacy.city, pharmacy.state FROM medicines INNER JOIN pharmacy ON medicines.pharmacy_id = pharmacy.id WHERE medicines.name LIKE ?`

		con.query(query, [value], (err, data) => {
			if (err) throw err
			res.json({data})
		})
	}
})

app.get('/api/searchmedicinebyid', (req, res) => {
	const value = req.query.id
	if (value === undefined || req.query.jwt === undefined) {
		res.json({status: 'missing parameters'})
	}
	let decoded_token
	try {
		decoded_token = verify_jwt_signature(req.query.jwt)
	} catch (err) {
		res.json({err})
		return
	}
	if (decoded_token.role == 'admin' || decoded_token.role == 'patient' || decoded_token.role == 'doctor' || decoded_token.role == 'hospital' || decoded_token.role == 'pharmacy') {
		const query = 'SELECT DISTINCT medicines.id, medicines.name AS "Medicine", medicines.price AS "Price" FROM medicines WHERE medicines.id = ?'
		con.query(query, [value], (err, data) => {
			if (err) throw err
			res.json({data})
		})
	}
})

app.get('/api/updateUserStatus', (req, res) => {
	const id = req.query.id
	const status = req.query.status
	if (id === undefined || status === undefined) {
		res.json({status: 'missing parameters'})
		return
	}
	let decoded_token
	try {
		decoded_token = verify_jwt_signature(req.query.jwt)
	} catch (err) {
		res.json({err})
		return
	}
	if (decoded_token.role === 'admin' && 0 <= status && status <= 3) {
		if (status === 3) {
			deleteUser(id)
			res.send('Deleted user ' + id)
		} else {
			const query = 'UPDATE users SET status = ? WHERE id = ?'
			con.query(query, [status, id], (err, data) => {
				if (err) throw err
				if (status === 1) {
					const walletquery = 'INSERT INTO wallet (userid, balance) VALUES ( ? , 0)'
					con.query(walletquery, [id], (err, data) => {
						if (err) throw err
						res.send('User approved & User Wallet Created')
					})
				} else res.send('Updated status of user ' + id + ' to ' + status)
			})
		}
	} else res.send('Not authorized to update user status.')
})

app.get('/api/searchpatientbyemail', (req, res) => {
	const value = req.query.name
	if (value === undefined) {
		res.json({status: 'missing parameters'})
		return
	}
	let decoded_token
	try {
		decoded_token = verify_jwt_signature(req.query.jwt)
	} catch (err) {
		res.json({err})
		return
	}
	if (decoded_token.role == 'admin' || decoded_token.role == 'doctor' || decoded_token.role == 'hospital') {
		const query = 'SELECT name, email FROM users WHERE email = ? AND status = 1 AND role = "patient"'
		con.query(query, [value], (err, data) => {
			if (err) throw err
			res.json({data})
		})
	}
})

app.post('/api/makeprescription', (req, res) => {
	console.log('API: /api/makeprescription')
	const prescriptionId = req.body.id
	const doctorId = req.body.doctorId
	const date = req.body.date
	const email = req.body.email
	const name = req.body.name
	const prescription = req.body.prescription
	console.log(req.body)
	if (prescriptionId === undefined || doctorId === undefined || date === undefined || email === undefined || name === undefined || prescription === undefined) {
		res.json({err: 'Missing parameters'})
		return
	}
	const q1 = 'SELECT * FROM prescriptions WHERE patient_email = ?'
	const q2 = 'INSERT INTO prescriptions (id, doctor_id, date, patient_email, patient_name, prescription) VALUES (?, ?, ?, ? ,?, ?)'
	con.query(q1, [email], (err, data) => {
		if (err) throw err
		con.query(q2, [prescriptionId, doctorId, date, email, name, prescription], (err) => {
			if (err) throw err
			res.status(200)
			res.json({message: 'Prescription made Successfully!'})
		})
	})
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
		const query = 'SELECT  name, email FROM users WHERE email = ? AND status = 1 AND role = "patient"'
		con.query(query, [value], (err, data) => {
			if (err) throw err
			res.json({data})
		})
	}
})

app.get('/api/viewmywallet', (req, res) => {
	console.log('viewmywallet')
	const value = req.query.id
	if (!validateParameters([value])) {
		res.json({status: 'missing parameters'})
		return
	}
	let decoded_token
	try {
		decoded_token = verify_jwt_signature(req.query.jwt)
	} catch (err) {
		res.json({err})
		return
	}
	if (decoded_token.role == 'doctor' || decoded_token.role == 'patient' || decoded_token.role == 'pharmacy' || decoded_token.role == 'hospital') {
		const query = 'SELECT balance AS "Wallet Balance" FROM wallet WHERE userid = ?'
		con.query(query, [value], (err, data) => {
			if (err) throw err
			res.json({data})
		})
	} else {
		res.json({status: 'not authorized'})
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
		const id = req.query.id
		const query = `SELECT balance FROM wallet WHERE userid = ?`
		con.query(query, [id], (err, data) => {
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
		const id = req.body.id
		const balance = req.body.balance
		const query = `UPDATE wallet SET balance = ? WHERE userid = ?`

		con.query(query, [balance, id], (err) => {
			if (err) throw err
			res.status(200)
			res.json({message: 'Balance Updated Successfully!'})
		})
	}
})

app.get('/api/viewclaims', (req, res) => {
	console.log('API : viewclaims')
	const value = req.query.id
	console.log('valid check')
	if (value === undefined || req.query.jwt === undefined) {
		res.json({status: 'missing parameters'})
	}
	let decoded_token
	try {
		decoded_token = verify_jwt_signature(req.query.jwt)
	} catch (err) {
		res.json({err})
		return
	}
	if (decoded_token.role == 'insurance') {
		const query = 'SELECT * FROM claims WHERE insurance_company_id = ?'
		con.query(query, [value], (err, data) => {
			if (err) throw err
			console.log(data)
			res.json({data})
		})
	}
})

app.get('/api/updateClaimStatus', (req, res) => {
	const id = req.query.id
	const status = req.query.status
	if (id === undefined || status === undefined) {
		res.json({status: 'missing parameters'})
		return
	}
	let decoded_token
	try {
		decoded_token = verify_jwt_signature(req.query.jwt)
	} catch (err) {
		res.json({err})
		return
	}
	if (decoded_token.role === 'insurance' && 0 <= status && status <= 3) {
		if (status === 3) {
			deleteClaim(id)
			res.send('Deleted Claim ' + id)
		} else {
			const query = 'UPDATE claims SET status = ? WHERE id = ?'
			con.query(query, [status, id], (err, data) => {
				if (err) throw err
				res.send('Updated status of Claim ' + id + ' to ' + status)
			})
		}
	} else res.send('Not authorized to update claim status.')
})

app.get('/api/sharing', (req, res) => {
	console.log('API: /api/sharing')
	if (req.query.jwt === undefined) {
		res.json({status: 'missing parameters'})
	}
	let decoded_token
	try {
		decoded_token = verify_jwt_signature(req.query.jwt)
	} catch (err) {
		res.json({err})
		return
	}
	if (roles.includes(decoded_token.role)) {
		con.query(`SELECT * FROM users WHERE status=1 AND role<>"${decoded_token.role}" AND role<>'admin'`, (err, data) => {
			if (err) throw err
			res.json({data})
		})
	}
})

app.get('/api/mydocs', (req, res) => {
	console.log('API: /api/mydocs')
	if (req.query.jwt === undefined) {
		res.json({status: 'missing parameters'})
	}
	let decoded_token
	try {
		decoded_token = verify_jwt_signature(req.query.jwt)
	} catch (err) {
		res.json({err})
		return
	}
	if (roles.includes(decoded_token.role)) {
		con.query(`SELECT documents.id, users.name, users.role, documents.doc_type, documents.path FROM documents INNER JOIN users ON documents.issued_to=users.id WHERE documents.issued_by='${decoded_token.userId}'`, (err, data) => {
			if (err) throw err
			res.json({data})
		})
	}
})

app.get('/api/deleteDoc', (req, res) => {
	console.log('API: /api/deleteDoc')
	if (req.query.jwt === undefined || req.query.doc_id === undefined) {
		res.json({status: 'missing parameters'})
	}
	let decoded_token
	try {
		decoded_token = verify_jwt_signature(req.query.jwt)
	} catch (err) {
		res.json({err})
		return
	}
	if (roles.includes(decoded_token.role) && decoded_token.userId === req.query.issued_by) {
		con.query(`DELETE FROM documents WHERE issued_by="${decoded_token.userId}"`, (err, data) => {
			if (err) throw err
			res.json({message: 'delete successfully'})
		})
	}
})
