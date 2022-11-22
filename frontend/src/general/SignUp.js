import React, {useContext} from 'react'
import './general.css'
import {v4 as uuidv4} from 'uuid'
import Form from 'react-bootstrap/Form'
import {Button} from 'react-bootstrap'
import {DataContext} from '../App'
import {useNavigate} from 'react-router-dom'

function SignUp() {
	const {loggedIn, setLoggedIn} = useContext(DataContext)
	const navigate = useNavigate()

	function handleSubmit(event) {
		event.preventDefault()
		const data = {}
		data.name = event.target.form_name.value
		data.email = event.target.form_email.value
		data.registration_type = event.target.form_registration_type.value
		data.password = event.target.form_password.value
		data.uuid = uuidv4()

		fetch('https://192.168.2.235/api/signup', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.message && data.message === 'User already exists') {
					alert('Email already registered')
				} else navigate('/')
			})
			.catch((error) => {
				console.error('Error:', error)
			})
	}

	return (
		<Form onSubmit={handleSubmit} className="m-5">
			<center className="form">
				<div>
					<h3 style={{color: 'var(--dark-green)'}}>Sign Up</h3>

					<Form.Group className="mb-3" controlId="form_name" style={{paddingTop: 50}}>
						<Form.Control type="fullname" placeholder="Enter Full Name" />
					</Form.Group>

					<Form.Group className="mb-3" controlId="form_email">
						<Form.Control type="email" placeholder="Enter email" />
					</Form.Group>

					<Form.Group className="mb-3" controlId="form_password">
						<Form.Control type="password" placeholder="Password" />
					</Form.Group>

					<Form.Group className="mb-3" controlId="form_registration_type">
						<Form.Label>Register as...</Form.Label>
						<Form.Select className="form-control">
							<option value="patient">Patient</option>
							<option value="doctor">Doctor</option>
							<option value="hospital">Hospital</option>
						</Form.Select>
					</Form.Group>
				</div>
				<div>
					<Button variant="primary" type="submit" style={{marginBottom: 20, width: 100, backgroundColor: 'var(--dark-green)', border: 0}}>
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
