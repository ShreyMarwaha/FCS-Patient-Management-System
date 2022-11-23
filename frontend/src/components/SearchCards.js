import {useEffect} from 'react'
import {Link} from 'react-router-dom'
import './components.css'

function SearchCards(d, type) {
	let l = []
	useEffect(() => {
		console.log('useEffect')
		d.forEach((element) => {
			let s = '/details?type=' + type + '&id=' + element.id
			l.push(
				<Link className="cardlink" to={s}>
					<div className="card">{element.name}</div>
				</Link>
			)
		})
	}, [])

	return {l}
}

export default SearchCards
