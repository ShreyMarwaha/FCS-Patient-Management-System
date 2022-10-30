import './App.css'
import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom'
import Login from './general/Login'
import SignUp from './general/SignUp'
import Search from './pages/Search'

function App() {
	return (
		<Router>
			<div className="App">
				<nav className="navbar navbar-expand-lg navbar-dark fixed-top">
					<div className="headercontainer">
						<Link className="navbar-brand" to={'/sign-in'}>
							61X Patient Management System
						</Link>
						<ul className="navbar-nav">
							<li className="nav-item">
								<Link className="nav-link" to={'/sign-in'}>
									Login
								</Link>
							</li>
							<li className="nav-item">
								<Link className="nav-link" to={'/sign-up'}>
									Sign Up
								</Link>
							</li>
						</ul>
					</div>
				</nav>
				<div className="auth-wrapper">
					<div className="auth-inner">
						<Routes>
							<Route exact path="/" element={<Login />} />
							<Route path="/sign-in" element={<Login />} />
							<Route path="/sign-up" element={<SignUp />} />
							<Route path="/search" element={<Search />} />
						</Routes>
					</div>
				</div>
			</div>
		</Router>
	)
}

export default App
