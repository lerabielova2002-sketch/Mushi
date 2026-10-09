// Грає звук ноти.
// Спочатку пробуємо файл у public/sounds, а якщо його немає — генеруємо просту міні-нотку через WebAudio.
// TODO: (я) замінити генерацію на реальні аудіофайли нот для повнішої озвучки
const noteFrequencies = {
  do: 261.63,
  re: 293.66,
  mi: 329.63,
  fa: 349.23,
  sol: 392.0,
  la: 440.0,
  si: 493.88,
}

let audioContext = null

function getAudioContext() {
  if (typeof window === 'undefined') return null

  const AudioConstructor = window.AudioContext || window.webkitAudioContext
  if (!AudioConstructor) return null

  if (!audioContext) {
    audioContext = new AudioConstructor()
  }

  if (audioContext.state === 'suspended') {
    audioContext.resume().catch(() => {})
  }

  return audioContext
}

function playGeneratedTone(name) {
  const ctx = getAudioContext()
  if (!ctx) return

  const oscillator = ctx.createOscillator()
  const gain = ctx.createGain()

  oscillator.type = 'sine'
  oscillator.frequency.value = noteFrequencies[name] ?? 440
  gain.gain.value = 0.04

  oscillator.connect(gain)
  gain.connect(ctx.destination)

  oscillator.start()
  oscillator.stop(ctx.currentTime + 0.18)
}

function playSound(name) {
  const safeName = String(name || 'do').toLowerCase()
  const audio = new Audio(`/sounds/${safeName}.mp3`)

  audio.play().catch(() => {
    playGeneratedTone(safeName)
  })
}

export default playSound
