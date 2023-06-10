import React from "react";
import {motion} from "framer-motion"
import "../Style/tictactoe.css"

export default function Box(props) {



    return(
        <motion.div 
            id="id1"
            whileHover={{scale:1.1}}
            className="box"
            onClick={()=> {
                props.toggle(props.id)
            }}
        >
            {props.on!="y" && (<p className="symbolp">{props.on ==="x"? "X" : "O"}</p>)}

        </motion.div>
    )
        
    
}