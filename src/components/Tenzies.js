import "../Style/tenzies.css"
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import TenziesBox from "../components/TenziesBox"


export default function Tenzies() {
    const [value,setvalue]=React.useState(100)
  const [score,setscore]=React.useState(0)
  const [won,setwon]=React.useState(false)
  const [number,setnumber]=React.useState([
    {
      id:0,
      value:0,
      freeze:false
    },{
      id:1,
      value:0,
      freeze:false
    },{
      id:2,
      value:0,
      freeze:false
    },{
      id:3,
      value:0,
      freeze:false
    },{
      id:4,
      value:0,
      freeze:false
    },{
      id:5,
      value:0,
      freeze:false
    },{
      id:6,
      value:0,
      freeze:false
    },{
      id:7,
      value:0,
      freeze:false
    },{
      id:8,
      value:0,
      freeze:false
    },{
      id:9,
      value:0,
      freeze:false
    },
  ])

  

  const handleclick=(id)=>{
    setvalue(id)
    setnumber(prevnum=>prevnum.map(num=>num.id===id?{...num,freeze:!num.freeze}:num))
  }

  const rolldice=()=>{
    won?window.location.reload():
    setscore(score+1)
    setnumber(prevnum=>prevnum.map(num=>num.freeze===false?{...num,value:Math.floor(Math.random()*7)}:num))
  }
  

  React.useEffect(()=>{
    const result=number.filter((num)=>{return num.freeze && num.value===6})
    if(result.length===10){
      setwon(true)
    }
  })
  return (
    <div className='main'>  
    {won && <Confetti/>}
    <div className='gametitle'>Tenzies</div>
    <div className='gameinfo'>Roll until all dice are the sixes. Click each<br /> die to freeze it at its current value between rolls.</div>
    <div className='gridlayout'>
      <TenziesBox func={handleclick} item={number[0].value} id={0}/>
      <TenziesBox func={handleclick} item={number[1].value} id={1}/>
      <TenziesBox func={handleclick} item={number[2].value} id={2}/>
      <TenziesBox func={handleclick} item={number[3].value} id={3}/>
      <TenziesBox func={handleclick} item={number[4].value} id={4}/>
      <TenziesBox func={handleclick} item={number[5].value} id={5}/>
      <TenziesBox func={handleclick} item={number[6].value} id={6}/>
      <TenziesBox func={handleclick} item={number[7].value} id={7}/>
      <TenziesBox func={handleclick} item={number[8].value} id={8}/>
      <TenziesBox func={handleclick} item={number[9].value} id={9}/>

    </div>

    <div className='rollbtn'>
    <motion.button onClick={rolldice} whileHover={{scale:1.1}}>{won?"New Game":"ROLL"}</motion.button></div>
     {won && <div className='score'>Hurrah!You Win<br/>Moves Taken: {score}</div>}
  </div>
  )
}
