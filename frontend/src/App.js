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
import Admin from './pages/Admin'
import Patient from './pages/Patient'
import Prescription from './pages/Prescription'

export const DataContext = createContext()

function App() {
	const [loginData, setLoginData] = useState({isLoggedIn: false, data: {}})
	const contextData = {loginData, setLoginData}

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
								{loginData.isLoggedIn ? (
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

					{loginData.isLoggedIn ? (
						loginData.data.role === 'admin' ? (
							<div className="sidebar">
								<Link className="sidebar-btn" to={'/Admin'}>
									User Management
								</Link>
							</div>
						) : loginData.data.role === 'doctor' ? (
							<div className="sidebar">
								<Link className="sidebar-btn" to={'/Patient'}>
									View Patients
								</Link>

								<Link className="sidebar-btn" to={'/Prescription'}>
									Make Prescription
								</Link>
							</div>
						) : (
							<div className="sidebar">
								<Link className="sidebar-btn" to={'/search'}>
									Search
								</Link>
								<Link className="sidebar-btn" to={'/Meds'}>
									Buy Medicines
								</Link>
								{loginData.data.role === 'patient' ? (
									<Link className="sidebar-btn" to={'/Documents'}>
										My Documents
									</Link>
								) : (
									<></>
								)}
							</div>
						)
					) : (
						<></>
					)}

					<div className={loginData.isLoggedIn ? 'auth-wrapper-loggedin' : 'auth-wrapper-loggedout'}>
						<div className="auth-inner">
							<Routes>
								{loginData.isLoggedIn ? (
									<>
										<Route exact path="/" element={<Home />} />
										<Route path="/search" element={<Search />} />
										<Route path="/Meds" element={<Meds />} />
										<Route path="/Documents" element={<Documents />} />
										<Route path="/Admin" element={<Admin />} />
										<Route path="/details" element={<Details role={loginData.data.role} />} />
										<Route path="/profile" element={<Profile />} />
										<Route path="*" element={<Navigate replace to="/" />} />
										<Route path="/Patient" element={<Patient />} />
										<Route path="/Prescription" element={<Prescription />} />
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
