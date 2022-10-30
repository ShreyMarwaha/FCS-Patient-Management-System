import React, { useState } from 'react'
import './pages.css'

function Search() {

	const [searchData, setSearchData] = useState("")

	fetch('https://192.168.2.235/api/search').then((res) => {
		res.json().then((data) => {
			setSearchData(data)
		})
	})

	return (
		<>
			<h3 style={{color: 'var(--dark-green)'}}>Search for Institutes and Professionals</h3>
			<input type="text" className="inputfield" placeholder="Search"/>

			<div className='search-results'>
				{searchData}
			</div>
		</>
	)
}

export default Search