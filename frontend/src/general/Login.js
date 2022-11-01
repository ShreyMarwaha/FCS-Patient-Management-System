import React, {useContext} from 'react'
import Form from 'react-bootstrap/Form'
import {Button} from 'react-bootstrap'
import './general.css'
import {DataContext} from '../App'

function Login() {

	const {loggedIn, setLoggedIn} = useContext(DataContext)
	const [error, setError] = React.useState(false)

	function handleSubmit(event) {
		event.preventDefault()

		const data = {}
		data.email = event.target.form_email.value
		data.password = event.target.form_password.value

		fetch('https://192.168.2.235/api/authenticate', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.status === 'success') {
					setLoggedIn(1)
					setError(false)

					
				} else setError(true)
			})
			.catch((error) => {
				console.error('Error:', error)
			})
	}

	return (
		<Form onSubmit={handleSubmit}>
			<center className="form">
				<div>
					<h3 style={{color: 'var(--dark-green)'}}>Login</h3>
					<Form.Group className="mb-3" controlId="form_email" style={{paddingTop: 100}}>
						<Form.Control type="email" placeholder="Enter email"/>
					</Form.Group>

					<Form.Group className="mb-3" controlId="form_password">
						<Form.Control type="password" placeholder="Password"/>
					</Form.Group>
				</div>
				<div>
					<Button variant="primary" type="submit" style={{marginBottom: 20, width: 100, backgroundColor: 'var(--dark-green)', border: 0}}>
						Submit
					</Button>
					{error ? <p className="text-danger">Wrong Email or Password</p> : <></>}
					<br></br>
					<a href="#">Forgot password?</a>
				</div>
			</center>
		</Form>
	)
}

export default Login