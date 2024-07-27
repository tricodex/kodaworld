import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Element Lab - Kodaworld',
  description: 'Experiment with and customize various HTML elements using CSS',
}

export default function ElementLabLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6">Element Lab</h1>
      {children}
    </div>
  )
}
