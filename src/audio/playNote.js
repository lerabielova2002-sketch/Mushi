// Грає звук з папки public/sounds.
// Приклад: playSound('do') відтворить public/sounds/do.mp3
// TODO: (я) покласти файли нот у public/sounds і викликати цю функцію з Player
function playSound(name) {
  const audio = new Audio(`/sounds/${name}.mp3`)
  audio.play()
}

export default playSound
