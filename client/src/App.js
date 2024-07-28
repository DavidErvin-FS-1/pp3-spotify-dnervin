import { FaSpotify } from 'react-icons/fa6'
import SpotifyApp from './pages/SpotifyApp'
import './styles/App.css'

function App() {
  const urlParams = new URLSearchParams(window.location.search)
  const token = urlParams.get('token')

  if (token) {
    localStorage.setItem('token', token)
    localStorage.setItem(
      'tokenExpiration',
      new Date().getTime() + 3600 * 1000
    ) // Set expiration to 1 hour from now
    window.location.href = '/'
  }

  const storedToken = localStorage.getItem('token')

  if (!storedToken) {
    return (
      <div className='App'>
        <header className='App-header'>
          <FaSpotify className='App-logo' />
          <h1>Please Sign In Using Spotify</h1>
          <p>
            In order to use this app, you need to sign in using your
            Spotify account.
          </p>
          <a
            className='App-link'
            href='http://localhost:3001/auth/login'
            rel='noopener noreferrer'
          >
            Sign In
          </a>
        </header>
      </div>
    )
  } else {
    return <SpotifyApp storedToken={storedToken} />
  }
}

export default App
