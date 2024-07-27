import Link from 'next/link'

export default function ElementLabPage() {
  return (
    <div>
      <p className="mb-4">Select an element to customize:</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link href="/element-lab/button" className="p-4 border rounded-lg hover:bg-gray-100">
          Button
        </Link>
        <Link href="/element-lab/article" className="p-4 border rounded-lg hover:bg-gray-100">
          Article
        </Link>
        <Link href="/element-lab/card" className="p-4 border rounded-lg hover:bg-gray-100">
          Card
        </Link>
        <Link href="/element-lab/download-button" className="p-4 border rounded-lg hover:bg-gray-100">
          Download Button
        </Link>
        <Link href="/element-lab/toggle" className="p-4 border rounded-lg hover:bg-gray-100">
          Toggle
        </Link>
      </div>
    </div>
  )
}
