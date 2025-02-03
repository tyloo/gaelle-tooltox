'use client'

import { CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TimerHeaderProps } from '@/lib/types'
import { cn } from '@/lib/utils'

export function TimerHeader({ timerType, onTimerTypeChange }: TimerHeaderProps) {
  return (
    <CardHeader className='flex flex-row items-center justify-between space-y-0 p-0 pb-4'>
      <CardTitle className='text-2xl font-bold'>Timer</CardTitle>
      <Select value={timerType} onValueChange={onTimerTypeChange}>
        <SelectTrigger className='w-[210px]'>
          <SelectValue
            placeholder='Select timer type'
            className={cn('font-mono', {
              'text-emerald-600': timerType === 'gwen',
              'text-blue-600': timerType === 'smartback',
              'text-purple-600': timerType === 'jb'
            })}
          />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='gwen' className='text-emerald-600 hover:text-emerald-600'>
            Administratif Gwen
          </SelectItem>
          <SelectItem value='smartback' className='text-blue-600 hover:text-blue-600'>
            Administratif Smartback
          </SelectItem>
          <SelectItem value='jb' className='text-purple-600 hover:text-purple-600'>
            Administratif JB
          </SelectItem>
        </SelectContent>
      </Select>
    </CardHeader>
  )
}
