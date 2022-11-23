import { useEffect, useState , useContext} from 'react'
import './pages.css'
import { Link } from 'react-router-dom'
import '../components/components.css'
import React, { Component } from 'react'
import {DataContext} from '../App'
import SearchCards from '../components/SearchCards'

let listItems = []
let output = []

function cards(d){
	let l = []
	d.forEach(element => {
        l.push(<Link className='cardlink' to={element}>
            <div className='card'>
                {element.name}
            </div>
        </Link>)
    })

    return (
        <>
            {l}
        </>
    )
}
function Admin() {

	const {loginData, setLoginData} = useContext(DataContext)
	const [unverifiedUsers, setUnverifiedUsers] = useState(0)
	useEffect(() =>{
		fetch(`https://192.168.2.235/api/unverifiedusers?jwt=${loginData.data.token}`).then((res) => {
			res.json().then((data) => {
				if (data.data.length===0) {
                    console.log("No unverified users present !!")
				}
				else {
					setUnverifiedUsers(1)
					listItems = data.data.map((d)=> <li key={d.email}>{d.email}</li>)
					output = JSON.stringify(data.data)
					document.getElementById("result").innerHTML = output;
				}
			})
		})
	}, [])

	return (
		<> 
			<h3 style={{color: 'var(--dark-green)'}}>View all the Unverified Users Here</h3>
			<br></br><br></br><br></br>
			<div id = "result">	</div>
		</>
	)
}
export default Admin