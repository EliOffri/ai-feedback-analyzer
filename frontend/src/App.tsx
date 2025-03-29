import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import FeedbackForm from './components/FeedbackForm'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>Feedback Analyzer</h1>
      <div className="card">
        <FeedbackForm />
      </div>
    </>
  )
}

export default App
