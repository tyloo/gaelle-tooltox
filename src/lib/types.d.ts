export type TimerType = 'gwen' | 'smartback' | 'jb'

export type Session = {
  id: string
  type: TimerType
  startTime: Date
  endTime: Date
  duration: number
}

export interface SessionFormProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (session: Session) => void
  initialSession?: Session | null
  triggerButton: React.ReactNode
}

export interface SessionHistoryProps {
  sessions: Session[]
  groupedSessions: Record<TimerType, { sessions: Session[]; totalDuration: number }>
  formatTime: (timeInSeconds: number) => string
  onRemoveSession: (sessionId: string) => void
}

export interface TimerControlsProps {
  time: number
  isRunning: boolean
  formatTime: (timeInSeconds: number) => string
  onStart: () => void
  onStop: () => void
  onReset: () => void
}

export interface TimerHeaderProps {
  timerType: TimerType
  onTimerTypeChange: (value: TimerType) => void
}
