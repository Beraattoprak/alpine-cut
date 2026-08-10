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
    <div className="mb-14 border-b border-line pb-6">
      <p className="label flex items-baseline gap-4">
        <span className="text-fg">{nummer}</span>
        <span>{eyebrow}</span>
      </p>
      <h2 id={`${id}-titel`} className="mt-5 uppercase">
        {titel}
      </h2>
    </div>
  )
}
