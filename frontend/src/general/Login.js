import React, {useContext} from 'react'
import Form from 'react-bootstrap/Form'
import {Button} from 'react-bootstrap'
import './general.css'
import {DataContext} from '../App'

function Login() {
	const {loginData, setLoginData} = useContext(DataContext)

	const [error, setError] = React.useState({isError: false, message: ''})
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
				if (data.authentication === 'success') {
					if (data.status === 1) {
						setLoginData({isLoggedIn: true, data: data.data})
						setError({isError: false, message: ''})
					} else if (data.status === 0) {
						console.log('User not verified')
						setError({isError: true, message: 'User not verified. Please wait for the admin to verify your account.'})
					} else if (data.status === 2) {
						console.log('User blocked')
						setError({isError: true, message: 'User blocked. Please contact the admin.'})
					}
				} else setError({isError: true, message: 'Incorrect email or password'})
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
						<Form.Control
							type="email"
							placeholder="Enter email"
							onClick={() => {
								setError({isError: false, message: ''})
							}}
						/>
					</Form.Group>

					<Form.Group className="mb-3" controlId="form_password">
						<Form.Control
							type="password"
							placeholder="Password"
							onClick={() => {
								setError({isError: false, message: ''})
							}}
						/>
					</Form.Group>
				</div>
				<div>
					<Button variant="primary" type="submit" style={{marginBottom: 20, width: 100, backgroundColor: 'var(--dark-green)', border: 0}}>
						Submit
					</Button>
					{error.isError ? <p className="text-danger">{error.message}</p> : <></>}
					<br></br>
					<a href="#">Forgot password?</a>
				</div>
			</center>
		</Form>
	)
}
export default Login