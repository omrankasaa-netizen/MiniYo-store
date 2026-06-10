import type { Product, Category } from '@/types'

export const categories: Category[] = [
  { id: '1', name: 'Apparel', nameAr: 'ملابس', slug: 'apparel', description: null, descriptionAr: null, image: null, sortOrder: 1, isActive: true },
  { id: '2', name: 'Set', nameAr: 'طقم', slug: 'sets', description: null, descriptionAr: null, image: null, sortOrder: 2, isActive: true },
  { id: '3', name: 'Accessories', nameAr: 'إكسسوارات', slug: 'accessories', description: null, descriptionAr: null, image: null, sortOrder: 3, isActive: true },
  { id: '4', name: 'Basics', nameAr: 'أساسيات', slug: 'basics', description: null, descriptionAr: null, image: null, sortOrder: 4, isActive: true },
  { id: '5', name: 'Sleepwear', nameAr: 'ملابس نوم', slug: 'sleepwear', description: null, descriptionAr: null, image: null, sortOrder: 5, isActive: true }
]

export const allProducts: Product[] = [
{
    id: '1', name: 'Footed Overall', nameAr: 'أوفرول برجلين', slug: 'footed-overall', 
    description: 'Adorable everyday wear that keeps your little one comfy from morning to nap time. A footed overall designed for newborns. Designed for girls. Available in sizes 0-3M, 3-6M, 6-9M — choose the right fit as baby grows. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from', descriptionAr: 'لبس ناعم ومريح يخلّي صغيرك مرتاح من الصبح لوقت النوم. أوفرول برجلين (تولوم) للمواليد الجدد. تصميم للبنات. متوفّر بقياسات 0-3M, 3-6M, 6-9M — اختاري القياس المناسب مع ما يكبر صغيرك. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'Adorable everyday wear that keeps your little one comfy from morning to nap time.', shortDescriptionAr: 'لبس ناعم ومريح يخلّي صغيرك مرتاح من الصبح لوقت النوم.',
    price: 26.99, compareAtPrice: null, currency: 'USD', sku: 'footed-overall', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'girls', ageGroup: 'Newborn',
    categoryId: '1', stockQuantity: 3, rating: 4.5, reviewCount: 0,
    category: categories[0],
    images: [],
    colors: [],
    sizes: [{ id: '1s0', name: '0-3M', nameAr: '0-3M', ageRange: null, sortOrder: 0 }, { id: '1s1', name: '3-6M', nameAr: '3-6M', ageRange: null, sortOrder: 1 }, { id: '1s2', name: '6-9M', nameAr: '6-9M', ageRange: null, sortOrder: 2 }]
  },
{
    id: '2', name: 'Footed Overall With Bonnet', nameAr: 'أوفرول برجلين', slug: 'footed-overall-with-bonnet', 
    description: 'Adorable everyday wear that keeps your little one comfy from morning to nap time. A footed overall designed for newborns. Designed for girls. Available in sizes 0-3M, 3-6M, 6-9M — choose the right fit as baby grows. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from', descriptionAr: 'لبس ناعم ومريح يخلّي صغيرك مرتاح من الصبح لوقت النوم. أوفرول برجلين (تولوم) للمواليد الجدد. تصميم للبنات. متوفّر بقياسات 0-3M, 3-6M, 6-9M — اختاري القياس المناسب مع ما يكبر صغيرك. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'Adorable everyday wear that keeps your little one comfy from morning to nap time.', shortDescriptionAr: 'لبس ناعم ومريح يخلّي صغيرك مرتاح من الصبح لوقت النوم.',
    price: 24.99, compareAtPrice: null, currency: 'USD', sku: 'footed-overall-with-bonnet', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'girls', ageGroup: 'Newborn',
    categoryId: '1', stockQuantity: 4, rating: 4.5, reviewCount: 0,
    category: categories[0],
    images: [],
    colors: [],
    sizes: [{ id: '2s0', name: '0-3M', nameAr: '0-3M', ageRange: null, sortOrder: 0 }, { id: '2s1', name: '3-6M', nameAr: '3-6M', ageRange: null, sortOrder: 1 }, { id: '2s2', name: '6-9M', nameAr: '6-9M', ageRange: null, sortOrder: 2 }]
  },
{
    id: '3', name: '5-Piece Newborn Gift Set', nameAr: 'طقم ٥ قطع للمولود', slug: '5-piece-newborn-gift-set', 
    description: 'A complete, ready-to-gift set — beautifully coordinated so you don\'t have to mix and match. This 5-piece newborn set comes as a coordinated set — great value and an easy gift. Designed for girls. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'طقم كامل ومنسّق، جاهز كهدية حلوة وما بدّك تجمّع القطع لحالك. هيدا طقم ٥ قطع للمولود منسّق، قيمة حلوة وهدية سهلة. تصميم للبنات. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'A complete, ready-to-gift set — beautifully coordinated so you don\'t have to mix and match.', shortDescriptionAr: 'طقم كامل ومنسّق، جاهز كهدية حلوة وما بدّك تجمّع القطع لحالك.',
    price: 43.99, compareAtPrice: null, currency: 'USD', sku: '5-piece-newborn-gift-set', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'girls', ageGroup: 'Newborn',
    categoryId: '2', stockQuantity: 3, rating: 4.5, reviewCount: 0,
    category: categories[1],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '4', name: '5-Piece Newborn Set', nameAr: 'طقم ٥ قطع للمولود', slug: '5-piece-newborn-set', 
    description: 'A complete, ready-to-gift set — beautifully coordinated so you don\'t have to mix and match. This 5-piece newborn set comes as a coordinated set — great value and an easy gift. Designed for girls. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'طقم كامل ومنسّق، جاهز كهدية حلوة وما بدّك تجمّع القطع لحالك. هيدا طقم ٥ قطع للمولود منسّق، قيمة حلوة وهدية سهلة. تصميم للبنات. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'A complete, ready-to-gift set — beautifully coordinated so you don\'t have to mix and match.', shortDescriptionAr: 'طقم كامل ومنسّق، جاهز كهدية حلوة وما بدّك تجمّع القطع لحالك.',
    price: 40.99, compareAtPrice: null, currency: 'USD', sku: '5-piece-newborn-set', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'girls', ageGroup: 'Newborn',
    categoryId: '2', stockQuantity: 3, rating: 4.5, reviewCount: 0,
    category: categories[1],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '5', name: '5-Piece Newborn Set', nameAr: 'طقم ٥ قطع للمولود', slug: '5-piece-newborn-set-2', 
    description: 'A complete, ready-to-gift set — beautifully coordinated so you don\'t have to mix and match. This 5-piece newborn set comes as a coordinated set — great value and an easy gift. Designed for girls. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'طقم كامل ومنسّق، جاهز كهدية حلوة وما بدّك تجمّع القطع لحالك. هيدا طقم ٥ قطع للمولود منسّق، قيمة حلوة وهدية سهلة. تصميم للبنات. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'A complete, ready-to-gift set — beautifully coordinated so you don\'t have to mix and match.', shortDescriptionAr: 'طقم كامل ومنسّق، جاهز كهدية حلوة وما بدّك تجمّع القطع لحالك.',
    price: 35.99, compareAtPrice: null, currency: 'USD', sku: '5-piece-newborn-set-2', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'girls', ageGroup: 'Newborn',
    categoryId: '2', stockQuantity: 3, rating: 4.5, reviewCount: 0,
    category: categories[1],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '6', name: 'Streamlined Salopette Set', nameAr: 'طقم سالوبيت', slug: 'streamlined-salopette-set', 
    description: 'Adorable everyday wear that keeps your little one comfy from morning to nap time. A salopette set designed for babies. Unisex design suits any little one. Available in sizes 3-6M, 6-9M, 9-12M — choose the right fit as baby grows. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle.', descriptionAr: 'لبس ناعم ومريح يخلّي صغيرك مرتاح من الصبح لوقت النوم. هيدا طقم سالوبيت منسّق، قيمة حلوة وهدية سهلة. تصميم مناسب للبنت والصبي. متوفّر بقياسات 3-6M, 6-9M, 9-12M — اختاري القياس المناسب مع ما يكبر صغيرك. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'Adorable everyday wear that keeps your little one comfy from morning to nap time.', shortDescriptionAr: 'لبس ناعم ومريح يخلّي صغيرك مرتاح من الصبح لوقت النوم.',
    price: 33.99, compareAtPrice: null, currency: 'USD', sku: 'streamlined-salopette-set', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'unisex', ageGroup: 'Baby',
    categoryId: '1', stockQuantity: 3, rating: 4.5, reviewCount: 0,
    category: categories[0],
    images: [],
    colors: [],
    sizes: [{ id: '6s0', name: '3-6M', nameAr: '3-6M', ageRange: null, sortOrder: 0 }, { id: '6s1', name: '6-9M', nameAr: '6-9M', ageRange: null, sortOrder: 1 }, { id: '6s2', name: '9-12M', nameAr: '9-12M', ageRange: null, sortOrder: 2 }]
  },
{
    id: '7', name: 'Penolope Footed Overall', nameAr: 'أوفرول برجلين', slug: 'penolope-footed-overall', 
    description: 'Adorable everyday wear that keeps your little one comfy from morning to nap time. A footed overall designed for babies. Unisex design suits any little one. Available in sizes 12-18M, 18-24M, 6-9M, 9-12M — choose the right fit as baby grows. Soft, breathable cotton-blend fabric. Machine wash cold, ge', descriptionAr: 'لبس ناعم ومريح يخلّي صغيرك مرتاح من الصبح لوقت النوم. أوفرول برجلين (تولوم) للبيبيهات. تصميم مناسب للبنت والصبي. متوفّر بقياسات 12-18M, 18-24M, 6-9M, 9-12M — اختاري القياس المناسب مع ما يكبر صغيرك. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'Adorable everyday wear that keeps your little one comfy from morning to nap time.', shortDescriptionAr: 'لبس ناعم ومريح يخلّي صغيرك مرتاح من الصبح لوقت النوم.',
    price: 26.99, compareAtPrice: null, currency: 'USD', sku: 'penolope-footed-overall', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'unisex', ageGroup: 'Baby',
    categoryId: '1', stockQuantity: 5, rating: 4.5, reviewCount: 0,
    category: categories[0],
    images: [],
    colors: [],
    sizes: [{ id: '7s0', name: '6-9M', nameAr: '6-9M', ageRange: null, sortOrder: 0 }, { id: '7s1', name: '9-12M', nameAr: '9-12M', ageRange: null, sortOrder: 1 }, { id: '7s2', name: '12-18M', nameAr: '12-18M', ageRange: null, sortOrder: 2 }, { id: '7s3', name: '18-24M', nameAr: '18-24M', ageRange: null, sortOrder: 3 }]
  },
{
    id: '8', name: 'Crispy Flower 2-Piece Set', nameAr: 'طقم قطعتين', slug: 'crispy-flower-2-piece-set', 
    description: 'Adorable everyday wear that keeps your little one comfy from morning to nap time. This 2-piece set comes as a coordinated set — great value and an easy gift. Designed for girls. Available in sizes 0-3M, 3-6M, 6-9M, 9-12M — choose the right fit as baby grows. Soft, breathable cotton-blend fabric. Mac', descriptionAr: 'لبس ناعم ومريح يخلّي صغيرك مرتاح من الصبح لوقت النوم. هيدا طقم قطعتين منسّق، قيمة حلوة وهدية سهلة. تصميم للبنات. متوفّر بقياسات 0-3M, 3-6M, 6-9M, 9-12M — اختاري القياس المناسب مع ما يكبر صغيرك. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'Adorable everyday wear that keeps your little one comfy from morning to nap time.', shortDescriptionAr: 'لبس ناعم ومريح يخلّي صغيرك مرتاح من الصبح لوقت النوم.',
    price: 28.99, compareAtPrice: null, currency: 'USD', sku: 'crispy-flower-2-piece-set', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'girls', ageGroup: 'Baby',
    categoryId: '1', stockQuantity: 4, rating: 4.5, reviewCount: 0,
    category: categories[0],
    images: [],
    colors: [],
    sizes: [{ id: '8s0', name: '0-3M', nameAr: '0-3M', ageRange: null, sortOrder: 0 }, { id: '8s1', name: '3-6M', nameAr: '3-6M', ageRange: null, sortOrder: 1 }, { id: '8s2', name: '6-9M', nameAr: '6-9M', ageRange: null, sortOrder: 2 }, { id: '8s3', name: '9-12M', nameAr: '9-12M', ageRange: null, sortOrder: 3 }]
  },
{
    id: '9', name: 'Newborn 2-Piece Overall Set', nameAr: 'طقم قطعتين', slug: 'newborn-2-piece-overall-set', 
    description: 'Adorable everyday wear that keeps your little one comfy from morning to nap time. This 2-piece set comes as a coordinated set — great value and an easy gift. Designed for boys. Available in sizes 0-3M, 3-6M, 6-9M — choose the right fit as baby grows. Soft, breathable cotton-blend fabric. Machine was', descriptionAr: 'لبس ناعم ومريح يخلّي صغيرك مرتاح من الصبح لوقت النوم. هيدا طقم قطعتين منسّق، قيمة حلوة وهدية سهلة. تصميم للصبيان. متوفّر بقياسات 0-3M, 3-6M, 6-9M — اختاري القياس المناسب مع ما يكبر صغيرك. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'Adorable everyday wear that keeps your little one comfy from morning to nap time.', shortDescriptionAr: 'لبس ناعم ومريح يخلّي صغيرك مرتاح من الصبح لوقت النوم.',
    price: 26.99, compareAtPrice: null, currency: 'USD', sku: 'newborn-2-piece-overall-set', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'boys', ageGroup: 'Newborn',
    categoryId: '1', stockQuantity: 3, rating: 4.5, reviewCount: 0,
    category: categories[0],
    images: [],
    colors: [],
    sizes: [{ id: '9s0', name: '0-3M', nameAr: '0-3M', ageRange: null, sortOrder: 0 }, { id: '9s1', name: '3-6M', nameAr: '3-6M', ageRange: null, sortOrder: 1 }, { id: '9s2', name: '6-9M', nameAr: '6-9M', ageRange: null, sortOrder: 2 }]
  },
{
    id: '10', name: 'Newborn 10-Piece Boy Set', nameAr: 'طقم ١٠ قطع', slug: 'newborn-10-piece-boy-set', 
    description: 'A complete, ready-to-gift set — beautifully coordinated so you don\'t have to mix and match. This 10-piece set comes as a coordinated set — great value and an easy gift. Designed for boys. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'طقم كامل ومنسّق، جاهز كهدية حلوة وما بدّك تجمّع القطع لحالك. هيدا طقم ١٠ قطع منسّق، قيمة حلوة وهدية سهلة. تصميم للصبيان. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'A complete, ready-to-gift set — beautifully coordinated so you don\'t have to mix and match.', shortDescriptionAr: 'طقم كامل ومنسّق، جاهز كهدية حلوة وما بدّك تجمّع القطع لحالك.',
    price: 98.99, compareAtPrice: null, currency: 'USD', sku: 'newborn-10-piece-boy-set', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'boys', ageGroup: 'Newborn',
    categoryId: '2', stockQuantity: 1, rating: 4.5, reviewCount: 0,
    category: categories[1],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '11', name: 'Plaid 10-Piece Boy Set', nameAr: 'طقم ١٠ قطع', slug: 'plaid-10-piece-boy-set', 
    description: 'A complete, ready-to-gift set — beautifully coordinated so you don\'t have to mix and match. This 10-piece set comes as a coordinated set — great value and an easy gift. Designed for boys. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'طقم كامل ومنسّق، جاهز كهدية حلوة وما بدّك تجمّع القطع لحالك. هيدا طقم ١٠ قطع منسّق، قيمة حلوة وهدية سهلة. تصميم للصبيان. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'A complete, ready-to-gift set — beautifully coordinated so you don\'t have to mix and match.', shortDescriptionAr: 'طقم كامل ومنسّق، جاهز كهدية حلوة وما بدّك تجمّع القطع لحالك.',
    price: 81.99, compareAtPrice: null, currency: 'USD', sku: 'plaid-10-piece-boy-set', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'boys', ageGroup: 'Newborn',
    categoryId: '2', stockQuantity: 1, rating: 4.5, reviewCount: 0,
    category: categories[1],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '12', name: 'Swaddle', nameAr: 'قماط', slug: 'swaddle', 
    description: 'Adorable everyday wear that keeps your little one comfy from morning to nap time. A swaddle designed for babies. Unisex design suits any little one. Choose from Beige, Gray. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'لبس ناعم ومريح يخلّي صغيرك مرتاح من الصبح لوقت النوم. قماط (كندك) للبيبيهات. تصميم مناسب للبنت والصبي. بتختاري بين بيج, رمادي. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'Adorable everyday wear that keeps your little one comfy from morning to nap time.', shortDescriptionAr: 'لبس ناعم ومريح يخلّي صغيرك مرتاح من الصبح لوقت النوم.',
    price: 19.99, compareAtPrice: null, currency: 'USD', sku: 'swaddle', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'unisex', ageGroup: 'Baby',
    categoryId: '1', stockQuantity: 6, rating: 4.5, reviewCount: 0,
    category: categories[0],
    images: [],
    colors: [{ id: '12c0', name: 'Beige', nameAr: 'Beige', hexCode: '#D4C4B0' }, { id: '12c1', name: 'Gray', nameAr: 'Gray', hexCode: '#A0A0A0' }],
    sizes: []
  },
{
    id: '13', name: 'Swaddle', nameAr: 'قماط', slug: 'swaddle-2', 
    description: 'Adorable everyday wear that keeps your little one comfy from morning to nap time. A swaddle designed for babies. Designed for girls. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'لبس ناعم ومريح يخلّي صغيرك مرتاح من الصبح لوقت النوم. قماط (كندك) للبيبيهات. تصميم للبنات. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'Adorable everyday wear that keeps your little one comfy from morning to nap time.', shortDescriptionAr: 'لبس ناعم ومريح يخلّي صغيرك مرتاح من الصبح لوقت النوم.',
    price: 19.99, compareAtPrice: null, currency: 'USD', sku: 'swaddle-2', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'girls', ageGroup: 'Baby',
    categoryId: '1', stockQuantity: 6, rating: 4.5, reviewCount: 0,
    category: categories[0],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '14', name: 'Bib', nameAr: 'مريول', slug: 'bib', 
    description: 'The finishing touch every little outfit needs. A bib designed for babies. Unisex design suits any little one. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'اللمسة الأخيرة يلي بتكمّل إطلالة صغيرك. مريول (صدرية) للبيبيهات. تصميم مناسب للبنت والصبي. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'The finishing touch every little outfit needs.', shortDescriptionAr: 'اللمسة الأخيرة يلي بتكمّل إطلالة صغيرك.',
    price: 6.99, compareAtPrice: null, currency: 'USD', sku: 'bib', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'unisex', ageGroup: 'Baby',
    categoryId: '3', stockQuantity: 3, rating: 4.5, reviewCount: 0,
    category: categories[2],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '15', name: 'Bib', nameAr: 'مريول', slug: 'bib-2', 
    description: 'The finishing touch every little outfit needs. A bib designed for babies. Unisex design suits any little one. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'اللمسة الأخيرة يلي بتكمّل إطلالة صغيرك. مريول (صدرية) للبيبيهات. تصميم مناسب للبنت والصبي. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'The finishing touch every little outfit needs.', shortDescriptionAr: 'اللمسة الأخيرة يلي بتكمّل إطلالة صغيرك.',
    price: 6.99, compareAtPrice: null, currency: 'USD', sku: 'bib-2', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'unisex', ageGroup: 'Baby',
    categoryId: '3', stockQuantity: 3, rating: 4.5, reviewCount: 0,
    category: categories[2],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '16', name: 'Bib', nameAr: 'مريول', slug: 'bib-3', 
    description: 'The finishing touch every little outfit needs. A bib designed for babies. Unisex design suits any little one. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'اللمسة الأخيرة يلي بتكمّل إطلالة صغيرك. مريول (صدرية) للبيبيهات. تصميم مناسب للبنت والصبي. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'The finishing touch every little outfit needs.', shortDescriptionAr: 'اللمسة الأخيرة يلي بتكمّل إطلالة صغيرك.',
    price: 12.99, compareAtPrice: null, currency: 'USD', sku: 'bib-3', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'unisex', ageGroup: 'Baby',
    categoryId: '3', stockQuantity: 3, rating: 4.5, reviewCount: 0,
    category: categories[2],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '17', name: 'Pacifier Clip', nameAr: 'علاقة لهاية', slug: 'pacifier-clip', 
    description: 'The finishing touch every little outfit needs. A pacifier clip designed for babies. Unisex design suits any little one. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'اللمسة الأخيرة يلي بتكمّل إطلالة صغيرك. علاقة لهاية للبيبيهات. تصميم مناسب للبنت والصبي. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'The finishing touch every little outfit needs.', shortDescriptionAr: 'اللمسة الأخيرة يلي بتكمّل إطلالة صغيرك.',
    price: 8.99, compareAtPrice: null, currency: 'USD', sku: 'pacifier-clip', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'unisex', ageGroup: 'Baby',
    categoryId: '3', stockQuantity: 18, rating: 4.5, reviewCount: 0,
    category: categories[2],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '18', name: 'Pacifier Clip', nameAr: 'علاقة لهاية', slug: 'pacifier-clip-2', 
    description: 'The finishing touch every little outfit needs. A pacifier clip designed for babies. Unisex design suits any little one. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'اللمسة الأخيرة يلي بتكمّل إطلالة صغيرك. علاقة لهاية للبيبيهات. تصميم مناسب للبنت والصبي. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'The finishing touch every little outfit needs.', shortDescriptionAr: 'اللمسة الأخيرة يلي بتكمّل إطلالة صغيرك.',
    price: 3.99, compareAtPrice: null, currency: 'USD', sku: 'pacifier-clip-2', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'unisex', ageGroup: 'Baby',
    categoryId: '3', stockQuantity: 18, rating: 4.5, reviewCount: 0,
    category: categories[2],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '19', name: 'Hat', nameAr: 'طاقية', slug: 'hat', 
    description: 'The finishing touch every little outfit needs. A hat designed for babies. Unisex design suits any little one. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'اللمسة الأخيرة يلي بتكمّل إطلالة صغيرك. طاقية للبيبيهات. تصميم مناسب للبنت والصبي. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'The finishing touch every little outfit needs.', shortDescriptionAr: 'اللمسة الأخيرة يلي بتكمّل إطلالة صغيرك.',
    price: 3.99, compareAtPrice: null, currency: 'USD', sku: 'hat', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'unisex', ageGroup: 'Baby',
    categoryId: '3', stockQuantity: 5, rating: 4.5, reviewCount: 0,
    category: categories[2],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '20', name: 'Hat', nameAr: 'طاقية', slug: 'hat-2', 
    description: 'The finishing touch every little outfit needs. A hat designed for babies. Unisex design suits any little one. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'اللمسة الأخيرة يلي بتكمّل إطلالة صغيرك. طاقية للبيبيهات. تصميم مناسب للبنت والصبي. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'The finishing touch every little outfit needs.', shortDescriptionAr: 'اللمسة الأخيرة يلي بتكمّل إطلالة صغيرك.',
    price: 3.99, compareAtPrice: null, currency: 'USD', sku: 'hat-2', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'unisex', ageGroup: 'Baby',
    categoryId: '3', stockQuantity: 5, rating: 4.5, reviewCount: 0,
    category: categories[2],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '21', name: 'Hat', nameAr: 'طاقية', slug: 'hat-3', 
    description: 'The finishing touch every little outfit needs. A hat designed for babies. Designed for girls. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'اللمسة الأخيرة يلي بتكمّل إطلالة صغيرك. طاقية للبيبيهات. تصميم للبنات. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'The finishing touch every little outfit needs.', shortDescriptionAr: 'اللمسة الأخيرة يلي بتكمّل إطلالة صغيرك.',
    price: 6.99, compareAtPrice: null, currency: 'USD', sku: 'hat-3', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'girls', ageGroup: 'Baby',
    categoryId: '3', stockQuantity: 5, rating: 4.5, reviewCount: 0,
    category: categories[2],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '22', name: 'Bib', nameAr: 'مريول', slug: 'bib-4', 
    description: 'The finishing touch every little outfit needs. A bib designed for babies. Designed for girls. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'اللمسة الأخيرة يلي بتكمّل إطلالة صغيرك. مريول (صدرية) للبيبيهات. تصميم للبنات. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'The finishing touch every little outfit needs.', shortDescriptionAr: 'اللمسة الأخيرة يلي بتكمّل إطلالة صغيرك.',
    price: 6.99, compareAtPrice: null, currency: 'USD', sku: 'bib-4', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'girls', ageGroup: 'Baby',
    categoryId: '3', stockQuantity: 3, rating: 4.5, reviewCount: 0,
    category: categories[2],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '23', name: 'Pacifier Clip', nameAr: 'علاقة لهاية', slug: 'pacifier-clip-3', 
    description: 'The finishing touch every little outfit needs. A pacifier clip designed for babies. Unisex design suits any little one. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'اللمسة الأخيرة يلي بتكمّل إطلالة صغيرك. علاقة لهاية للبيبيهات. تصميم مناسب للبنت والصبي. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'The finishing touch every little outfit needs.', shortDescriptionAr: 'اللمسة الأخيرة يلي بتكمّل إطلالة صغيرك.',
    price: 2.99, compareAtPrice: null, currency: 'USD', sku: 'pacifier-clip-3', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'unisex', ageGroup: 'Baby',
    categoryId: '3', stockQuantity: 18, rating: 4.5, reviewCount: 0,
    category: categories[2],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '24', name: 'Knitted Baby Blanket', nameAr: 'بطانية مكرّمة', slug: 'knitted-baby-blanket', 
    description: 'The finishing touch every little outfit needs. A knitted baby blanket designed for babies. Unisex design suits any little one. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'اللمسة الأخيرة يلي بتكمّل إطلالة صغيرك. بطانية مكرّمة (تريكو) للبيبيهات. تصميم مناسب للبنت والصبي. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'The finishing touch every little outfit needs.', shortDescriptionAr: 'اللمسة الأخيرة يلي بتكمّل إطلالة صغيرك.',
    price: 28.99, compareAtPrice: null, currency: 'USD', sku: 'knitted-baby-blanket', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'unisex', ageGroup: 'Baby',
    categoryId: '3', stockQuantity: 4, rating: 4.5, reviewCount: 0,
    category: categories[2],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '25', name: 'Knitted Baby Blanket', nameAr: 'بطانية مكرّمة', slug: 'knitted-baby-blanket-2', 
    description: 'The finishing touch every little outfit needs. A knitted baby blanket designed for babies. Unisex design suits any little one. Choose from Beige, Ecru. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'اللمسة الأخيرة يلي بتكمّل إطلالة صغيرك. بطانية مكرّمة (تريكو) للبيبيهات. تصميم مناسب للبنت والصبي. بتختاري بين بيج, إكرو. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'The finishing touch every little outfit needs.', shortDescriptionAr: 'اللمسة الأخيرة يلي بتكمّل إطلالة صغيرك.',
    price: 28.99, compareAtPrice: null, currency: 'USD', sku: 'knitted-baby-blanket-2', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'unisex', ageGroup: 'Baby',
    categoryId: '3', stockQuantity: 4, rating: 4.5, reviewCount: 0,
    category: categories[2],
    images: [],
    colors: [{ id: '25c0', name: 'Beige', nameAr: 'Beige', hexCode: '#D4C4B0' }, { id: '25c1', name: 'Ecru', nameAr: 'Ecru', hexCode: '#F5F0E6' }],
    sizes: []
  },
{
    id: '26', name: 'Knitted Baby Blanket', nameAr: 'بطانية مكرّمة', slug: 'knitted-baby-blanket-3', 
    description: 'The finishing touch every little outfit needs. A knitted baby blanket designed for babies. Unisex design suits any little one. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'اللمسة الأخيرة يلي بتكمّل إطلالة صغيرك. بطانية مكرّمة (تريكو) للبيبيهات. تصميم مناسب للبنت والصبي. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'The finishing touch every little outfit needs.', shortDescriptionAr: 'اللمسة الأخيرة يلي بتكمّل إطلالة صغيرك.',
    price: 28.99, compareAtPrice: null, currency: 'USD', sku: 'knitted-baby-blanket-3', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'unisex', ageGroup: 'Baby',
    categoryId: '3', stockQuantity: 4, rating: 4.5, reviewCount: 0,
    category: categories[2],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '27', name: 'Footed Overall', nameAr: 'أوفرول برجلين', slug: 'footed-overall-2', 
    description: 'Adorable everyday wear that keeps your little one comfy from morning to nap time. A footed overall designed for babies. Designed for boys. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'لبس ناعم ومريح يخلّي صغيرك مرتاح من الصبح لوقت النوم. أوفرول برجلين (تولوم) للبيبيهات. تصميم للصبيان. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'Adorable everyday wear that keeps your little one comfy from morning to nap time.', shortDescriptionAr: 'لبس ناعم ومريح يخلّي صغيرك مرتاح من الصبح لوقت النوم.',
    price: 17.99, compareAtPrice: null, currency: 'USD', sku: 'footed-overall-2', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'boys', ageGroup: 'Baby',
    categoryId: '1', stockQuantity: 3, rating: 4.5, reviewCount: 0,
    category: categories[0],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '28', name: '2-piece Bodysuit', nameAr: 'أساسيات', slug: '2-piece-bodysuit', 
    description: 'Wardrobe essentials you\'ll reach for again and again. This 2-piece bodysuit comes as a coordinated set — great value and an easy gift. Unisex design suits any little one. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'قطع أساسية رح تلبّسها صغيرك كل يوم. أساسيات للبيبيهات. تصميم مناسب للبنت والصبي. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'Wardrobe essentials you\'ll reach for again and again.', shortDescriptionAr: 'قطع أساسية رح تلبّسها صغيرك كل يوم.',
    price: 21.99, compareAtPrice: null, currency: 'USD', sku: '2-piece-bodysuit', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'unisex', ageGroup: 'Baby',
    categoryId: '4', stockQuantity: 32, rating: 4.5, reviewCount: 0,
    category: categories[3],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '29', name: '2-piece Pants', nameAr: 'أساسيات', slug: '2-piece-pants', 
    description: 'Wardrobe essentials you\'ll reach for again and again. This 2-piece pants comes as a coordinated set — great value and an easy gift. Designed for girls. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'قطع أساسية رح تلبّسها صغيرك كل يوم. أساسيات للبيبيهات. تصميم للبنات. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'Wardrobe essentials you\'ll reach for again and again.', shortDescriptionAr: 'قطع أساسية رح تلبّسها صغيرك كل يوم.',
    price: 18.99, compareAtPrice: null, currency: 'USD', sku: '2-piece-pants', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'girls', ageGroup: 'Baby',
    categoryId: '4', stockQuantity: 3, rating: 4.5, reviewCount: 0,
    category: categories[3],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '30', name: '2-piece Bodysuit', nameAr: 'أساسيات', slug: '2-piece-bodysuit-2', 
    description: 'Wardrobe essentials you\'ll reach for again and again. This 2-piece bodysuit comes as a coordinated set — great value and an easy gift. Designed for girls. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'قطع أساسية رح تلبّسها صغيرك كل يوم. أساسيات للبيبيهات. تصميم للبنات. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'Wardrobe essentials you\'ll reach for again and again.', shortDescriptionAr: 'قطع أساسية رح تلبّسها صغيرك كل يوم.',
    price: 22.99, compareAtPrice: null, currency: 'USD', sku: '2-piece-bodysuit-2', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'girls', ageGroup: 'Baby',
    categoryId: '4', stockQuantity: 32, rating: 4.5, reviewCount: 0,
    category: categories[3],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '31', name: 'Footed Overall', nameAr: 'أوفرول برجلين', slug: 'footed-overall-3', 
    description: 'Adorable everyday wear that keeps your little one comfy from morning to nap time. A footed overall designed for babies. Unisex design suits any little one. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'لبس ناعم ومريح يخلّي صغيرك مرتاح من الصبح لوقت النوم. أوفرول برجلين (تولوم) للبيبيهات. تصميم مناسب للبنت والصبي. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'Adorable everyday wear that keeps your little one comfy from morning to nap time.', shortDescriptionAr: 'لبس ناعم ومريح يخلّي صغيرك مرتاح من الصبح لوقت النوم.',
    price: 23.99, compareAtPrice: null, currency: 'USD', sku: 'footed-overall-3', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'unisex', ageGroup: 'Baby',
    categoryId: '1', stockQuantity: 3, rating: 4.5, reviewCount: 0,
    category: categories[0],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '32', name: '5-piece Set', nameAr: 'طقم ٥ قطع', slug: '5-piece-set', 
    description: 'A complete, ready-to-gift set — beautifully coordinated so you don\'t have to mix and match. This 5-piece set comes as a coordinated set — great value and an easy gift. Unisex design suits any little one. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'طقم كامل ومنسّق، جاهز كهدية حلوة وما بدّك تجمّع القطع لحالك. هيدا طقم ٥ قطع منسّق، قيمة حلوة وهدية سهلة. تصميم مناسب للبنت والصبي. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'A complete, ready-to-gift set — beautifully coordinated so you don\'t have to mix and match.', shortDescriptionAr: 'طقم كامل ومنسّق، جاهز كهدية حلوة وما بدّك تجمّع القطع لحالك.',
    price: 38.99, compareAtPrice: null, currency: 'USD', sku: '5-piece-set', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'unisex', ageGroup: 'Baby',
    categoryId: '2', stockQuantity: 4, rating: 4.5, reviewCount: 0,
    category: categories[1],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '33', name: '2-piece Set', nameAr: 'طقم قطعتين', slug: '2-piece-set', 
    description: 'A complete, ready-to-gift set — beautifully coordinated so you don\'t have to mix and match. This 2-piece set comes as a coordinated set — great value and an easy gift. Unisex design suits any little one. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'طقم كامل ومنسّق، جاهز كهدية حلوة وما بدّك تجمّع القطع لحالك. هيدا طقم قطعتين منسّق، قيمة حلوة وهدية سهلة. تصميم مناسب للبنت والصبي. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'A complete, ready-to-gift set — beautifully coordinated so you don\'t have to mix and match.', shortDescriptionAr: 'طقم كامل ومنسّق، جاهز كهدية حلوة وما بدّك تجمّع القطع لحالك.',
    price: 32.99, compareAtPrice: null, currency: 'USD', sku: '2-piece-set', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'unisex', ageGroup: 'Baby',
    categoryId: '2', stockQuantity: 15, rating: 4.5, reviewCount: 0,
    category: categories[1],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '34', name: '2-piece Bodysuit', nameAr: 'أساسيات', slug: '2-piece-bodysuit-3', 
    description: 'Wardrobe essentials you\'ll reach for again and again. This 2-piece bodysuit comes as a coordinated set — great value and an easy gift. Unisex design suits any little one. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'قطع أساسية رح تلبّسها صغيرك كل يوم. أساسيات للبيبيهات. تصميم مناسب للبنت والصبي. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'Wardrobe essentials you\'ll reach for again and again.', shortDescriptionAr: 'قطع أساسية رح تلبّسها صغيرك كل يوم.',
    price: 16.99, compareAtPrice: null, currency: 'USD', sku: '2-piece-bodysuit-3', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'unisex', ageGroup: 'Baby',
    categoryId: '4', stockQuantity: 32, rating: 4.5, reviewCount: 0,
    category: categories[3],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '35', name: '2-piece Athletic Body', nameAr: 'أساسيات', slug: '2-piece-athletic-body', 
    description: 'Wardrobe essentials you\'ll reach for again and again. This 2-piece athletic body comes as a coordinated set — great value and an easy gift. Unisex design suits any little one. Available in sizes 18-24M, One Size — choose the right fit as baby grows. Choose from Ecru, Gray. Soft, breathable cotton-b', descriptionAr: 'قطع أساسية رح تلبّسها صغيرك كل يوم. أساسيات للبيبيهات. تصميم مناسب للبنت والصبي. متوفّر بقياسات 18-24M, One Size — اختاري القياس المناسب مع ما يكبر صغيرك. بتختاري بين إكرو, رمادي. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'Wardrobe essentials you\'ll reach for again and again.', shortDescriptionAr: 'قطع أساسية رح تلبّسها صغيرك كل يوم.',
    price: 16.99, compareAtPrice: null, currency: 'USD', sku: '2-piece-athletic-body', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'unisex', ageGroup: 'Baby',
    categoryId: '4', stockQuantity: 18, rating: 4.5, reviewCount: 0,
    category: categories[3],
    images: [],
    colors: [{ id: '35c0', name: 'Ecru', nameAr: 'Ecru', hexCode: '#F5F0E6' }, { id: '35c1', name: 'Gray', nameAr: 'Gray', hexCode: '#A0A0A0' }],
    sizes: [{ id: '35s0', name: 'One Size', nameAr: 'One Size', ageRange: null, sortOrder: 0 }, { id: '35s1', name: '18-24M', nameAr: '18-24M', ageRange: null, sortOrder: 1 }]
  },
{
    id: '36', name: '2-piece Athletic Body', nameAr: 'أساسيات', slug: '2-piece-athletic-body-2', 
    description: 'Wardrobe essentials you\'ll reach for again and again. This 2-piece athletic body comes as a coordinated set — great value and an easy gift. Unisex design suits any little one. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'قطع أساسية رح تلبّسها صغيرك كل يوم. أساسيات للبيبيهات. تصميم مناسب للبنت والصبي. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'Wardrobe essentials you\'ll reach for again and again.', shortDescriptionAr: 'قطع أساسية رح تلبّسها صغيرك كل يوم.',
    price: 17.99, compareAtPrice: null, currency: 'USD', sku: '2-piece-athletic-body-2', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'unisex', ageGroup: 'Baby',
    categoryId: '4', stockQuantity: 18, rating: 4.5, reviewCount: 0,
    category: categories[3],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '37', name: '2-piece Bodysuit', nameAr: 'أساسيات', slug: '2-piece-bodysuit-4', 
    description: 'Wardrobe essentials you\'ll reach for again and again. This 2-piece bodysuit comes as a coordinated set — great value and an easy gift. Unisex design suits any little one. Choose from Lilac, Powder. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'قطع أساسية رح تلبّسها صغيرك كل يوم. أساسيات للبيبيهات. تصميم مناسب للبنت والصبي. بتختاري بين ليلكي, Powder. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'Wardrobe essentials you\'ll reach for again and again.', shortDescriptionAr: 'قطع أساسية رح تلبّسها صغيرك كل يوم.',
    price: 22.99, compareAtPrice: null, currency: 'USD', sku: '2-piece-bodysuit-4', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'unisex', ageGroup: 'Baby',
    categoryId: '4', stockQuantity: 32, rating: 4.5, reviewCount: 0,
    category: categories[3],
    images: [],
    colors: [{ id: '37c0', name: 'Powder', nameAr: 'Powder', hexCode: '#F0E6E6' }, { id: '37c1', name: 'Lilac', nameAr: 'Lilac', hexCode: '#C8B4D4' }],
    sizes: []
  },
{
    id: '38', name: '2-piece Bodysuit', nameAr: 'أساسيات', slug: '2-piece-bodysuit-5', 
    description: 'Wardrobe essentials you\'ll reach for again and again. This 2-piece bodysuit comes as a coordinated set — great value and an easy gift. Unisex design suits any little one. Choose from Lilac, Powder. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'قطع أساسية رح تلبّسها صغيرك كل يوم. أساسيات للبيبيهات. تصميم مناسب للبنت والصبي. بتختاري بين ليلكي, Powder. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'Wardrobe essentials you\'ll reach for again and again.', shortDescriptionAr: 'قطع أساسية رح تلبّسها صغيرك كل يوم.',
    price: 19.99, compareAtPrice: null, currency: 'USD', sku: '2-piece-bodysuit-5', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'unisex', ageGroup: 'Baby',
    categoryId: '4', stockQuantity: 32, rating: 4.5, reviewCount: 0,
    category: categories[3],
    images: [],
    colors: [{ id: '38c0', name: 'Powder', nameAr: 'Powder', hexCode: '#F0E6E6' }, { id: '38c1', name: 'Lilac', nameAr: 'Lilac', hexCode: '#C8B4D4' }],
    sizes: []
  },
{
    id: '39', name: '2-piece Bodysuit', nameAr: 'أساسيات', slug: '2-piece-bodysuit-6', 
    description: 'Wardrobe essentials you\'ll reach for again and again. This 2-piece bodysuit comes as a coordinated set — great value and an easy gift. Unisex design suits any little one. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'قطع أساسية رح تلبّسها صغيرك كل يوم. أساسيات للبيبيهات. تصميم مناسب للبنت والصبي. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'Wardrobe essentials you\'ll reach for again and again.', shortDescriptionAr: 'قطع أساسية رح تلبّسها صغيرك كل يوم.',
    price: 16.99, compareAtPrice: null, currency: 'USD', sku: '2-piece-bodysuit-6', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'unisex', ageGroup: 'Baby',
    categoryId: '4', stockQuantity: 32, rating: 4.5, reviewCount: 0,
    category: categories[3],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '40', name: '2-piece Bodysuit', nameAr: 'أساسيات', slug: '2-piece-bodysuit-7', 
    description: 'Wardrobe essentials you\'ll reach for again and again. This 2-piece bodysuit comes as a coordinated set — great value and an easy gift. Unisex design suits any little one. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'قطع أساسية رح تلبّسها صغيرك كل يوم. أساسيات للبيبيهات. تصميم مناسب للبنت والصبي. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'Wardrobe essentials you\'ll reach for again and again.', shortDescriptionAr: 'قطع أساسية رح تلبّسها صغيرك كل يوم.',
    price: 16.99, compareAtPrice: null, currency: 'USD', sku: '2-piece-bodysuit-7', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'unisex', ageGroup: 'Baby',
    categoryId: '4', stockQuantity: 32, rating: 4.5, reviewCount: 0,
    category: categories[3],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '41', name: '2-piece Athletic Body', nameAr: 'أساسيات', slug: '2-piece-athletic-body-3', 
    description: 'Wardrobe essentials you\'ll reach for again and again. This 2-piece athletic body comes as a coordinated set — great value and an easy gift. Unisex design suits any little one. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'قطع أساسية رح تلبّسها صغيرك كل يوم. أساسيات للبيبيهات. تصميم مناسب للبنت والصبي. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'Wardrobe essentials you\'ll reach for again and again.', shortDescriptionAr: 'قطع أساسية رح تلبّسها صغيرك كل يوم.',
    price: 16.99, compareAtPrice: null, currency: 'USD', sku: '2-piece-athletic-body-3', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'unisex', ageGroup: 'Baby',
    categoryId: '4', stockQuantity: 18, rating: 4.5, reviewCount: 0,
    category: categories[3],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '42', name: '2-piece Athletic Body', nameAr: 'أساسيات', slug: '2-piece-athletic-body-4', 
    description: 'Wardrobe essentials you\'ll reach for again and again. This 2-piece athletic body comes as a coordinated set — great value and an easy gift. Unisex design suits any little one. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'قطع أساسية رح تلبّسها صغيرك كل يوم. أساسيات للبيبيهات. تصميم مناسب للبنت والصبي. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'Wardrobe essentials you\'ll reach for again and again.', shortDescriptionAr: 'قطع أساسية رح تلبّسها صغيرك كل يوم.',
    price: 17.99, compareAtPrice: null, currency: 'USD', sku: '2-piece-athletic-body-4', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'unisex', ageGroup: 'Baby',
    categoryId: '4', stockQuantity: 18, rating: 4.5, reviewCount: 0,
    category: categories[3],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '43', name: '2-piece Set', nameAr: 'طقم قطعتين', slug: '2-piece-set-2', 
    description: 'A complete, ready-to-gift set — beautifully coordinated so you don\'t have to mix and match. This 2-piece set comes as a coordinated set — great value and an easy gift. Unisex design suits any little one. Available in sizes 1-3M, 3-6/6-9/9-12/12-18M — choose the right fit as baby grows. Choose from ', descriptionAr: 'طقم كامل ومنسّق، جاهز كهدية حلوة وما بدّك تجمّع القطع لحالك. هيدا طقم قطعتين منسّق، قيمة حلوة وهدية سهلة. تصميم مناسب للبنت والصبي. متوفّر بقياسات 1-3M, 3-6/6-9/9-12/12-18M — اختاري القياس المناسب مع ما يكبر صغيرك. بتختاري بين بني, Rosewood. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مست',
    shortDescription: 'A complete, ready-to-gift set — beautifully coordinated so you don\'t have to mix and match.', shortDescriptionAr: 'طقم كامل ومنسّق، جاهز كهدية حلوة وما بدّك تجمّع القطع لحالك.',
    price: 32.99, compareAtPrice: null, currency: 'USD', sku: '2-piece-set-2', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'unisex', ageGroup: 'Baby',
    categoryId: '2', stockQuantity: 15, rating: 4.5, reviewCount: 0,
    category: categories[1],
    images: [],
    colors: [{ id: '43c0', name: 'Brown', nameAr: 'Brown', hexCode: '#8B6F47' }, { id: '43c1', name: 'Rosewood', nameAr: 'Rosewood', hexCode: '#9E6B5B' }],
    sizes: [{ id: '43s0', name: '1-3M', nameAr: '1-3M', ageRange: null, sortOrder: 0 }, { id: '43s1', name: '3-6/6-9/9-12/12-18M', nameAr: '3-6/6-9/9-12/12-18M', ageRange: null, sortOrder: 1 }]
  },
{
    id: '44', name: '2-piece Set', nameAr: 'طقم قطعتين', slug: '2-piece-set-3', 
    description: 'A complete, ready-to-gift set — beautifully coordinated so you don\'t have to mix and match. This 2-piece set comes as a coordinated set — great value and an easy gift. Unisex design suits any little one. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'طقم كامل ومنسّق، جاهز كهدية حلوة وما بدّك تجمّع القطع لحالك. هيدا طقم قطعتين منسّق، قيمة حلوة وهدية سهلة. تصميم مناسب للبنت والصبي. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'A complete, ready-to-gift set — beautifully coordinated so you don\'t have to mix and match.', shortDescriptionAr: 'طقم كامل ومنسّق، جاهز كهدية حلوة وما بدّك تجمّع القطع لحالك.',
    price: 37.99, compareAtPrice: null, currency: 'USD', sku: '2-piece-set-3', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'unisex', ageGroup: 'Baby',
    categoryId: '2', stockQuantity: 15, rating: 4.5, reviewCount: 0,
    category: categories[1],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '45', name: 'Dress', nameAr: 'فستان', slug: 'dress', 
    description: 'Adorable everyday wear that keeps your little one comfy from morning to nap time. A dress designed for babies. Designed for girls. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'لبس ناعم ومريح يخلّي صغيرك مرتاح من الصبح لوقت النوم. فستان للبيبيهات. تصميم للبنات. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'Adorable everyday wear that keeps your little one comfy from morning to nap time.', shortDescriptionAr: 'لبس ناعم ومريح يخلّي صغيرك مرتاح من الصبح لوقت النوم.',
    price: 42.99, compareAtPrice: null, currency: 'USD', sku: 'dress', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'girls', ageGroup: 'Baby',
    categoryId: '1', stockQuantity: 5, rating: 4.5, reviewCount: 0,
    category: categories[0],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '46', name: '4-piece Set', nameAr: 'طقم ٤ قطع', slug: '4-piece-set', 
    description: 'A complete, ready-to-gift set — beautifully coordinated so you don\'t have to mix and match. This 4-piece set comes as a coordinated set — great value and an easy gift. Designed for girls. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'طقم كامل ومنسّق، جاهز كهدية حلوة وما بدّك تجمّع القطع لحالك. هيدا طقم ٤ قطع منسّق، قيمة حلوة وهدية سهلة. تصميم للبنات. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'A complete, ready-to-gift set — beautifully coordinated so you don\'t have to mix and match.', shortDescriptionAr: 'طقم كامل ومنسّق، جاهز كهدية حلوة وما بدّك تجمّع القطع لحالك.',
    price: 44.99, compareAtPrice: null, currency: 'USD', sku: '4-piece-set', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'girls', ageGroup: 'Baby',
    categoryId: '2', stockQuantity: 1, rating: 4.5, reviewCount: 0,
    category: categories[1],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '47', name: 'Body Pants Set', nameAr: 'طقم', slug: 'body-pants-set', 
    description: 'A complete, ready-to-gift set — beautifully coordinated so you don\'t have to mix and match. This body pants set comes as a coordinated set — great value and an easy gift. Unisex design suits any little one. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'طقم كامل ومنسّق، جاهز كهدية حلوة وما بدّك تجمّع القطع لحالك. هيدا طقم منسّق، قيمة حلوة وهدية سهلة. تصميم مناسب للبنت والصبي. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'A complete, ready-to-gift set — beautifully coordinated so you don\'t have to mix and match.', shortDescriptionAr: 'طقم كامل ومنسّق، جاهز كهدية حلوة وما بدّك تجمّع القطع لحالك.',
    price: 37.99, compareAtPrice: null, currency: 'USD', sku: 'body-pants-set', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'unisex', ageGroup: 'Baby',
    categoryId: '2', stockQuantity: 1, rating: 4.5, reviewCount: 0,
    category: categories[1],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '48', name: '5-piece Towel/cloth', nameAr: 'إكسسوار', slug: '5-piece-towel-cloth', 
    description: 'The finishing touch every little outfit needs. This 5-piece towel/cloth comes as a coordinated set — great value and an easy gift. Designed for boys. Choose from Beige, Blue, Pink. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'اللمسة الأخيرة يلي بتكمّل إطلالة صغيرك. إكسسوار للبيبيهات. تصميم للصبيان. بتختاري بين بيج, أزرق, زهري. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'The finishing touch every little outfit needs.', shortDescriptionAr: 'اللمسة الأخيرة يلي بتكمّل إطلالة صغيرك.',
    price: 10.99, compareAtPrice: null, currency: 'USD', sku: '5-piece-towel-cloth', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'boys', ageGroup: 'Baby',
    categoryId: '3', stockQuantity: 3, rating: 4.5, reviewCount: 0,
    category: categories[2],
    images: [],
    colors: [{ id: '48c0', name: 'Blue', nameAr: 'Blue', hexCode: '#6B8FAE' }, { id: '48c1', name: 'Pink', nameAr: 'Pink', hexCode: '#E8B4B8' }, { id: '48c2', name: 'Beige', nameAr: 'Beige', hexCode: '#D4C4B0' }],
    sizes: []
  },
{
    id: '49', name: '7-piece Baby Cloth', nameAr: 'إكسسوار', slug: '7-piece-baby-cloth', 
    description: 'The finishing touch every little outfit needs. This 7-piece baby cloth comes as a coordinated set — great value and an easy gift. Unisex design suits any little one. Choose from Gray melange, Green. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'اللمسة الأخيرة يلي بتكمّل إطلالة صغيرك. إكسسوار للبيبيهات. تصميم مناسب للبنت والصبي. بتختاري بين Gray melange, أخضر. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'The finishing touch every little outfit needs.', shortDescriptionAr: 'اللمسة الأخيرة يلي بتكمّل إطلالة صغيرك.',
    price: 6.99, compareAtPrice: null, currency: 'USD', sku: '7-piece-baby-cloth', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'unisex', ageGroup: 'Baby',
    categoryId: '3', stockQuantity: 9, rating: 4.5, reviewCount: 0,
    category: categories[2],
    images: [],
    colors: [{ id: '49c0', name: 'Green', nameAr: 'Green', hexCode: '#8FAE7B' }, { id: '49c1', name: 'Gray melange', nameAr: 'Gray melange', hexCode: '#B8B8B8' }],
    sizes: []
  },
{
    id: '50', name: '7-piece Baby Cloth', nameAr: 'إكسسوار', slug: '7-piece-baby-cloth-2', 
    description: 'The finishing touch every little outfit needs. This 7-piece baby cloth comes as a coordinated set — great value and an easy gift. Unisex design suits any little one. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'اللمسة الأخيرة يلي بتكمّل إطلالة صغيرك. إكسسوار للبيبيهات. تصميم مناسب للبنت والصبي. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'The finishing touch every little outfit needs.', shortDescriptionAr: 'اللمسة الأخيرة يلي بتكمّل إطلالة صغيرك.',
    price: 6.99, compareAtPrice: null, currency: 'USD', sku: '7-piece-baby-cloth-2', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'unisex', ageGroup: 'Baby',
    categoryId: '3', stockQuantity: 9, rating: 4.5, reviewCount: 0,
    category: categories[2],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '51', name: '7-piece Baby Cloth', nameAr: 'إكسسوار', slug: '7-piece-baby-cloth-3', 
    description: 'The finishing touch every little outfit needs. This 7-piece baby cloth comes as a coordinated set — great value and an easy gift. Unisex design suits any little one. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'اللمسة الأخيرة يلي بتكمّل إطلالة صغيرك. إكسسوار للبيبيهات. تصميم مناسب للبنت والصبي. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'The finishing touch every little outfit needs.', shortDescriptionAr: 'اللمسة الأخيرة يلي بتكمّل إطلالة صغيرك.',
    price: 6.99, compareAtPrice: null, currency: 'USD', sku: '7-piece-baby-cloth-3', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'unisex', ageGroup: 'Baby',
    categoryId: '3', stockQuantity: 9, rating: 4.5, reviewCount: 0,
    category: categories[2],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '52', name: '7-piece Baby Cloth', nameAr: 'إكسسوار', slug: '7-piece-baby-cloth-4', 
    description: 'The finishing touch every little outfit needs. This 7-piece baby cloth comes as a coordinated set — great value and an easy gift. Unisex design suits any little one. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'اللمسة الأخيرة يلي بتكمّل إطلالة صغيرك. إكسسوار للبيبيهات. تصميم مناسب للبنت والصبي. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'The finishing touch every little outfit needs.', shortDescriptionAr: 'اللمسة الأخيرة يلي بتكمّل إطلالة صغيرك.',
    price: 6.99, compareAtPrice: null, currency: 'USD', sku: '7-piece-baby-cloth-4', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'unisex', ageGroup: 'Baby',
    categoryId: '3', stockQuantity: 9, rating: 4.5, reviewCount: 0,
    category: categories[2],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '53', name: '7-piece Baby Cloth', nameAr: 'إكسسوار', slug: '7-piece-baby-cloth-5', 
    description: 'The finishing touch every little outfit needs. This 7-piece baby cloth comes as a coordinated set — great value and an easy gift. Unisex design suits any little one. Choose from Beige, Green. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'اللمسة الأخيرة يلي بتكمّل إطلالة صغيرك. إكسسوار للبيبيهات. تصميم مناسب للبنت والصبي. بتختاري بين بيج, أخضر. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'The finishing touch every little outfit needs.', shortDescriptionAr: 'اللمسة الأخيرة يلي بتكمّل إطلالة صغيرك.',
    price: 6.99, compareAtPrice: null, currency: 'USD', sku: '7-piece-baby-cloth-5', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'unisex', ageGroup: 'Baby',
    categoryId: '3', stockQuantity: 9, rating: 4.5, reviewCount: 0,
    category: categories[2],
    images: [],
    colors: [{ id: '53c0', name: 'Beige', nameAr: 'Beige', hexCode: '#D4C4B0' }, { id: '53c1', name: 'Green', nameAr: 'Green', hexCode: '#8FAE7B' }],
    sizes: []
  },
{
    id: '54', name: 'Blanket', nameAr: 'بطانية', slug: 'blanket', 
    description: 'The finishing touch every little outfit needs. A blanket designed for babies. Unisex design suits any little one. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'اللمسة الأخيرة يلي بتكمّل إطلالة صغيرك. بطانية للبيبيهات. تصميم مناسب للبنت والصبي. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'The finishing touch every little outfit needs.', shortDescriptionAr: 'اللمسة الأخيرة يلي بتكمّل إطلالة صغيرك.',
    price: 43.99, compareAtPrice: null, currency: 'USD', sku: 'blanket', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'unisex', ageGroup: 'Baby',
    categoryId: '3', stockQuantity: 8, rating: 4.5, reviewCount: 0,
    category: categories[2],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '55', name: 'Blanket', nameAr: 'بطانية', slug: 'blanket-2', 
    description: 'The finishing touch every little outfit needs. A blanket designed for babies. Unisex design suits any little one. Choose from Beige, Ecru, Green. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'اللمسة الأخيرة يلي بتكمّل إطلالة صغيرك. بطانية للبيبيهات. تصميم مناسب للبنت والصبي. بتختاري بين بيج, إكرو, أخضر. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'The finishing touch every little outfit needs.', shortDescriptionAr: 'اللمسة الأخيرة يلي بتكمّل إطلالة صغيرك.',
    price: 51.99, compareAtPrice: null, currency: 'USD', sku: 'blanket-2', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'unisex', ageGroup: 'Baby',
    categoryId: '3', stockQuantity: 8, rating: 4.5, reviewCount: 0,
    category: categories[2],
    images: [],
    colors: [{ id: '55c0', name: 'Green', nameAr: 'Green', hexCode: '#8FAE7B' }, { id: '55c1', name: 'Beige', nameAr: 'Beige', hexCode: '#D4C4B0' }, { id: '55c2', name: 'Ecru', nameAr: 'Ecru', hexCode: '#F5F0E6' }],
    sizes: []
  },
{
    id: '56', name: 'Blanket', nameAr: 'بطانية', slug: 'blanket-3', 
    description: 'The finishing touch every little outfit needs. A blanket designed for babies. Unisex design suits any little one. Choose from Gray, Mink. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'اللمسة الأخيرة يلي بتكمّل إطلالة صغيرك. بطانية للبيبيهات. تصميم مناسب للبنت والصبي. بتختاري بين رمادي, Mink. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'The finishing touch every little outfit needs.', shortDescriptionAr: 'اللمسة الأخيرة يلي بتكمّل إطلالة صغيرك.',
    price: 43.99, compareAtPrice: null, currency: 'USD', sku: 'blanket-3', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'unisex', ageGroup: 'Baby',
    categoryId: '3', stockQuantity: 8, rating: 4.5, reviewCount: 0,
    category: categories[2],
    images: [],
    colors: [{ id: '56c0', name: 'Mink', nameAr: 'Mink', hexCode: '#8B7D6B' }, { id: '56c1', name: 'Gray', nameAr: 'Gray', hexCode: '#A0A0A0' }],
    sizes: []
  },
{
    id: '57', name: '4-piece Set Accessory', nameAr: 'طقم', slug: '4-piece-set-accessory', 
    description: 'A complete, ready-to-gift set — beautifully coordinated so you don\'t have to mix and match. This 4-piece set accessory comes as a coordinated set — great value and an easy gift. Designed for girls. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'طقم كامل ومنسّق، جاهز كهدية حلوة وما بدّك تجمّع القطع لحالك. هيدا طقم منسّق، قيمة حلوة وهدية سهلة. تصميم للبنات. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'A complete, ready-to-gift set — beautifully coordinated so you don\'t have to mix and match.', shortDescriptionAr: 'طقم كامل ومنسّق، جاهز كهدية حلوة وما بدّك تجمّع القطع لحالك.',
    price: 14.99, compareAtPrice: null, currency: 'USD', sku: '4-piece-set-accessory', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'girls', ageGroup: 'Baby',
    categoryId: '2', stockQuantity: 8, rating: 4.5, reviewCount: 0,
    category: categories[1],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '58', name: '4-piece Set Accessory', nameAr: 'طقم', slug: '4-piece-set-accessory-2', 
    description: 'A complete, ready-to-gift set — beautifully coordinated so you don\'t have to mix and match. This 4-piece set accessory comes as a coordinated set — great value and an easy gift. Unisex design suits any little one. Choose from Beige, Ecru. Soft, breathable cotton-blend fabric. Machine wash cold, gen', descriptionAr: 'طقم كامل ومنسّق، جاهز كهدية حلوة وما بدّك تجمّع القطع لحالك. هيدا طقم منسّق، قيمة حلوة وهدية سهلة. تصميم مناسب للبنت والصبي. بتختاري بين بيج, إكرو. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'A complete, ready-to-gift set — beautifully coordinated so you don\'t have to mix and match.', shortDescriptionAr: 'طقم كامل ومنسّق، جاهز كهدية حلوة وما بدّك تجمّع القطع لحالك.',
    price: 14.99, compareAtPrice: null, currency: 'USD', sku: '4-piece-set-accessory-2', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'unisex', ageGroup: 'Baby',
    categoryId: '2', stockQuantity: 8, rating: 4.5, reviewCount: 0,
    category: categories[1],
    images: [],
    colors: [{ id: '58c0', name: 'Ecru', nameAr: 'Ecru', hexCode: '#F5F0E6' }, { id: '58c1', name: 'Beige', nameAr: 'Beige', hexCode: '#D4C4B0' }],
    sizes: []
  },
{
    id: '59', name: '4-piece Set Accessory', nameAr: 'طقم', slug: '4-piece-set-accessory-3', 
    description: 'A complete, ready-to-gift set — beautifully coordinated so you don\'t have to mix and match. This 4-piece set accessory comes as a coordinated set — great value and an easy gift. Unisex design suits any little one. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from ', descriptionAr: 'طقم كامل ومنسّق، جاهز كهدية حلوة وما بدّك تجمّع القطع لحالك. هيدا طقم منسّق، قيمة حلوة وهدية سهلة. تصميم مناسب للبنت والصبي. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'A complete, ready-to-gift set — beautifully coordinated so you don\'t have to mix and match.', shortDescriptionAr: 'طقم كامل ومنسّق، جاهز كهدية حلوة وما بدّك تجمّع القطع لحالك.',
    price: 14.99, compareAtPrice: null, currency: 'USD', sku: '4-piece-set-accessory-3', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'unisex', ageGroup: 'Baby',
    categoryId: '2', stockQuantity: 8, rating: 4.5, reviewCount: 0,
    category: categories[1],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '60', name: '4-piece Set Accessory', nameAr: 'طقم', slug: '4-piece-set-accessory-4', 
    description: 'A complete, ready-to-gift set — beautifully coordinated so you don\'t have to mix and match. This 4-piece set accessory comes as a coordinated set — great value and an easy gift. Unisex design suits any little one. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from ', descriptionAr: 'طقم كامل ومنسّق، جاهز كهدية حلوة وما بدّك تجمّع القطع لحالك. هيدا طقم منسّق، قيمة حلوة وهدية سهلة. تصميم مناسب للبنت والصبي. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'A complete, ready-to-gift set — beautifully coordinated so you don\'t have to mix and match.', shortDescriptionAr: 'طقم كامل ومنسّق، جاهز كهدية حلوة وما بدّك تجمّع القطع لحالك.',
    price: 14.99, compareAtPrice: null, currency: 'USD', sku: '4-piece-set-accessory-4', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'unisex', ageGroup: 'Baby',
    categoryId: '2', stockQuantity: 8, rating: 4.5, reviewCount: 0,
    category: categories[1],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '61', name: '10-piece Hospital Set', nameAr: 'طقم مستشفى ١٠ قطع', slug: '10-piece-hospital-set', 
    description: 'A complete, ready-to-gift set — beautifully coordinated so you don\'t have to mix and match. This 10-piece hospital set comes as a coordinated set — great value and an easy gift. Unisex design suits any little one. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from ', descriptionAr: 'طقم كامل ومنسّق، جاهز كهدية حلوة وما بدّك تجمّع القطع لحالك. هيدا طقم مستشفى ١٠ قطع منسّق، قيمة حلوة وهدية سهلة. تصميم مناسب للبنت والصبي. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'A complete, ready-to-gift set — beautifully coordinated so you don\'t have to mix and match.', shortDescriptionAr: 'طقم كامل ومنسّق، جاهز كهدية حلوة وما بدّك تجمّع القطع لحالك.',
    price: 85.99, compareAtPrice: null, currency: 'USD', sku: '10-piece-hospital-set', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'unisex', ageGroup: 'Baby',
    categoryId: '2', stockQuantity: 1, rating: 4.5, reviewCount: 0,
    category: categories[1],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '62', name: '2-piece Set', nameAr: 'طقم قطعتين', slug: '2-piece-set-4', 
    description: 'A complete, ready-to-gift set — beautifully coordinated so you don\'t have to mix and match. This 2-piece set comes as a coordinated set — great value and an easy gift. Unisex design suits any little one. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'طقم كامل ومنسّق، جاهز كهدية حلوة وما بدّك تجمّع القطع لحالك. هيدا طقم قطعتين منسّق، قيمة حلوة وهدية سهلة. تصميم مناسب للبنت والصبي. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'A complete, ready-to-gift set — beautifully coordinated so you don\'t have to mix and match.', shortDescriptionAr: 'طقم كامل ومنسّق، جاهز كهدية حلوة وما بدّك تجمّع القطع لحالك.',
    price: 33.99, compareAtPrice: null, currency: 'USD', sku: '2-piece-set-4', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'unisex', ageGroup: 'Baby',
    categoryId: '2', stockQuantity: 15, rating: 4.5, reviewCount: 0,
    category: categories[1],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '63', name: 'Zip Bodysuit Set', nameAr: 'طقم', slug: 'zip-bodysuit-set', 
    description: 'A complete, ready-to-gift set — beautifully coordinated so you don\'t have to mix and match. This zip bodysuit set comes as a coordinated set — great value and an easy gift. Unisex design suits any little one. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turke', descriptionAr: 'طقم كامل ومنسّق، جاهز كهدية حلوة وما بدّك تجمّع القطع لحالك. هيدا طقم منسّق، قيمة حلوة وهدية سهلة. تصميم مناسب للبنت والصبي. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'A complete, ready-to-gift set — beautifully coordinated so you don\'t have to mix and match.', shortDescriptionAr: 'طقم كامل ومنسّق، جاهز كهدية حلوة وما بدّك تجمّع القطع لحالك.',
    price: 21.99, compareAtPrice: null, currency: 'USD', sku: 'zip-bodysuit-set', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'unisex', ageGroup: 'Baby',
    categoryId: '2', stockQuantity: 5, rating: 4.5, reviewCount: 0,
    category: categories[1],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '64', name: '2-piece Set', nameAr: 'طقم قطعتين', slug: '2-piece-set-5', 
    description: 'A complete, ready-to-gift set — beautifully coordinated so you don\'t have to mix and match. This 2-piece set comes as a coordinated set — great value and an easy gift. Unisex design suits any little one. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'طقم كامل ومنسّق، جاهز كهدية حلوة وما بدّك تجمّع القطع لحالك. هيدا طقم قطعتين منسّق، قيمة حلوة وهدية سهلة. تصميم مناسب للبنت والصبي. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'A complete, ready-to-gift set — beautifully coordinated so you don\'t have to mix and match.', shortDescriptionAr: 'طقم كامل ومنسّق، جاهز كهدية حلوة وما بدّك تجمّع القطع لحالك.',
    price: 40.99, compareAtPrice: null, currency: 'USD', sku: '2-piece-set-5', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'unisex', ageGroup: 'Baby',
    categoryId: '2', stockQuantity: 15, rating: 4.5, reviewCount: 0,
    category: categories[1],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '65', name: 'Short Set', nameAr: 'طقم شورت', slug: 'short-set', 
    description: 'A complete, ready-to-gift set — beautifully coordinated so you don\'t have to mix and match. This short set comes as a coordinated set — great value and an easy gift. Unisex design suits any little one. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'طقم كامل ومنسّق، جاهز كهدية حلوة وما بدّك تجمّع القطع لحالك. هيدا طقم شورت منسّق، قيمة حلوة وهدية سهلة. تصميم مناسب للبنت والصبي. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'A complete, ready-to-gift set — beautifully coordinated so you don\'t have to mix and match.', shortDescriptionAr: 'طقم كامل ومنسّق، جاهز كهدية حلوة وما بدّك تجمّع القطع لحالك.',
    price: 38.99, compareAtPrice: null, currency: 'USD', sku: 'short-set', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'unisex', ageGroup: 'Baby',
    categoryId: '2', stockQuantity: 5, rating: 4.5, reviewCount: 0,
    category: categories[1],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '66', name: '2-piece Set', nameAr: 'طقم قطعتين', slug: '2-piece-set-6', 
    description: 'A complete, ready-to-gift set — beautifully coordinated so you don\'t have to mix and match. This 2-piece set comes as a coordinated set — great value and an easy gift. Unisex design suits any little one. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'طقم كامل ومنسّق، جاهز كهدية حلوة وما بدّك تجمّع القطع لحالك. هيدا طقم قطعتين منسّق، قيمة حلوة وهدية سهلة. تصميم مناسب للبنت والصبي. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'A complete, ready-to-gift set — beautifully coordinated so you don\'t have to mix and match.', shortDescriptionAr: 'طقم كامل ومنسّق، جاهز كهدية حلوة وما بدّك تجمّع القطع لحالك.',
    price: 31.99, compareAtPrice: null, currency: 'USD', sku: '2-piece-set-6', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'unisex', ageGroup: 'Baby',
    categoryId: '2', stockQuantity: 15, rating: 4.5, reviewCount: 0,
    category: categories[1],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '67', name: '10-piece Set', nameAr: 'طقم ١٠ قطع', slug: '10-piece-set', 
    description: 'A complete, ready-to-gift set — beautifully coordinated so you don\'t have to mix and match. This 10-piece set comes as a coordinated set — great value and an easy gift. Unisex design suits any little one. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'طقم كامل ومنسّق، جاهز كهدية حلوة وما بدّك تجمّع القطع لحالك. هيدا طقم ١٠ قطع منسّق، قيمة حلوة وهدية سهلة. تصميم مناسب للبنت والصبي. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'A complete, ready-to-gift set — beautifully coordinated so you don\'t have to mix and match.', shortDescriptionAr: 'طقم كامل ومنسّق، جاهز كهدية حلوة وما بدّك تجمّع القطع لحالك.',
    price: 116.99, compareAtPrice: null, currency: 'USD', sku: '10-piece-set', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'unisex', ageGroup: 'Baby',
    categoryId: '2', stockQuantity: 3, rating: 4.5, reviewCount: 0,
    category: categories[1],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '68', name: '10-piece Set', nameAr: 'طقم ١٠ قطع', slug: '10-piece-set-2', 
    description: 'A complete, ready-to-gift set — beautifully coordinated so you don\'t have to mix and match. This 10-piece set comes as a coordinated set — great value and an easy gift. Unisex design suits any little one. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'طقم كامل ومنسّق، جاهز كهدية حلوة وما بدّك تجمّع القطع لحالك. هيدا طقم ١٠ قطع منسّق، قيمة حلوة وهدية سهلة. تصميم مناسب للبنت والصبي. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'A complete, ready-to-gift set — beautifully coordinated so you don\'t have to mix and match.', shortDescriptionAr: 'طقم كامل ومنسّق، جاهز كهدية حلوة وما بدّك تجمّع القطع لحالك.',
    price: 116.99, compareAtPrice: null, currency: 'USD', sku: '10-piece-set-2', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'unisex', ageGroup: 'Baby',
    categoryId: '2', stockQuantity: 3, rating: 4.5, reviewCount: 0,
    category: categories[1],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '69', name: '10-piece Set', nameAr: 'طقم ١٠ قطع', slug: '10-piece-set-3', 
    description: 'A complete, ready-to-gift set — beautifully coordinated so you don\'t have to mix and match. This 10-piece set comes as a coordinated set — great value and an easy gift. Unisex design suits any little one. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'طقم كامل ومنسّق، جاهز كهدية حلوة وما بدّك تجمّع القطع لحالك. هيدا طقم ١٠ قطع منسّق، قيمة حلوة وهدية سهلة. تصميم مناسب للبنت والصبي. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'A complete, ready-to-gift set — beautifully coordinated so you don\'t have to mix and match.', shortDescriptionAr: 'طقم كامل ومنسّق، جاهز كهدية حلوة وما بدّك تجمّع القطع لحالك.',
    price: 135.99, compareAtPrice: null, currency: 'USD', sku: '10-piece-set-3', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'unisex', ageGroup: 'Baby',
    categoryId: '2', stockQuantity: 3, rating: 4.5, reviewCount: 0,
    category: categories[1],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '70', name: 'Footed Tights', nameAr: 'كولون بكلسات', slug: 'footed-tights', 
    description: 'The finishing touch every little outfit needs. A footed tights designed for babies. Unisex design suits any little one. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'اللمسة الأخيرة يلي بتكمّل إطلالة صغيرك. كولون بكلسات للبيبيهات. تصميم مناسب للبنت والصبي. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'The finishing touch every little outfit needs.', shortDescriptionAr: 'اللمسة الأخيرة يلي بتكمّل إطلالة صغيرك.',
    price: 5.99, compareAtPrice: null, currency: 'USD', sku: 'footed-tights', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'unisex', ageGroup: 'Baby',
    categoryId: '3', stockQuantity: 36, rating: 4.5, reviewCount: 0,
    category: categories[2],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '71', name: 'Footed Tights', nameAr: 'كولون بكلسات', slug: 'footed-tights-2', 
    description: 'The finishing touch every little outfit needs. A footed tights designed for babies. Unisex design suits any little one. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'اللمسة الأخيرة يلي بتكمّل إطلالة صغيرك. كولون بكلسات للبيبيهات. تصميم مناسب للبنت والصبي. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'The finishing touch every little outfit needs.', shortDescriptionAr: 'اللمسة الأخيرة يلي بتكمّل إطلالة صغيرك.',
    price: 7.99, compareAtPrice: null, currency: 'USD', sku: 'footed-tights-2', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'unisex', ageGroup: 'Baby',
    categoryId: '3', stockQuantity: 36, rating: 4.5, reviewCount: 0,
    category: categories[2],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '72', name: '2-pair Abs Socks', nameAr: 'كلسات ٢ جوز ABS مانعة للتزحلق', slug: '2-pair-abs-socks', 
    description: 'The finishing touch every little outfit needs. A 2-pair abs socks designed for babies. Unisex design suits any little one. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'اللمسة الأخيرة يلي بتكمّل إطلالة صغيرك. كلسات ٢ جوز ABS مانعة للتزحلق للبيبيهات. تصميم مناسب للبنت والصبي. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'The finishing touch every little outfit needs.', shortDescriptionAr: 'اللمسة الأخيرة يلي بتكمّل إطلالة صغيرك.',
    price: 66.99, compareAtPrice: null, currency: 'USD', sku: '2-pair-abs-socks', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'unisex', ageGroup: 'Baby',
    categoryId: '3', stockQuantity: 7, rating: 4.5, reviewCount: 0,
    category: categories[2],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '73', name: '2-pair Abs Socks', nameAr: 'كلسات ٢ جوز ABS مانعة للتزحلق', slug: '2-pair-abs-socks-2', 
    description: 'The finishing touch every little outfit needs. A 2-pair abs socks designed for babies. Unisex design suits any little one. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'اللمسة الأخيرة يلي بتكمّل إطلالة صغيرك. كلسات ٢ جوز ABS مانعة للتزحلق للبيبيهات. تصميم مناسب للبنت والصبي. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'The finishing touch every little outfit needs.', shortDescriptionAr: 'اللمسة الأخيرة يلي بتكمّل إطلالة صغيرك.',
    price: 66.99, compareAtPrice: null, currency: 'USD', sku: '2-pair-abs-socks-2', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'unisex', ageGroup: 'Baby',
    categoryId: '3', stockQuantity: 7, rating: 4.5, reviewCount: 0,
    category: categories[2],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '74', name: '2-pair Abs Socks', nameAr: 'كلسات ٢ جوز ABS مانعة للتزحلق', slug: '2-pair-abs-socks-3', 
    description: 'The finishing touch every little outfit needs. A 2-pair abs socks designed for babies. Unisex design suits any little one. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'اللمسة الأخيرة يلي بتكمّل إطلالة صغيرك. كلسات ٢ جوز ABS مانعة للتزحلق للبيبيهات. تصميم مناسب للبنت والصبي. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'The finishing touch every little outfit needs.', shortDescriptionAr: 'اللمسة الأخيرة يلي بتكمّل إطلالة صغيرك.',
    price: 66.99, compareAtPrice: null, currency: 'USD', sku: '2-pair-abs-socks-3', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'unisex', ageGroup: 'Baby',
    categoryId: '3', stockQuantity: 7, rating: 4.5, reviewCount: 0,
    category: categories[2],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '75', name: '2-pair Abs Socks', nameAr: 'كلسات ٢ جوز ABS مانعة للتزحلق', slug: '2-pair-abs-socks-4', 
    description: 'The finishing touch every little outfit needs. A 2-pair abs socks designed for babies. Unisex design suits any little one. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'اللمسة الأخيرة يلي بتكمّل إطلالة صغيرك. كلسات ٢ جوز ABS مانعة للتزحلق للبيبيهات. تصميم مناسب للبنت والصبي. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'The finishing touch every little outfit needs.', shortDescriptionAr: 'اللمسة الأخيرة يلي بتكمّل إطلالة صغيرك.',
    price: 56.99, compareAtPrice: null, currency: 'USD', sku: '2-pair-abs-socks-4', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'unisex', ageGroup: 'Baby',
    categoryId: '3', stockQuantity: 7, rating: 4.5, reviewCount: 0,
    category: categories[2],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '76', name: 'Socks', nameAr: 'كلسات', slug: 'socks', 
    description: 'The finishing touch every little outfit needs. A socks designed for babies. Unisex design suits any little one. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'اللمسة الأخيرة يلي بتكمّل إطلالة صغيرك. كلسات للبيبيهات. تصميم مناسب للبنت والصبي. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'The finishing touch every little outfit needs.', shortDescriptionAr: 'اللمسة الأخيرة يلي بتكمّل إطلالة صغيرك.',
    price: 43.99, compareAtPrice: null, currency: 'USD', sku: 'socks', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'unisex', ageGroup: 'Baby',
    categoryId: '3', stockQuantity: 7, rating: 4.5, reviewCount: 0,
    category: categories[2],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '77', name: '2-pair Abs Socks', nameAr: 'كلسات ٢ جوز ABS مانعة للتزحلق', slug: '2-pair-abs-socks-5', 
    description: 'The finishing touch every little outfit needs. A 2-pair abs socks designed for babies. Unisex design suits any little one. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'اللمسة الأخيرة يلي بتكمّل إطلالة صغيرك. كلسات ٢ جوز ABS مانعة للتزحلق للبيبيهات. تصميم مناسب للبنت والصبي. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'The finishing touch every little outfit needs.', shortDescriptionAr: 'اللمسة الأخيرة يلي بتكمّل إطلالة صغيرك.',
    price: 61.99, compareAtPrice: null, currency: 'USD', sku: '2-pair-abs-socks-5', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'unisex', ageGroup: 'Baby',
    categoryId: '3', stockQuantity: 7, rating: 4.5, reviewCount: 0,
    category: categories[2],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '78', name: '2-pair Abs Socks', nameAr: 'كلسات ٢ جوز ABS مانعة للتزحلق', slug: '2-pair-abs-socks-6', 
    description: 'The finishing touch every little outfit needs. A 2-pair abs socks designed for babies. Unisex design suits any little one. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'اللمسة الأخيرة يلي بتكمّل إطلالة صغيرك. كلسات ٢ جوز ABS مانعة للتزحلق للبيبيهات. تصميم مناسب للبنت والصبي. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'The finishing touch every little outfit needs.', shortDescriptionAr: 'اللمسة الأخيرة يلي بتكمّل إطلالة صغيرك.',
    price: 61.99, compareAtPrice: null, currency: 'USD', sku: '2-pair-abs-socks-6', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'unisex', ageGroup: 'Baby',
    categoryId: '3', stockQuantity: 7, rating: 4.5, reviewCount: 0,
    category: categories[2],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '79', name: '3-pair Socks', nameAr: 'كلسات ٣ جوزات', slug: '3-pair-socks', 
    description: 'The finishing touch every little outfit needs. A 3-pair socks designed for babies. Unisex design suits any little one. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'اللمسة الأخيرة يلي بتكمّل إطلالة صغيرك. كلسات ٣ جوزات للبيبيهات. تصميم مناسب للبنت والصبي. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'The finishing touch every little outfit needs.', shortDescriptionAr: 'اللمسة الأخيرة يلي بتكمّل إطلالة صغيرك.',
    price: 72.99, compareAtPrice: null, currency: 'USD', sku: '3-pair-socks', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'unisex', ageGroup: 'Baby',
    categoryId: '3', stockQuantity: 2, rating: 4.5, reviewCount: 0,
    category: categories[2],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '80', name: 'Knee-high Socks', nameAr: 'كلسات لتحت الركبة', slug: 'knee-high-socks', 
    description: 'The finishing touch every little outfit needs. A knee-high socks designed for babies. Unisex design suits any little one. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'اللمسة الأخيرة يلي بتكمّل إطلالة صغيرك. كلسات لتحت الركبة للبيبيهات. تصميم مناسب للبنت والصبي. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'The finishing touch every little outfit needs.', shortDescriptionAr: 'اللمسة الأخيرة يلي بتكمّل إطلالة صغيرك.',
    price: 30.99, compareAtPrice: null, currency: 'USD', sku: 'knee-high-socks', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'unisex', ageGroup: 'Baby',
    categoryId: '3', stockQuantity: 2, rating: 4.5, reviewCount: 0,
    category: categories[2],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '81', name: 'Knee-high Socks', nameAr: 'كلسات لتحت الركبة', slug: 'knee-high-socks-2', 
    description: 'The finishing touch every little outfit needs. A knee-high socks designed for babies. Unisex design suits any little one. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'اللمسة الأخيرة يلي بتكمّل إطلالة صغيرك. كلسات لتحت الركبة للبيبيهات. تصميم مناسب للبنت والصبي. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'The finishing touch every little outfit needs.', shortDescriptionAr: 'اللمسة الأخيرة يلي بتكمّل إطلالة صغيرك.',
    price: 42.99, compareAtPrice: null, currency: 'USD', sku: 'knee-high-socks-2', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'unisex', ageGroup: 'Baby',
    categoryId: '3', stockQuantity: 2, rating: 4.5, reviewCount: 0,
    category: categories[2],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '82', name: 'Dress', nameAr: 'فستان', slug: 'dress-2', 
    description: 'Adorable everyday wear that keeps your little one comfy from morning to nap time. A dress designed for babies. Unisex design suits any little one. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'لبس ناعم ومريح يخلّي صغيرك مرتاح من الصبح لوقت النوم. فستان للبيبيهات. تصميم مناسب للبنت والصبي. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'Adorable everyday wear that keeps your little one comfy from morning to nap time.', shortDescriptionAr: 'لبس ناعم ومريح يخلّي صغيرك مرتاح من الصبح لوقت النوم.',
    price: 27.99, compareAtPrice: null, currency: 'USD', sku: 'dress-2', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'unisex', ageGroup: 'Baby',
    categoryId: '1', stockQuantity: 5, rating: 4.5, reviewCount: 0,
    category: categories[0],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '83', name: 'Babymy Unisex Baby Bathrobe', nameAr: 'روب حمّام', slug: 'babymy-unisex-baby-bathrobe', 
    description: 'Adorable everyday wear that keeps your little one comfy from morning to nap time. A bathrobe designed for babies. Designed for boys. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'لبس ناعم ومريح يخلّي صغيرك مرتاح من الصبح لوقت النوم. روب حمّام (برنس) للبيبيهات. تصميم للصبيان. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'Adorable everyday wear that keeps your little one comfy from morning to nap time.', shortDescriptionAr: 'لبس ناعم ومريح يخلّي صغيرك مرتاح من الصبح لوقت النوم.',
    price: 13.99, compareAtPrice: null, currency: 'USD', sku: 'babymy-unisex-baby-bathrobe', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'boys', ageGroup: 'Baby',
    categoryId: '1', stockQuantity: 10, rating: 4.5, reviewCount: 0,
    category: categories[0],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '84', name: 'Babymy Unisex Baby Bathrobe', nameAr: 'روب حمّام', slug: 'babymy-unisex-baby-bathrobe-2', 
    description: 'Adorable everyday wear that keeps your little one comfy from morning to nap time. A bathrobe designed for babies. Designed for boys. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'لبس ناعم ومريح يخلّي صغيرك مرتاح من الصبح لوقت النوم. روب حمّام (برنس) للبيبيهات. تصميم للصبيان. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'Adorable everyday wear that keeps your little one comfy from morning to nap time.', shortDescriptionAr: 'لبس ناعم ومريح يخلّي صغيرك مرتاح من الصبح لوقت النوم.',
    price: 13.99, compareAtPrice: null, currency: 'USD', sku: 'babymy-unisex-baby-bathrobe-2', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'boys', ageGroup: 'Baby',
    categoryId: '1', stockQuantity: 10, rating: 4.5, reviewCount: 0,
    category: categories[0],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '85', name: 'Babymy Unisex Baby Bathrobe', nameAr: 'روب حمّام', slug: 'babymy-unisex-baby-bathrobe-3', 
    description: 'Adorable everyday wear that keeps your little one comfy from morning to nap time. A bathrobe designed for babies. Designed for boys. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'لبس ناعم ومريح يخلّي صغيرك مرتاح من الصبح لوقت النوم. روب حمّام (برنس) للبيبيهات. تصميم للصبيان. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'Adorable everyday wear that keeps your little one comfy from morning to nap time.', shortDescriptionAr: 'لبس ناعم ومريح يخلّي صغيرك مرتاح من الصبح لوقت النوم.',
    price: 13.99, compareAtPrice: null, currency: 'USD', sku: 'babymy-unisex-baby-bathrobe-3', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'boys', ageGroup: 'Baby',
    categoryId: '1', stockQuantity: 10, rating: 4.5, reviewCount: 0,
    category: categories[0],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '86', name: 'Ramel Girl Baby Bathrobe', nameAr: 'روب حمّام', slug: 'ramel-girl-baby-bathrobe', 
    description: 'Adorable everyday wear that keeps your little one comfy from morning to nap time. A bathrobe designed for babies. Designed for girls. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'لبس ناعم ومريح يخلّي صغيرك مرتاح من الصبح لوقت النوم. روب حمّام (برنس) للبيبيهات. تصميم للبنات. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'Adorable everyday wear that keeps your little one comfy from morning to nap time.', shortDescriptionAr: 'لبس ناعم ومريح يخلّي صغيرك مرتاح من الصبح لوقت النوم.',
    price: 36.99, compareAtPrice: null, currency: 'USD', sku: 'ramel-girl-baby-bathrobe', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'girls', ageGroup: 'Baby',
    categoryId: '1', stockQuantity: 1, rating: 4.5, reviewCount: 0,
    category: categories[0],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '87', name: 'Ramel Boy Baby Bathrobe', nameAr: 'روب حمّام', slug: 'ramel-boy-baby-bathrobe', 
    description: 'Adorable everyday wear that keeps your little one comfy from morning to nap time. A bathrobe designed for babies. Designed for boys. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'لبس ناعم ومريح يخلّي صغيرك مرتاح من الصبح لوقت النوم. روب حمّام (برنس) للبيبيهات. تصميم للصبيان. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'Adorable everyday wear that keeps your little one comfy from morning to nap time.', shortDescriptionAr: 'لبس ناعم ومريح يخلّي صغيرك مرتاح من الصبح لوقت النوم.',
    price: 35.99, compareAtPrice: null, currency: 'USD', sku: 'ramel-boy-baby-bathrobe', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'boys', ageGroup: 'Baby',
    categoryId: '1', stockQuantity: 1, rating: 4.5, reviewCount: 0,
    category: categories[0],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '88', name: 'Ramel Unisex Kids Bathrobe', nameAr: 'روب حمّام', slug: 'ramel-unisex-kids-bathrobe', 
    description: 'Adorable everyday wear that keeps your little one comfy from morning to nap time. A bathrobe designed for babies. Unisex design suits any little one. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'لبس ناعم ومريح يخلّي صغيرك مرتاح من الصبح لوقت النوم. روب حمّام (برنس) للبيبيهات. تصميم مناسب للبنت والصبي. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'Adorable everyday wear that keeps your little one comfy from morning to nap time.', shortDescriptionAr: 'لبس ناعم ومريح يخلّي صغيرك مرتاح من الصبح لوقت النوم.',
    price: 33.99, compareAtPrice: null, currency: 'USD', sku: 'ramel-unisex-kids-bathrobe', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'unisex', ageGroup: 'Baby',
    categoryId: '1', stockQuantity: 2, rating: 4.5, reviewCount: 0,
    category: categories[0],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '89', name: 'Girls Hat', nameAr: 'طاقية بناتي', slug: 'girls-hat', 
    description: 'The finishing touch every little outfit needs. A girls hat designed for little ones. Designed for girls. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'اللمسة الأخيرة يلي بتكمّل إطلالة صغيرك. طاقية بناتي للصغار. تصميم للبنات. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'The finishing touch every little outfit needs.', shortDescriptionAr: 'اللمسة الأخيرة يلي بتكمّل إطلالة صغيرك.',
    price: 6.99, compareAtPrice: null, currency: 'USD', sku: 'girls-hat', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'girls', ageGroup: 'Baby/Toddler',
    categoryId: '3', stockQuantity: 5, rating: 4.5, reviewCount: 0,
    category: categories[2],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '90', name: 'Polar Bear Hooded Pajama', nameAr: 'لبس نوم', slug: 'polar-bear-hooded-pajama', 
    description: 'Cozy, gentle sleepwear for sweeter, calmer nights. A polar bear hooded pajama designed for little ones. Unisex design suits any little one. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'لبس نوم ناعم ودافي لليالي أهدأ وأحلى. لبس نوم للصغار. تصميم مناسب للبنت والصبي. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'Cozy, gentle sleepwear for sweeter, calmer nights.', shortDescriptionAr: 'لبس نوم ناعم ودافي لليالي أهدأ وأحلى.',
    price: 16.99, compareAtPrice: null, currency: 'USD', sku: 'polar-bear-hooded-pajama', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'unisex', ageGroup: 'Baby/Toddler',
    categoryId: '5', stockQuantity: 4, rating: 4.5, reviewCount: 0,
    category: categories[4],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '91', name: 'Star Pajama', nameAr: 'لبس نوم', slug: 'star-pajama', 
    description: 'Cozy, gentle sleepwear for sweeter, calmer nights. A star pajama designed for little ones. Unisex design suits any little one. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'لبس نوم ناعم ودافي لليالي أهدأ وأحلى. لبس نوم للصغار. تصميم مناسب للبنت والصبي. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'Cozy, gentle sleepwear for sweeter, calmer nights.', shortDescriptionAr: 'لبس نوم ناعم ودافي لليالي أهدأ وأحلى.',
    price: 16.99, compareAtPrice: null, currency: 'USD', sku: 'star-pajama', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'unisex', ageGroup: 'Baby/Toddler',
    categoryId: '5', stockQuantity: 4, rating: 4.5, reviewCount: 0,
    category: categories[4],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '92', name: 'Color Pajama Set', nameAr: 'لبس نوم', slug: 'color-pajama-set', 
    description: 'Cozy, gentle sleepwear for sweeter, calmer nights. A color pajama set designed for little ones. Unisex design suits any little one. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'لبس نوم ناعم ودافي لليالي أهدأ وأحلى. لبس نوم للصغار. تصميم مناسب للبنت والصبي. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'Cozy, gentle sleepwear for sweeter, calmer nights.', shortDescriptionAr: 'لبس نوم ناعم ودافي لليالي أهدأ وأحلى.',
    price: 6.99, compareAtPrice: null, currency: 'USD', sku: 'color-pajama-set', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'unisex', ageGroup: 'Baby/Toddler',
    categoryId: '5', stockQuantity: 12, rating: 4.5, reviewCount: 0,
    category: categories[4],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '93', name: 'Red Pajama', nameAr: 'لبس نوم', slug: 'red-pajama', 
    description: 'Cozy, gentle sleepwear for sweeter, calmer nights. A red pajama designed for little ones. Unisex design suits any little one. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'لبس نوم ناعم ودافي لليالي أهدأ وأحلى. لبس نوم للصغار. تصميم مناسب للبنت والصبي. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'Cozy, gentle sleepwear for sweeter, calmer nights.', shortDescriptionAr: 'لبس نوم ناعم ودافي لليالي أهدأ وأحلى.',
    price: 18.99, compareAtPrice: null, currency: 'USD', sku: 'red-pajama', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'unisex', ageGroup: 'Baby/Toddler',
    categoryId: '5', stockQuantity: 4, rating: 4.5, reviewCount: 0,
    category: categories[4],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '94', name: 'Color Pajama', nameAr: 'بيجاما قطن ملوّنة', slug: 'color-pajama', 
    description: 'Cozy, gentle sleepwear for sweeter, calmer nights. A color pajama designed for little ones. Unisex design suits any little one. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'لبس نوم ناعم ودافي لليالي أهدأ وأحلى. بيجاما قطن ملوّنة للصغار. تصميم مناسب للبنت والصبي. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'Cozy, gentle sleepwear for sweeter, calmer nights.', shortDescriptionAr: 'لبس نوم ناعم ودافي لليالي أهدأ وأحلى.',
    price: 6.99, compareAtPrice: null, currency: 'USD', sku: 'color-pajama', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'unisex', ageGroup: 'Baby/Toddler',
    categoryId: '5', stockQuantity: 12, rating: 4.5, reviewCount: 0,
    category: categories[4],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '95', name: 'Pajama', nameAr: 'بيجاما قطن', slug: 'pajama', 
    description: 'Cozy, gentle sleepwear for sweeter, calmer nights. A pajama designed for little ones. Unisex design suits any little one. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'لبس نوم ناعم ودافي لليالي أهدأ وأحلى. بيجاما قطن للصغار. تصميم مناسب للبنت والصبي. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'Cozy, gentle sleepwear for sweeter, calmer nights.', shortDescriptionAr: 'لبس نوم ناعم ودافي لليالي أهدأ وأحلى.',
    price: 16.99, compareAtPrice: null, currency: 'USD', sku: 'pajama', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'unisex', ageGroup: 'Baby/Toddler',
    categoryId: '5', stockQuantity: 12, rating: 4.5, reviewCount: 0,
    category: categories[4],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '96', name: 'Fruit Pajama', nameAr: 'بيجاما أوفرول', slug: 'fruit-pajama', 
    description: 'Cozy, gentle sleepwear for sweeter, calmer nights. A fruit pajama designed for little ones. Unisex design suits any little one. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'لبس نوم ناعم ودافي لليالي أهدأ وأحلى. بيجاما أوفرول للصغار. تصميم مناسب للبنت والصبي. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'Cozy, gentle sleepwear for sweeter, calmer nights.', shortDescriptionAr: 'لبس نوم ناعم ودافي لليالي أهدأ وأحلى.',
    price: 22.99, compareAtPrice: null, currency: 'USD', sku: 'fruit-pajama', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'unisex', ageGroup: 'Baby/Toddler',
    categoryId: '5', stockQuantity: 8, rating: 4.5, reviewCount: 0,
    category: categories[4],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '97', name: 'Fruit Pajama', nameAr: 'لبس نوم', slug: 'fruit-pajama-2', 
    description: 'Cozy, gentle sleepwear for sweeter, calmer nights. A fruit pajama designed for little ones. Unisex design suits any little one. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'لبس نوم ناعم ودافي لليالي أهدأ وأحلى. لبس نوم للصغار. تصميم مناسب للبنت والصبي. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'Cozy, gentle sleepwear for sweeter, calmer nights.', shortDescriptionAr: 'لبس نوم ناعم ودافي لليالي أهدأ وأحلى.',
    price: 22.99, compareAtPrice: null, currency: 'USD', sku: 'fruit-pajama-2', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'unisex', ageGroup: 'Baby/Toddler',
    categoryId: '5', stockQuantity: 8, rating: 4.5, reviewCount: 0,
    category: categories[4],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '98', name: 'Boy Short+t-shirt Set', nameAr: 'لبس', slug: 'boy-short-t-shirt-set', 
    description: 'Adorable everyday wear that keeps your little one comfy from morning to nap time. This boy short+t-shirt set comes as a coordinated set — great value and an easy gift. Unisex design suits any little one. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'لبس ناعم ومريح يخلّي صغيرك مرتاح من الصبح لوقت النوم. لبس للصغار. تصميم مناسب للبنت والصبي. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'Adorable everyday wear that keeps your little one comfy from morning to nap time.', shortDescriptionAr: 'لبس ناعم ومريح يخلّي صغيرك مرتاح من الصبح لوقت النوم.',
    price: 21.99, compareAtPrice: null, currency: 'USD', sku: 'boy-short-t-shirt-set', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'unisex', ageGroup: 'Baby/Toddler',
    categoryId: '1', stockQuantity: 4, rating: 4.5, reviewCount: 0,
    category: categories[0],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '99', name: 'Boy T-shirt+short Set', nameAr: 'لبس', slug: 'boy-t-shirt-short-set', 
    description: 'Adorable everyday wear that keeps your little one comfy from morning to nap time. This boy t-shirt+short set comes as a coordinated set — great value and an easy gift. Unisex design suits any little one. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'لبس ناعم ومريح يخلّي صغيرك مرتاح من الصبح لوقت النوم. لبس للصغار. تصميم مناسب للبنت والصبي. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'Adorable everyday wear that keeps your little one comfy from morning to nap time.', shortDescriptionAr: 'لبس ناعم ومريح يخلّي صغيرك مرتاح من الصبح لوقت النوم.',
    price: 21.99, compareAtPrice: null, currency: 'USD', sku: 'boy-t-shirt-short-set', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'unisex', ageGroup: 'Baby/Toddler',
    categoryId: '1', stockQuantity: 4, rating: 4.5, reviewCount: 0,
    category: categories[0],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '100', name: 'Girl Set T-shirt+short', nameAr: 'لبس', slug: 'girl-set-t-shirt-short', 
    description: 'Adorable everyday wear that keeps your little one comfy from morning to nap time. This girl set t-shirt+short comes as a coordinated set — great value and an easy gift. Designed for girls. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'لبس ناعم ومريح يخلّي صغيرك مرتاح من الصبح لوقت النوم. لبس للصغار. تصميم للبنات. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'Adorable everyday wear that keeps your little one comfy from morning to nap time.', shortDescriptionAr: 'لبس ناعم ومريح يخلّي صغيرك مرتاح من الصبح لوقت النوم.',
    price: 21.99, compareAtPrice: null, currency: 'USD', sku: 'girl-set-t-shirt-short', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'girls', ageGroup: 'Baby/Toddler',
    categoryId: '1', stockQuantity: 4, rating: 4.5, reviewCount: 0,
    category: categories[0],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '101', name: 'Snap Pajama Set', nameAr: 'طقم بيجاما بكبسات', slug: 'snap-pajama-set', 
    description: 'Cozy, gentle sleepwear for sweeter, calmer nights. This snap pajama set comes as a coordinated set — great value and an easy gift. Unisex design suits any little one. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'لبس نوم ناعم ودافي لليالي أهدأ وأحلى. هيدا طقم بيجاما بكبسات منسّق، قيمة حلوة وهدية سهلة. تصميم مناسب للبنت والصبي. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'Cozy, gentle sleepwear for sweeter, calmer nights.', shortDescriptionAr: 'لبس نوم ناعم ودافي لليالي أهدأ وأحلى.',
    price: 15.99, compareAtPrice: null, currency: 'USD', sku: 'snap-pajama-set', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'unisex', ageGroup: 'Baby/Toddler',
    categoryId: '5', stockQuantity: 12, rating: 4.5, reviewCount: 0,
    category: categories[4],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '102', name: 'Bicycle Collar Pajama', nameAr: 'لبس نوم', slug: 'bicycle-collar-pajama', 
    description: 'Cozy, gentle sleepwear for sweeter, calmer nights. This bicycle collar pajama comes as a coordinated set — great value and an easy gift. Unisex design suits any little one. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'لبس نوم ناعم ودافي لليالي أهدأ وأحلى. لبس نوم للصغار. تصميم مناسب للبنت والصبي. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'Cozy, gentle sleepwear for sweeter, calmer nights.', shortDescriptionAr: 'لبس نوم ناعم ودافي لليالي أهدأ وأحلى.',
    price: 14.99, compareAtPrice: null, currency: 'USD', sku: 'bicycle-collar-pajama', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'unisex', ageGroup: 'Baby/Toddler',
    categoryId: '5', stockQuantity: 4, rating: 4.5, reviewCount: 0,
    category: categories[4],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '103', name: 'Braided Ski Cap', nameAr: 'طاقية مكرّمة', slug: 'braided-ski-cap', 
    description: 'The finishing touch every little outfit needs. A braided ski cap designed for little ones. Unisex design suits any little one. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'اللمسة الأخيرة يلي بتكمّل إطلالة صغيرك. طاقية مكرّمة للصغار. تصميم مناسب للبنت والصبي. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'The finishing touch every little outfit needs.', shortDescriptionAr: 'اللمسة الأخيرة يلي بتكمّل إطلالة صغيرك.',
    price: 18.99, compareAtPrice: null, currency: 'USD', sku: 'braided-ski-cap', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'unisex', ageGroup: 'Baby/Toddler',
    categoryId: '3', stockQuantity: 1, rating: 4.5, reviewCount: 0,
    category: categories[2],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '104', name: 'Snap Pajama Set', nameAr: 'طقم بيجاما بكبسات', slug: 'snap-pajama-set-2', 
    description: 'Cozy, gentle sleepwear for sweeter, calmer nights. This snap pajama set comes as a coordinated set — great value and an easy gift. Unisex design suits any little one. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'لبس نوم ناعم ودافي لليالي أهدأ وأحلى. هيدا طقم بيجاما بكبسات منسّق، قيمة حلوة وهدية سهلة. تصميم مناسب للبنت والصبي. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'Cozy, gentle sleepwear for sweeter, calmer nights.', shortDescriptionAr: 'لبس نوم ناعم ودافي لليالي أهدأ وأحلى.',
    price: 15.99, compareAtPrice: null, currency: 'USD', sku: 'snap-pajama-set-2', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'unisex', ageGroup: 'Baby/Toddler',
    categoryId: '5', stockQuantity: 12, rating: 4.5, reviewCount: 0,
    category: categories[4],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '105', name: 'Daisy Hair Clip Set', nameAr: 'طقم مشابك شعر', slug: 'daisy-hair-clip-set', 
    description: 'The finishing touch every little outfit needs. A daisy hair clip set designed for little ones. Unisex design suits any little one. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'اللمسة الأخيرة يلي بتكمّل إطلالة صغيرك. هيدا طقم مشابك شعر منسّق، قيمة حلوة وهدية سهلة. تصميم مناسب للبنت والصبي. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'The finishing touch every little outfit needs.', shortDescriptionAr: 'اللمسة الأخيرة يلي بتكمّل إطلالة صغيرك.',
    price: 2.99, compareAtPrice: null, currency: 'USD', sku: 'daisy-hair-clip-set', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'unisex', ageGroup: 'Baby/Toddler',
    categoryId: '3', stockQuantity: 6, rating: 4.5, reviewCount: 0,
    category: categories[2],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '106', name: 'Snap Pajama Set', nameAr: 'طقم بيجاما بكبسات', slug: 'snap-pajama-set-3', 
    description: 'Cozy, gentle sleepwear for sweeter, calmer nights. This snap pajama set comes as a coordinated set — great value and an easy gift. Unisex design suits any little one. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'لبس نوم ناعم ودافي لليالي أهدأ وأحلى. هيدا طقم بيجاما بكبسات منسّق، قيمة حلوة وهدية سهلة. تصميم مناسب للبنت والصبي. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'Cozy, gentle sleepwear for sweeter, calmer nights.', shortDescriptionAr: 'لبس نوم ناعم ودافي لليالي أهدأ وأحلى.',
    price: 15.99, compareAtPrice: null, currency: 'USD', sku: 'snap-pajama-set-3', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'unisex', ageGroup: 'Baby/Toddler',
    categoryId: '5', stockQuantity: 12, rating: 4.5, reviewCount: 0,
    category: categories[4],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '107', name: 'Zero-collar Pajama', nameAr: 'بيجاما بدون ياقة', slug: 'zero-collar-pajama', 
    description: 'Cozy, gentle sleepwear for sweeter, calmer nights. This zero-collar pajama comes as a coordinated set — great value and an easy gift. Unisex design suits any little one. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'لبس نوم ناعم ودافي لليالي أهدأ وأحلى. بيجاما بدون ياقة للصغار. تصميم مناسب للبنت والصبي. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'Cozy, gentle sleepwear for sweeter, calmer nights.', shortDescriptionAr: 'لبس نوم ناعم ودافي لليالي أهدأ وأحلى.',
    price: 14.99, compareAtPrice: null, currency: 'USD', sku: 'zero-collar-pajama', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'unisex', ageGroup: 'Baby/Toddler',
    categoryId: '5', stockQuantity: 8, rating: 4.5, reviewCount: 0,
    category: categories[4],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '108', name: 'Zero-collar Pajama', nameAr: 'بيجاما بدون ياقة', slug: 'zero-collar-pajama-2', 
    description: 'Cozy, gentle sleepwear for sweeter, calmer nights. This zero-collar pajama comes as a coordinated set — great value and an easy gift. Unisex design suits any little one. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'لبس نوم ناعم ودافي لليالي أهدأ وأحلى. بيجاما بدون ياقة للصغار. تصميم مناسب للبنت والصبي. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'Cozy, gentle sleepwear for sweeter, calmer nights.', shortDescriptionAr: 'لبس نوم ناعم ودافي لليالي أهدأ وأحلى.',
    price: 14.99, compareAtPrice: null, currency: 'USD', sku: 'zero-collar-pajama-2', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'unisex', ageGroup: 'Baby/Toddler',
    categoryId: '5', stockQuantity: 8, rating: 4.5, reviewCount: 0,
    category: categories[4],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '109', name: 'Colored Pompom Hairband', nameAr: 'ربطة شعر بكرات ملوّنة', slug: 'colored-pompom-hairband', 
    description: 'The finishing touch every little outfit needs. A colored pompom hairband designed for little ones. Unisex design suits any little one. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'اللمسة الأخيرة يلي بتكمّل إطلالة صغيرك. ربطة شعر بكرات ملوّنة للصغار. تصميم مناسب للبنت والصبي. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'The finishing touch every little outfit needs.', shortDescriptionAr: 'اللمسة الأخيرة يلي بتكمّل إطلالة صغيرك.',
    price: 2.99, compareAtPrice: null, currency: 'USD', sku: 'colored-pompom-hairband', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'unisex', ageGroup: 'Baby/Toddler',
    categoryId: '3', stockQuantity: 24, rating: 4.5, reviewCount: 0,
    category: categories[2],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '110', name: 'Ribbed Hairband', nameAr: 'ربطة شعر', slug: 'ribbed-hairband', 
    description: 'The finishing touch every little outfit needs. A ribbed hairband designed for little ones. Unisex design suits any little one. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'اللمسة الأخيرة يلي بتكمّل إطلالة صغيرك. ربطة شعر للصغار. تصميم مناسب للبنت والصبي. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'The finishing touch every little outfit needs.', shortDescriptionAr: 'اللمسة الأخيرة يلي بتكمّل إطلالة صغيرك.',
    price: 1.99, compareAtPrice: null, currency: 'USD', sku: 'ribbed-hairband', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'unisex', ageGroup: 'Baby/Toddler',
    categoryId: '3', stockQuantity: 4, rating: 4.5, reviewCount: 0,
    category: categories[2],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '111', name: 'Printed Rib Hairband', nameAr: 'ربطة شعر مطبوعة', slug: 'printed-rib-hairband', 
    description: 'The finishing touch every little outfit needs. A printed rib hairband designed for little ones. Unisex design suits any little one. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'اللمسة الأخيرة يلي بتكمّل إطلالة صغيرك. ربطة شعر مطبوعة للصغار. تصميم مناسب للبنت والصبي. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'The finishing touch every little outfit needs.', shortDescriptionAr: 'اللمسة الأخيرة يلي بتكمّل إطلالة صغيرك.',
    price: 1.99, compareAtPrice: null, currency: 'USD', sku: 'printed-rib-hairband', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'unisex', ageGroup: 'Baby/Toddler',
    categoryId: '3', stockQuantity: 6, rating: 4.5, reviewCount: 0,
    category: categories[2],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '112', name: 'Grosgrain Clip', nameAr: 'مشبك شعر', slug: 'grosgrain-clip', 
    description: 'The finishing touch every little outfit needs. A grosgrain clip designed for little ones. Unisex design suits any little one. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'اللمسة الأخيرة يلي بتكمّل إطلالة صغيرك. مشبك شعر للصغار. تصميم مناسب للبنت والصبي. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'The finishing touch every little outfit needs.', shortDescriptionAr: 'اللمسة الأخيرة يلي بتكمّل إطلالة صغيرك.',
    price: 4.99, compareAtPrice: null, currency: 'USD', sku: 'grosgrain-clip', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'unisex', ageGroup: 'Baby/Toddler',
    categoryId: '3', stockQuantity: 4, rating: 4.5, reviewCount: 0,
    category: categories[2],
    images: [],
    colors: [],
    sizes: []
  },
{
    id: '113', name: '7-piece Tissue Box Cloth', nameAr: 'إكسسوار', slug: '7-piece-tissue-box-cloth', 
    description: 'The finishing touch every little outfit needs. A 7-piece tissue box cloth designed for little ones. Unisex design suits any little one. Soft, breathable cotton-blend fabric. Machine wash cold, gentle cycle. Imported from Turkey.', descriptionAr: 'اللمسة الأخيرة يلي بتكمّل إطلالة صغيرك. إكسسوار للصغار. تصميم مناسب للبنت والصبي. قماش قطن ناعم وبيتنفّس. غسيل بمي باردة على دورة خفيفة. مستورد من تركيا.',
    shortDescription: 'The finishing touch every little outfit needs.', shortDescriptionAr: 'اللمسة الأخيرة يلي بتكمّل إطلالة صغيرك.',
    price: 4.99, compareAtPrice: null, currency: 'USD', sku: '7-piece-tissue-box-cloth', 
    status: 'active', isNew: true, isBestseller: false, 
    isFeatured: false, gender: 'unisex', ageGroup: 'Baby/Toddler',
    categoryId: '3', stockQuantity: 4, rating: 4.5, reviewCount: 0,
    category: categories[2],
    images: [],
    colors: [],
    sizes: []
  }
]

// --- Unified data service ---
// Reads admin-edited data from localStorage (where zustand persist saves it).
// Falls back to static data if no admin edits have been made yet.
// This breaks the circular dependency between data.ts and adminStore.ts.

const STORAGE_KEY = 'miniyo-admin-store'

function getAdminState(): any {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  return null
}

function getAdminProducts(): Product[] | null {
  const state = getAdminState()
  return state?.products?.length ? state.products : null
}

import { applySyncOverrides } from './storefrontSync'

export const dataService = {
  getCategories(): Promise<Category[]> {
    const adminProds = getAdminProducts()
    if (adminProds) {
      const catMap = new Map<string, Category>()
      adminProds.forEach((p: Product) => {
        if (p.category && !catMap.has(p.category.id)) {
          catMap.set(p.category.id, p.category)
        }
      })
      const derived = Array.from(catMap.values())
      if (derived.length > 0) return Promise.resolve(derived)
    }
    return Promise.resolve(categories)
  },

  getProducts(params?: Record<string, string>): Promise<Product[]> {
    let prods = getAdminProducts() || [...allProducts]
    if (!params) return Promise.resolve(prods)

    if (params.category) {
      const catIds: Record<string, string> = { apparel: '1', sets: '2', accessories: '3', basics: '4', sleepwear: '5' }
      const catId = catIds[params.category]
      if (catId) prods = prods.filter(p => p.categoryId === catId)
    }
    if (params.search) {
      const s = params.search.toLowerCase()
      prods = prods.filter(p => p.name.toLowerCase().includes(s) || p.nameAr.toLowerCase().includes(s))
    }
    if (params.new === 'true') prods = prods.filter(p => p.isNew)
    if (params.bestseller === 'true') prods = prods.filter(p => p.isBestseller)
    if (params.sale === 'true') prods = prods.filter(p => p.compareAtPrice)
    if (params.gender) prods = prods.filter(p => p.gender === params.gender)

    if (params.sort === 'newest') prods.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
    else if (params.sort === 'price-asc') prods.sort((a, b) => a.price - b.price)
    else if (params.sort === 'price-desc') prods.sort((a, b) => b.price - a.price)

    // Apply storefront stock overrides (sync decrements)
    prods = applySyncOverrides(prods)

    return Promise.resolve(prods)
  },

  getProduct(handle: string): Promise<Product | null> {
    const adminProds = getAdminProducts()
    let p: Product | null = null
    if (adminProds) {
      p = adminProds.find((p: Product) => p.slug === handle) || null
    }
    if (!p) p = allProducts.find(p => p.slug === handle) || null
    if (p) {
      // Apply storefront stock overrides
      const [overridden] = applySyncOverrides([p])
      return Promise.resolve(overridden)
    }
    return Promise.resolve(null)
  },

  getNewArrivals(): Promise<Product[]> {
    const adminProds = getAdminProducts()
    if (adminProds) return Promise.resolve(adminProds.filter((p: Product) => p.isNew))
    return Promise.resolve(allProducts.filter(p => p.isNew))
  },

  getBestSellers(): Promise<Product[]> {
    const adminProds = getAdminProducts()
    if (adminProds) return Promise.resolve(adminProds.filter((p: Product) => p.isBestseller))
    return Promise.resolve(allProducts.filter(p => p.isBestseller))
  },

  getWishlistProducts(ids: string[]): Promise<Product[]> {
    const adminProds = getAdminProducts()
    const prods = adminProds || allProducts
    return Promise.resolve(prods.filter((p: Product) => ids.includes(p.id)))
  },

  // Mutations are handled through the admin panel only
  updateProduct(): Promise<Product | null> {
    return Promise.resolve(null)
  },

  deleteProduct(): Promise<boolean> {
    return Promise.resolve(false)
  },

}
