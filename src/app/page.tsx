import { DogCard } from '@/components/dog-card'
import { JokeCard } from '@/components/joke-card'
import { Suspense } from 'react'

export default function Home() {
  return (
    <div className='flex flex-col items-center justify-center gap-4 h-[calc(100vh_-_64px)] p-2'>
      <Suspense fallback={'Loading...'}>
        <JokeCard />
        <DogCard />
      </Suspense>
    </div>
  )
}
