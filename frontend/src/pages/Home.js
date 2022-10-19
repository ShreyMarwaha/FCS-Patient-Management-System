import {Button} from 'react-bootstrap'
const Home = () => {
	function handleClick(e) {
		e.preventDefault()
		console.log('The button was clicked.')
	}
	return (
		<>
			<h1>Home</h1>
			<Button variant="primary" onClick={handleClick}>
				react button
			</Button>
			<button className="btn btn-primary">normal button</button>
		</>
	)
}

export default Home
