import './components.css'

function SearchCards(d) {

    let l = []
    d.forEach(element => {
        l.push(<div className='card'>{element.name}</div>)
    })

    return (
        <>
            {l}
        </>
    )
}

export default SearchCards