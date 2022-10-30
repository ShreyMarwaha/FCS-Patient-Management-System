import React, { useState } from 'react'
import './pages.css'

function Search() {

	const [queryRun, setQueryRun] = useState(0)
	const [searchData1, setSearchData1] = useState()
	const [dataFound1, setDataFound1] = useState(0)
	const [searchData2, setSearchData2] = useState()
	const [dataFound2, setDataFound2] = useState(0)
	const [searchData3, setSearchData3] = useState()
	const [dataFound3, setDataFound3] = useState(0)

	const fetchSearchData = () => {
		setQueryRun(1)
		var value = document.getElementById('searchValue').value
		fetch('https://192.168.2.235/api/searchdocs?name=' + value).then((res) => {
			res.json().then((data) => {
				setSearchData1(JSON.stringify(data))
				setDataFound1(1)
			})
		})
		fetch('https://192.168.2.235/api/searchhospitals?name=' + value).then((res) => {
			res.json().then((data) => {
				setSearchData2(JSON.stringify(data))
				setDataFound2(1)
			})
		})
		fetch('https://192.168.2.235/api/searchpharmacy?name=' + value).then((res) => {
			res.json().then((data) => {
				setSearchData3(JSON.stringify(data))
				setDataFound3(1)
			})
		})
	}

	return (
		<>
			<h3 style={{color: 'var(--dark-green)'}}>Search for Institutes and Professionals</h3>

			<div style={{display: 'flex'}}>
				<input id="searchValue" type="text" className="inputfield" placeholder="Search"/>
				<button className='searchBtn' onClick={fetchSearchData}>Search</button>
			</div>

			<div className='search-results'>
				{queryRun?
					<>
					<div>
						Doctors
						<div className='records'>
							{dataFound1?
								{searchData1}
							:
								<>
								No Records Found!
								</>
							}
						</div>
					</div>
					<div>
						Hospitals
						<div className='records'>
							{dataFound2?
								{searchData2}
							:
								<>
								No Records Found!
								</>
							}
						</div>
					</div>
					<div>
						Pharmacies
						<div className='records'>
							{dataFound3?
								{searchData3}
							:
								<>
								No Records Found!
								</>
							}
						</div>
					</div>
					</>
				:
					<></>
				}
			</div>
		</>
	)
}

export default Search