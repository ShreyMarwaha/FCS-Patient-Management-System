import {Menu} from '@mantine/core'
import {UserCircle} from 'tabler-icons-react'
import './components.css'
import {DataContext} from '../App'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'

function ProfileMenu() {

	const {loggedIn, setLoggedIn} = useContext(DataContext)
	const navigate = useNavigate();

    function signout() {
		navigate('/')
        setLoggedIn(0)
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
                <Menu.Item><center>Edit Profile</center></Menu.Item>
                <Menu.Item color="red" onClick={signout}><center>Signout</center></Menu.Item>
            </Menu.Dropdown>
        </Menu>
	)
}

export default ProfileMenu