const MARKER = Symbol.for('alpine-cut.todo')

export type Todo = { readonly [MARKER]: true; readonly hinweis: string }

/** Ein Wert, der noch nicht vom Salon geliefert wurde. */
export type Offen<T> = T | Todo

const gesammelt: string[] = []

/** Markiert eine offene Inhaltsstelle. Erfindet nichts, meldet sich im Build. */
export function todo(hinweis: string): Todo {
  gesammelt.push(hinweis)
  return { [MARKER]: true, hinweis }
}

export function istOffen<T>(wert: Offen<T>): wert is Todo {
  return typeof wert === 'object' && wert !== null && MARKER in wert
}

export function offeneHinweise(): readonly string[] {
  return gesammelt
}
