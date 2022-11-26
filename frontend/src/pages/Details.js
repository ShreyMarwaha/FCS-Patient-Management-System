import {useEffect, useState} from 'react'
import {Link, useSearchParams} from 'react-router-dom'
import {Modal} from '@mantine/core'
import './pages.css'
import React, { Component } from 'react'

let name = ''
let city = ''
let state = ''
let hospital = ''

function Details({role}) {
	const [searchParams, setSearchParams] = useSearchParams()
	let type = searchParams.get('type')
	let id = searchParams.get('id')
	const [modalOpenedToDeleteID, setModalOpenedToDeleteID] = useState(0)

	const deleteRecord = () => {
		if (type === 'doc') {
			fetch('https://192.168.2.235/api/deletedoc?id=' + id)
		} else if (type === 'hos') {
			fetch('https://192.168.2.235/api/deletehos?id=' + id)
		} else if (type === 'pha') {
			fetch('https://192.168.2.235/api/deletepha?id=' + id)
		}
		setModalOpenedToDeleteID(0)
	}

	const fetchDetails = () => {
		if (type === 'doc') {
			fetch('https://192.168.2.235/api/detailsdoc?id=' + id).then((res) => {
				res.json().then((data) => {
					if (data.data.length === 0) {
					} else {
						let f = data.data
						name = f[0].name
						city = f[0].city
						state = f[0].state
						hospital = f[0].hospital
					}
				})
			})
		} else if (type === 'hos') {
			fetch('https://192.168.2.235/api/detailshos?id=' + id).then((res) => {
				res.json().then((data) => {
					if (data.data.length === 0) {
					} else {
						let f = data.data
						name = f[0].name
						city = f[0].city
						state = f[0].state
					}
				})
			})
		} else if (type === 'pha') {
			fetch('https://192.168.2.235/api/detailspha?id=' + id).then((res) => {
				res.json().then((data) => {
					if (data.data.length === 0) {
					} else {
						let f = data.data
						name = f[0].name
						city = f[0].city
						state = f[0].state
					}
				})
			})
		} else if (type === 'user') {
			fetch('https://192.168.2.235/api/detailsUser?id=' + id).then((res) => {
				res.json().then((data) => {
					if (data.data.length === 0) {
					} else {
						let f = data.data
						name = f[0].name
						city = f[0].city
						state = f[0].state
					}
				})
			})
		}
	}

	useEffect(() => {
		fetchDetails()
	})

	return (
		<>
			<Modal centered opened={modalOpenedToDeleteID} onClose={() => setModalOpenedToDeleteID(false)}>
				<center>
					Are you sure you want to delete this Record? The data would be cleared permanently.
					<br></br>
					<br></br>
					<br></br>
					<Link to={'/search'}>
						<button className="delete-btn-modal" onClick={deleteRecord}>
							Yes, Proceed
						</button>
					</Link>
				</center>
			</Modal>

			{type === 'doc' ? <h3 style={{color: 'var(--dark-green)'}}>Doctor Details</h3> : <>{type === 'hos' ? <h3 style={{color: 'var(--dark-green)'}}>Hospital Details</h3> : <h3 style={{color: 'var(--dark-green)'}}>Pharmacy Details</h3>}</>}

			<div className="data">
				Name: {name}
				<br></br>
				City: {city}
				<br></br>
				State: {state}
				<br></br>
				{type === 'doc' ? <>Hospital: {hospital}</> : <></>}
			</div>

			{role === 'admin' ? (
				<button className="delete-btn" onClick={() => setModalOpenedToDeleteID(1)}>
					Delete {type === 'doc' ? <>Doctor</> : <>{type === 'hos' ? <>Hospital</> : <>Pharmacy</>}</>} Record
				</button>
			) : (
				<></>
			)}
		</>
	)
}

export default Details
