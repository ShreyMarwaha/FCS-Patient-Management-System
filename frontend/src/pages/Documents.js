import React, {useState, useContext, useEffect} from 'react'
import axios from 'axios'
import Select from 'react-select'
import {DataContext} from '../App'

function Documents() {
	const {loginData, setLoginData} = useContext(DataContext)
	const [file, setFile] = useState('') // storing the uploaded file
	const [myDocuments, setMyDocuments] = useState([])
	const [progress, setProgess] = useState(0) // progess bar
	const [sharingOptions, setSharingOptions] = useState([])
	const handleFileChange = (e) => {
		setProgess(0)
		const file = e.target.files[0] // accessing file
		console.log(file)
		setFile(file) // storing file
	}
	useEffect(() => {
		getDocumentSharingOptions()
	}, [])

	function getDocumentSharingOptions() {
		fetch(`https://192.168.2.235/api/sharing?jwt=${loginData.data.token}`).then((res) => {
			res.json().then((data) => {
				if (data.hasOwnProperty('err') || data.data.length === 0) {
					console.log('No sharing options present !!')
				} else {
					console.log(data)
					setSharingOptions(data.data)
				}
			})
		})
	}

	function getMyDocuments() {
		fetch(`https://192.168.2.235/api/myDocuments?jwt=${loginData.data.token}`).then((res) => {
			res.json().then((data) => {
				if (data.hasOwnProperty('err') || data.data.length === 0) {
					console.log('No sharing options present !!')
				} else {
					console.log(data)
					setSharingOptions(data.data)
				}
			})
		})
	}

	function createSelectOptions() {
		let options = []
		sharingOptions.forEach((option) => {
			options.push({value: option.id, label: `${option.role}-${option.name}`})
		})
		console.log(options)
		return options
	}

	function deleteDoc(e) {
		fetch(`https://192.168.2.235/api/deleteDoc?jwt=${loginData.data.token}&doc_id=${e.target.id}`)
	}
	const uploadFile = () => {
		const formData = new FormData()
		formData.append('doc_type', 'identity') // appending file
		formData.append('file', file) // appending file
		axios
			.post('https://192.168.2.235/api/upload_document', formData, {
				onUploadProgress: (ProgressEvent) => {
					let progress = Math.round((ProgressEvent.loaded / ProgressEvent.total) * 100)
					setProgess(progress)
				},
			})
			.then((res) => {
				console.log(res)
			})
			.catch((err) => console.log(err))
	}

	return (
		<>
			<div className="file-upload">
				<input type="file" onChange={handleFileChange} />
				<div className="progessBar" style={{width: progress}}>
					{progress < 100 ? progress + '%' : <p className="text-success">Upload Complete!</p>}
				</div>
				<button onClick={uploadFile} className="btn btn-primary">
					Upload
				</button>
				<Select options={createSelectOptions()} placeholder="Select your State" />
				<hr />

				{progress === 100 && (
					<a href={'https://192.168.2.235/docs/' + file.name} target="_blank">
						{file.name} (View)
					</a>
				)}
			</div>

			<h3 style={{color: 'var(--dark-green)'}}>Docs Management</h3>
			<br></br>
			<br></br>
			<br></br>
			<h1>My Documents</h1>
			<div className={`${myDocuments.length > 0 ? 'col-10 p-0 ml-5 text-left' : ''} `}>
				{myDocuments.length > 0 ? (
					<table className="table table-borderless ml-3" style={{minWidth: '130%'}}>
						<thead>
							<tr className="text-center">
								<th className="text-secondary" scope="col">
									Shared To
								</th>
								<th className="text-secondary pl-0" scope="col">
									Document Type
								</th>
								<th className="text-secondary" scope="col">
									Link
								</th>
								<th className="text-secondary" scope="col">
									Action
								</th>
							</tr>
						</thead>

						<tbody>
							{myDocuments.map((doc) => (
								<tr className="my-2 py-2" key={doc.id}>
									<td className="pl-0 ">{doc.issued_to}</td>
									<td className="pl-0">{doc.doc_type}</td>
									<td>
										<a href={`https://192.168.2.235/docs/${doc.path}`}>File</a>
									</td>
									<div>
										<button className="btn btn-outline-dark mx-2" onClick={deleteDoc} id={doc.id} value="3">
											Delete
										</button>
									</div>
								</tr>
							))}
						</tbody>
					</table>
				) : (
					<center>
						<div className="bg-danger rounded p-2 d-flex justify-content-center align-items-center">
							<h5>No unverified Users</h5>
						</div>
					</center>
				)}
			</div>

			<hr className="my-5" />
		</>
	)
}

export default Documents
