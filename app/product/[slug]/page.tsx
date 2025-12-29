// app/product/[slug]/page.tsx
import { fetchProduct } from "@/lib/Products";
import ProductDetailClient from "./ProductDetailClient";
import NotFoundClient from "./NotFoundClient";

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
    const { slug } = await params
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
