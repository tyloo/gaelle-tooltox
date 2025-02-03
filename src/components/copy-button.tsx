import { useState } from 'react'

import { Check, Copy } from 'lucide-react'

import { Button } from '@/components/ui/button'

interface CopyButtonProps {
  value: string | number
  className?: string
}

export function CopyButton({ value, className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(value.toString())

      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy value:', err)
    }
  }

  return (
    <Button variant='ghost' size='xs' className={className} onClick={copyToClipboard}>
      {copied ? <Check className='h-4 w-4' /> : <Copy className='h-4 w-4' />}
    </Button>
  )
}
