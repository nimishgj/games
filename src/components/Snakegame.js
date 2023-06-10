import styled from 'styled-components'
import "../Style/snakegame.css"
import { useState,useEffect } from 'react';
import { motion } from 'framer-motion';

function Snakegame() {

  function rand(min, max) {
    min = Math.ceil(min / 5) * 5;
    max = Math.floor(max / 5) * 5; 
    return Math.floor(Math.random() * ((max - min) / 5 + 1)) * 5 + min;
  }
  
  
  const BOX_SIZE=5;
  const GAME_WIDTH=210;
  const GAME_HEIGHT=100;
  

  const [boxLeft,setboxleft]=useState(0)
  const [boxtop,setboxtop]=useState(0)
  const [fruitLeft,setfruitleft]=useState(rand(0,GAME_WIDTH-BOX_SIZE)) 
  const [fruittop,setfruittop]=useState(rand(0,GAME_HEIGHT-BOX_SIZE)) 
  const [score,setscore]=useState(0)
  const [boxpos,setboxpos]=useState([{x:0,y:0}])
  const [numofboxes,setnumofboxes]=useState(1)
  const [gamestarted,setgamestarted]=useState(true)


  const collision=(direction)=>{
      let iscollision=false
      const newpos=boxpos.slice(-numofboxes)
      console.log(newpos)
      if(direction==='ArrowRight'){
        newpos.map((prev)=>{
          if(prev.x===boxLeft+BOX_SIZE && prev.y===boxtop){iscollision=true} 
        })
      } else if(direction==='ArrowLeft'){
        newpos.map((prev)=>{
          if(prev.x===boxLeft-BOX_SIZE && prev.y===boxtop){iscollision=true} 
        })
      } else if(direction==='ArrowUp'){
        newpos.map((prev)=>{
          if(prev.y===boxtop-BOX_SIZE && prev.x===boxLeft){iscollision=true} 
        })
      } else if(direction==='ArrowDown'){
        newpos.map((prev)=>{
          if(prev.y===boxtop+BOX_SIZE && prev.x===boxLeft){iscollision=true} 
        })
      }
      if(iscollision){setgamestarted((prevstate)=>!prevstate)}
      return iscollision

  }

  useEffect(()=>{
    console.log('useefefct')
  })


  const move=(event)=>{
    if (event.key==='ArrowRight' && boxLeft<GAME_WIDTH-BOX_SIZE && !collision(event.key)){
      setboxleft((prevleft)=>prevleft+BOX_SIZE)
      setboxpos(pos=>[...pos,{x:pos[pos.length-1].x+BOX_SIZE,y:pos[pos.length-1].y}])
    } else if(event.key==='ArrowLeft' && boxLeft>0 && !collision(event.key)){
      setboxleft((prevleft)=>prevleft-BOX_SIZE)
      setboxpos(pos=>[...pos,{x:pos[pos.length-1].x-BOX_SIZE,y:pos[pos.length-1].y}])
    } else if(event.key==='ArrowUp' && boxtop>0 && !collision(event.key)){
      setboxtop((prevtop)=>prevtop-BOX_SIZE)
      setboxpos(pos=>[...pos,{x:pos[pos.length-1].x,y:pos[pos.length-1].y-BOX_SIZE}])
    } else if(event.key==='ArrowDown' && boxtop<GAME_HEIGHT-BOX_SIZE && !collision(event.key)){
      setboxtop((prevtop)=>prevtop+BOX_SIZE)
      setboxpos(pos=>[...pos,{x:pos[pos.length-1].x,y:pos[pos.length-1].y+BOX_SIZE}])
    }
  }

  useEffect(()=>{
    if(fruitLeft===boxLeft&& fruittop===boxtop){
      setfruitleft(()=>rand(0,GAME_WIDTH-BOX_SIZE))
      setfruittop(()=>rand(0,GAME_HEIGHT-BOX_SIZE))
      setscore(score=>score+1)
      setnumofboxes(box=>box+1)
      
    }
  },[boxLeft,boxtop])



  return (
    <div onKeyDown={move} tabIndex={0}>
    {gamestarted && <GameCanvas height={GAME_HEIGHT} width={GAME_WIDTH} box={BOX_SIZE} >
    {Array.from(Array(numofboxes), (e, i) => {
    return <Box width={BOX_SIZE} height={BOX_SIZE} left={boxpos[boxpos.length-(i+1)].x} top={boxpos[boxpos.length-(i+1)].y}/>
  })}
      
      <Fruit width={BOX_SIZE} height={BOX_SIZE} fruitleft={fruitLeft} fruittop={fruittop}>*</Fruit>
    </GameCanvas>}
    {!gamestarted && <div className='gamerestartCanvas'>
        <p className='scorecard'>Score:{score}</p>
        <motion.button whileHover={{scale:1.1}} className='playAgainButton' onClick={()=>{window.location.reload()}}>Play Again</motion.button>
      </div>}
    </div>
    
  );
}

const GameCanvas=styled.div`
display:grid;
position:relative;
grid-template-columns:repeat(${(props)=> props.width/props.box},${(props)=>props.box}vh);
grid-template-columns:repeat(${(props)=> props.height/props.box},${(props)=>props.box}vh);
background-color: black;
width:${(props)=>props.width}vh;
height:${(props)=>props.height}vh;
`
const Box=styled.div`
position:absolute;
width:${(props)=>props.width}vh;
height:${(props)=>props.height}vh;
background-color:red;
left:${(props)=>props.left}vh;
top:${(props)=>props.top}vh;
`

const Fruit=styled.div`
position:absolute;
font-size: 40px;
text-align: center;
width:${(props)=>props.width}vh;
height:${(props)=>props.height}vh;
color: green;
left:${(props)=>props.fruitleft}vh;
top:${(props)=>props.fruittop}vh;
`


export default Snakegame;
