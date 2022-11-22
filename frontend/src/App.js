import './App.css'
import {BrowserRouter as Router, Routes, Route, Link, Navigate} from 'react-router-dom'
import Login from './general/Login'
import SignUp from './general/SignUp'
import Home from './general/Home'
import Search from './pages/Search'
import Meds from './pages/Meds'
import Details from './pages/Details'
import Documents from './pages/Documents'
import Profile from './pages/Profile'
import ProfileMenu from './components/ProfileMenu'
import {useState, createContext} from 'react'
import React, { Component } from 'react'

export const DataContext = createContext()

function App() {
	const [loggedIn, setLoggedIn] = useState(0)
	const [role, setRole] = useState('patient')
	const contextData = {loggedIn, setLoggedIn}

	return (
		<DataContext.Provider value={contextData}>
			<Router>
				<div className="App">
					<nav className="navbar navbar-expand-lg navbar-dark fixed-top">
						<div className="headercontainer">
							<Link className="navbar-brand" to={'/'}>
								61X Patient Management System
							</Link>
							<ul className="navbar-nav">
								{loggedIn ? (
									<ProfileMenu />
								) : (
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
								)}
							</ul>
						</div>
					</nav>

					{loggedIn ? (
						<div className="sidebar">
							<Link className="sidebar-btn" to={'/search'}>
								Search
							</Link>
							<Link className="sidebar-btn" to={'/Meds'}>
								Meds
							</Link>
							{role === 'patient' ? (
								<Link className="sidebar-btn" to={'/Documents'}>
									My Documents
								</Link>
							) : (
								<></>
							)}
						</div>
					) : (
						<></>
					)}

					<div className={loggedIn ? 'auth-wrapper-loggedin' : 'auth-wrapper-loggedout'}>
						<div className="auth-inner">
							<Routes>
								{loggedIn ? (
									<>
										<Route exact path="/" element={<Home />} />
										<Route path="/search" element={<Search />} />
										<Route path="/Meds" element={<Meds />} />
										<Route path="/Documents" element={<Documents />} />
										<Route path="/details" element={<Details role={role} />} />
										<Route path="/profile" element={<Profile />} />
										<Route path="*" element={<Navigate replace to="/" />} />
									</>
								) : (
									<>
										<Route exact path="/" element={<Login />} />
										<Route path="/" element={<Login />} />
										<Route path="/sign-up" element={<SignUp />} />
										<Route path="*" element={<Navigate replace to="/" />} />
									</>
								)}
							</Routes>
						</div>
					</div>
				</div>
			</Router>
		</DataContext.Provider>
	)
}

export default App
