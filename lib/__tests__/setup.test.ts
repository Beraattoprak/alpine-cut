import { describe, expect, it } from 'vitest'
import { cn } from '@/lib/utils'

describe('Projektgrundgerüst', () => {
  it('löst den @-Alias auf und lädt die shadcn-Hilfsfunktion', () => {
    expect(cn('a', false && 'b', 'c')).toBe('a c')
  })
})
