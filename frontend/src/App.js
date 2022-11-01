import './App.css'
import {BrowserRouter as Router, Routes, Route, Navigate, Link} from 'react-router-dom'
import Login from './general/Login'
import SignUp from './general/SignUp'
import {createContext, useEffect, useState} from 'react'

function App() {
	const [loggedInUser, setLoggedInUser] = useState({})
	if (!loggedInUser || Object.keys(loggedInUser).length === 0) {
		return (
			<Router>
				<div className="App">
					{/* <nav className="navbar navbar-expand-lg navbar-light fixed-top">
						<div className="container">
							<Link className="navbar-brand" to={'/sign-in'}>
								61x Patient Management
							</Link>
							<div className="collapse navbar-collapse" id="navbarTogglerDemo02">
								<ul className="navbar-nav ml-auto">
									<li className="nav-item">
										<Link className="nav-link" to={'/sign-in'}>
											Login
										</Link>
									</li>
									<li className="nav-item">
										<Link className="nav-link" to={'/sign-up'}>
											Sign up
										</Link>
									</li>
								</ul>
							</div>
						</div>
					</nav> */}
					<div className="auth-wrapper">
						<div className="auth-inner">
							<Routes>
								<Route exact path="/" element={<Navigate replace to="/sign-in" />} />
								<Route path="/sign-in" element={<Login />} />
								<Route path="/sign-up" element={<SignUp />} />
								<Route path="*" element={<Navigate replace to="/" />} />
							</Routes>
						</div>
					</div>
				</div>
			</Router>
		)
	}
	// else {
	// 	return (
	// 		<Router>
	// 			<Routes>
	// 				<Route exact path="/" element={<Login />} />
	// 				<Route path="/sign-in" element={<Login />} />
	// 				<Route path="/sign-up" element={<SignUp />} />
	// 			</Routes>
	// 		</Router>
	// 	)
	// }
}

export default App
