import {useEffect, useState, useContext} from 'react'
import './pages.css'
import {Link} from 'react-router-dom'
import '../components/components.css'
import React, {Component} from 'react'
import {DataContext} from '../App'

function Insurance() {
	const {loginData, setLoginData} = useContext(DataContext)
	const [unverifiedUsers, setUnverifiedUsers] = useState([])      // Unsettled claims
	const [blockedUsers, setBlockedUsers] = useState([])            // Rejected claims
	const [verifiedUsers, setVerifiedUsers] = useState([])          // Settled claims

	useEffect(() => {
		getUsers()
	}, [])

	function getUsers() {
        const id = loginData.data.id
		fetch(`https://192.168.2.235/api/viewclaims?id="${id}"&jwt=${loginData.data.token}`).then((res) => {
			res.json().then((data) => {
				if (data.hasOwnProperty('err') || data.data.length === 0) {
					console.log('No Claims present !!')
				} else {
					setUnverifiedUsers(data.data.filter((user) => user.status === 0))
					setVerifiedUsers(data.data.filter((user) => user.status === 1))
					setBlockedUsers(data.data.filter((user) => user.status === 2))
				}
			})
		})
	}

	function updateClaimStatus(e) {
		e.preventDefault()
		const userID = e.target.id
		const status = e.target.value

		if (window.confirm('Are you sure you want to update the claim status?')) {
			fetch(`https://192.168.2.235/api/updateClaimStatus?status=${status}&id=${userID}&jwt=${loginData.data.token}`).then((res) => {})
			getUsers()
		}
	}

	return (
		<>
			<h3 style={{color: 'var(--dark-green)'}}>Claims Management</h3>
			<br></br>
			<br></br>
			<br></br>
			<h1>Unsettled Claims</h1>
			<div className={`${unverifiedUsers.length > 0 ? 'col-10 p-0 ml-5 text-left' : ''} `}>
				{unverifiedUsers.length > 0 ? (
					<table className="table table-borderless ml-3" style={{minWidth: '130%'}}>
						<thead>
							<tr className="text-center">
								<th className="text-secondary" scope="col">
									Claim Id
								</th>
								<th className="text-secondary pl-0" scope="col">
									Claim Amount
								</th>
								<th className="text-secondary" scope="col">
									Settle Claim
								</th>
							</tr>
						</thead>

						<tbody>
							{unverifiedUsers.map((user) => (
								<tr className="my-2 py-2" key={user.id}>
									<td className="pl-0 ">{user.id}</td>
									<td className="pl-0">{user.amount}</td>
									<div>
										<button className="btn btn-primary mx-2" onClick={updateClaimStatus} id={user.id} value="1">
											Settle Claim
										</button>
										<button className="btn btn-outline-danger mx-2" onClick={updateClaimStatus} id={user.id} value="2">
											Reject Claim
										</button>
										<button className="btn btn-outline-dark mx-2" onClick={updateClaimStatus} id={user.id} value="3">
											Delete Delete
										</button>
									</div>
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

			<hr className="my-5" />

			<h1 className="text-danger">Rejected Claims</h1>
			<div className={`${blockedUsers.length > 0 ? 'col-10 p-0 ml-5' : ''} `}>
				{blockedUsers.length > 0 ? (
					<table className="table table-borderless ml-3" style={{minWidth: '130%'}}>
						<thead>
							<tr className="text-center">
								<th className="text-secondary" scope="col">
									Claim Id
								</th>
								<th className="text-secondary pl-0" scope="col">
									Claim Amount
								</th>
								<th className="text-secondary" scope="col">
									Approve
								</th>
							</tr>
						</thead>

						<tbody>
							{blockedUsers.map((user) => (
								<tr className="text-center my-2 py-2" key={user.id}>
									<td className="pl-0">{user.id}</td>
									<td className="pl-0">{user.amount}</td>
									<div>
										<button className="btn btn-primary mx-2" onClick={updateClaimStatus} id={user.id} value="1">
											Approve Claim
										</button>
									</div>
								</tr>
							))}
						</tbody>
					</table>
				) : (
					<center>
						<div className="bg-danger rounded p-2 d-flex justify-content-center align-items-center">
							<h5>No Rejected Claims Found</h5>
						</div>
					</center>
				)}
			</div>

			<hr className="my-5" />

			<h1 className="text-success">Settled Claims</h1>
			<div className={`${verifiedUsers.length > 0 ? 'col-10 p-0 ml-5' : ''} `}>
				{verifiedUsers.length > 0 ? (
					<table className="table table-borderless ml-3" style={{minWidth: '130%'}}>
						<thead>
							<tr className="text-center">
								<th className="text-secondary" scope="col">
									Claim Id
								</th>
								<th className="text-secondary pl-0" scope="col">
									Claim Amount
								</th>
							</tr>
						</thead>

						<tbody>
							{verifiedUsers.map((user) => (
								<tr className="text-center my-2 py-2" key={user.id}>
									<td className="pl-0">{user.id}</td>
									<td className="pl-0">{user.amount}</td>
								</tr>
							))}
						</tbody>
					</table>
				) : (
					<center>
						<div className="bg-danger rounded p-2 d-flex justify-content-center align-items-center">
							<h5>No Settled Claims Found</h5>
						</div>
					</center>
				)}
			</div>
		</>
	)
}
export default Insurance
