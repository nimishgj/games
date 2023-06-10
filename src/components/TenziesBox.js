import "../Style/tenziesbox.css"

import React from 'react'

export default function TenziesBox(props) {
    const [isClicked, setIsClicked] = React.useState(false);

 


    return (
      <div class='box'  id={`x${props.id}`} onClick={(event)=>{
          props.func(props.id)
          setIsClicked(true)
          if (isClicked===true){event.target.style.backgroundColor='white';event.target.style.color='black' ; setIsClicked(false)}
          else {event.target.style.backgroundColor='rgb(186,171,228)';event.target.style.color='white' ;setIsClicked(true)}
  
        }}>
        {props.item}
        
      </div>
    )
}
