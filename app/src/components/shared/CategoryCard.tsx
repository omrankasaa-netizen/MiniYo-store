import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import type { Category, Locale } from '@/types'

interface CategoryCardProps {
  category: Category
  locale: Locale
  index?: number
}

export function CategoryCard({ category, locale, index = 0 }: CategoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link to={`/shop?category=${category.slug}`} className="block group">
        <div className="relative aspect-[4/5] rounded-[18px] overflow-hidden shadow-sm">
          <img
            src={category.image || '/images/categories/bodysuits.jpg'}
            alt={locale === 'ar' ? category.nameAr : category.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Softer gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-dark-teal/50 via-transparent to-transparent" />

          {/* Category name + arrow */}
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
            <h3 className="font-display text-lg text-white drop-shadow-md leading-tight">
              {locale === 'ar' ? category.nameAr : category.name}
            </h3>
            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
              <ArrowRight size={14} className="text-white" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
