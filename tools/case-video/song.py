# Original instrumentals for the Superfine films, written note by note here so
# there is nothing to license. usage: python3 song.py employee|driver seconds out.wav
# then: afconvert out.wav -f m4af -d aac -b 160000 ../../public/case/.../intro.m4a
import sys
import wave
import numpy as np

SR = 44100
rng = np.random.default_rng(7)
hz = lambda m: 440.0 * 2 ** ((m - 69) / 12)


def add(buf, sig, at, pan=0.0):
    i = int(at * SR)
    if i >= len(buf):
        return
    n = min(len(sig), len(buf) - i)
    buf[i:i + n, 0] += sig[:n] * (1 - max(pan, 0))
    buf[i:i + n, 1] += sig[:n] * (1 + min(pan, 0))


def env(n, a, d):
    t = np.arange(n) / SR
    return np.minimum(t / a, 1) * np.exp(-t / d)


def epiano(m, dur, vel=0.3):  # soft FM electric piano
    n = int((dur + 0.8) * SR)
    t = np.arange(n) / SR
    f = hz(m)
    mod = 1.6 * np.exp(-t / 0.35) * np.sin(2 * np.pi * f * t)
    tone = np.sin(2 * np.pi * f * t + mod) + 0.25 * np.sin(2 * np.pi * 2 * f * t)
    release = np.clip((dur + 0.8 - t) / 0.8, 0, 1)
    return vel * tone * env(n, 0.006, 1.5) * release


def pluck(m, vel=0.22):  # bright short note with a few harmonics
    n = int(0.45 * SR)
    t = np.arange(n) / SR
    f = hz(m)
    tone = sum(np.sin(2 * np.pi * f * k * t) * np.exp(-t * 7 * k) / k for k in range(1, 6))
    return vel * tone * env(n, 0.002, 0.2)


def bass(m, dur, vel=0.42):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = hz(m)
    tone = np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * 2 * f * t) * np.exp(-t * 8)
    return vel * tone * env(n, 0.006, dur * 0.9) * np.clip((dur - t) / 0.03, 0, 1)


def kick(vel=0.7):
    n = int(0.3 * SR)
    t = np.arange(n) / SR
    phase = 2 * np.pi * np.cumsum(48 + 90 * np.exp(-t * 32)) / SR
    return vel * np.sin(phase) * np.exp(-t * 13)


def noise_hit(dur, decay, vel, bright=True):
    n = int(dur * SR)
    t = np.arange(n) / SR
    x = rng.standard_normal(n)
    if bright:
        x = np.diff(x, prepend=0)
    else:
        x = np.convolve(x, np.ones(8) / 8, 'same')
    return vel * x * np.exp(-t * decay)


def space(x, wet):  # small room: convolve with decaying noise
    n = int(0.9 * SR)
    ir = rng.standard_normal((n, 2)) * np.exp(-np.arange(n) / SR * 6)[:, None]
    ir[:, 0] /= np.sqrt((ir[:, 0] ** 2).sum())
    ir[:, 1] /= np.sqrt((ir[:, 1] ** 2).sum())
    size = 1 << int(np.ceil(np.log2(len(x) + n)))
    out = np.stack([np.fft.irfft(np.fft.rfft(x[:, c], size) * np.fft.rfft(ir[:, c], size), size)[:len(x)] for c in (0, 1)], 1)
    return x + wet * out


def employee(total):  # warm, unhurried: 82 bpm, Fmaj7 Em7 Dm7 Cmaj7
    keys, drums = np.zeros((int(total * SR), 2)), np.zeros((int(total * SR), 2))
    beat = 60 / 82
    bar = beat * 4
    chords = [(41, [57, 60, 64, 65]), (40, [55, 59, 62, 64]), (38, [53, 57, 60, 65]), (36, [55, 59, 60, 64])]
    tune = [[72, None, 69, 67], [71, None, 67, None], [69, 72, None, 65], [67, None, 64, None]]
    for b in range(int(total / bar) + 1):
        t0 = b * bar
        root, notes = chords[b % 4]
        for j, m in enumerate(notes):
            add(keys, epiano(m, bar * 0.9, 0.17), t0 + j * 0.012, (j - 1.5) * 0.18)
        add(keys, epiano(notes[-1] + 12, beat, 0.08), t0 + beat * 2.5, 0.3)
        if b >= 2:
            add(drums, bass(root, beat * 1.7), t0)
            add(drums, bass(root + 7, beat * 0.9, 0.3), t0 + beat * 2.5)
        if b >= 4:
            for j, m in enumerate(tune[b % 4]):
                if m:
                    add(keys, epiano(m + 12, beat * 0.8, 0.14), t0 + j * beat, -0.2)
        if b >= 2:
            for k in (0, 2.5):
                add(drums, kick(0.5), t0 + k * beat)
            for k in (1, 3):
                add(drums, noise_hit(0.2, 22, 0.10, False), t0 + k * beat)
            for k in range(8):  # swung hats
                swing = 0.06 * beat if k % 2 else 0
                add(drums, noise_hit(0.05, 90, 0.022 if k % 2 else 0.034), t0 + k * beat / 2 + swing, 0.25)
    mix = space(keys, 0.35) + drums
    mix += rng.standard_normal(mix.shape) * 0.0015  # a little air
    return mix


def driver(total):  # moving, on the clock: 112 bpm, Am F C G
    arp, drums = np.zeros((int(total * SR), 2)), np.zeros((int(total * SR), 2))
    beat = 60 / 112
    bar = beat * 4
    chords = [(33, [57, 60, 64, 69]), (29, [57, 60, 65, 69]), (36, [55, 60, 64, 67]), (31, [55, 59, 62, 67])]
    order = [0, 1, 2, 3, 2, 1, 3, 0, 1, 2, 3, 0, 2, 3, 1, 0]
    lead = [[76, None, 79, 81], [77, None, 76, None], [79, 76, None, 72], [74, None, 71, None]]
    for b in range(int(total / bar) + 1):
        t0 = b * bar
        root, notes = chords[b % 4]
        for s in range(16):
            m = notes[order[s]] + (12 if s % 8 == 6 else 0)
            add(arp, pluck(m, 0.24 if s % 4 else 0.32), t0 + s * beat / 4, 0.35 * np.sin(s * 0.8))
        if b >= 2:
            for k in range(8):
                add(drums, bass(root + (12 if k % 4 == 3 else 0), beat * 0.45, 0.2), t0 + k * beat / 2)
        if b >= 4:
            for k in range(4):
                add(drums, kick(0.4), t0 + k * beat)
            for k in (1, 3):
                add(drums, noise_hit(0.16, 28, 0.13), t0 + k * beat)
            for k in range(8):
                add(drums, noise_hit(0.05, 80, 0.04 if k % 2 else 0.018), t0 + k * beat / 2, -0.25)
        if b >= 8 and (b // 4) % 2 == 0:
            for j, m in enumerate(lead[b % 4]):
                if m:
                    add(arp, pluck(m, 0.42), t0 + j * beat, -0.15)
    return space(arp, 0.3) + drums


def main():
    name, total, out = sys.argv[1], float(sys.argv[2]), sys.argv[3]
    mix = {'employee': employee, 'driver': driver}[name](total)
    t = np.arange(len(mix)) / SR
    fade = np.clip((total - t) / 2.5, 0, 1) ** 2  # ends quietly, so the loop doesn't cut
    mix = mix * (fade * np.clip(t / 0.05, 0, 1))[:, None]
    mix = np.tanh(mix / np.abs(mix).max() * 1.15) * 0.85
    w = wave.open(out, 'wb')
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((mix * 32767).astype('<i2').tobytes())
    w.close()


main()
