import { apiUrl } from "./constants";

// lib/products.ts
export async function fetchProduct(slug: string) {
    try {
        const res = await fetch(`${apiUrl}/products/slug/${slug}`);
        console.log(res, 'gfhjkl;', slug)

        if (!res.ok) {
            throw new Error("Failed to fetch product");
        }

        const product = await res.json();
        return product;
    } catch (error) {
        console.error(error);
        return null;
    }
}
