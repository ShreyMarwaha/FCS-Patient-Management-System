import {useEffect} from 'react'
import {Link} from 'react-router-dom'
import './components.css'

function SearchCards(dataArray, type) {
	let cardsList = []
	dataArray.forEach((element) => {
		let link = '/details?type=' + type + '&id=' + element.id
		cardsList.push(
			<Link className="cardlink" to={link} id={element.id}>
				<div className="card">{element.name}</div>
			</Link>
		)
	})
	return cardsList
}

export default SearchCards
