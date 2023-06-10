import "../Style/flappybird.css"
import React from 'react';
import styled from 'styled-components';
import img from '../images/bg.jpg'
import topimg from '../images/top.png'
import botimg from '../images/bottom.png'
import bird from "../images/bird.png"
import { useState, useEffect } from 'react';

function FlappyBird() {
  const GAME_HEIGHT = 500;
  const GAME_WIDTH = 500;
  const OBSTACLE_GAP = 200;
  const OBSTACLE_WIDTH = 40;
  const OBSTACLE_SPEED = 5;
  const FRAME_RATE = 20;
  const BIRD_SIZE=20;
  const GRAVITY=2;

  const [obstacleHeight, setObstacleHeight] = useState(100);
  const [obstacleLeft, setObstacleLeft] = useState(GAME_WIDTH-OBSTACLE_WIDTH);
  const [birdTop,setbirdtop]=useState(GAME_HEIGHT/2)
  const [gamestarted,setgamestarted]=useState(false)
  const [score,setscore]=useState(-2)

  function rand_10(){
    return Math.floor(Math.random()*16)*10
}

  const bottomobsticleheight= GAME_HEIGHT- (OBSTACLE_GAP + obstacleHeight)

  useEffect(()=>{
    if(gamestarted &&birdTop< GAME_HEIGHT-BIRD_SIZE){
      const birdinterval=setInterval(() => {
        setbirdtop((top)=>top+GRAVITY);
      }, FRAME_RATE);
      return () => clearInterval(birdinterval);
    }


    
  });

  const handleclick=()=>{
    setgamestarted(true);
    setbirdtop((top)=>top-100);
  }
  
  useEffect(() => {
    

    if(gamestarted &&obstacleLeft>=-OBSTACLE_WIDTH){
      const interval = setInterval(() => {
      setObstacleLeft((left) => left - OBSTACLE_SPEED);
    }, FRAME_RATE); 
    
    return () => clearInterval(interval);
  }
    else {
      setObstacleLeft(GAME_WIDTH-OBSTACLE_WIDTH);
      setObstacleHeight(rand_10())
      setscore(score=>score+1)
      }
    
  },[obstacleLeft,gamestarted]);

  useEffect(()=>{
    if(obstacleLeft==GAME_WIDTH/2 && (birdTop<obstacleHeight || birdTop>bottomobsticleheight)){
      setgamestarted(false)
    }
  })


  return (
    <div style={{position:'relative',height: "100vh", justifyContent: "center", display: "flex" ,alignItems:'center',}}>
      <Gamecanvas width={GAME_WIDTH} height={GAME_HEIGHT} img={img} onClick={handleclick}>

          <Bird size={BIRD_SIZE} top={birdTop} left={GAME_WIDTH/2}/>

          <div>
            <Obstacle width={OBSTACLE_WIDTH} height={obstacleHeight} top={0} left={obstacleLeft}/>
            <Obstacle width={OBSTACLE_WIDTH} height={bottomobsticleheight} top={obstacleHeight+OBSTACLE_GAP} left={obstacleLeft}/>
          </div>

        
      </Gamecanvas>


      Score:{score}
    </div>
  );
}

const Bird=styled.div`
position:absolute;
width:${(props)=>props.size}px;
height:${(props)=>props.size}px;
background-image:url(${bird});
background-size:cover;
top:${(props)=>props.top}px;
left:${(props)=>props.left}px;
border-radius:50px
`;

const Obstacle=styled.div`
  position:absolute;
  width:${(props)=> props.width}px;
  height:${(props)=> props.height}px;
  background-color: rgb(48, 149, 32);
  
  top:${(props)=> props.top}px;
  left:${(props)=> props.left}px;
`;

const Gamecanvas=styled.div`
  width:${(props)=> props.width}px;
  height:${(props)=> props.height}px;
  overflow:hidden;
  background-image:url(${img});
  
  position:relative;
  border:1px solid black;
`;

export default FlappyBird;


