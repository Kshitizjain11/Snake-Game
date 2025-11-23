import React, { useEffect, useRef, useState } from 'react'

const App = () => {
  const boardRef = useRef(null)
  const blocksRef = useRef([])
  const blockHeight = 80
  const blockWidth = 80
  const [cols, setCols] = useState(0)
  const [rows, setRows] = useState(0)

  const getIndex = (row,col) =>{
    return row * cols + col
  }

  const getRow = (index)=> Math.floor(index / cols)
  const getCol = index => index % cols 
  
  const snake = [{
    x:1,y:3
  },{x:1,y:4},{x:1,y:5}]
  
  const renderSnake = ()=>{
    snake.forEach(segment => {
      const idx = getIndex(segment.x,segment.y)
      const block = blocksRef.current[idx]
      if (block) block.classList.add("fill")
      console.log(block)
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
    blocksRef.current.forEach((block,index)=>{
      if (block) block.innerText = `${getRow(index)}- ${getCol(index)}`
    })
    renderSnake()
  }, [rows,cols])
  
  
   
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