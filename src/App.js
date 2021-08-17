import './App.css'
import Subscribe from './Subscribe'
import SignIn from './SignIn'
import { useState } from 'react'

function App () {
  const [user, setUser] = useState(null)
  return (
    <div className='App'>
      <h1>My fancy subscription site!</h1>
      <Subscribe />
      {user ? <h1>Paywalled Content!</h1> : <SignIn setUser={setUser} />}
    </div>
  )
}

export default App
