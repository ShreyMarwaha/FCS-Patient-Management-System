import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import './pages.css'

let d = []

function Details() {

    const [searchParams, setSearchParams] = useSearchParams();
    let type = searchParams.get("type")
    let id = searchParams.get("id")

    const fetchDocsDetails = () => {
        fetch('https://192.168.2.235/api/detailsdoc?id=' + id).then((res) => {
			res.json().then((data) => {
				if (data.data.length===0) {
					
				}
				else {
					d = data.data
				}
			})
		})
    }
    const fetchHosDetails = () => {
        fetch('https://192.168.2.235/api/detailshos?id=' + id).then((res) => {
			res.json().then((data) => {
				if (data.data.length===0) {
					
				}
				else {
					d = data.data
				}
			})
		})
    }
    const fetchPharmaDetails = () => {
        fetch('https://192.168.2.235/api/detailspha?id=' + id).then((res) => {
			res.json().then((data) => {
				if (data.data.length===0) {
					
				}
				else {
					d = data.data
				}
			})
		})
    }

    useEffect(() => {
        if (type==="docs")
        {
            fetchDocsDetails()
        }
        if (type==="hos")
        {
            fetchHosDetails()
        }
        if (type==="pha")
        {
            fetchPharmaDetails()
        }
        console.log(d);
    })

    return (
        <>
            {type==="doc"?
                <h3 style={{color: 'var(--dark-green)'}}>Doctor Details</h3>
            :<>
                {type==="hos"?
                    <h3 style={{color: 'var(--dark-green)'}}>Hospital Details</h3>
                :
                    <h3 style={{color: 'var(--dark-green)'}}>Pharmacy Details</h3>
                }
            </>}
        </>
    )
}

export default Details