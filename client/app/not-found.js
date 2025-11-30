import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-2">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-gray-500 mb-8">The page you're looking for doesn't exist.</p>
      </div>
      <Link href="/">
        <Button>Go Back Home</Button>
      </Link>
    </div>
  )
}
