import {useRef, useState} from 'react'
import axios from 'axios'
import React, { Component } from 'react'

function Documents() {
	const [file, setFile] = useState('') // storing the uploaded file
	// storing the recived file from backend
	const [progress, setProgess] = useState(0) // progess bar

	const handleChange = (e) => {
		setProgess(0)
		const file = e.target.files[0] // accessing file
		console.log(file)
		setFile(file) // storing file
	}

	const uploadFile = () => {
		const formData = new FormData()
		formData.append('file', file) // appending file
		axios
			.post('https://192.168.2.235/api/upload', formData, {
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
		<div>
			<div className="file-upload">
				<input type="file" onChange={handleChange} />
				<div className="progessBar" style={{width: progress}}>
					{progress < 100 ? progress + '%' : <p className="text-success">Upload Complete!</p>}
				</div>
				<button onClick={uploadFile} className="btn btn-primary">
					Upload
				</button>
				<hr />

				{progress === 100 && (
					<a href={'https://192.168.2.235/docs/' + file.name} target="_blank">
						{file.name} (View)
					</a>
				)}
			</div>
		</div>
	)
}

export default Documents
