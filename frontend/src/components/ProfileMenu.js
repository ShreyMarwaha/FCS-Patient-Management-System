import {Menu} from '@mantine/core'
import {UserCircle} from 'tabler-icons-react'
import './components.css'

function ProfileMenu() {
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
                <Menu.Label>Profile</Menu.Label>
                <Menu.Item>Edit Profile</Menu.Item>
            </Menu.Dropdown>
        </Menu>
	)
}

export default ProfileMenu