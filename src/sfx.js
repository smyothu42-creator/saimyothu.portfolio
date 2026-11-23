const SELECT = '/sounds/select.mp3'
const CLICK_VOLUME = 0.4
const INTERACTIVE = [
  'a[href]',
  'button',
  'input:not([type="hidden"])',
  'select',
  'textarea',
  'summary',
  '[role="button"]',
  '[role="link"]',
  '[data-sound-interactive]',
].join(',')

function interactiveTarget(target) {
  if (!(target instanceof Element)) return null
  const el = target.closest(INTERACTIVE)
  if (!el || el.closest('[inert], [aria-disabled="true"]') || el.matches(':disabled')) return null
  return el
}

export function installUiSounds() {
  const AudioContext = window.AudioContext || window.webkitAudioContext
  const context = AudioContext ? new AudioContext() : null
  const clips = context && new Map([SELECT].map((src) => [
    src,
    fetch(src)
      .then((response) => {
        if (!response.ok) throw new Error(`Could not load ${src}`)
        return response.arrayBuffer()
      })
      .then((data) => context.decodeAudioData(data))
      .catch(() => null),
  ]))
  let media
  let stopPlaying
  let latestPlayback = 0

  function unlock(event) {
    if (!event.isTrusted || !context || context.state === 'running') return
    return context.resume().catch(() => {})
  }

  function playMedia(src, volume) {
    media ??= new Audio()
    stopPlaying?.()
    if (media.getAttribute('src') !== src) media.src = src
    media.currentTime = 0
    media.volume = volume
    stopPlaying = () => media.pause()
    media.play().catch(() => {})
  }

  async function play(src, volume, ready) {
    if (document.hidden) return
    const playback = ++latestPlayback
    if (!context || (context.state !== 'running' && !ready)) {
      playMedia(src, volume)
      return
    }

    const [, buffer] = await Promise.all([ready, clips.get(src)])
    if (playback !== latestPlayback || document.hidden) return
    if (!buffer || context.state !== 'running') {
      playMedia(src, volume)
      return
    }

    const source = context.createBufferSource()
    const gain = context.createGain()
    const stop = () => source.stop()
    source.buffer = buffer
    gain.gain.value = volume
    source.connect(gain)
    gain.connect(context.destination)
    source.onended = () => {
      if (stopPlaying === stop) stopPlaying = undefined
      source.disconnect()
      gain.disconnect()
    }
    stopPlaying?.()
    stopPlaying = stop
    source.start()
  }

  // Browsers may unlock audio on a press or key before a click is dispatched.
  document.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'mouse') unlock(event)
  }, true)
  document.addEventListener('pointerup', (event) => {
    if (event.pointerType !== 'mouse') unlock(event)
  }, true)
  document.addEventListener('keydown', unlock, true)

  document.addEventListener('click', (event) => {
    if (!event.isTrusted) return
    const ready = unlock(event)
    if (interactiveTarget(event.target)) play(SELECT, CLICK_VOLUME, ready)
  }, true)
}
