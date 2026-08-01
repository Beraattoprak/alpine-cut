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
        {/* --gold, nicht --gold-soft: die Nummer ist Text und braucht 4,5:1. */}
        <span className="text-gold">{nummer}</span>
        <span className="ml-2">{eyebrow}</span>
      </p>
      <h2 id={`${id}-titel`}>{titel}</h2>
    </div>
  )
}
