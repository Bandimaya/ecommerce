import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/NewProduct";
import Variant from "@/models/NewVariant";
import slugify from "slugify";
import fs from "fs/promises";
import path from "path";

// Helper to save files to public/uploads
const saveMedia = async (file: File) => {
  const uploadDir = path.join(process.cwd(), "public/uploads/products");
  await fs.mkdir(uploadDir, { recursive: true });

  const filename = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(uploadDir, filename), buffer);
  
  return `/uploads/products/${filename}`;
};

export async function GET(req: NextRequest) {
  await connectDB();
  try {
    const products = await Product.find()
      .populate("categories")
      .populate("brand")
      .lean();

    const productsWithVariants = await Promise.all(
      products.map(async (product: any) => {
        let variants = [];
        if (product.isOnlyProduct && product.productData?.variants?.length > 0) {
          variants = product.productData.variants;
        } else {
          variants = await Variant.find({ productId: product._id }).lean();
        }
        return { ...product, variants };
      })
    );

    return NextResponse.json(productsWithVariants);
  } catch (err: any) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await connectDB();
  try {
    const formData = await req.formData();
    
    // Parse JSON strings from formData
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const pricing = JSON.parse(formData.get("pricing") as string || "[]");
    const variants = JSON.parse(formData.get("variants") as string || "[]");
    const categories = JSON.parse(formData.get("categories") as string || "[]");
    const dimensions = JSON.parse(formData.get("dimensions") as string || "{}");
    
    // Handle Media Uploads
    const media: any[] = [];
    const allEntries = Array.from(formData.entries());
    
    for (const [key, value] of allEntries) {
      if (value instanceof File && !key.startsWith("variantMedia_")) {
        const url = await saveMedia(value);
        media.push({
          url,
          alt: value.name,
          type: value.type.startsWith("video/") ? "video" : "image",
          position: 1
        });
      }
    }

    const productData = {
      name,
      slug: slugify(name, { lower: true, strict: true }),
      description,
      categories,
      brand: formData.get("brand") || null,
      media,
      isFeatured: formData.get("isFeatured") === "true",
      isActive: formData.get("isActive") === "true",
      isOnlyProduct: formData.get("isOnlyProduct") === "true",
      pricing: pricing.map((p: any) => ({ ...p, originalPrice: Number(p.originalPrice) })),
    };

    if (productData.isOnlyProduct) {
      (productData as any).productData = {
        sku: formData.get("sku"),
        inventory: {
          stock: Number(formData.get("stock") || 0),
          lowStockThreshold: Number(formData.get("lowStockThreshold") || 5)
        },
        dimensions,
        media
      };
    }

    const newProduct = await Product.create(productData);

    // Multi-variant Logic
    if (!productData.isOnlyProduct && variants.length > 0) {
      const variantDocs = await Promise.all(variants.map(async (v: any, idx: number) => {
        const variantMedia = [];
        for (const [key, value] of allEntries) {
          if (value instanceof File && key === `variantMedia_${idx}`) {
            const url = await saveMedia(value);
            variantMedia.push({ url, type: value.type.startsWith("video/") ? "video" : "image" });
          }
        }
        return { ...v, media: variantMedia, productId: newProduct._id };
      }));
      await Variant.insertMany(variantDocs);
    }

    return NextResponse.json(newProduct, { status: 201 });
  } catch (err: any) {
    console.log(err);
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  await connectDB();
  try {
    const formData = await req.formData();
    const id = formData.get("id") as string;

    if (!id) {
      return NextResponse.json({ message: "Product ID is required" }, { status: 400 });
    }
    const product = await Product.findById(id);
    if (!product) return NextResponse.json({ message: "Product not found" }, { status: 404 });

    const allEntries = Array.from(formData.entries());

    // 1. HELPER: Parse JSON strings from formData
    const parseJson = (key: string, fallback: any) => {
      const val = formData.get(key);
      if (typeof val === "string") {
        try { return JSON.parse(val); } catch (e) { return fallback; }
      }
      return fallback;
    };

    const name = formData.get("name") as string;
    const pricing = parseJson("pricing", []);
    const variants = parseJson("variants", []);
    const categories = parseJson("categories", []);
    const dimensions = parseJson("dimensions", { length: 0, width: 0, height: 0 });
    const removedMedia = parseJson("removedMedia", []);

    // 2. MEDIA MANAGEMENT (Removal)
    if (removedMedia.length > 0) {
      product.media = product.media.filter((m: any) => {
        const isRemoved = removedMedia.includes(m.url);
        if (isRemoved) {
          // Attempt to delete physical file (optional)
          const filePath = path.join(process.cwd(), "public", m.url);
          fs.unlink(filePath).catch(() => console.log("File not found for deletion"));
        }
        return !isRemoved;
      });
    }

    // 3. MEDIA MANAGEMENT (New Uploads for Main Product)
    const newMainMedia: any[] = [];
    for (const [key, value] of allEntries) {
      if (value instanceof File && !key.startsWith("variantMedia_") && value.size > 0) {
        const url = await saveMedia(value); // Using your existing saveMedia helper
        newMainMedia.push({
          url,
          alt: value.name,
          type: value.type.startsWith("video/") ? "video" : "image",
          position: 1
        });
      }
    }
    product.media.push(...newMainMedia);

    // 4. UPDATE CORE FIELDS
    if (name) {
      product.name = name;
      product.slug = slugify(name, { lower: true, strict: true });
    }
    product.description = (formData.get("description") as string) || product.description;
    product.categories = categories;
    product.brand = formData.get("brand") || null;
    product.isFeatured = formData.get("isFeatured") === "true";
    product.isActive = formData.get("isActive") === "true";
    product.isOnlyProduct = formData.get("isOnlyProduct") === "true";
    product.pricing = pricing.map((p: any) => ({ ...p, originalPrice: Number(p.originalPrice) }));

    // 5. CONDITIONAL LOGIC (Single vs Multi)
    if (product.isOnlyProduct) {
      product.productData = {
        sku: formData.get("sku"),
        barcode: formData.get("barcode"),
        inventory: {
          stock: Number(formData.get("stock") || 0),
          reserved: Number(formData.get("reserved") || 0),
          lowStockThreshold: Number(formData.get("lowStockThreshold") || 5)
        },
        weight: Number(formData.get("weight") || 0),
        dimensions,
        media: product.media
      };
      // product.variants = []; 
    } else {
      // Logic for Multi-Variant Product
      const variantIds = [];

      for (const [idx, vData] of variants.entries()) {
        let currentVariantMedia = vData.media || [];
        
        // Remove media from variant if flagged
        if (removedMedia.length > 0) {
          currentVariantMedia = currentVariantMedia.filter((m: any) => !removedMedia.includes(m.url));
        }

        // Handle new uploads for this specific variant
        const newVariantMedia = [];
        for (const [key, value] of allEntries) {
          if (value instanceof File && key === `variantMedia_${idx}` && value.size > 0) {
            const url = await saveMedia(value);
            newVariantMedia.push({
              url,
              alt: value.name,
              type: value.type.startsWith("video/") ? "video" : "image"
            });
          }
        }

        const finalVariantData = {
          ...vData,
          productId: product._id,
          media: [...currentVariantMedia, ...newVariantMedia],
          inventory: {
            stock: Number(vData.inventory?.stock || 0),
            reserved: Number(vData.inventory?.reserved || 0),
            lowStockThreshold: Number(vData.inventory?.lowStockThreshold || 5)
          }
        };

        if (vData._id) {
          await Variant.findByIdAndUpdate(vData._id, finalVariantData);
          variantIds.push(vData._id);
        } else {
          const newVariant = new Variant(finalVariantData);
          const savedV = await newVariant.save();
          variantIds.push(savedV._id);
        }
      }
      // product.variants = variantIds;
    }

    await product.save();
    
    // Return populated product
    const populatedProduct = await Product.findById(product._id)
    // .populate('variants');
    return NextResponse.json(populatedProduct, { status: 200 });

  } catch (err: any) {
    console.error("Update Product Error:", err);
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}