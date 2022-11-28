import React, {useContext, useState} from 'react'
import './general.css'
import {v4 as uuidv4} from 'uuid'
import Form from 'react-bootstrap/Form'
import {Button} from 'react-bootstrap'
import {DataContext} from '../App'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'

function SignUp() {
	const {loggedIn, setLoggedIn} = useContext(DataContext)
	const navigate = useNavigate()
	const [file, setFile] = useState(undefined) // storing the uploaded file
	// storing the recived file from backend
	const [progress, setProgess] = useState(0) // progess bar
	const handleFileChange = (e) => {
		const file = e.target.files[0] // accessing file
		console.log(file)
		setProgess(0)
		setFile(file) // storing file
	}

	function getExtension(filename) {
		return filename.split('.').pop()
	}
	function handleSubmit(event) {
		event.preventDefault()

		const data = {}
		data.name = event.target.form_name.value
		data.email = event.target.form_email.value
		data.registration_type = event.target.form_registration_type.value
		data.password = event.target.form_password.value

		if (!ValidateEmail(event.target.form_email.value) || !ValidateName(event.target.form_name.value) || CheckPasswordStrength(data.password) !== 'strong') {
			return
		}
		if (file === undefined) {
			alert('Please upload a pdf file')
			return
		}
		if (getExtension(file.name) !== 'pdf' && getExtension(file.name) !== 'jpg' && getExtension(file.name) !== 'jpeg') {
			alert('Only pdf/jpg/jpeg files are allowed')
			return
		}

		data.uuid = uuidv4()
		fetch('https://192.168.2.235/api/signup', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		})
			.then((response) => response.json())
			.then((response_data) => {
				if (response_data.hasOwnProperty('message') && response_data.message === 'user already exists') {
					if (window.confirm('Email already registered. Do you want to login?')) {
						navigate('/login')
					}
				} else if (response_data.hasOwnProperty('message') && response_data.message === 'successfully registered') {
					const formData = new FormData()
					formData.append('doc_type', 'identity') // appending file
					formData.append('uuid', data.uuid)
					formData.append('file', file) // appending file
					axios
						.post('https://192.168.2.235/api/upload_identity', formData, {
							onUploadProgress: (ProgressEvent) => {
								let progress = Math.round((ProgressEvent.loaded / ProgressEvent.total) * 100)
								setProgess(progress)
							},
						})
						.then((res) => {
							alert('Successfully registered. Please login to continue.')
						})
						.catch((err) => {
							console.log(err)
							alert('Error uploading identity document. Please contact support.')
						})
				} else alert('Registration failed')
			})
			.catch((error) => {
				console.error('Error:', error)
			})
	}

	function ValidateEmail(input) {
		const validRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

		if (input.match(validRegex)) {
			return true
		} else {
			alert('Invalid email address!')
			return false
		}
	}
	function ValidateName(name) {
		const regName = /^[a-zA-Z]+ [a-zA-Z]+$/
		if (!regName.test(name)) {
			alert('Invalid name given.')
			return false
		} else {
			return true
		}
	}
	function CheckPasswordStrength(password) {
		const strongPassword = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})')
		const mediumPassword = new RegExp('((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,}))|((?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.{8,}))')
		const passwordStrength = document.getElementById('password-strength')
		if (strongPassword.test(password)) {
			passwordStrength.textContent = 'Password strength: Strong'
			passwordStrength.style.color = 'green'
			return 'strong'
		} else if (mediumPassword.test(password)) {
			passwordStrength.textContent = 'Password strength: Medium'
			passwordStrength.style.color = 'yellow'
			return 'medium'
		} else {
			passwordStrength.textContent = 'Password strength: Weak'
			passwordStrength.style.color = 'red'
			return 'weak'
		}
	}
	return (
		<Form onSubmit={handleSubmit} style={{marginTop: '300px'}}>
			<center className="form">
				<div>
					<h3 style={{color: 'var(--dark-green)'}}>Sign Up</h3>

					<Form.Group className="mb-3" controlId="form_name" style={{paddingTop: 50}}>
						<Form.Control type="fullname" placeholder="Enter Full Name" />
					</Form.Group>

					<Form.Group className="mb-3" controlId="form_email">
						<Form.Control type="email" placeholder="Enter email" />
					</Form.Group>

					<Form.Group className="mb-4" controlId="form_password">
						<Form.Control type="password" placeholder="Password" className="border border-success" />
						<p id="password-strength"></p>
						<div className="rounded shadow p-3 text-left font-weight-light" style={{width: '450px'}}>
							<h5>Password must met following conditions:</h5>
							<p>Contain at least 8 characters</p>
							<p>Contain at least one uppercase letter</p>
							<p>Contain at least one lowercase letter</p>
							<p>Contain at least one number</p>
							<p>Contain at least one special character</p>
						</div>
					</Form.Group>

					<Form.Group className="my-4" controlId="form_registration_type">
						<Form.Label>Register as...</Form.Label>
						<Form.Select className="form-control" defaultValue="patient">
							<option value="patient">Patient</option>
							<option value="doctor">Doctor</option>
							<option value="hospital">Hospital</option>
							<option value="hospital">Pharmacy</option>
						</Form.Select>
					</Form.Group>
					<Form.Group controlId="form_identity_proof" className="my-4">
						<Form.Label>
							Please upload a proof of identity <br />
							(Format: <b>pdf/jpg/jpeg</b>, Max Size: <b>1MB</b>)
						</Form.Label>
						<Form.Control type="file" onChange={handleFileChange} />
					</Form.Group>
				</div>
				<div>
					<Button variant="primary" type="submit" style={{width: 100, backgroundColor: 'var(--dark-green)', border: 0}} className="my-4">
						Submit
					</Button>
					<p>
						Already registered? <a href="/">Login</a>
					</p>
				</div>
			</center>
		</Form>
	)
}

export default SignUp
