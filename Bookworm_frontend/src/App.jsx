import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

import BookCard from './components/BookCard'
import Counter from './components/Counter'
import Status from './components/Status'

function App() {

  async function getBooks(){
    try{
      const response = await fetch("http://127.0.0.1:8000/books/list/")
      const data = await response.json();
      console.log(data);
    }
    catch(error){
      console.log("Something went wrong", error);
    }
  }

  return (
    <div>
      {/* <BookCard title="Atomic Habits" author="James Clear" published_year={2018} />
      <BookCard title="Deep Work" author="Cal Newport" published_year={2022} />
      <Counter />
      <Status /> */}

      <button onClick={getBooks}>Get Books</button>
    </div>

  );
}

export default App
