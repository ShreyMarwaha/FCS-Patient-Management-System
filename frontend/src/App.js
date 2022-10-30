import './App.css'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Login from './general/Login'
import SignUp from './general/SignUp'
import Home from './general/Home'
import Search from './pages/Search'
import { useState } from 'react'
import { UserCircle } from 'tabler-icons-react'

function App() {

	const [loggedIn, setLoggedIn] = useState(1)

	return (
		<Router>
			<div className="App">

				<nav className="navbar navbar-expand-lg navbar-dark fixed-top">
					<div className="headercontainer">
						<Link className="navbar-brand" to={'/'}>
							61X Patient Management System
						</Link>
						<ul className="navbar-nav">
							{loggedIn? 
								<li className="nav-item" style={{borderRadius: 100}}>
									<center>
										<UserCircle color='white' size={40}/>
									</center>
								</li>
							:
							<>
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
							</>
							}
						</ul>
					</div>
				</nav>
				
				{loggedIn?
					<div className='sidebar'>
						<Link className='sidebar-btn' to={'/search'}>
							Search
						</Link>
					</div>
				:
					<></>
				}

				<div className={loggedIn?"auth-wrapper-loggedin":"auth-wrapper-loggedout"}>
					<div className="auth-inner">
						<Routes>
							{loggedIn?
								<>
									<Route exact path="/" element={<Home />} />
									<Route path="/search" element={<Search />} />
								</>
								:
								<>
									<Route exact path="/" element={<Login />} />
									<Route path="/sign-in" element={<Login />} />
									<Route path="/sign-up" element={<SignUp />} />
								</>
							}
						</Routes>
					</div>
				</div>

			</div>
		</Router>
	)
}

export default App