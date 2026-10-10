import { useState } from 'react'
import './Lobby.css'

function Lobby({ onStart }) {
  const [page, setPage] = useState('menu')

  if (page === 'credits') {
    return (
      <main className="lobby">
        <section className="lobby-panel">
          <h1 className="lobby-title">Титри</h1>
          <p className="lobby-message">Дякуємо, що граєш у Муші!</p>
          <button className="lobby-text-button" type="button" onClick={() => setPage('menu')}>
            Назад до меню
          </button>
        </section>
      </main>
    )
  }

  if (page === 'exit') {
    return (
      <main className="lobby">
        <section className="lobby-panel">
          <h1 className="lobby-title">Дякуємо за гру!</h1>
          <button className="lobby-text-button" type="button" onClick={() => setPage('menu')}>
            Повернутися до меню
          </button>
        </section>
      </main>
    )
  }

  return (
    <main className="lobby">
      <section className="lobby-panel" aria-label="Головне меню">
        <h1 className="lobby-title">Муші</h1>
        <p className="lobby-subtitle">Пригода починається тут</p>
        <nav className="lobby-menu" aria-label="Головне меню">
          <button className="lobby-image-button" type="button" onClick={onStart} aria-label="Почати гру">
            <img src="/exit.jpg" alt="Старт" />
          </button>
          <button
            className="lobby-image-button lobby-small-button"
            type="button"
            onClick={() => setPage('credits')}
            aria-label="Титри"
          >
            <img src="/green-start-button-on-transparent-background-free-png.webp" alt="Титри" />
          </button>
          <button
            className="lobby-image-button lobby-small-button"
            type="button"
            onClick={() => setPage('exit')}
            aria-label="Вийти з гри"
          >
            <img src="/images.jpg" alt="Вихід" />
          </button>
        </nav>
      </section>
    </main>
  )
}

export default Lobby
