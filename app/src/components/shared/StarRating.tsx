import { Star } from 'lucide-react'

interface StarRatingProps {
  rating: number
  size?: number
  interactive?: boolean
  onChange?: (rating: number) => void
}

export function StarRating({ rating, size = 16, interactive = false, onChange }: StarRatingProps) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= Math.floor(rating)
        const half = !filled && star === Math.ceil(rating) && rating % 1 !== 0
        return (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange?.(star)}
            className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
          >
            <Star
              size={size}
              className={`${
                filled || half
                  ? 'fill-sage-green text-sage-green'
                  : 'fill-transparent text-border-beige'
              }`}
              fill={filled ? '#C9A55A' : half ? 'url(#half)' : 'transparent'}
            />
            {half && (
              <svg width="0" height="0">
                <defs>
                  <linearGradient id="half">
                    <stop offset="50%" stopColor="#C9A55A" />
                    <stop offset="50%" stopColor="transparent" />
                  </linearGradient>
                </defs>
              </svg>
            )}
          </button>
        )
      })}
    </div>
  )
}
