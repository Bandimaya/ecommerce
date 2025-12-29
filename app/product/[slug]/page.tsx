// app/product/[slug]/page.tsx
// import { fetchProduct } from "@/lib/Products";
import ProductDetailClient from "./ProductDetailClient";
import NotFoundClient from "./NotFoundClient";

async function fetchProduct(slug: string) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/products/${slug}`);
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

export async function generateMetadata({ params }:
    {
        params: Promise<{ slug: string }>
    }
) {
    const { slug } = await params
    const product = await fetchProduct(slug);

    if (!product) {
        return {
            title: "Product not found",
        };
    }

    return {
        title: product.name,
        description: product.description,
        openGraph: {
            title: product.name,
            description: product.description,
            images: [product.image],
        },
    };
}


export default async function Page({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params;

    const product = await fetchProduct(slug);

    if (!product) {
        return <NotFoundClient />;
    }

    return (
        <div>
            <ProductDetailClient product={product} />
        </div>
    );
};

// export default ProductPage;
