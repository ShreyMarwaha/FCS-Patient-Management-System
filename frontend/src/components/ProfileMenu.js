import {Menu} from '@mantine/core'
import {UserCircle} from 'tabler-icons-react'
import './components.css'
import {DataContext} from '../App'
import {useContext} from 'react'
import {useNavigate} from 'react-router-dom'

function ProfileMenu() {
	const {loginData, setLoginData} = useContext(DataContext)
	const navigate = useNavigate()

	function signout() {
		setLoginData({isLoggedIn: false})
		navigate('/')
	}
	function openProfile() {
		navigate('/profile')
	}

	return (
		<Menu shadow="lg" width={200} trigger="hover" position="bottom-end" offset={15} withArrow>
			<Menu.Target>
				<li className="nav-item" style={{borderRadius: 100}}>
					<center>
						<UserCircle color="white" size={40} />
					</center>
				</li>
			</Menu.Target>

			<Menu.Dropdown>
				<Menu.Item onClick={openProfile}>
					<center>View Profile</center>
				</Menu.Item>
				<Menu.Item color="red" onClick={signout}>
					<center>Signout</center>
				</Menu.Item>
			</Menu.Dropdown>
		</Menu>
	)
}

export default ProfileMenu
