import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

import BookCard from './components/BookCard'

function App() {

  const [count, setCount] = useState(0);

  return (
    <div>
      <BookCard title="Atomic Habits" author="James Clear" published_year={2018} />
      <BookCard title="Deep Work" author="Cal Newport" published_year={2022} />

      {count} <br />
      <button onClick={()=>{setCount(count+1)}}>
        +
      </button>
      <button onClick={()=>{setCount(count-1)}}>
        -
      </button>
    </div>

  );
}

export default App
