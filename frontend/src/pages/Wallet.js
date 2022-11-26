import { useEffect, useState , useContext} from 'react'
import './pages.css'
import { Link } from 'react-router-dom'
import '../components/components.css'
import React, { Component } from 'react'
import {DataContext} from '../App'

let output = []

function Wallet() {

	const {loginData, setLoginData} = useContext(DataContext)
    var name = loginData.data.name
    var email = loginData.data.email

	function viewBalance() {
		fetch(`https://192.168.2.235/api/viewmywallet?name="${name}"&email="${email}"&jwt=${loginData.data.token}`).then((res) => {
			res.json().then((data) => {
				if (data.data.length===0) {
                    alert("User Wallet Not Found !!")
				}
				else {
					output = JSON.stringify(data.data)
					document.getElementById("balance").innerHTML = output;
				}
			})
		})
	}

    function updateBalance() {
        let previousBalance
        const data = {}

        data.name = loginData.data.name
        data.email = loginData.data.email
        data.balance = 0                    // set the value to be the one added to the balance

        fetch(`https://192.168.2.235/api/fetchbalance?name="${name}"&email=${email}&jwt=${loginData.data.token}`).then((res) => {
			res.json().then((data) => {
				if (data.data.length===0) {
                    alert("User Wallet Not Found !!")
				}
				else {
                    previousBalance = data.data[0].balance
				}
			})
		})

        data.balance = data.balance + previousBalance

        fetch('https://192.168.2.235/api/updatebalance', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		})
			.then((response) => response.json())
			.then(alert("Balance Updated Successfully!"))
			.catch((error) => {
				console.log('Error : ', error)
			})
			return
    }

	return (
		<> 
			<h1 style={{color: 'var(--dark-green)'}}>View Your Wallet Balance Here</h1>
			<div style={{display: 'flex'}}>
				<button className="searchBtn" onClick={viewBalance}>
					Click To View
				</button>
			</div>
			<br></br>
			<div id = "balance">	</div>
			<br></br><br></br>
		</>
	)
}
export default Wallet