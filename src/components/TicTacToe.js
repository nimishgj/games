

import Box from "./Box"
import React, { useEffect } from 'react';
import boxes from "./Boxes"
import {motion} from "framer-motion"
import "../Style/tictactoe.css"


export default function TicTacToe(){
    
    const [squares,setsquare]=React.useState(boxes)
    const [turn,changeturn]=React.useState("")
    const [winner,setwinner]=React.useState("")

    function toggle(id){
        setsquare(prevsq=>{
            return prevsq.map((square)=>{
                return square.id===id?turn==="x"?{...square,on:"x"} :{...square,on:"o"} : square
            })
        })
        
    }


    useEffect(()=>{
        game()
        change()
    },[squares])

    function change(){
        changeturn(prevturn=>{
            if (prevturn==="x"){
                return "o"
            }
            else if (prevturn==="o"){
                return "x"
            }

        })
    }

    function game (){

        if((squares[0].on==="o" && squares[1].on==="o"&&squares[2].on==="o") || (squares[0].on==="x" && squares[1].on==="x"&&squares[2].on==="x")){
            setwinner(turn)
        }
        else if((squares[0].on==="o" && squares[4].on==="o"&&squares[8].on==="o") || (squares[0].on==="x" && squares[4].on==="x"&&squares[8].on==="x")){
            setwinner(turn)
        }
        else if((squares[0].on==="o" && squares[3].on==="o"&&squares[6].on==="o") || (squares[0].on==="x" && squares[3].on==="x"&&squares[6].on==="x")){
            setwinner(turn)
        }
        else if((squares[1].on==="o" && squares[4].on==="o"&&squares[7].on==="o") || (squares[1].on==="x" && squares[4].on==="x"&&squares[7].on==="x")){
            setwinner(turn)
        }
        else if((squares[2].on==="o" && squares[5].on==="o"&&squares[8].on==="o") || (squares[2].on==="x" && squares[5].on==="x"&&squares[8].on==="x")){
            setwinner(turn)
        }
        else if((squares[2].on==="o" && squares[4].on==="o"&&squares[6].on==="o") || (squares[2].on==="x" && squares[4].on==="x"&&squares[6].on==="x")){
            setwinner(turn)
        }
        else if((squares[3].on==="o" && squares[4].on==="o"&&squares[5].on==="o") ||squares[3].on==="x" && squares[4].on==="x"&&squares[5].on==="x"){
            setwinner(turn)
        }
        else if((squares[6].on==="o" && squares[7].on==="o"&&squares[8].on==="o") || (squares[6].on==="x" && squares[7].on==="x"&&squares[8].on==="x")){
            setwinner(turn)
        }
        
    }
   
    const squareelements=squares.map(
        square=> {return <Box on={square.on}  toggle={toggle} id={square.id} />}
                
        
    )





    return(
        <div className="screen"><div className="gametitle">Tic Tac Toe Game</div>
        {((winner==="x") ||(winner==="o")) ? (
        <div>
            <div className="resultscreen">
                {`${winner.toUpperCase()}`} Won
            </div>
            <div>
                <motion.div
                    whileHover={{scale:1.1}}
                    onClick={()=>{setwinner(null);changeturn("");setsquare(boxes)}}
                    className="resultplayagain"
                >
                    Play Again
                </motion.div>
            </div>
        </div>
        ):(
            <div>
                
            <div className="dono">
            <div className="horizontal">
            <motion.div className="pos" whileHover={{scale:1.2}}>
            <h2>Select a symbol</h2>
            <div className="pad">
            <motion.button 
                id="myButton"
                whileHover={{scale:1.1}}
                onClick={()=>{document.getElementById("myButton").disabled = true;document.getElementById("myButton1").disabled = true;changeturn("x");}}
            >
                X
            </motion.button> 
            <motion.button 
                id="myButton1"
                whileHover={{scale:1.1}}
                onClick={()=>{document.getElementById("myButton1").disabled = true;document.getElementById("myButton").disabled = true;changeturn("o");}}
            >
                O
            </motion.button>
            </div>
        </motion.div>
    <div className="canvas">
        
        <div className="box-container">
        
            {squareelements}
        </div>
        
        
    </div>
    <div className="turn-element">
        <h2>Turn : {turn}</h2>
    </div>
    </div>
        </div>
            </div>)
        }
        </div>
        )
}