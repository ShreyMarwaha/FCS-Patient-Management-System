import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import {Button} from 'react-bootstrap'

function App() {
	function handleClick(e) {
		e.preventDefault()
		console.log('The button was clicked.')
	}
	return (
		<>
			<Button variant="primary" onClick={handleClick}>
				react button
			</Button>
			<button className="btn btn-primary">normal button</button>
		</>
	)
}

export default App
