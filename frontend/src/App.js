import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom'
import Home from './pages/Home'

function App() {
	function handleClick(e) {
		e.preventDefault()
		console.log('The button was clicked.')
	}
	return (
		<Router>
			<Routes>
				<Route exact path="/" element={<Home />}></Route>
				<Route path="*" element={<Navigate replace to="/" />} />
			</Routes>
		</Router>
	)
}

export default App
