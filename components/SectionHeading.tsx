export function SectionHeading({
  id,
  nummer,
  eyebrow,
  titel,
}: {
  id: string
  nummer: string
  eyebrow: string
  titel: string
}) {
  return (
    <div className="mb-12 flex flex-col gap-3">
      <p className="eyebrow">
        <span className="text-gold-soft">{nummer}</span>
        <span className="ml-2">{eyebrow}</span>
      </p>
      <h2 id={`${id}-titel`}>{titel}</h2>
    </div>
  )
}
