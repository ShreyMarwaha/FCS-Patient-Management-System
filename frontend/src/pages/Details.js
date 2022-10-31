import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import './pages.css'

let d = []

function Details() {

    const [searchParams, setSearchParams] = useSearchParams();
    let type = searchParams.get("type")
    let id = searchParams.get("id")

    const fetchDocsDetails = () => {
        fetch('https://192.168.2.235/api/detailsdocs?id=' + id).then((res) => {
			res.json().then((data) => {
				if (data.data.length===0) {
					
				}
				else {
					d = data.data
                    console.log(d);
					// setDataFound1(1)
				}
			})
		})
    }

    return (
        <>
            {type==="doc"?
             <>
                <h3 style={{color: 'var(--dark-green)'}}>Doctor Details</h3>
                <button className='searchBtn' onClick={fetchDocsDetails}>Search</button>
             </>
            :<></>}

            {type==="hos"?
             <>
                <h3 style={{color: 'var(--dark-green)'}}>Hospital Details</h3>
             </>
            :<></>}

            {type==="pha"?
             <>
                <h3 style={{color: 'var(--dark-green)'}}>Pharmacy Details</h3>
             </>
            :<></>}
        </>
    )
}

export default Details