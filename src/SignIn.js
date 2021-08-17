import { useState } from 'react'
import { Auth } from 'aws-amplify'

export default function SignIn ({ setUser }) {
  async function logIn (e) {
    e.preventDefault()
    try {
      const user = await Auth.signIn(username, password)
      setUser(user)
    } catch (err) {
      console.error(err)
    }
  }

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  return (
    <form onSubmit={logIn}>
      <input type='text' placeholder='username' onChange={e => setUsername(e.target.value)} />
      <input type='password' placeholder='password' onChange={e => setPassword(e.target.value)} />
      <input type='submit' value='log in' />
    </form>
  )
}
