'use client'

import { RefreshCw } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader } from './ui/card'

type Joke = {
  blague: string
  reponse: string
}

export function JokeCard() {
  const [joke, setJoke] = useState<Joke | null>(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const fetchJoke = async () => {
    try {
      setIsLoading(true)
      setShowAnswer(false)
      const response = await fetch('https://blague-api.vercel.app/api?mode=limit')
      const data = await response.json()
      setJoke(data)
    } catch (error) {
      console.error('Error fetching joke:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchJoke()
  }, [])

  return (
    <Card className='w-full'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 p-3'>
        <h3 className='font-bold text-lg'>Blague du jour</h3>
        <Button variant='ghost' size='icon' onClick={fetchJoke} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      <CardContent className='p-3 pt-0'>
        {joke ? (
          <div className='space-y-2'>
            <p className='text-lg'>{joke.blague}</p>
            <div className='pt-2'>
              <Button variant='outline' onClick={() => setShowAnswer(!showAnswer)} className='w-full'>
                {showAnswer ? 'Cacher la réponse' : 'Voir la réponse'}
              </Button>
              {showAnswer && <p className='mt-2 text-lg font-medium text-muted-foreground'>{joke.reponse}</p>}
            </div>
          </div>
        ) : (
          <div className='flex items-center justify-center h-16'>
            <p className='text-muted-foreground'>Loading...</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
