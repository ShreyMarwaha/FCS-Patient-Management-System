import './pages.css'
import React, { Component } from 'react'

function Profile() {

    return (
        <>
            <h3 style={{color: 'var(--dark-green)'}}>User Profile</h3>

            <div className='data'>
                Name: {}
                <br></br>
                City: {}
                <br></br>
                State: {}
                <br></br>
                Email: {}
                <br></br>
                Phone: {}
            </div>

            <button className='edit-btn'>
                Edit Profile
            </button>
        </>
    )
}

export default Profile