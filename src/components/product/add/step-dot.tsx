export default function StepDot({
  state,
}: {
  state: 'done' | 'active' | 'idle'
}) {
  if (state === 'done')
    return (
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-foreground">
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path
            d="M2 5l2.5 2.5L8 3"
            stroke="white"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    )
  if (state === 'active')
    return (
      <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-foreground bg-background">
        <span className="h-2 w-2 rounded-full bg-foreground" />
      </span>
    )
  return (
    <span className="flex h-5 w-5 items-center justify-center rounded-full border border-border bg-background">
      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
    </span>
  )
}
