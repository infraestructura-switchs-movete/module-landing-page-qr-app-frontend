import type { ProductType } from "../types/productsType";


export const normalizeCategory = (name: string) =>
  (name || "").trim().replace(/\s+/g, " ").toUpperCase();


export const toProductType = (p: any): ProductType => ({
  id: String(p?.id ?? p?.productId ?? ""),        
  arqid: p?.arqProductId != null ? String(p.arqProductId) : "", 
  productName: p?.productName ?? p?.name ?? "",
  price: Number(p?.price ?? 0),
  categoryId: String(p?.categoryId ?? ""),
  category: p?.category ?? undefined,
  image: p?.image ?? p?.imgProduct ?? undefined,
  quantity: typeof p?.quantity === "number" ? p.quantity : 1,  
  description: p?.description ?? undefined,
});
