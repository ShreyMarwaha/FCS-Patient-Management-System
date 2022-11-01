import React from 'react'
import Form from 'react-bootstrap/Form'
import {Button} from 'react-bootstrap'

function Login() {
	function handleSubmit(event) {
		//password
		event.preventDefault()

		const data = {}
		data.email = event.target.form_email.value
		data.password = event.target.form_password.value
		console.log('Data: ', data)
		fetch('https://192.168.2.235/api/authenticate', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		}).then((res) => {
			console.log(res)
		})
	}
	return (
		<Form onSubmit={handleSubmit} className="m-5">
			<Form.Group className="mb-3" controlId="form_email">
				<Form.Label>Email address</Form.Label>
				<Form.Control type="email" placeholder="Enter email" />
			</Form.Group>

			<Form.Group className="mb-3" controlId="form_password">
				<Form.Label>Password</Form.Label>
				<Form.Control type="password" placeholder="Password" />
			</Form.Group>
			<Button variant="primary" type="submit">
				Submit
			</Button>
		</Form>
	)
}

export default Login
