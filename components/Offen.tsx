import type { ReactNode } from 'react'
import { istOffen, type Offen as OffenTyp } from '@/content/todo'

export function TodoMarker({ hinweis }: { hinweis: string }) {
  return (
    <span role="note" className="todo-marker" data-todo>
      TODO: {hinweis}
    </span>
  )
}

/**
 * Rendert den Inhalt, sobald er vorliegt — sonst einen sichtbaren TODO-Balken.
 * Erfindet unter keinen Umständen einen Ersatzwert.
 */
export function Offen<T>({
  wert,
  children,
}: {
  wert: OffenTyp<T>
  children: (wert: T) => ReactNode
}) {
  if (istOffen(wert)) return <TodoMarker hinweis={wert.hinweis} />
  return <>{children(wert)}</>
}
