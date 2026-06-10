export interface Category {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
  description: string | null;
  descriptionAr: string | null;
  image: string | null;
  sortOrder: number;
  isActive?: boolean;
}

export interface Product {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
  description: string | null;
  descriptionAr: string | null;
  shortDescription: string | null;
  shortDescriptionAr: string | null;
  price: number;
  compareAtPrice: number | null;
  currency: string;
  sku: string;
  status: string;
  isActive?: boolean;
  isNew: boolean;
  isBestseller: boolean;
  isFeatured: boolean;
  gender: string;
  ageGroup: string | null;
  categoryId: string;
  categorySlug?: string;
  stockQuantity: number;
  rating: number | null;
  reviewCount: number;
  category?: Category;
  images?: ProductImage[];
  colors?: ProductColor[];
  sizes?: ProductSize[];
  reviews?: Review[];
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string | null;
  altAr: string | null;
  isPrimary: boolean;
}

export interface ProductColor {
  id: string;
  name: string;
  nameAr: string;
  hexCode: string;
}

export interface ProductSize {
  id: string;
  name: string;
  nameAr: string;
  ageRange: string | null;
  sortOrder: number;
}

export interface Review {
  id: string;
  customerName: string;
  rating: number;
  title: string | null;
  body: string;
  isVerified: boolean;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  variantId: string | null;
  name: string;
  nameAr: string;
  price: number;
  quantity: number;
  image: string;
  color: string | null;
  size: string | null;
  sku: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  role: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  email: string;
  phone: string;
  subtotal: number;
  deliveryFee: number;
  discountTotal: number;
  grandTotal: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  shippingCity: string;
  deliveryMethod: string;
  notes: string | null;
  items: OrderItem[];
  createdAt: string;
}

export interface OrderItem {
  id: string;
  productName: string;
  variantName: string | null;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  imageUrl: string | null;
}

export interface WishlistItem {
  productId: string;
}

export type Locale = 'en' | 'ar';
