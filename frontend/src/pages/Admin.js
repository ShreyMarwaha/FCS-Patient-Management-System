import { useEffect, useState , useContext} from 'react'
import './pages.css'
import { Link } from 'react-router-dom'
import '../components/components.css'
import React, { Component } from 'react'
import {DataContext} from '../App'

let listItems = []
let output = []

function Admin() {

	const {loginData, setLoginData} = useContext(DataContext)

	function verifiedUsers() {
		fetch(`https://192.168.2.235/api/normalusers?jwt=${loginData.data.token}`).then((res) => {
			res.json().then((data) => {
				if (data.data.length===0) {
                    console.log("No verified users present !!")
				}
				else {
					// listItems = data.data.map((d)=> <li key={d.email}>{d.email}</li>)
					output = JSON.stringify(data.data)
					document.getElementById("verified").innerHTML = output;
				}
			})
		})
	}

	function unverifiedUsers() {
		fetch(`https://192.168.2.235/api/unverifiedusers?jwt=${loginData.data.token}`).then((res) => {
			res.json().then((data) => {
				if (data.data.length===0) {
                    console.log("No unverified users present !!")
				}
				else {
					// listItems = data.data.map((d)=> <li key={d.email}>{d.email}</li>)
					output = JSON.stringify(data.data)
					document.getElementById("unverified").innerHTML = output;
				}
			})
		})
	}

	function blockedUsers() {
		fetch(`https://192.168.2.235/api/blockedusers?jwt=${loginData.data.token}`).then((res) => {
			res.json().then((data) => {
				if (data.data.length===0) {
                    console.log("No blocked users present !!")
				}
				else {
					// listItems = data.data.map((d)=> <li key={d.email}>{d.email}</li>)
					output = JSON.stringify(data.data)
					document.getElementById("blocked").innerHTML = output;
				}
			})
		})
	}

	return (
		<> 
			<h1 style={{color: 'var(--dark-green)'}}>View all the Verified Users Here</h1>
			<div style={{display: 'flex'}}>
				<button className="searchBtn" onClick={verifiedUsers}>
					Click Here
				</button>
			</div>
			<br></br>
			<div id = "verified">	</div>
			<br></br><br></br>

			<h1 style={{color: 'var(--dark-green)'}}>View all the Unverified Users Here</h1>
			<div style={{display: 'flex'}}>
				<button className="searchBtn" onClick={unverifiedUsers}>
				Click Here
				</button>
			</div>
			<br></br>
			<div id = "unverified">	</div>
			<br></br><br></br>

			<h1 style={{color: 'var(--dark-green)'}}>View all the Blocked Users Here</h1>
			<div style={{display: 'flex'}}>
				<button className="searchBtn" onClick={blockedUsers}>
				Click Here
				</button>
			</div>
			<br></br>
			<div id = "blocked">	</div>
			<br></br><br></br>
		</>
	)
}
export default Admin