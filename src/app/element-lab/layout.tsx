import Link from 'next/link'

export default function ElementLabLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container mx-auto px-4 flex">
      <aside className="w-64 bg-gray-100 p-4">
        <h2 className="text-xl font-bold mb-4">Elements</h2>
        <nav>
          <ul className="space-y-2">
            <li><Link href="/element-lab/button" className="text-blue-500 hover:underline">Button</Link></li>
            <li><Link href="/element-lab/article" className="text-blue-500 hover:underline">Article</Link></li>
            <li><Link href="/element-lab/card" className="text-blue-500 hover:underline">Card</Link></li>
            <li><Link href="/element-lab/download-button" className="text-blue-500 hover:underline">Download Button</Link></li>
            <li><Link href="/element-lab/toggle" className="text-blue-500 hover:underline">Toggle</Link></li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-4">
        {children}
      </main>
    </div>
  )
}