import React from 'react'
import { Link } from 'react-router-dom'
import './style.css'

function Login() {
	return (
		<form>
			<center className='form'>
			<div>
				<h3>Login</h3>
				<div style={{paddingTop: 100}}>
					<input type="email" className="form-control" placeholder="Enter email" />
				</div>
				<div style={{paddingTop: 20}}>
					<input type="password" className="form-control" placeholder="Enter password" />
				</div>
			</div>
			<div>
				<Link className="nav-link" to={'/search'}>
					<button type="submit" className="btn btn-primary" style={{marginBottom: 20, width: 100}}>
						Submit
					</button>
				</Link>
				<a href="#">Forgot password?</a>
			</div>
			</center>
		</form>
	)
}

export default Login