import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useWordTyping, type WordTypingResumeSnapshot } from './useWordTyping'

interface KeyMods {
  ctrl?: boolean
  alt?: boolean
  meta?: boolean
}

function makeKey(key: string, mods: KeyMods = {}): KeyboardEvent {
  return {
    key,
    ctrlKey: mods.ctrl ?? false,
    altKey: mods.alt ?? false,
    metaKey: mods.meta ?? false,
    preventDefault: () => {},
  } as KeyboardEvent
}

// Word arrays must be stable references: the engine re-initialises whenever the
// words identity changes (in the app this is guaranteed by useMemo).
const WORDS_HI = ['hi']
const WORDS_HI_YO = ['hi', 'yo']
const WORDS_AAA = ['aaa']
const WORDS_SENTENCE = ['a b']

/**
 * Types the given characters through the hook. The first key press only starts
 * the session (the engine swallows it), so a leading dummy press is required
 * before the first real character lands.
 */
function typeChars(result: { current: ReturnType<typeof useWordTyping> }, chars: string[]) {
  for (const char of chars) {
    act(() => {
      result.current.handleKeyDown(makeKey(char))
    })
  }
}

beforeEach(() => {
  vi.useFakeTimers({
    toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'Date'],
  })
})

afterEach(() => {
  vi.useRealTimers()
})

describe('useWordTyping', () => {
  it('starts the session with the first keystroke and swallows it', () => {
    const { result } = renderHook(() => useWordTyping({ words: WORDS_HI }))

    let accepted: boolean | undefined
    act(() => {
      accepted = result.current.handleKeyDown(makeKey('h'))
    })

    expect(accepted).toBe(false)
    expect(result.current.isTyping).toBe(true)
    expect(result.current.wordState.inputWord).toBe('')

    act(() => {
      accepted = result.current.handleKeyDown(makeKey('h'))
    })
    expect(accepted).toBe(true)
    expect(result.current.wordState.inputWord).toBe('h')
  })

  it('advances to the next word after completing the current one', () => {
    const onWordComplete = vi.fn()
    const { result } = renderHook(() =>
      useWordTyping({ words: WORDS_HI_YO, onWordComplete }),
    )

    typeChars(result, ['s', 'h', 'i'])

    expect(result.current.wordIndex).toBe(1)
    expect(result.current.wordState.displayWord).toBe('yo')
    expect(onWordComplete).toHaveBeenCalledWith(0, 0)
  })

  it('finishes the chapter after the last word and reports stats', () => {
    const onChapterFinish = vi.fn()
    const { result } = renderHook(() =>
      useWordTyping({ words: WORDS_HI_YO, onChapterFinish }),
    )

    typeChars(result, ['s', 'h', 'i', 'y', 'o'])

    expect(result.current.isFinished).toBe(true)
    expect(onChapterFinish).toHaveBeenCalledTimes(1)

    const stats = result.current.getStats()
    expect(stats.wordCount).toBe(2)
    expect(stats.totalCorrect).toBe(4)
    expect(stats.totalWrong).toBe(0)
    expect(stats.accuracy).toBe(100)
  })

  it('marks wrong input, resets after the shake delay and records word errors', () => {
    const { result } = renderHook(() => useWordTyping({ words: WORDS_HI_YO }))

    typeChars(result, ['s', 'h'])

    let accepted: boolean | undefined
    act(() => {
      accepted = result.current.handleKeyDown(makeKey('z'))
    })

    expect(accepted).toBe(true)
    expect(result.current.wordState.hasWrong).toBe(true)

    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(result.current.wordState.hasWrong).toBe(false)
    expect(result.current.wordState.inputWord).toBe('')

    typeChars(result, ['h', 'i', 'y', 'o'])

    const items = [
      { id: 'w1', content: 'hi', kind: 'word' as const },
      { id: 'w2', content: 'yo', kind: 'word' as const },
    ]
    expect(result.current.getErrorItems(items)).toEqual([
      { content_type: 'word', content_id: 'w1', error_count: 1, avg_time_ms: 0 },
    ])
  })

  it('ignores backspace, enter, modifiers and multi-length keys', () => {
    const { result } = renderHook(() => useWordTyping({ words: WORDS_HI }))

    typeChars(result, ['s', 'h'])

    const ignored = [
      makeKey('Backspace'),
      makeKey('Enter'),
      makeKey('Shift'),
      makeKey('ArrowLeft'),
      makeKey('c', { ctrl: true }),
      makeKey('c', { meta: true }),
    ]

    for (const event of ignored) {
      let accepted: boolean | undefined
      act(() => {
        accepted = result.current.handleKeyDown(event)
      })
      expect(accepted, `key ${event.key}`).toBe(false)
      // The engine has no editing support: input must stay intact.
      expect(result.current.wordState.inputWord, `key ${event.key}`).toBe('h')
    }
  })

  it('tracks per-key stats with lowercased keys and intervals', () => {
    const { result } = renderHook(() => useWordTyping({ words: WORDS_AAA }))

    act(() => {
      result.current.handleKeyDown(makeKey('a'))
    })
    act(() => {
      result.current.handleKeyDown(makeKey('a'))
    })
    act(() => {
      vi.advanceTimersByTime(120)
    })
    act(() => {
      result.current.handleKeyDown(makeKey('a'))
    })

    // Wrong-case press against a lowercase word counts as an error on 'h'.
    act(() => {
      result.current.handleKeyDown(makeKey('H'))
    })

    const stats = Object.fromEntries(
      result.current.getKeystrokeStats().map((stat) => [stat.key_char, stat]),
    )

    expect(stats['a']).toMatchObject({ hit_count: 2, error_count: 0, avg_interval_ms: 120 })
    expect(stats['h']).toMatchObject({ hit_count: 1, error_count: 1 })
  })

  it('counts wpm from completed words and elapsed timer seconds', () => {
    const { result } = renderHook(() => useWordTyping({ words: WORDS_HI_YO }))

    typeChars(result, ['s', 'h', 'i'])

    act(() => {
      vi.advanceTimersByTime(60_000)
    })

    typeChars(result, ['y', 'o'])

    const stats = result.current.getStats()
    expect(stats.time).toBeGreaterThanOrEqual(60)
    expect(stats.wpm).toBe(2)
  })

  it('round-trips a resume snapshot into a fresh session', () => {
    const first = renderHook(() => useWordTyping({ words: WORDS_HI_YO }))

    typeChars(first.result, ['s', 'h', 'i'])
    act(() => {
      first.result.current.handleKeyDown(makeKey('z'))
    })

    let snapshot: WordTypingResumeSnapshot | undefined
    act(() => {
      snapshot = first.result.current.getResumeSnapshot()
    })

    const initialSnapshot = snapshot as WordTypingResumeSnapshot
    const second = renderHook(() =>
      useWordTyping({ words: WORDS_HI_YO, initialSnapshot }),
    )

    expect(second.result.current.wordIndex).toBe(1)
    expect(second.result.current.wordState.displayWord).toBe('yo')
    expect(second.result.current.getStats()).toMatchObject({
      totalCorrect: 2,
      totalWrong: 1,
      wordCount: 1,
    })

    const keyStats = second.result.current.getKeystrokeStats()
    expect(keyStats.find((stat) => stat.key_char === 'z')).toMatchObject({ hit_count: 1, error_count: 1 })
  })

  it('supports spaces inside sentence content', () => {
    const { result } = renderHook(() => useWordTyping({ words: WORDS_SENTENCE }))

    typeChars(result, ['s', 'a', ' ', 'b'])

    expect(result.current.isFinished).toBe(true)
    expect(result.current.getStats().totalCorrect).toBe(3)
  })

  it('resets all counters and returns to the first word', () => {
    const { result } = renderHook(() => useWordTyping({ words: WORDS_HI_YO }))

    typeChars(result, ['s', 'h', 'i', 'z'])

    act(() => {
      result.current.reset()
    })

    expect(result.current.wordIndex).toBe(0)
    expect(result.current.isFinished).toBe(false)
    expect(result.current.getStats()).toMatchObject({
      totalCorrect: 0,
      totalWrong: 0,
      wordCount: 0,
    })
    expect(result.current.getKeystrokeStats()).toEqual([])
    expect(result.current.wordState.displayWord).toBe('hi')
  })
})
