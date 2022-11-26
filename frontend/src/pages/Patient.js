import { useEffect, useState , useContext} from 'react'
import './pages.css'
import { Link } from 'react-router-dom'
import '../components/components.css'
import React, { Component } from 'react'
import {DataContext} from '../App'

let output = []

function Patient() {

	const {loginData, setLoginData} = useContext(DataContext)

	function viewPatients() {
		fetch(`https://192.168.2.235/api/viewpatients?jwt=${loginData.data.token}`).then((res) => {
			res.json().then((data) => {
				if (data.data.length===0) {
                    console.log("No patients present !!")
				}
				else {
					// listItems = data.data.map((d)=> <li key={d.email}>{d.email}</li>)
					output = JSON.stringify(data.data)
					document.getElementById("patients").innerHTML = output;
				}
			})
		})
	}

	return (
		<> 
			<h1 style={{color: 'var(--dark-green)'}}>View all the Patients Here</h1>
			<div style={{display: 'flex'}}>
				<button className="searchBtn" onClick={viewPatients}>
					Click Here
				</button>
			</div>
			<br></br>
			<div id = "patients">	</div>
			<br></br><br></br>
		</>
	)
}
export default Patient