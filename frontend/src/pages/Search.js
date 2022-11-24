import React, {useState, useContext} from 'react'
import SearchCards from '../components/SearchCards'
import './pages.css'
import {DataContext} from '../App'

function Search() {
	const {loginData, setLoginData} = useContext(DataContext)
	const [dataHospital, setDataHospital] = useState([])
	const [dataDoctor, setDataDoctor] = useState([])
	const [dataPharmacy, setDataPharmacy] = useState([])

	function fetchSearchData() {
		console.log('clicked')
		var value = document.getElementById('searchValue').value
		fetch(`https://192.168.2.235/api/searchdocs?name=${value}&jwt=${loginData.data.token}`).then((res) => {
			res.json().then((data) => {
				if (!data.hasOwnProperty('err') && data.data.length > 0) {
					setDataDoctor(data.data)
				}
			})
		})
		fetch(`https://192.168.2.235/api/searchhospitals?name=${value}&jwt=${loginData.data.token}`).then((res) => {
			res.json().then((data) => {
				if (!data.hasOwnProperty('err') && data.data.length > 0) {
					setDataHospital(data.data)
				}
			})
		})
		fetch(`https://192.168.2.235/api/searchpharmacy?name=${value}&jwt=${loginData.data.token}`).then((res) => {
			res.json().then((data) => {
				if (!data.hasOwnProperty('err') && data.data.length > 0) {
					setDataPharmacy(data.data)
				}
			})
		})
	}

	return (
		<>
			<h3 style={{color: 'var(--dark-green)'}}>Search for Institutes and Professionals</h3>

			<div style={{display: 'flex'}}>
				<input id="searchValue" type="text" className="inputfield" placeholder="Search" />
				<button className="searchBtn" onClick={fetchSearchData}>
					Search
				</button>
			</div>

			<div className="search-results">
				<div>
					Doctors
					<div className="records">{dataDoctor.length > 0 ? SearchCards(dataDoctor, 'doc') : <>No Records Found!</>}</div>
				</div>
				<div>
					Hospitals
					<div className="records">{dataHospital.length > 0 ? SearchCards(dataHospital, 'hos') : <>No Records Found!</>}</div>
				</div>
				<div>
					Pharmacies
					<div className="records">{dataPharmacy.length > 0 ? SearchCards(dataPharmacy, 'pha') : <>No Records Found!</>}</div>
				</div>
			</div>
		</>
	)
}

export default Search
