import {useEffect, useState, useContext} from 'react'
import './pages.css'
import {Link} from 'react-router-dom'
import '../components/components.css'
import React, {Component} from 'react'
import {DataContext} from '../App'
import SearchCards from '../components/SearchCards'

function Admin() {
	const {loginData, setLoginData} = useContext(DataContext)
	const [unverifiedUsers, setUnverifiedUsers] = useState([])
	useEffect(() => {
		getUnverifiedUsers()
	}, [])

	function getUnverifiedUsers() {
		fetch(`https://192.168.2.235/api/unverifiedusers?jwt=${loginData.data.token}`).then((res) => {
			res.json().then((data) => {
				if (data.hasOwnProperty('err') || data.data.length === 0) {
					console.log('No unverified users present !!')
				} else {
					console.log(data.data)
					// setUnverifiedUsers(1)
					// let l = []
					// data.data.forEach((element) => {
					// 	let link = '/details?type=user&id=' + element.id
					// 	l.push(
					// 		<Link className="cardlink" to={link} id={element.id}>
					// 			<div className="card">{element.name}</div>
					// 		</Link>
					// 	)
					// })
					setUnverifiedUsers(data.data)
					// console.log(l)
				}
			})
		})
	}
	function approveUser(e) {
		e.preventDefault()
		let userID = e.target.id
		console.log(userID)
		fetch(`https://192.168.2.235/api/approveuser?id=${userID}&jwt=${loginData.data.token}`).then((res) => {
			getUnverifiedUsers()
		})
		fetch(`https://192.168.2.235/api/test`).then((res) => {})
	}
	return (
		<>
			<h3 style={{color: 'var(--dark-green)'}}>View all the Unverified Users Here</h3>
			<br></br>
			<br></br>
			<br></br>
			<div className={`${unverifiedUsers.length > 0 ? 'col-6 p-0 ml-5' : ''} `}>
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
								<tr className="text-center my-2 py-2" key={user.id}>
									<td className="pl-0">{user.email}</td>
									<td className="pl-0">{user.role}</td>
									<td className="pl-0">{user.city}</td>
									<td className="pl-0">{user.state}</td>
									<td className="pl-0">{user.phone}</td>
									<button className="btn btn-primary" onClick={approveUser} id={user.id}>
										Approve
									</button>
								</tr>
							))}
						</tbody>
					</table>
				) : (
					<center>
						<div className="bg-danger rounded p-2 d-flex justify-content-center align-items-center">
							<h5>No slots added/All added slots have been booked</h5>
						</div>
					</center>
				)}
			</div>
		</>
	)
}
export default Admin
