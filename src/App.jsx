import React, { useEffect, useRef, useState } from 'react'

const App = () => {
  const boardRef = useRef(null)
  const blocksRef = useRef([])
  const modalRef = useRef(null)
  const startModalRef = useRef(null)
  const gameOverModalRef = useRef(null)

  const snakeRef = useRef([{
    x:1,y:3
  },{x:1,y:4},{x:1,y:5}])


  const blockHeight = 80
  const blockWidth = 80
  const [cols, setCols] = useState(0)
  const [rows, setRows] = useState(0)
  const [food, setFood] = useState({})
  const [direction, setDirection] = useState("")
  const getIndex = (row,col) =>{
    return row * cols + col
  }

  const getRow = (index)=> Math.floor(index / cols)
  const getCol = index => index % cols 

  const generateFood = ()=>{
    let foodIndex= Math.floor(Math.random() * rows * cols) 
    setFood({
    x: getRow(foodIndex),
    y:getCol(foodIndex)
  })
  return foodIndex
  }

  const renderFood = ()=>{
    if (!food.x && !food.y) return;
    const foodIndex = getIndex(food.x,food.y) 
    const block = blocksRef.current[foodIndex]
    if (block) block.classList.add("food")
  }


  const renderSnake = ()=>{
    snakeRef.current.forEach(segment => {
      const idx = getIndex(segment.x,segment.y)
      const block = blocksRef.current[idx]
      if (block) block.classList.add("fill")
      if (block && idx === getIndex(food.x,food.y)) block.classList.add("food")
      // console.log(block)
    })
  }

  const clearBoard = ()=>{
    blocksRef.current.forEach((elem)=>{
      if (elem) {
        elem.classList.remove("fill")
        elem.classList.remove("food")
      }
    })
  }
  useEffect(()=>{
    const board = boardRef.current
    if (board){
      setCols(Math.floor(board?.clientWidth / blockWidth))
      setRows(Math.floor(board?.clientHeight / blockHeight))
    }
  },[])

  useEffect(() => {
      const handleKey = (e)=>{
      const key = e.key

      if (key == "ArrowUp") setDirection("up")
      else if (key == "ArrowDown") setDirection("down")
      else if (key == "ArrowLeft") setDirection("left")
      else if (key == "ArrowRight") setDirection("right")
    }
  
  window.addEventListener("keydown",handleKey)
  
  return ()=>window.removeEventListener("keydown",handleKey)  
  }, [])
  

  useEffect(() => {
    let foodIndex = getIndex(food.x,food.y)
    blocksRef.current.forEach((block,index)=>{
    // if (block && index === foodIndex) block.classList.add("food")

    if (block) block.innerText = `${getRow(index)}-${getCol(index)}`
  })
    
    const interval = setInterval(()=>{
      clearBoard()
      let head=null;
      let snake = snakeRef.current
      if (direction === 'left'){
        head = {x:snake[0].x,y:snake[0].y - 1}
      }else if (direction === 'right')
      {
        head = {x:snake[0].x,y:snake[0].y + 1}
      }else if (direction === 'down')
      {
        head = {x:snake[0].x + 1,y:snake[0].y}
      }else if (direction === 'up'){
        head = {x:snake[0].x - 1,y:snake[0].y}
      }

      if (head.x <0 || head.x >= rows || head.y < 0 || head.y >= cols) {
        clearInterval(interval)
        alert("Game Over")
        modalRef.current.style.display ="flex"
        startModalRef.current.classList.add("hidden")
        gameOverModalRef.current.classList.remove("hidden")
        return 
      }

      if (head.x == food.x && head.y == food.y){
        blocksRef.current[foodIndex].classList.remove("food")
        generateFood()
        snake.unshift(head)
      }

      snake.unshift(head)
      snake.pop()
     renderSnake()
     renderFood()
    },400)
  
    return () => clearInterval(interval)
  }, [rows,cols,direction])

  useEffect(() => {
    if (rows>0 && cols >0) generateFood()
    
  }, [rows,cols])
  
  const restartGame = () => {
    gameOverModalRef.current.classList.add("hidden");
    modalRef.current.style.display = "none"
    snakeRef.current.forEach(segment => {
      const idx = getIndex(segment.x,segment.y)
      const block = blocksRef.current[idx]
      if (block) block.classList.remove("fill")
  })
    snakeRef.current = [
      { x: 1, y: 3 },
      { x: 1, y: 4 },
      { x: 1, y: 5 },
    ];
    intervalId = setInterval(() => {
      renderSnake();
    }, 300);
  };
  
  return (
    <>
    <section className='bg-slate-800 flex-col  w-full h-screen overflow-hidden text-white'>
      <div className="infos p-(--space-2xl) flex justify-between">
        <div className="info border p-2  rounded-xl border-(--border-primary-color)">
          <h3 className='text-lg'>High Score:
            <span className='high-score' >0</span>
          </h3>
        </div>
        <div className="info border p-2  rounded-xl border-(--border-primary-color)">
          <h3 className='text-lg'>Score:
            <span className='high-score' >0</span>
          </h3>
        </div>
        <div className="info border p-2  rounded-xl border-(--border-primary-color)">
          <h3 className='text-lg'>Time:
            <span className='high-score' >00-00</span>
          </h3>
        </div>
      </div>
      <div ref={boardRef} className="board h-3/4 w-[95%] px-11 ">
        <div style={{
              gridTemplateColumns: `repeat(${cols}, ${blockWidth}px)`,
              gridTemplateRows: `repeat(${rows}, ${blockHeight}px)`
            }} className={`grid h-full w-full`}>
          {
            [...Array(rows*cols)].map((elem,ind)=>(
               <div ref={(el) => blocksRef.current[ind] = el} key={ind} className={`block w-[${blockWidth}px] h-[${blockHeight}px] border border-white/45`}></div>
            ))
          }
        </div>
      </div>
    </section>
    <div ref={modalRef} className="modal h-screen w-full fixed top-0 text-white bg-[#35353587] backdrop-blur-[3px] flex justify-center items-center">
      <div ref={startModalRef} className="start-game flex flex-col justify-center gap-(--space-lg)">
        <h2 className='text-3xl '>Welcome to Snake Game</h2>
        <button onClick={()=>{
          modalRef.current.style.display = "none"
          intervalId = setInterval(()=>{renderSnake()},300)
        }} className='text-4xl border rounded-xl py-2 cursor-pointer hover:scale-110 active:scale-75 transition-all duration-300 ease-out ' >Start Game</button>
      </div>
      <div ref={gameOverModalRef} className="game-over flex flex-col justify-center gap-(--space-lg) hidden">
        <h2 className='text-4xl text-center '>Game Over !!</h2>
        <button onClick={()=>restartGame()} className='text-4xl border px-5 rounded-xl py-2 cursor-pointer hover:scale-110 active:scale-75 transition-all duration-300 ease-out '>Restart Game</button>

      </div>
    </div>
    </>
  )
}

export default App