import React, {useContext, useState} from 'react'
import Form from 'react-bootstrap/Form'
import {Button} from 'react-bootstrap'
import './general.css'
import {DataContext} from '../App'
import {MuiOtpInput} from 'mui-one-time-password-input'

function Login() {
	const {loginData, setLoginData} = useContext(DataContext)

	const [otp, setOtp] = useState('')
	const handleOtpChange = (newValue) => {
		setOtp(newValue)
	}
	const [authenticateToLogin, setAuthenticateToLogin] = useState(false)

	const [error, setError] = React.useState({isError: false, message: ''})
	function ValidateEmail(input) {
		const validRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

		if (input.match(validRegex)) {
			return true
		} else {
			alert('Invalid email address!')
			return false
		}
	}
	function handleSubmit(event) {
		event.preventDefault()
		const data = {}
		data.email = document.getElementById('email').value
		data.password = document.getElementById('password').value
		data.otp = otp

		if (!ValidateEmail(data.email)) {
			return
		}

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
				} else setError({isError: true, message: data.error})
			})
			.catch((error) => {
				console.error('Error:', error)
			})
	}

	function getAuthenticatedToLogin() {
		const data = {}
		data.email = document.getElementById('email').value
		data.password = document.getElementById('password').value
		if (!ValidateEmail(data.email)) {
			return
		}

		fetch('https://192.168.2.235/api/authToLogin', {
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
						setAuthenticateToLogin(true)
						setError({isError: false, message: ''})
					} else if (data.status === 0) setError({isError: true, message: 'User not verified. Please wait for the admin to verify your account.'})
					else if (data.status === 2) setError({isError: true, message: 'User blocked. Please contact the admin.'})
				} else setError({isError: true, message: 'Incorrect email or password'})
			})
			.catch((error) => {
				console.error('Error:', error)
			})
	}

	function handleBack() {
		setAuthenticateToLogin(false)
		setError({isError: false, message: ''})
	}
	return (
		<Form onSubmit={handleSubmit}>
			<center className="form">
				<div>
					<h3 style={{color: 'var(--dark-green)'}} className="pb-5">
						Login
					</h3>
					{authenticateToLogin ? (
						<p className="text-info">
							✓ OTP sent to <b>{document.getElementById('email').value}</b>
						</p>
					) : null}
					<Form.Group className="mb-3">
						<Form.Control
							id="email"
							type="email"
							placeholder="Enter email"
							disabled={authenticateToLogin}
							onClick={() => {
								setError({isError: false, message: ''})
							}}
						/>
					</Form.Group>

					<Form.Group className="mb-3">
						<Form.Control
							id="password"
							type="password"
							placeholder="Password"
							disabled={authenticateToLogin}
							onClick={() => {
								setError({isError: false, message: ''})
							}}
						/>
					</Form.Group>
					{authenticateToLogin ? (
						<>
							<Form.Group className="mb-3">
								<div style={{width: '475px'}}>
									<MuiOtpInput length={8} value={otp} onChange={handleOtpChange} TextFieldsProps={{size: 'small', placeholder: '-'}} />
								</div>
							</Form.Group>

							<div className="w-50">
								<Button onClick={handleBack} className="m-3 btn btn-danger">
									🠐 Back
								</Button>

								<Button disabled={otp.length === 8 ? false : true} variant="primary" type="submit" style={{backgroundColor: 'var(--dark-green)'}} className="m-3 btn btn-primary w-50">
									Submit
								</Button>
							</div>
						</>
					) : (
						<div>
							<Button onClick={getAuthenticatedToLogin} disabled={error.isError ? true : false} className="btn w-25" style={{backgroundColor: 'var(--dark-green)'}}>
								Next 🠒
							</Button>
						</div>
					)}
					{error.isError ? <p className="text-danger">{error.message}</p> : <></>}
				</div>
			</center>
		</Form>
	)
}
export default Login
