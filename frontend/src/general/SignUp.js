import React, {Component} from 'react'
import Login from './Login'
import Form from 'react-bootstrap/Form'
import {Button} from 'react-bootstrap'
import {v4 as uuidv4} from 'uuid'
import bcrypt from 'bcryptjs'
function SignUp() {
	function handleSubmit(event) {
		event.preventDefault()

		const data = {}
		data.name = event.target.form_name.value
		data.email = event.target.form_email.value
		data.registration_type = event.target.form_registration_type.value
		data.password = event.target.form_password.value
		console.log('Data: ', data)
		data.uuid = uuidv4()
		// const salt = bcrypt.genSaltSync(10)
		// const password = bcrypt.hashSync(data.password, salt)
		// console.log('salt', salt)
		// console.log('Password: ', password)
		// return
		fetch('https://192.168.2.235/api/signup', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		})
	}
	return (
		<Form onSubmit={handleSubmit} className="m-5">
			<h1 className="my-5">SIGN UP</h1>

			<Form.Group className="mb-3" controlId="form_name">
				<Form.Label>Full Name</Form.Label>
				<Form.Control type="fullname" placeholder="Enter Full Name" />
			</Form.Group>

			<Form.Group className="mb-3" controlId="form_email">
				<Form.Label>Email address</Form.Label>
				<Form.Control type="email" placeholder="Enter email" />
			</Form.Group>

			<Form.Group className="mb-3" controlId="form_password">
				<Form.Label>Password</Form.Label>
				<Form.Control type="password" placeholder="Password" />
			</Form.Group>

			<Form.Group className="mb-3" controlId="form_registration_type">
				<Form.Label>Register as...</Form.Label>
				<Form.Select>
					<option value="patient">Patient</option>
					<option value="doctor">Doctor</option>
					<option value="hospital">Hospital</option>
				</Form.Select>
			</Form.Group>

			<Button variant="primary" type="submit" className="my-5">
				Submit
			</Button>
		</Form>
	)
}

export default SignUp
