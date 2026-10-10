import { useState } from 'react'
import './Lobby.css'

function Lobby({ onStart }) {
  const [page, setPage] = useState('menu')

  if (page === 'credits') {
    return (
      <main className="lobby">
        <section className="lobby-panel">
          <h1 className="lobby-title">Credits</h1>
          <p className="lobby-message">Thank you for playing Mushi!</p>
          <button className="lobby-text-button" type="button" onClick={() => setPage('menu')}>
            Back to Menu
          </button>
        </section>
      </main>
    )
  }

  if (page === 'exit') {
    return (
      <main className="lobby">
        <section className="lobby-panel">
          <h1 className="lobby-title">Thank you for playing!</h1>
          <button className="lobby-text-button" type="button" onClick={() => setPage('menu')}>
            Back to Menu
          </button>
        </section>
      </main>
    )
  }

  return (
    <main className="lobby">
      <section className="lobby-panel" aria-label="Main Menu">
        <h1 className="lobby-title">Mushi</h1>
        <p className="lobby-subtitle">The adventure begins here</p>
        <nav className="lobby-menu" aria-label="Main Menu">
          <button className="lobby-image-button" type="button" onClick={onStart} aria-label="Start Game">
            <div className="lobby-button-text">Start game</div>
          </button>
          <button
            className="lobby-image-button lobby-small-button"
            type="button"
            onClick={() => setPage('credits')}
            aria-label="Credits"
          >
            <div className="lobby-button-text">Credits</div>
          </button>
          <button
            className="lobby-image-button lobby-small-button"
            type="button"
            onClick={() => setPage('exit')}
            aria-label="Exit Game"
          >
            <div className="lobby-button-text">Exit game</div>
          </button>
        </nav>
      </section>
    </main>
  )
}

export default Lobby
