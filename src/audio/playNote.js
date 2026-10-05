// Грає звук з папки public/sounds.
// Приклад: playSound('do') відтворить public/sounds/do.mp3
// TODO: (я) додати аудіофайли нот у public/sounds
function playSound(name) {
  const audio = new Audio(`/sounds/${name}.mp3`)
  audio.play().catch((error) => {
    console.error(`Не вдалося відтворити ноту "${name}" (${audio.src})`, error)
  })
}

export default playSound
