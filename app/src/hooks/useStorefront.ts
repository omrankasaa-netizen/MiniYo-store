import { trpc } from "@/providers/trpc";

// ── Products ──
export function useProducts(filters?: {
  category?: string;
  search?: string;
  isNew?: boolean;
  isBestseller?: boolean;
  isFeatured?: boolean;
  sale?: boolean;
  gender?: string;
  sort?: string;
}) {
  return trpc.miniyo.product.list.useQuery(filters || {});
}

export function useProductBySlug(slug: string) {
  return trpc.miniyo.product.getBySlug.useQuery({ slug }, { enabled: !!slug });
}

// ── Categories ──
export function useCategories() {
  return trpc.miniyo.category.list.useQuery();
}

// ── Orders ──
export function useCreateOrder() {
  const utils = trpc.useUtils();
  return trpc.miniyo.order.create.useMutation({
    onSuccess: () => {
      utils.miniyo.order.list.invalidate();
      utils.miniyo.stats.get.invalidate();
    },
  });
}

// ── Settings ──
export function useSiteSettings() {
  return trpc.miniyo.settings.getAll.useQuery();
}

export function useSiteSetting(key: string) {
  return trpc.miniyo.settings.getByKey.useQuery({ key }, { enabled: !!key });
}

// ── Stats ──
export function useDashboardStats() {
  return trpc.miniyo.stats.get.useQuery();
}

// ── Promo Codes ──
export function useValidatePromo() {
  return trpc.miniyo.order.validatePromo.useMutation();
}
