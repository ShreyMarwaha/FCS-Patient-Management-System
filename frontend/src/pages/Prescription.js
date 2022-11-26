import { useEffect, useState , useContext} from 'react'
import './pages.css'
import { Link } from 'react-router-dom'
import '../components/components.css'
import React, { Component } from 'react'
import {DataContext} from '../App'
import {v4 as uuidv4} from 'uuid'

function Admin() {

	const {loginData, setLoginData} = useContext(DataContext)

	let prescription;
	const handlemessage = event => {
		prescription = event.target.value
	};

	
	function util(prescriptionId, doctorId, timestamp, email, name, prescription){
		const data = {}
		data.id = prescriptionId
		data.doctorId = doctorId
		data.date = timestamp
		data.email = email
		data.name = name
		data.prescription = prescription

		fetch('https://192.168.2.235/api/makeprescription', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		})
			.then((response) => response.json())
			.then(alert("Prescription made Successfully!"))
			.catch((error) => {
				console.log('Error : ', error)
			})
			return
	}

	function makePrescription() {
		
		var email = document.getElementById('emailid').value
		var name = document.getElementById('name').value
		var doctorId = loginData.data.userId
		var prescriptionId = uuidv4()
		var timestamp = Date.now()
		// var date = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(timestamp)	

		fetch(`https://192.168.2.235/api/searchpatientbyemail?name="${email}"&jwt=${loginData.data.token}`).then((res) => {
			res.json().then((data) => {
				if (data.data.length===0) {
                    alert("Patient not found")
				}
				else {
					if(data.data[0].name === name && data.data[0].email === email){
						util(prescriptionId, doctorId, timestamp, email, name, prescription)
					}
					else{
						alert("Patient Name and Email do not match")
						return
					}
                }
			})
		})
	}

	return (
		<> 
			<h1 style={{color: 'var(--dark-green)'}}>Make a Prescription here</h1>
			<div style={{display: 'flex'}}>
                <input id="emailid" type="text" className="inputfield" placeholder="Enter Patient's Email Here" />
                <br></br>
                <input id="name" type="text" className="inputfield" placeholder="Enter Patient's Full Name Here" />
                <br></br>
			</div>

			<h3 style={{color: 'var(--dark-green)'}}>Write Prescription here</h3>
			
			<div style={{position:'center'}}>
				<textarea rows="8" cols="90" id="message" name="message" onChange={handlemessage} />
			</div>

			<button className="searchBtn" onClick={makePrescription}>
					Submit
			</button>
		</>
	)
}
export default Admin