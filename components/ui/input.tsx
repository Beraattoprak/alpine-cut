import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        // focus-visible:ring-* und outline-none entfernt — siehe Begruendung in button.tsx.
        // transition ohne outline-color: der Fokus-Ring soll sofort stehen,
        // nicht einblenden. transition-colors wuerde ihn mit animieren.
        "h-11 w-full min-w-0 rounded-lg border border-input bg-transparent px-3 py-1 text-base transition-[color,background-color,border-color] file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Input }
