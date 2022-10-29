import React from 'react'

function Search() {

    fetch('https://192.168.2.235/api/users').then((res) => {
		res.json().then((data) => {
            console.log(data)
		})
    })

	return (
        <>
		Hello
        </>
	)
}

export default Search