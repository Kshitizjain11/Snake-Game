import React, { useEffect, useRef, useState } from 'react'

const App = () => {
  const boardRef = useRef(null)
  const blocksRef = useRef([])

  const snakeRef = useRef([{
    x:1,y:3
  },{x:1,y:4},{x:1,y:5}])

  const blockHeight = 80
  const blockWidth = 80
  const [cols, setCols] = useState(0)
  const [rows, setRows] = useState(0)
  const [direction, setDirection] = useState("")
  const getIndex = (row,col) =>{
    return row * cols + col
  }

  const getRow = (index)=> Math.floor(index / cols)
  const getCol = index => index % cols 
  
  const renderSnake = ()=>{
    snakeRef.current.forEach(segment => {
      const idx = getIndex(segment.x,segment.y)
      const block = blocksRef.current[idx]
      if (block) block.classList.add("fill")
      console.log(block)
    })
  }

  const clearBoard = ()=>{
    blocksRef.current.forEach((elem)=>{
      if (elem) elem.classList.remove("fill")
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
    blocksRef.current.forEach((block,index)=>{
      if (block) block.innerText = `${getRow(index)}- ${getCol(index)}`
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
      snake.unshift(head)
      snake.pop()
     renderSnake()
    },400)
  
    return () => clearInterval(interval)
  }, [rows,cols,direction])
  
  return (
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
  )
}

export default App