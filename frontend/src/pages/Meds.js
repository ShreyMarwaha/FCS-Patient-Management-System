import RazorpayButton from '../components/RazorpayButton'
import '../components/components.css'
import React, { Component } from 'react'
import {DataContext} from '../App'
import { useEffect, useState , useContext} from 'react'
import './pages.css'

let output = []
function Meds() {
	const {loginData, setLoginData} = useContext(DataContext)

	function searchMedicine(){
		var value = document.getElementById('searchValue').value
		console.log(value)
		fetch(`https://192.168.2.235/api/searchmedicine?name=${value}&jwt=${loginData.data.token}`).then((res) => {
			res.json().then((data) => {
				if (data.data.length===0) {
					alert("Sorry! Searched Medicine not available!")
				}
				else {
					output = JSON.stringify(data.data)
					document.getElementById("meds").innerHTML = output;
				}
			})
		})
	}

	function searchMedicineById(){
		var value = document.getElementById('idValue').value
		console.log(value)
		fetch(`https://192.168.2.235/api/searchmedicinebyid?id=${value}&jwt=${loginData.data.token}`).then((res) => {
			res.json().then((data) => {
				if (data.data.length===0) {
					alert("Sorry! Searched Medicine not available!")
				}
				else {
					output = JSON.stringify(data.data)
					document.getElementById("medId").innerHTML = output;
				}
			})
		})
	}

	return (
		<>
			<h1 style={{color: 'var(--dark-green)'}}>Search for the required medicine</h1>
			<div style={{display: 'flex'}}>
				<input id="searchValue" type="text" className="inputfield" placeholder="Search a Medicine"/>
				<button className='searchBtn' onClick={searchMedicine}>Search</button>
			</div>
			<div id="meds"></div>
			<br></br><br></br>

			<h1 style={{color: 'var(--dark-green)'}}>Search Medicine by ID</h1>
			<div style={{display: 'flex'}}>
				<input id="idValue" type="text" className="inputfield" placeholder="Search Medicine by ID"/>
				<button className='searchBtn' onClick={searchMedicineById}>Search</button>
			</div>
			<div id="medId"></div>
			<br></br><br></br>

			<h1 style={{color: 'var(--dark-green)'}}>Purchase the required medicine</h1>
			<br></br><br></br>
			<RazorpayButton button_id="pl_Ke1GINO9Cr1qio" />
		</>
	)
}

export default Meds