import { GRADE_META } from '../../config'
import type { FinenessGrade } from '../../types/saltfine'

export interface GradeBadgeProps {
  grade: FinenessGrade | string
  className?: string
}

export default function GradeBadge({ grade, className = '' }: GradeBadgeProps) {
  const meta = GRADE_META[grade as FinenessGrade]
  if (!meta) return <span className={className}>{grade}</span>

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[0.8rem] font-semibold ${meta.badge} ${className}`}
    >
      {grade}
    </span>
  )
}
