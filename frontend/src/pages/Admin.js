import { useEffect, useState , useContext} from 'react'
import './pages.css'
import React, { Component } from 'react'
import {DataContext} from '../App'

function Admin() {

	const {loginData, setLoginData} = useContext(DataContext)
	const [unverifiedUsers, setUnverifiedUsers] = useState([])
	let listItems;
	let output;
	useEffect(() =>{
		fetch(`https://192.168.2.235/api/unverifiedusers?jwt=${loginData.data.token}`).then((res) => {
			res.json().then((data) => {
				if (data.data.length===0) {
                    console.log("No unverified users present !!")
					output = "No unverified users present !!"
				}
				else {
					console.log(data.data)
					setUnverifiedUsers(data.data)
					listItems = data.data.map((d)=> <li key={d.email}>{d.email}</li>)
					console.log(listItems)
					output = JSON.stringify(data.data)
					document.getElementById("result").innerHTML = output;
				}
			})
		})
	}, [])

	return (
		<>
			<h3 style={{color: 'var(--dark-green)'}}>View all the Unverified Users Here</h3>
				<div id = "result">	</div>
				{/* <div className='records' id = "result">
					{output}
				</div> */}
		</>
	)
}
export default Admin