import { useState } from 'react'
import { Star, ThumbsUp, User, CheckCircle } from 'lucide-react'
import { useMemberStore } from '@/stores/memberStore'
import { ScrollReveal } from './ScrollReveal'
import type { Locale } from '@/types'

interface ReviewSectionProps {
  productId: string
  productName: string
  locale: Locale
}

export function ReviewSection({ productId, productName, locale }: ReviewSectionProps) {
  const { addReview, getProductReviews, getAverageRating, markHelpful, customer } = useMemberStore()
  const productReviews = getProductReviews(productId)
  const avgRating = getAverageRating(productId)
  const isAr = locale === 'ar'

  const [showForm, setShowForm] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    if (rating === 0 || !body.trim()) return
    addReview({
      productId,
      customerName: customer?.name || (isAr ? 'زبون' : 'Guest'),
      customerId: customer?.id || 'guest',
      rating,
      title: title || (isAr ? 'مراجعة' : 'Review'),
      body,
      verified: !!customer,
      helpful: 0,
    })
    setSubmitted(true)
    setTimeout(() => {
      setShowForm(false)
      setSubmitted(false)
      setRating(0)
      setTitle('')
      setBody('')
    }, 2000)
  }

  const starCounts = [5, 4, 3, 2, 1].map(stars => ({
    stars,
    count: productReviews.filter(r => r.rating === stars).length,
  }))
  const maxCount = Math.max(...starCounts.map(s => s.count), 1)

  return (
    <ScrollReveal className="mt-12 border-t border-border-beige pt-8">
      <h3 className="font-display text-xl text-dark-teal mb-6">
        {isAr ? 'التقييمات' : 'Customer Reviews'}
        {productReviews.length > 0 && (
          <span className="text-sm font-normal text-muted-teal ml-2">({productReviews.length})</span>
        )}
      </h3>

      {productReviews.length === 0 ? (
        <div className="text-center py-8 bg-cream rounded-xl">
          <Star size={32} className="text-border-beige mx-auto mb-2" />
          <p className="text-sm text-muted-teal mb-1">
            {isAr ? 'لا توجد تقييمات بعد' : 'No reviews yet'}
          </p>
          <p className="text-xs text-muted-teal">
            {isAr ? 'كني أول من يقيّم هذا المنتج' : 'Be the first to review this product'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Rating Summary */}
          <div className="md:col-span-1">
            <div className="text-center mb-4">
              <p className="font-display text-4xl text-dark-teal">{avgRating.toFixed(1)}</p>
              <div className="flex items-center justify-center gap-0.5 my-1">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} size={16} className={s <= Math.round(avgRating) ? 'fill-amber-400 text-amber-400' : 'text-border-beige'} />
                ))}
              </div>
              <p className="text-xs text-muted-teal">{isAr ? 'بناءً على' : 'Based on'} {productReviews.length} {isAr ? 'تقييم' : 'review'}{productReviews.length > 1 ? 's' : ''}</p>
            </div>
            <div className="space-y-1">
              {starCounts.map(({ stars, count }) => (
                <div key={stars} className="flex items-center gap-2">
                  <span className="text-xs text-muted-teal w-3">{stars}</span>
                  <Star size={10} className="text-amber-400 fill-amber-400" />
                  <div className="flex-1 h-1.5 bg-cream rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: `${(count / maxCount) * 100}%` }} />
                  </div>
                  <span className="text-[10px] text-muted-teal w-4 text-right">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Review List */}
          <div className="md:col-span-2 space-y-4">
            {productReviews.slice().reverse().slice(0, 5).map(review => (
              <div key={review.id} className="border border-border-beige rounded-xl p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-cream flex items-center justify-center">
                      <User size={14} className="text-muted-teal" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-dark-teal">{review.customerName}</p>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map(s => (
                          <Star key={s} size={10} className={s <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-border-beige'} />
                        ))}
                        {review.verified && (
                          <span className="text-[10px] text-sage-green flex items-center gap-0.5 ml-1">
                            <CheckCircle size={9} /> {isAr ? 'مشتري' : 'Verified'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] text-muted-teal">{new Date(review.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-sm font-medium text-dark-teal mb-1">{review.title}</p>
                <p className="text-sm text-muted-teal mb-3">{review.body}</p>
                <button
                  onClick={() => markHelpful(review.id)}
                  className="flex items-center gap-1 text-xs text-muted-teal hover:text-dark-teal transition-colors"
                >
                  <ThumbsUp size={12} /> {isAr ? 'مفيد' : 'Helpful'} ({review.helpful})
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Write Review */}
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="w-full py-3 border-2 border-dashed border-border-beige rounded-xl text-sm text-dark-teal font-medium hover:bg-cream hover:border-beige transition-colors"
        >
          {isAr ? 'اكتبي تقييم' : 'Write a Review'}
        </button>
      ) : submitted ? (
        <div className="bg-sage-green/10 border border-sage-green/30 rounded-xl p-4 text-center">
          <CheckCircle size={24} className="text-sage-green mx-auto mb-1" />
          <p className="text-sm text-sage-green font-medium">
            {isAr ? 'شكراً لتقييمك!' : 'Thank you for your review!'}
          </p>
        </div>
      ) : (
        <div className="bg-white border border-border-beige rounded-xl p-5">
          <h4 className="font-medium text-dark-teal text-sm mb-3">
            {isAr ? 'تقييم' : 'Review'} {productName}
          </h4>
          {/* Star Rating */}
          <div className="flex items-center gap-1 mb-3">
            {[1, 2, 3, 4, 5].map(s => (
              <button
                key={s}
                onMouseEnter={() => setHoverRating(s)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(s)}
                className="p-0.5"
              >
                <Star
                  size={24}
                  className={s <= (hoverRating || rating) ? 'fill-amber-400 text-amber-400 transition-colors' : 'text-border-beige transition-colors'}
                />
              </button>
            ))}
            <span className="text-xs text-muted-teal ml-2">
              {rating > 0 ? (isAr ? ['سيء جداً', 'سيء', 'مقبول', 'جيد', 'ممتاز'][rating - 1] : ['Very Poor', 'Poor', 'Average', 'Good', 'Excellent'][rating - 1]) : ''}
            </span>
          </div>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder={isAr ? 'عنوان التقييم (اختياري)' : 'Review title (optional)'}
            className="w-full h-10 border border-border-beige rounded-lg px-3 text-sm mb-3 outline-none focus:border-beige"
          />
          <textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            placeholder={isAr ? 'شاركي تجربتك مع هذا المنتج...' : 'Share your experience with this product...'}
            rows={3}
            className="w-full border border-border-beige rounded-lg px-3 py-2 text-sm mb-3 outline-none focus:border-beige resize-y"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              disabled={rating === 0 || !body.trim()}
              className="px-4 py-2 bg-beige text-dark-teal rounded-lg text-sm font-medium hover:bg-beige-dark transition-colors disabled:opacity-40"
            >
              {isAr ? 'نشر التقييم' : 'Submit Review'}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-sm text-muted-teal hover:bg-cream rounded-lg"
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>
          </div>
        </div>
      )}
    </ScrollReveal>
  )
}
