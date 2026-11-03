import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

import BookCard from './components/BookCard'
import Counter from './components/Counter'

function App() {

  return (
    <div>
      <BookCard title="Atomic Habits" author="James Clear" published_year={2018} />
      <BookCard title="Deep Work" author="Cal Newport" published_year={2022} />
      <Counter />
    </div>

  );
}

export default App
