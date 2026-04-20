interface LayoutProps {
  children: React.ReactNode
}

export default function Layouts({ children }: LayoutProps) {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="min-h-screen flex-1 rounded-xl bg-muted/50 md:min-h-min p-5">
        {children}
      </div>
    </div>
  )
}
