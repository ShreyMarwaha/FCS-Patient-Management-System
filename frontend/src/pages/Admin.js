import {useEffect, useState, useContext} from 'react'
import './pages.css'
import {Link} from 'react-router-dom'
import '../components/components.css'
import React, {Component} from 'react'
import {DataContext} from '../App'

function Admin() {
	const {loginData, setLoginData} = useContext(DataContext)
	const [unverifiedUsers, setUnverifiedUsers] = useState([])
	const [blockedUsers, setBlockedUsers] = useState([])
	const [verifiedUsers, setVerifiedUsers] = useState([])
	useEffect(() => {
		getUsers()
	}, [])

	function getUsers() {
		fetch(`https://192.168.2.235/api/users?jwt=${loginData.data.token}`).then((res) => {
			res.json().then((data) => {
				if (data.hasOwnProperty('err') || data.data.length === 0) {
					console.log('No users present !!')
				} else {
					setUnverifiedUsers(data.data.filter((user) => user.status === 0))
					setVerifiedUsers(data.data.filter((user) => user.status === 1))
					setBlockedUsers(data.data.filter((user) => user.status === 2))
				}
			})
		})
	}

	function updateUserStatus(e) {
		e.preventDefault()
		const userID = e.target.id
		const status = e.target.value

		if (window.confirm('Are you sure you want to update the user status?')) {
			fetch(`https://192.168.2.235/api/updateUserStatus?status=${status}&id=${userID}&jwt=${loginData.data.token}`).then((res) => {})
			getUsers()
		}
	}

	return (
		<>
			<h3 style={{color: 'var(--dark-green)'}}>User Management</h3>
			<br></br>
			<br></br>
			<br></br>
			<h1>Unverified Users</h1>
			<div className={`${unverifiedUsers.length > 0 ? 'col-10 p-0 ml-5 text-left' : ''} `}>
				{unverifiedUsers.length > 0 ? (
					<table className="table table-borderless ml-3" style={{minWidth: '130%'}}>
						<thead>
							<tr className="text-center">
								<th className="text-secondary" scope="col">
									Email
								</th>
								<th className="text-secondary pl-0" scope="col">
									Role
								</th>
								<th className="text-secondary" scope="col">
									City
								</th>
								<th className="text-secondary" scope="col">
									State
								</th>
								<th className="text-secondary" scope="col">
									Phone
								</th>
								<th className="text-secondary" scope="col">
									Approve
								</th>
							</tr>
						</thead>

						<tbody>
							{unverifiedUsers.map((user) => (
								<tr className="my-2 py-2" key={user.id}>
									<td className="pl-0 ">{user.email}</td>
									<td className="pl-0">{user.role}</td>
									<td className="pl-0">{user.city}</td>
									<td className="pl-0">{user.state}</td>
									<td className="pl-0">{user.phone}</td>
									<div>
										<button className="btn btn-primary mx-2" onClick={updateUserStatus} id={user.id} value="1">
											Approve
										</button>
										<button className="btn btn-outline-danger mx-2" onClick={updateUserStatus} id={user.id} value="2">
											Block
										</button>
										<button className="btn btn-outline-dark mx-2" onClick={updateUserStatus} id={user.id} value="3">
											Delete
										</button>
									</div>
								</tr>
							))}
						</tbody>
					</table>
				) : (
					<center>
						<div className="bg-danger rounded p-2 d-flex justify-content-center align-items-center">
							<h5>No unverified Users</h5>
						</div>
					</center>
				)}
			</div>

			<hr className="my-5" />

			<h1 className="text-danger">Blocked Users</h1>
			<div className={`${blockedUsers.length > 0 ? 'col-10 p-0 ml-5' : ''} `}>
				{blockedUsers.length > 0 ? (
					<table className="table table-borderless ml-3" style={{minWidth: '130%'}}>
						<thead>
							<tr className="text-center">
								<th className="text-secondary" scope="col">
									Email
								</th>
								<th className="text-secondary pl-0" scope="col">
									Role
								</th>
								<th className="text-secondary" scope="col">
									City
								</th>
								<th className="text-secondary" scope="col">
									State
								</th>
								<th className="text-secondary" scope="col">
									Phone
								</th>
								<th className="text-secondary" scope="col">
									Approve
								</th>
							</tr>
						</thead>

						<tbody>
							{blockedUsers.map((user) => (
								<tr className="text-center my-2 py-2" key={user.id}>
									<td className="pl-0">{user.email}</td>
									<td className="pl-0">{user.role}</td>
									<td className="pl-0">{user.city}</td>
									<td className="pl-0">{user.state}</td>
									<td className="pl-0">{user.phone}</td>
									<div>
										<button className="btn btn-primary mx-2" onClick={updateUserStatus} id={user.id} value="1">
											Approve
										</button>
									</div>
								</tr>
							))}
						</tbody>
					</table>
				) : (
					<center>
						<div className="bg-danger rounded p-2 d-flex justify-content-center align-items-center">
							<h5>No Blocked Users Found</h5>
						</div>
					</center>
				)}
			</div>

			<hr className="my-5" />

			<h1 className="text-success">Verified Users</h1>
			<div className={`${verifiedUsers.length > 0 ? 'col-10 p-0 ml-5' : ''} `}>
				{verifiedUsers.length > 0 ? (
					<table className="table table-borderless ml-3" style={{minWidth: '130%'}}>
						<thead>
							<tr className="text-center">
								<th className="text-secondary" scope="col">
									Email
								</th>
								<th className="text-secondary pl-0" scope="col">
									Role
								</th>
								<th className="text-secondary" scope="col">
									City
								</th>
								<th className="text-secondary" scope="col">
									State
								</th>
								<th className="text-secondary" scope="col">
									Phone
								</th>
								<th className="text-secondary" scope="col">
									Approve
								</th>
							</tr>
						</thead>

						<tbody>
							{verifiedUsers.map((user) => (
								<tr className="text-center my-2 py-2" key={user.id}>
									<td className="pl-0">{user.email}</td>
									<td className="pl-0">{user.role}</td>
									<td className="pl-0">{user.city}</td>
									<td className="pl-0">{user.state}</td>
									<td className="pl-0">{user.phone}</td>
									<div>
										<button className="btn btn-outline-secondary mx-2" onClick={updateUserStatus} id={user.id} value="0">
											Unverify
										</button>
										<button className="btn btn-danger mx-2" onClick={updateUserStatus} id={user.id} value="2">
											Block
										</button>
									</div>
								</tr>
							))}
						</tbody>
					</table>
				) : (
					<center>
						<div className="bg-danger rounded p-2 d-flex justify-content-center align-items-center">
							<h5>No Verified Users Found</h5>
						</div>
					</center>
				)}
			</div>
		</>
	)
}
export default Admin
