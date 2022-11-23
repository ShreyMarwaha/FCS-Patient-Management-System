import React, {useState, useContext} from 'react'
import SearchCards from '../components/SearchCards'
import './pages.css'
import {DataContext} from '../App'

let d1 = []
let d2 = []
let d3 = []

function Search() {
	const {loginData, setLoginData} = useContext(DataContext)
	const [queryRun, setQueryRun] = useState(0)
	const [dataFound1, setDataFound1] = useState(0)
	const [dataFound2, setDataFound2] = useState(0)
	const [dataFound3, setDataFound3] = useState(0)

	function fetchSearchData() {
		console.log('clicked')
		setQueryRun(1)
		var value = document.getElementById('searchValue').value
		fetch(`https://192.168.2.235/api/searchdocs?name=${value}&jwt=${loginData.data.token}`).then((res) => {
			res.json().then((data) => {
				if (data.hasOwnProperty('err') || data.data.length === 0) {
					setDataFound1(0)
				} else {
					d1 = data.data
					setDataFound1(1)
				}
			})
		})
		fetch(`https://192.168.2.235/api/searchhospitals?name=${value}&jwt=${loginData.data.token}`).then((res) => {
			res.json().then((data) => {
				if (data.data.length === 0) {
				} else {
					d2 = data.data
					setDataFound2(1)
				}
			})
		})
		fetch(`https://192.168.2.235/api/searchpharmacy?name=${value}&jwt=${loginData.data.token}`).then((res) => {
			res.json().then((data) => {
				if (data.data.length === 0) {
				} else {
					d3 = data.data
					setDataFound3(1)
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
				{queryRun ? (
					<>
						<div>
							Doctors
							<div className="records">{dataFound1 ? <>{SearchCards(d1, 'doc')}</> : <>No Records Found!</>}</div>
						</div>
						<div>
							Hospitals
							<div className="records">{dataFound2 ? <>{SearchCards(d2, 'hos')}</> : <>No Records Found!</>}</div>
						</div>
						<div>
							Pharmacies
							<div className="records">{dataFound3 ? <>{SearchCards(d3, 'pha')}</> : <>No Records Found!</>}</div>
						</div>
					</>
				) : (
					<></>
				)}
			</div>
		</>
	)
}

export default Search
