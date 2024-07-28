import axios from 'axios'
import { useEffect, useState } from 'react'
import { FaMagnifyingGlass, FaSpotify } from 'react-icons/fa6'
import '../styles/Spotify.css'

export default function SpotifyApp({ storedToken }) {
  const [type, setType] = useState('track')
  const [search, setSearch] = useState('')
  const [results, setResults] = useState([])

  useEffect(() => {
    if (search.trim() !== '' && type) {
      async function fetchResults() {
        try {
          const response = await axios.get(`/spotify/search`, {
            params: {
              token: storedToken,
              q: search,
              type,
            },
          })

          // Set the results
          setResults(response.data)
          console.log('Search Results:', response.data)
        } catch (error) {
          console.error(error)
        }
      }

      fetchResults()
    } else {
      setResults([]) // Clear results if the search is empty
    }
  }, [search, storedToken, type])

  return (
    <div className='Spotify'>
      <header className='Spotify-header'>
        <FaSpotify className='Spotify-logo' />
        <div className='Spotify-search'>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className='Spotify-search-select'
          >
            <option value='album'>Albums</option>
            <option value='artist'>Artists</option>
            <option value='track'>Tracks</option>
          </select>
          <FaMagnifyingGlass className='Spotify-search-icon' />
          <input
            type='text'
            placeholder='Search...'
            className='Spotify-search-input'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>
      <main className='Spotify-main'>
        {type === 'track' && (
          <>
            <h2>Tracks</h2>
            {results.length === 0 ? (
              <div className='Spotify-empty'>
                <FaSpotify className='Spotify-icon' />
                <h1>Search for tracks using the search bar above.</h1>
                <p>
                  You can search for tracks by artist, album, or track
                  name.
                </p>
              </div>
            ) : (
              <div className='Spotify-results'>
                {results.map((track) => (
                  <div
                    key={track.id}
                    className='Spotify-track'
                    onClick={() => {
                      window.open(
                        track.external_urls.spotify,
                        '_blank'
                      )
                    }}
                  >
                    {track.album &&
                      track.album.images &&
                      track.album.images[0] && (
                        <img
                          src={track.album.images[0].url}
                          alt={track.album.name}
                          className='Spotify-track-image'
                        />
                      )}
                    <div className='Spotify-track-info'>
                      <h3>{track.name}</h3>
                      {track.artists && track.artists[0] && (
                        <p>{track.artists[0].name}</p>
                      )}
                      {track.album && <p>{track.album.name}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
        {type === 'album' && (
          <>
            <h2>Albums</h2>
            {results.length === 0 ? (
              <div className='Spotify-empty'>
                <FaSpotify className='Spotify-icon' />
                <h1>Search for albums using the search bar above.</h1>
                <p>
                  You can search for artists by name, album name, or
                  track name.
                </p>
              </div>
            ) : (
              <div className='Spotify-results'>
                {results.map((album) => (
                  <div
                    key={album.id}
                    className='Spotify-album'
                    onClick={() => {
                      window.open(
                        album.external_urls.spotify,
                        '_blank'
                      )
                    }}
                  >
                    {album.images && album.images[0] && (
                      <img
                        src={album.images[0].url}
                        alt={album.name}
                        className='Spotify-album-image'
                      />
                    )}
                    <div className='Spotify-album-info'>
                      <h3>{album.name}</h3>
                      {album.artists && album.artists[0] && (
                        <p>{album.artists[0].name}</p>
                      )}
                      <p>{album.release_date}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
        {type === 'artist' && (
          <>
            <h2>Artists</h2>
            {results.length === 0 ? (
              <div className='Spotify-empty'>
                <FaSpotify className='Spotify-icon' />
                <h1>
                  Search for artists using the search bar above.
                </h1>
                <p>You can search for artists by name.</p>
              </div>
            ) : (
              <div className='Spotify-results'>
                {results.map((artist) => (
                  <div
                    key={artist.id}
                    className='Spotify-artist'
                    onClick={() => {
                      window.open(
                        artist.external_urls.spotify,
                        '_blank'
                      )
                    }}
                  >
                    {artist.images && artist.images[0] && (
                      <img
                        src={artist.images[0].url}
                        alt={artist.name}
                        className='Spotify-artist-image'
                      />
                    )}
                    <div className='Spotify-artist-info'>
                      <h3>{artist.name}</h3>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
