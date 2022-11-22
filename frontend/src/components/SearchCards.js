import { Link } from 'react-router-dom'
import './components.css'
import React, { Component } from 'react'

function SearchCards(d, type) {

    let l = []
    d.forEach(element => {
        let s = '/details?type=' + type + '&id=' + element.id
        l.push(<Link className='cardlink' to={s}>
            <div className='card'>
                {element.name}
            </div>
        </Link>)
    })

    return (
        <>
            {l}
        </>
    )
}

export default SearchCards