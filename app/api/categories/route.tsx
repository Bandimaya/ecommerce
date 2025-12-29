// app/api/categories/route.ts
import { NextResponse } from "next/server";
import Category from "@/models/Category";
import { withAuth, UserPayload } from "@/lib/withAuth";
import { connectDB } from "@/lib/db";

/* ================= CREATE CATEGORY ================= */
const createCategoryHandler = async (user: UserPayload, req: Request) => {
  if (user.role !== "admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { title, description, parentCategory } = body;

  if (!title) {
    return NextResponse.json({ message: "Category title is required" }, { status: 400 });
  }

  if (parentCategory) {
    const parentExists = await Category.findById(parentCategory);
    if (!parentExists) {
      return NextResponse.json({ message: "Parent category not found" }, { status: 404 });
    }
  }

  const category = await Category.create({
    title,
    description,
    parentCategory: parentCategory || null
  });

  return NextResponse.json(category, { status: 201 });
};

/* ================= GET ALL CATEGORIES ================= */
const getAllCategoriesHandler = async (_user: UserPayload, _req: Request) => {
  await connectDB();
  
  const categories = await Category.aggregate([
    { $match: { parentCategory: null } },
    {
      $lookup: {
        from: "categories",
        localField: "_id",
        foreignField: "parentCategory",
        as: "subCategories"
      }
    }
  ]);

  return NextResponse.json(categories);
};

/* ================= GET CATEGORY BY ID ================= */
const getCategoryByIdHandler = async (_user: UserPayload, req: Request) => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id")!;
  
  const category = await Category.findById(id);
  if (!category) {
    return NextResponse.json({ message: "Category not found" }, { status: 404 });
  }

  return NextResponse.json(category);
};

/* ================= GET SUB-CATEGORIES ================= */
const getSubCategoriesHandler = async (_user: UserPayload, req: Request) => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id")!;

  const subCategories = await Category.find({ parentCategory: id });
  return NextResponse.json(subCategories);
};

/* ================= UPDATE CATEGORY ================= */
const updateCategoryHandler = async (user: UserPayload, req: Request) => {
  if (user.role !== "admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const categoryId = searchParams.get("id")!;
  const body = await req.json();
  const { title, description, parentCategory } = body;

  const category = await Category.findById(categoryId);
  if (!category) {
    return NextResponse.json({ message: "Category not found" }, { status: 404 });
  }

  if (parentCategory && parentCategory === categoryId) {
    return NextResponse.json({ message: "A category cannot be its own parent." }, { status: 400 });
  }

  if (parentCategory) {
    const parentExists = await Category.findById(parentCategory);
    if (!parentExists) {
      return NextResponse.json({ message: "Specified parent category not found" }, { status: 404 });
    }
  }

  const updatedCategory = await Category.findByIdAndUpdate(
    categoryId,
    { title, description, parentCategory: parentCategory || null },
    { new: true, runValidators: true }
  );

  return NextResponse.json(updatedCategory);
};

/* ================= DELETE CATEGORY ================= */
const deleteCategoryHandler = async (user: UserPayload, req: Request) => {
  if (user.role !== "admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id")!;

  const category = await Category.findById(id);
  if (!category) {
    return NextResponse.json({ message: "Category not found" }, { status: 404 });
  }

  await Category.deleteMany({ parentCategory: category._id });
  await category.deleteOne();

  return NextResponse.json({ message: "Category deleted successfully" });
};

/* ================= EXPORT ROUTES ================= */
export const POST = withAuth(createCategoryHandler);
export const GET = getAllCategoriesHandler;
export const PATCH = withAuth(updateCategoryHandler);
export const DELETE = withAuth(deleteCategoryHandler);
