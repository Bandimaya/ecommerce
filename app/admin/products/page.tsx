"use client"
import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { CURRENCY_OPTIONS, IMAGE_URL } from "@/lib/constants";
import { t } from "@/lib/i18n";
import { apiFetch } from "@/lib/axios";
import AdminButton from "@/components/admin/AdminButton";
import {
  Pencil,
  Trash2,
  Plus,
  X,
  Tag,
  DollarSign,
  Image as ImageIcon,
  Box,
  Video,
  Upload,
  Search,
  Package
} from "lucide-react";

// --- Recursive Variant Component ---
const VariantNode = ({ nodes, path = [], depth = 1, addNode, updateNodeDeep, levelLabels, setForm, deleteNodeDeep }: any) => {
  const handleLabelChange = (newLabel: any) => {
    setForm((prev: any) => {
      const updatedLabels = [...prev.levelLabels];
      updatedLabels[depth - 1] = newLabel;
      return { ...prev, levelLabels: updatedLabels };
    });
  };

  const handleRemoveExistingVariantImage = (path: any, url: any) => {
    setForm((prev: any) => {
      const newRemoved = [...(prev.removedMedia || []), url];
      const newNestedVariants = [...prev.nestedVariants];
      let current = newNestedVariants;

      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }

      const lastKey = path[path.length - 1];
      const targetNode = current[lastKey];

      if (targetNode) {
        current[lastKey] = {
          ...targetNode,
          media: (targetNode.media || []).filter((m: any) => m.url !== url),
          images: (targetNode.images || []).filter((img: any) => img.url !== url)
        };
      }

      return {
        ...prev,
        nestedVariants: newNestedVariants,
        removedMedia: newRemoved
      };
    });
  };

  return (
    <div className={`space-y-4 ${depth > 1 ? "ml-6 pl-6 border-l-2 border-dashed border-gray-200" : ""}`}>
      {nodes?.length > 0 && (
        <div className="flex items-center gap-3 mb-3 bg-blue-50 p-2 rounded-lg border border-blue-100 w-fit">
          <span className="text-[10px] font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded uppercase tracking-wider">
            Level {depth}
          </span>
          <input
            placeholder="Label (e.g. Color)"
            className="bg-transparent border-b border-blue-200 focus:border-blue-500 outline-none text-sm font-semibold text-blue-900 w-32 placeholder:text-blue-300"
            value={levelLabels[depth - 1] || ""}
            onChange={(e) => handleLabelChange(e.target.value)}
          />
        </div>
      )}

      {(nodes ?? []).map((node: any, idx: any) => {
        const currentPath = [...path, idx];
        const isLeaf = node.children?.length === 0;

        return (
          <div key={node.id} className="group relative bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all mb-4">
            {/* Header Row */}
            <div className="flex flex-col sm:flex-row gap-4 mb-4 items-start sm:items-center justify-between">
              <div className="flex-1 w-full">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">
                  {node.levelLabel || `Option Value`}
                </label>
                <input
                  placeholder="e.g. Red, Large"
                  className="w-full text-lg font-bold text-gray-800 border-b border-gray-200 focus:border-blue-500 outline-none pb-1 bg-transparent placeholder:text-gray-300"
                  value={node.name}
                  onChange={(e) => updateNodeDeep(currentPath, 'name', e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Delete "${node.name || 'this option'}"?`)) deleteNodeDeep(currentPath);
                  }}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-red-100"
                  title="Delete Option"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Leaf Node Details */}
            {isLeaf && (
              <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 space-y-6 animate-in fade-in zoom-in duration-200">
                {/* 1. Identification */}
                <div>
                  <h5 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
                    <Tag className="w-3 h-3" /> Identification
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <input
                        placeholder="SKU (Required)"
                        className="w-full p-2.5 rounded-[8px] border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        value={node.sku}
                        onChange={e => updateNodeDeep(currentPath, 'sku', e.target.value)}
                      />
                    </div>
                    <div>
                      <input
                        placeholder="Barcode / EAN"
                        className="w-full p-2.5 rounded-[8px] border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        value={node.barcode || ""}
                        onChange={e => updateNodeDeep(currentPath, 'barcode', e.target.value)}
                      />
                    </div>
                    <div>
                      <div className="relative">
                        <input
                          type="number"
                          min={0}
                          placeholder="Weight"
                          className="w-full p-2.5 rounded-[8px] border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 outline-none pr-8"
                          value={node.weight || ""}
                          onChange={e => updateNodeDeep(currentPath, 'weight', e.target.value)}
                        />
                        <span className="absolute right-3 top-2.5 text-xs text-gray-400 font-bold">KG</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Pricing */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center mb-3">
                    <h5 className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                      <DollarSign className="w-3 h-3" /> Pricing
                    </h5>

                    <div className="flex items-center gap-2">
                      <select
                        value=""
                        onChange={(e) => {
                          let currencyCode = e.target.value;
                          const currentPricing = node.pricing || [];
                          const missingMarkets = CURRENCY_OPTIONS
                            .filter(opt => opt.code === currencyCode)
                            .map(opt => ({
                              region: opt.label.split(' - ')[1] || opt.label,
                              currency: opt.code,
                              originalPrice: "",
                              salePrice: ""
                            }));
                          updateNodeDeep(currentPath, 'pricing', [...currentPricing, missingMarkets[0]]);
                        }}
                        className="text-xs border border-gray-300 rounded-[6px] p-1.5 bg-white focus:outline-none focus:border-blue-500 cursor-pointer"
                      >
                        <option value="" disabled>+ Add Market</option>
                        {CURRENCY_OPTIONS.map((curr: any) => (
                          <option
                            key={curr.code}
                            value={curr.code}
                            disabled={node.pricing.some((p: any) => p.currency === curr.code)}
                          >
                            {curr.code}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {(node.pricing || []).map((pGroup: any, pIdx: any) => {
                      const selectedCurrency = CURRENCY_OPTIONS.find(c => c.code === pGroup.currency) || CURRENCY_OPTIONS[0];
                      const pPath = [...currentPath, 'pricing', pIdx];

                      return (
                        <div key={pIdx} className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm relative group/price">
                          {/* Remove Market Button */}
                          {!['INR', 'QAR'].includes(pGroup.currency) && (
                            <button
                              type="button"
                              onClick={() => {
                                const filtered = node.pricing.filter((_: any, i: any) => i !== pIdx);
                                updateNodeDeep(currentPath, 'pricing', filtered);
                              }}
                              className="absolute -top-2 -right-2 bg-white text-red-500 border border-gray-200 rounded-full w-5 h-5 flex items-center justify-center text-xs shadow-sm opacity-0 group-hover/price:opacity-100 transition-opacity z-10 hover:bg-red-50"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}

                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 border border-gray-200">
                              {pGroup.currency}
                            </div>
                            <div className="flex-1 grid grid-cols-2 gap-3">
                              <div className="relative">
                                <label className="text-[9px] font-bold text-gray-400 uppercase absolute -top-1.5 left-2 bg-white px-1">Regular</label>
                                <input
                                  type="number"
                                  min={0}
                                  placeholder="0.00"
                                  className="w-full p-2 border border-gray-300 rounded text-sm outline-none focus:border-blue-500"
                                  value={pGroup.originalPrice}
                                  onChange={(e) => updateNodeDeep(pPath, 'originalPrice', e.target.value)}
                                />
                              </div>
                              <div className="relative">
                                <label className="text-[9px] font-bold text-green-600 uppercase absolute -top-1.5 left-2 bg-white px-1">Sale</label>
                                <input
                                  type="number"
                                  min={0}
                                  placeholder="0.00"
                                  className="w-full p-2 border border-green-200 rounded text-sm outline-none focus:border-green-500 text-green-700 font-bold bg-green-50/30"
                                  value={pGroup.salePrice}
                                  onChange={(e) => updateNodeDeep(pPath, 'salePrice', e.target.value)}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* 3. Inventory & Specs */}
                <div className="pt-4 border-t border-gray-200">
                  <h5 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
                    <Box className="w-3 h-3" /> Inventory & Logistics
                  </h5>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <label className="text-[10px] text-gray-400 uppercase font-bold block mb-1">Stock</label>
                      <input
                        type="number"
                        min={0}
                        className="w-full p-2 border border-gray-300 rounded text-sm outline-none focus:border-blue-500"
                        value={node.inventory.stock}
                        onChange={e => updateNodeDeep(currentPath, 'inventory.stock', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-400 uppercase font-bold block mb-1">Reserved</label>
                      <input
                        type="number"
                        min={0}
                        disabled
                        className="w-full p-2 border border-gray-200 bg-gray-100 rounded text-sm text-gray-500 cursor-not-allowed"
                        value={node.inventory.reserved || 0}
                      />
                    </div>
                    <div className="col-span-2 flex gap-2">
                      <div className="flex-1">
                        <label className="text-[10px] text-gray-400 uppercase font-bold block mb-1">L (cm)</label>
                        <input
                          type="number"
                          className="w-full p-2 border border-gray-300 rounded text-sm outline-none focus:border-blue-500 text-center"
                          value={node.dimensions.length}
                          onChange={e => updateNodeDeep(currentPath, 'dimensions.length', e.target.value)}
                        />
                      </div>
                      <div className="flex-1">
                        <label className="text-[10px] text-gray-400 uppercase font-bold block mb-1">W (cm)</label>
                        <input
                          type="number"
                          className="w-full p-2 border border-gray-300 rounded text-sm outline-none focus:border-blue-500 text-center"
                          value={node.dimensions.width}
                          onChange={e => updateNodeDeep(currentPath, 'dimensions.width', e.target.value)}
                        />
                      </div>
                      <div className="flex-1">
                        <label className="text-[10px] text-gray-400 uppercase font-bold block mb-1">H (cm)</label>
                        <input
                          type="number"
                          className="w-full p-2 border border-gray-300 rounded text-sm outline-none focus:border-blue-500 text-center"
                          value={node.dimensions.height}
                          onChange={e => updateNodeDeep(currentPath, 'dimensions.height', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Variant Media */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                      <ImageIcon className="w-3 h-3" /> Specific Media
                    </h5>
                    <label className="cursor-pointer bg-white border border-blue-200 text-blue-600 px-3 py-1 rounded-full text-xs font-bold hover:bg-blue-50 transition-colors flex items-center gap-1">
                      <Plus className="w-3 h-3" /> Add Images
                      <input
                        type="file"
                        multiple
                        accept="image/*,video/*"
                        className="hidden"
                        onChange={(e: any) => {
                          const newFiles = Array.from(e.target.files);
                          updateNodeDeep(currentPath, 'imageFiles', [...(node.imageFiles || []), ...newFiles]);
                        }}
                      />
                    </label>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {/* Existing */}
                    {node.media?.map((m: any, mIdx: any) => (
                      <div key={`old-${mIdx}`} className="relative w-14 h-14 rounded-lg overflow-hidden border border-gray-200 group bg-gray-100">
                        {m.type === 'video' ? (
                          <div className="w-full h-full bg-black flex items-center justify-center">
                            <Video className="w-5 h-5 text-white" />
                          </div>
                        ) : (
                          <img src={`${IMAGE_URL + m.url}`} className="w-full h-full object-cover" alt="" />
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveExistingVariantImage(currentPath, m.url)}
                          className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    {/* New */}
                    {node.imageFiles?.map((file: any, fIdx: any) => (
                      <div key={`new-${fIdx}`} className="relative w-14 h-14 rounded-lg overflow-hidden border-2 border-blue-500 group">
                        <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="" />
                        <div className="absolute top-0 right-0 bg-blue-500 text-white text-[8px] px-1 font-bold">NEW</div>
                        <button
                          type="button"
                          onClick={() => {
                            const updatedFiles = node.imageFiles.filter((_: any, i: any) => i !== fIdx);
                            updateNodeDeep(currentPath, 'imageFiles', updatedFiles);
                          }}
                          className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    {(!node.media?.length && !node.imageFiles?.length) && (
                      <div className="text-xs text-gray-400 italic py-2">No variant-specific images added.</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Recursion for Children */}
            <VariantNode
              deleteNodeDeep={deleteNodeDeep}
              nodes={node.children ?? []}
              path={[...currentPath, 'children']}
              depth={depth + 1}
              addNode={addNode}
              updateNodeDeep={updateNodeDeep}
              levelLabels={levelLabels}
              setForm={setForm}
            />

            {/* Add Child Button */}
            {!isLeaf && (
              <div className="mt-4 pl-6 border-l-2 border-dashed border-gray-200">
                <button
                  type="button"
                  onClick={() => addNode([...currentPath, 'children'])}
                  className="flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors bg-blue-50 px-3 py-2 rounded-lg hover:bg-blue-100 w-fit"
                >
                  <Plus className="w-3 h-3" />
                  Add {node.children?.length > 0 ? "Another Value" : "Sub-Option"}
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default function Products() {
  const [products, setProducts] = useState<any>([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const initialPricing = [
    { region: "Domestic", currency: "INR", originalPrice: "", salePrice: "" },
    { region: "Overseas", currency: "QAR", originalPrice: "", salePrice: "" }
  ];

  const [form, setForm]: any = useState({
    name: "",
    discount: 0,
    description: "",
    shortDescription: "",
    brand: "",
    levelLabels: [],
    categories: [],
    media: [],
    pricing: initialPricing,
    seo: { title: "", description: "", keywords: [] },
    isActive: true,
    isFeatured: false,
    isOnlyProduct: false,
    isDiykit: false,
    productData: {},
    variants: [],
    sku: "",
    stock: 0,
    reserved: 0,
    lowStockThreshold: 0,
    weight: "",
    nestedVariants: [],
    dimensions: { length: "", width: "", height: "" },
    attributes: [],
  });

  const [editingId, setEditingId] = useState(null);
  const [removedMedia, setRemovedMedia] = useState<any>([]);
  const [submitting, setSubmitting] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [search, setSearch] = useState(""); // Add search state

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchBrands();
  }, []);

  const fetchProducts = async () => {
    const res = await apiFetch("/products");
    setProducts(res);
  };

  const fetchCategories = async () => {
    const res = await apiFetch("/categories");
    setCategories(res);
  };

  const fetchBrands = async () => {
    const res = await apiFetch("/brands");
    setBrands(res.data);
  };

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
      variants: name === "isOnlyProduct" && !checked ? [] : form.variants
    });
  };

  const handleDimensionChange = (field: any, value: any) => {
    setForm({ ...form, dimensions: { ...form.dimensions, [field]: value } });
  };

  const handleMediaChange = (e: any) => {
    const input = e.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const files = Array.from(input.files) as File[];
    const newMedia: any[] = [];
    for (const file of files) {
      const isVideo = file.type.startsWith("video/");
      if (!isVideo && file.size > 5 * 1024 * 1024) {
        toast({ title: `Image ${file.name} too large (max 5MB)`, variant: "destructive" });
        continue;
      }
      if (isVideo && file.size > 50 * 1024 * 1024) {
        toast({ title: `Video ${file.name} too large (max 50MB)`, variant: "destructive" });
        continue;
      }
      newMedia.push({
        file,
        url: URL.createObjectURL(file),
        alt: file.name,
        type: isVideo ? "video" : "image",
        videoType: isVideo ? "uploaded" : null,
      });
    }

    if (newMedia.length) {
      setForm((prev: any) => ({ ...prev, media: [...prev.media, ...newMedia] }));
    }
  };

  const handleRemoveMedia = (url: any) => {
    setForm((prev: any) => ({
      ...prev,
      media: prev.media.filter((m: any) => m.url !== url),
    }));
    setRemovedMedia((prev: any) => [...prev, url]);
  };

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      shortDescription: "",
      brand: "",
      categories: [],
      media: [],
      pricing: initialPricing,
      levelLabels: [],
      seo: { title: "", description: "", keywords: [] },
      isActive: true,
      isFeatured: false,
      isOnlyProduct: false,
      isDiykit: false,
      productData: {},
      variants: [],
      sku: "",
      stock: 0,
      reserved: 0,
      lowStockThreshold: 0,
      weight: "",
      nestedVariants: [],
      dimensions: { length: "", width: "", height: "" },
      attributes: [],
    });
    setEditingId(null);
    setRemovedMedia([]);
  };

  const handleEdit = (p: any) => {
    setEditingId(p._id);

    const labels = p.variants?.length > 0
      ? Object.keys(p.variants[0].attributes)
      : ["Level 1", "Level 2", "Level 3"];

    const reconstructTree = (flatVariants: any, labels: any) => {
      const root: any = [];
      flatVariants.forEach((variant: any) => {
        let currentLevel = root;
        labels.forEach((label: any, index: any) => {
          const value = variant.attributes[label];
          const isLastLevel = index === labels.length - 1;
          let existingNode = currentLevel.find((node: any) => node.name === value);

          if (!existingNode) {
            existingNode = {
              id: `node-${Math.random().toString(36).substr(2, 9)}`,
              name: value,
              children: [],
              ...(isLastLevel ? {
                sku: variant.sku,
                barcode: variant.barcode,
                pricing: variant.pricing || [],
                inventory: variant.inventory || { stock: 0, reserved: 0, lowStockThreshold: 5 },
                dimensions: variant.dimensions || { length: 0, width: 0, height: 0 },
                weight: variant.weight,
                images: variant.images || [],
                media: variant.media || [],
                imageFiles: [],
                _id: variant._id
              } : {})
            };
            currentLevel.push(existingNode);
          }
          currentLevel = existingNode.children;
        });
      });
      return root;
    };

    const nestedTree = reconstructTree(p.variants || [], labels);

    setForm({
      ...p,
      pricing: p.pricing ?? initialPricing,
      brand: p.brand?._id || "",
      categories: p.categories?.map((c: any) => c._id) || [],
      levelLabels: labels,
      nestedVariants: nestedTree,
      sku: p.productData?.sku || "",
      stock: p.productData?.inventory?.stock || 0,
      reserved: p.productData?.inventory?.reserved || 0,
      lowStockThreshold: p.productData?.inventory?.lowStockThreshold || 0,
      weight: p.productData?.weight || "",
      dimensions: p.productData?.dimensions || { length: "", width: "", height: "" },
      attributes: p.productData?.attributes
        ? Object.entries(p.productData.attributes).map(([key, value]) => ({ key, value }))
        : [],
    });

    setRemovedMedia([]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: any) => {
    if (!confirm(t('delete_confirm', { name: 'this product' }))) return;
    setRemovingId(id);
    try {
      await apiFetch(`/products/${id}`, { method: "DELETE" });
      setProducts(products.filter((p: any) => p._id !== id));
    } catch (err) {
      console.error(err);
    } finally {
      setRemovingId(null);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = new FormData();
      data.append("name", form.name);
      data.append("description", form.description);
      data.append("shortDescription", form.shortDescription);
      data.append("brand", form.brand);
      data.append("categories", JSON.stringify(form.categories));
      data.append("pricing", JSON.stringify(form.pricing));
      data.append("seo", JSON.stringify(form.seo));
      data.append("isActive", form.isActive?.toString());
      data.append("isFeatured", form.isFeatured?.toString());
      data.append("isOnlyProduct", form.isOnlyProduct?.toString());
      data.append("attributes", JSON.stringify(form.attributes));
      data.append("sku", form.sku);
      data.append("stock", form.stock?.toString());
      data.append("reserved", form.reserved?.toString());
      data.append("lowStockThreshold", form.lowStockThreshold?.toString());
      data.append("weight", form.weight);
      data.append("dimensions", JSON.stringify(form.dimensions));

      form.media.forEach((m: any) => {
        if (m.type === "image") data.append("images", m.file);
        if (m.type === "video") data.append("videos", m.file);
      });

      if (!form.isOnlyProduct) {
        const flatVariants: any = [];
        const flattenTree = (nodes: any, parentName = "", parentAttrs = {}, depth = 1) => {
          nodes.forEach((node: any) => {
            const currentName = parentName ? `${parentName} / ${node.name}` : node.name;
            const attrLabel = form.levelLabels[depth - 1] || `Level_${depth}`;
            const currentAttrs = { ...parentAttrs, [attrLabel]: node.name };

            if (node.children && node.children.length > 0) {
              flattenTree(node.children, currentName, currentAttrs, depth + 1);
            } else {
              const currentIndex = flatVariants.length;
              const allMediaFiles = [...(node.imageFiles || []), ...(node.videoFiles || [])];
              allMediaFiles.forEach((file) => data.append(`variantMedia_${currentIndex}`, file));
              const { id, children, imageFiles, videoFiles, ...variantMetadata } = node;
              flatVariants.push({ ...variantMetadata, name: currentName, attributes: currentAttrs });
            }
          });
        };
        flattenTree(form.nestedVariants);
        data.append("variants", JSON.stringify(flatVariants));
      }

      if (removedMedia.length) data.append("removedMedia", JSON.stringify(removedMedia));

      let res: any;
      if (editingId) {
        data.append("id", editingId);
        res = await apiFetch(`/products`, { method: "PUT", data });
        setProducts(products.map((p: any) => (p._id === editingId ? res : p)));
      } else {
        res = await apiFetch("/products", { method: "POST", data });
        setProducts([...products, res]);
      }

      resetForm();
      fetchProducts();
      toast({ title: editingId ? "Product Updated" : "Product Created", variant: "default" });
    } catch (err: any) {
      toast({ title: err.message || "Error saving product", variant: "destructive" });
    }
    finally {
      setSubmitting(false);
    }
  };

  const updateNodeDeep = (path: any, field: any, value: any) => {
    setForm((prev: any) => {
      const newNestedVariants = [...prev.nestedVariants];
      let current: any = newNestedVariants;
      for (let i = 0; i < path.length - 1; i++) {
        const key = path[i];
        if (Array.isArray(current[key])) {
          current[key] = [...current[key]];
        } else {
          current[key] = { ...current[key] };
        }
        current = current[key];
      }
      const lastKey = path[path.length - 1];
      if (field.includes('.')) {
        const [parentKey, childKey] = field.split('.');
        current[lastKey] = {
          ...current[lastKey],
          [parentKey]: {
            ...current[lastKey][parentKey],
            [childKey]: value
          }
        };
      } else {
        current[lastKey] = {
          ...current[lastKey],
          [field]: value
        };
      }
      return { ...prev, nestedVariants: newNestedVariants };
    });
  };

  const addNode = (path = []) => {
    setForm((prev: any) => {
      const newForm: any = { ...prev, nestedVariants: structuredClone(prev.nestedVariants) };
      if (path.length === 0) {
        newForm.nestedVariants.push(createEmptyNode());
        return newForm;
      }
      let current: any = newForm.nestedVariants;
      for (let i = 0; i < path.length; i++) {
        const key = path[i];
        if (typeof key === "number") current = current[key];
        else if (key === "children") {
          if (!current.children) current.children = [];
          current = current.children;
        }
      }
      current.push(createEmptyNode());
      return newForm;
    });
  };

  const createEmptyNode: any = () => ({
    id: crypto.randomUUID(),
    levelLabel: "",
    name: "",
    sku: "",
    barcode: "",
    weight: 0,
    pricing: [
      { region: "Domestic", currency: "INR", originalPrice: "", salePrice: "" },
      { region: "Overseas", currency: "QAR", originalPrice: "", salePrice: "" }
    ],
    inventory: { stock: 0, reserved: 0, lowStockThreshold: 5 },
    dimensions: { length: 0, width: 0, height: 0 },
    children: [],
    imageFiles: []
  });

  const deleteNodeDeep = (path: any) => {
    setForm((prev: any) => {
      const newNestedVariants = structuredClone(prev.nestedVariants);
      if (path.length === 1) {
        newNestedVariants.splice(path[0], 1);
        return { ...prev, nestedVariants: newNestedVariants };
      }
      let current: any = newNestedVariants;
      for (let i = 0; i < path.length - 1; i++) {
        const key = path[i];
        current = key === "children" ? current.children : current[key];
      }
      current.splice(path[path.length - 1], 1);
      return { ...prev, nestedVariants: newNestedVariants };
    });
  };

  const handlePricingChange = (index: any, field: any, value: any) => {
    const newPricing: any = [...form.pricing];
    newPricing[index][field] = value;
    setForm({ ...form, pricing: newPricing });
  };

  const handleAddRegion = (currencyCode: any) => {
    if (form.pricing.find((p: any) => p.currency === currencyCode)) return;
    const currencyInfo: any = CURRENCY_OPTIONS.find(c => c.code === currencyCode);
    setForm((prev: any) => ({
      ...prev,
      pricing: [...prev.pricing, { region: currencyInfo.label, currency: currencyCode, originalPrice: "", salePrice: "" }]
    }));
  };

  const handleRemoveRegion = (index: any) => {
    setForm((prev: any) => ({
      ...prev,
      pricing: prev.pricing.filter((_: any, i: any) => i !== index)
    }));
  };

  return (
    <div className="w-full p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-[10px] border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500 mt-1">
            Add, edit, and organize your product catalog.
          </p>
        </div>
        <AdminButton 
          onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); resetForm(); }} 
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </AdminButton>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
                {editingId ? <Pencil className="w-4 h-4 text-orange-500" /> : <Plus className="w-4 h-4 text-blue-500" />}
                {editingId ? "Edit Product Details" : "Create New Product"}
            </h2>
            {editingId && (
                <button type="button" onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                </button>
            )}
        </div>

        <div className="p-6 space-y-8">
            {/* 1. General Info */}
            <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Basic Info</h3>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-600">Product Name</label>
                        <input
                            name="name"
                            required
                            value={form.name}
                            onChange={handleChange}
                            placeholder="e.g. Premium Wireless Headphones"
                            className="w-full p-2.5 rounded-[8px] border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-600">Brand</label>
                            <select
                                name="brand"
                                value={form.brand}
                                onChange={handleChange}
                                className="w-full p-2.5 rounded-[8px] border border-gray-300 text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option value="">Select Brand</option>
                                {brands.map((b: any) => (
                                    <option key={b._id} value={b._id}>{b.title}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-600">Category</label>
                            <select
                                name="category"
                                value={form.categories?.[0] || ""}
                                onChange={(e: any) => setForm({ ...form, categories: [e.target.value] })}
                                className="w-full p-2.5 rounded-[8px] border border-gray-300 text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option value="">Select Category</option>
                                {categories.map((c: any) => (
                                    <option key={c._id} value={c._id}>{c.title}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="md:col-span-2 space-y-1">
                        <label className="text-xs font-semibold text-gray-600">Short Description</label>
                        <input
                            name="shortDescription"
                            value={form.shortDescription}
                            onChange={handleChange}
                            placeholder="Brief summary shown in product cards..."
                            className="w-full p-2.5 rounded-[8px] border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <div className="md:col-span-2 space-y-1">
                        <label className="text-xs font-semibold text-gray-600">Full Description</label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Detailed product information..."
                            rows={4}
                            className="w-full p-2.5 rounded-[8px] border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                        />
                    </div>
                </div>
            </div>

            {/* 2. Global Media */}
            <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Global Media</h3>
                    <label className="cursor-pointer bg-blue-50 text-blue-600 px-3 py-1.5 rounded-[8px] text-xs font-bold hover:bg-blue-100 transition-colors flex items-center gap-2">
                        <Upload className="w-3.5 h-3.5" />
                        Upload Images/Video
                        <input
                            type="file"
                            accept="image/*,video/*"
                            multiple
                            className="hidden"
                            onChange={handleMediaChange}
                        />
                    </label>
                </div>
                
                <div className="flex flex-wrap gap-4 min-h-[80px] bg-gray-50/50 p-4 rounded-xl border border-dashed border-gray-200">
                    {form.media?.length === 0 && (
                        <div className="w-full text-center text-gray-400 text-sm italic py-4">No media uploaded yet.</div>
                    )}
                    {form.media?.map((m: any, idx: any) => (
                        <div key={idx} className="relative w-24 h-24 group rounded-xl overflow-hidden shadow-sm border border-gray-200 bg-white">
                            {m.type === 'video' ? (
                                <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white">
                                    <Video className="w-8 h-8 opacity-50" />
                                </div>
                            ) : (
                                <img
                                    src={m.url.startsWith('http') || m.url.startsWith('blob') ? m.url : IMAGE_URL + m.url}
                                    alt="Product"
                                    className="w-full h-full object-cover"
                                />
                            )}
                            <button
                                type="button"
                                onClick={() => handleRemoveMedia(m.url)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* 3. Global Pricing */}
            <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Base Pricing</h3>
                    <div className="relative">
                        <select
                            value=""
                            onChange={(e) => handleAddRegion(e.target.value)}
                            className="text-xs border border-gray-300 rounded-[6px] p-1.5 bg-white focus:outline-none focus:border-blue-500"
                        >
                            <option value="" disabled>+ Add Market</option>
                            {CURRENCY_OPTIONS.map((curr) => (
                                <option key={curr.code} value={curr.code} disabled={form.pricing.some((p:any) => p.currency === curr.code)}>
                                    {curr.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {form.pricing.map((priceGroup: any, idx: any) => (
                        <div key={idx} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm relative group">
                            {!['INR', 'QAR'].includes(priceGroup.currency) && (
                                <button
                                    type="button"
                                    onClick={() => handleRemoveRegion(idx)}
                                    className="absolute -top-2 -right-2 bg-white border border-red-200 text-red-500 rounded-full w-6 h-6 flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            )}
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded text-gray-600">{priceGroup.currency}</span>
                                <span className="text-xs text-gray-400 truncate">{priceGroup.region}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Regular</label>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        className="w-full p-2 border border-gray-300 rounded text-sm focus:border-blue-500 outline-none"
                                        value={priceGroup.originalPrice}
                                        onChange={(e) => handlePricingChange(idx, "originalPrice", e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-green-600 block mb-1">Sale</label>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        className="w-full p-2 border border-green-200 rounded text-sm focus:border-green-500 outline-none font-bold text-green-700"
                                        value={priceGroup.salePrice}
                                        onChange={(e) => handlePricingChange(idx, "salePrice", e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 4. Configuration & Variants */}
            <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Configuration</h3>
                
                <div className="flex gap-4 mb-6">
                    <label className="flex items-center gap-2 cursor-pointer select-none border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                        <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
                        <span className="text-sm font-medium text-gray-700">Active</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                        <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500" />
                        <span className="text-sm font-medium text-gray-700">Featured</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                        <input type="checkbox" name="isDiykit" checked={form.isDiykit} onChange={handleChange} className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500" />
                        <span className="text-sm font-medium text-gray-700">DIY Kit</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                        <input type="checkbox" name="isOnlyProduct" checked={form.isOnlyProduct} onChange={handleChange} className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500" />
                        <span className="text-sm font-medium text-gray-700">Single Product (No Variants)</span>
                    </label>
                </div>

                {/* Conditional Render: Single Inventory vs Variants */}
                {form.isOnlyProduct ? (
                    <div className="bg-purple-50/50 p-5 rounded-xl border border-purple-100 animate-in fade-in">
                        <h4 className="text-sm font-bold text-purple-800 mb-4 flex items-center gap-2">
                            <Box className="w-4 h-4" /> Single Inventory Management
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-500">SKU</label>
                                <input
                                    name="sku"
                                    value={form.sku}
                                    onChange={handleChange}
                                    className="w-full p-2 bg-white border border-gray-300 rounded text-sm"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-500">Stock</label>
                                <input
                                    type="number"
                                    name="stock"
                                    value={form.stock}
                                    onChange={handleChange}
                                    className="w-full p-2 bg-white border border-gray-300 rounded text-sm"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-500">Dimensions (L x W x H)</label>
                                <div className="flex gap-2">
                                    <input placeholder="L" name="length" value={form.dimensions.length} onChange={(e) => handleDimensionChange("length", e.target.value)} className="w-full p-2 bg-white border border-gray-300 rounded text-sm text-center" />
                                    <input placeholder="W" name="width" value={form.dimensions.width} onChange={(e) => handleDimensionChange("width", e.target.value)} className="w-full p-2 bg-white border border-gray-300 rounded text-sm text-center" />
                                    <input placeholder="H" name="height" value={form.dimensions.height} onChange={(e) => handleDimensionChange("height", e.target.value)} className="w-full p-2 bg-white border border-gray-300 rounded text-sm text-center" />
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h4 className="text-sm font-bold text-gray-700">Product Variants</h4>
                            <button
                                type="button"
                                onClick={() => addNode([])}
                                className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-1"
                            >
                                <Plus className="w-3 h-3" /> Add Variant Group
                            </button>
                        </div>
                        <div className="border-l-2 border-gray-200 pl-4 ml-2">
                            <VariantNode
                                deleteNodeDeep={deleteNodeDeep}
                                nodes={form.nestedVariants}
                                addNode={addNode}
                                updateNodeDeep={updateNodeDeep}
                                levelLabels={form.levelLabels}
                                setForm={setForm}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Action Footer */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                {editingId && (
                    <AdminButton type="button" variant="ghost" onClick={resetForm} className="px-6 py-2.5">
                        Cancel
                    </AdminButton>
                )}
                <AdminButton type="submit" loading={submitting} className="px-8 py-2.5 font-bold shadow-md hover:shadow-lg transition-all">
                    {editingId ? "Update Product" : "Create Product"}
                </AdminButton>
            </div>
        </div>
      </form>

      {/* Product List Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <h3 className="font-bold text-gray-700">Inventory</h3>
            <div className="flex items-center gap-3">
               {/* Search Bar */}
               <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input 
                    placeholder="Search products..." 
                    className="pl-9 pr-4 py-1.5 text-xs rounded-full border border-gray-300 focus:border-blue-500 outline-none w-48"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
               </div>
               <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-md font-bold">{products.length} Items</span>
            </div>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold">
                    <tr>
                        <th className="px-6 py-3">Product</th>
                        <th className="px-6 py-3">Brand</th>
                        <th className="px-6 py-3">Category</th>
                        <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {products
                      .filter((p: any) => p.name.toLowerCase().includes(search.toLowerCase()) || p.sku?.toLowerCase().includes(search.toLowerCase()))
                      .map((p: any) => (
                        <tr key={p._id} className="hover:bg-blue-50/50 transition-colors group">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded bg-gray-100 border border-gray-200 overflow-hidden shrink-0">
                                        {p.images?.[0]?.url ? (
                                            <img src={IMAGE_URL + p.images[0].url} className="w-full h-full object-cover" alt="" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300"><ImageIcon className="w-4 h-4" /></div>
                                        )}
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-gray-900">{p.name}</div>
                                        <div className="text-xs text-gray-500 font-mono">{p.sku || "NO-SKU"}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="inline-block px-2 py-1 rounded-md bg-gray-100 text-xs font-medium text-gray-600">
                                    {p.brand?.title || "—"}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex gap-1 flex-wrap">
                                    {p.categories?.map((c: any) => (
                                        <span key={c._id} className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                                            {c.title}
                                        </span>
                                    ))}
                                    {!p.categories?.length && <span className="text-gray-400 text-xs italic">Uncategorized</span>}
                                </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleEdit(p)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors" title="Edit">
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleDelete(p._id)} className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors" title="Delete">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {products.length === 0 && (
                        <tr>
                            <td colSpan={4} className="px-6 py-12 text-center text-gray-400 italic">
                                No products found. Add one to get started.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}