// Data hooks — synchronous static data for instant loading
// All data reads from static arrays with admin-store overrides applied
import { useMemo } from "react";
import { allProducts, categories as staticCategories } from "@/lib/data";
import { useAdminStore } from "@/stores/adminStore";
import { applyAdminOverrides } from "@/lib/adminBridge";
import { applySyncOverrides } from "@/lib/storefrontSync";

// ── Products ──
export function useProducts(filters?: {
  category?: string;
  search?: string;
  isNew?: boolean;
  isBestseller?: boolean;
  sale?: boolean;
  gender?: string;
  sort?: string;
}) {
  return useMemo(() => {
    let prods = [...allProducts];

    if (filters?.category) {
      prods = prods.filter(p => {
        const catSlug = p.categorySlug || p.category?.slug || '';
        return catSlug.toLowerCase().includes(filters.category!.toLowerCase());
      });
    }
    if (filters?.search) {
      const s = filters.search.toLowerCase();
      prods = prods.filter(p =>
        p.name.toLowerCase().includes(s) || p.nameAr.toLowerCase().includes(s)
      );
    }
    if (filters?.isNew) prods = prods.filter(p => p.isNew);
    if (filters?.isBestseller) prods = prods.filter(p => p.isBestseller);
    if (filters?.sale) prods = prods.filter(p => p.compareAtPrice);
    if (filters?.gender) prods = prods.filter(p => p.gender === filters.gender);
    if (filters?.sort === "price-asc") prods.sort((a, b) => a.price - b.price);
    else if (filters?.sort === "price-desc") prods.sort((a, b) => b.price - a.price);

    // Merge admin-store images
    prods = applyAdminOverrides(prods);
    // Apply storefront stock overrides (orders decrement stock)
    prods = applySyncOverrides(prods);

    return { data: prods, isLoading: false };
  }, [JSON.stringify(filters)]);
}

// ── Single Product ──
export function useProductBySlug(slug: string) {
  return useMemo(() => {
    const product = allProducts.find(p => p.slug === slug) || null;
    if (product) {
      let merged = applyAdminOverrides([product])[0];
      merged = applySyncOverrides([merged])[0];
      return { data: merged, isLoading: false };
    }
    return { data: null, isLoading: false };
  }, [slug]);
}

// ── Categories ──
export function useCategories() {
  return { data: staticCategories, isLoading: false };
}

// ── Orders ──
export function useOrders() {
  const orders = useAdminStore(s => s.orders);
  return { data: orders, isLoading: false };
}

// ── CMS ──
export function useCmsSections() {
  const sections = useAdminStore(s => s.cmsSections);
  return { data: sections, isLoading: false };
}

// ── Settings ──
export function useSettings() {
  const settings = useAdminStore(s => s.settings);
  const settingsArray = Object.entries(settings).map(([key, value]) => ({
    key,
    value: String(value),
  }));
  return { data: settingsArray, isLoading: false };
}

// ── Stats ──
export function useStats() {
  const { products, orders, customers } = useAdminStore();
  return {
    data: {
      totalProducts: products.length,
      activeProducts: products.filter((p: any) => p.isActive !== false).length,
      totalOrders: orders.length,
      totalCustomers: customers.length,
      pendingWA: orders.filter((o: any) => o.orderStatus === 'pending_confirmation' && !o.whatsappConfirmed).length,
      pendingWish: orders.filter((o: any) => o.orderStatus === 'payment_pending_whish').length,
      lowStock: products.filter((p: any) => (p.stockQuantity || 0) <= 5 && (p.stockQuantity || 0) > 0).length,
    },
    isLoading: false,
  };
}

// ── Admin products ──
export function useAdminProducts() {
  const store = useAdminStore();
  const { data: products } = useProducts();

  return {
    products,
    isLoading: false,
    updateProduct: store.updateProduct,
    deleteProduct: store.deleteProduct,
    addProductImage: (productId: string | number, productSlug: string, file: File, onComplete?: (url: string) => void) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        if (!url) return;
        const adminProducts = useAdminStore.getState().products;
        const idx = adminProducts.findIndex(p => p.slug === productSlug || String(p.id) === String(productId));
        if (idx >= 0) {
          const existingImages = adminProducts[idx].images || [];
          store.updateProduct(adminProducts[idx].id, {
            images: [...existingImages, {
              id: `img-${Date.now()}`, url,
              alt: adminProducts[idx].name,
              altAr: adminProducts[idx].nameAr,
              isPrimary: existingImages.length === 0,
            }],
          });
        }
        onComplete?.(url);
      };
      reader.readAsDataURL(file);
    },
    bulkUpdate: store.bulkUpdateProducts,
  };
}

// ── Admin orders ──
export function useAdminOrders() {
  const store = useAdminStore();
  const { data: orders } = useOrders();
  return {
    orders,
    updateStatus: store.updateOrderStatus,
    toggleWA: store.toggleWhatsAppConfirmed,
    deleteOrder: store.deleteOrder,
    restoreOrderStock: store.restoreOrderStock,
  };
}

// ── Admin CMS ──
export function useAdminCms() {
  const store = useAdminStore();
  return { sections: store.cmsSections, updateSection: store.updateCmsSection };
}

// ── Admin settings ──
export function useAdminSettings() {
  const store = useAdminStore();
  return {
    dbSettings: Object.entries(store.settings).map(([key, value]) => ({ key, value: String(value) })),
    setSetting: (key: string, value: string) => store.updateSettings({ [key]: value } as any),
  };
}

// ── Audit logs ──
export function useAuditLogs() {
  const logs = useAdminStore(s => s.auditLogs);
  return { data: logs, isLoading: false };
}

// ── Media ──
export function useMedia() {
  const media = useAdminStore(s => s.media);
  return { data: media, isLoading: false };
}

export function useCreateMedia() {
  const addMedia = useAdminStore(s => s.addMedia);
  return { mutate: addMedia, isPending: false };
}

export function useDeleteMedia() {
  const deleteMedia = useAdminStore(s => s.deleteMedia);
  return { mutate: deleteMedia, isPending: false };
}

// ── Customers ──
export function useCustomers() {
  const customers = useAdminStore(s => s.customers);
  return { data: customers, isLoading: false };
}
