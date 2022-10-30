import React from 'react'
import './style.css'

function SignUp() {
	return (
		<form>
			<center className='form'>
			<div>
				<h3>Sign Up</h3>
				<div style={{paddingTop: 100}} className="mb-3">
					<input type="text" className="form-control" placeholder="First name" />
				</div>
				<div className="mb-3">
					<input type="text" className="form-control" placeholder="Last name" />
				</div>
				<div className="mb-3">
					<input type="email" className="form-control" placeholder="Enter email" />
				</div>
				<div className="mb-3">
					<input type="password" className="form-control" placeholder="Enter password" />
				</div>
			</div>
			<div>
				<button type="submit" className="btn btn-primary" style={{marginBottom: 20, width: 100}}>
					Sign Up
				</button>
				<p>
					Already registered? <a href="/sign-in">Login</a>
				</p>
			</div>
			</center>
		</form>
	)
}

export default SignUp