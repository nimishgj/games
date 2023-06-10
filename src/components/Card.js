import React from 'react'
import "../Style/card.css"

export default function Card(props) {
  return (
    <div className='maincard'>
      <img src={`${props.image}`}/>
    </div>
  )
}
