
export default function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-12 text-center">
      <h2 className="font-brush text-5xl text-neutral-800">
        {children}
      </h2>
      <div className="mx-auto mt-3 h-1 w-24 rounded-full bg-gold" />
    </div>
  )
}


