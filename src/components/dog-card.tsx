'use client'

import { RefreshCw } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader } from './ui/card'

type DogImage = {
  url: string
}

export function DogCard() {
  const [dogImage, setDogImage] = useState<DogImage | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchDogImage = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch('https://random.dog/woof.json')
      const data = await response.json()
      setDogImage(data)
    } catch (error) {
      console.error('Error fetching dog image:', error)
      setError('Failed to fetch dog image')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDogImage()
  }, [])

  return (
    <Card className='w-full'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 p-3'>
        <h3 className='font-bold text-lg'>Random Dog</h3>
        <Button variant='ghost' size='icon' onClick={fetchDogImage} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      <CardContent className='p-3 pt-0'>
        {error ? (
          <div className='flex items-center justify-center h-16'>
            <p className='text-red-500'>{error}</p>
          </div>
        ) : isLoading ? (
          <div className='flex items-center justify-center h-16'>
            <p className='text-muted-foreground'>Loading...</p>
          </div>
        ) : dogImage ? (
          <div className='relative aspect-video'>
            {dogImage.url.endsWith('.mp4') ? (
              <video src={dogImage.url} autoPlay controls loop className='rounded object-contain w-full h-full' />
            ) : (
              <Image src={dogImage.url} alt='Random dog' className='rounded object-cover w-full h-full' fill />
            )}
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
