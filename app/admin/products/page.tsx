"use client"
import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { apiUrl, CURRENCY_OPTIONS } from "@/lib/constants";
import { useI18n } from "@/contexts/I18nContext";
import { apiFetch } from "@/lib/axios";

const VariantNode = ({ nodes, path = [], depth = 1, addNode, updateNodeDeep, levelLabels, setForm, deleteNodeDeep }: any) => {
  const { t } = useI18n();
  const handleLabelChange = (newLabel: any) => {
    setForm((prev: any) => {
      const updatedLabels = [...prev.levelLabels];
      updatedLabels[depth - 1] = newLabel; // depth 1 maps to index 0
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
    <div className={`${depth > 1 ? "ml-8 border-l-2 border-[var(--neutral-100)] pl-4" : ""} space-y-4`}>
      {nodes?.length > 0 && (
        <div className="bg-[var(--primary-50)] p-2 rounded-md border border-[var(--primary-100)] flex items-center gap-4 mb-2">
          <label className="text-[10px] font-black text-[var(--primary-500)] uppercase tracking-widest whitespace-nowrap">
            {t('admin.variant.level_name', { depth })}
          </label> 
          <input
            placeholder="e.g. Color, Size, or Fabric"
            className="flex-1 bg-transparent border-b border-[var(--primary-200)] focus:border-[var(--primary-500)] outline-none text-sm font-bold text-[var(--primary-700)]"
            value={levelLabels[depth - 1] || ""}
            onChange={(e) => handleLabelChange(e.target.value)}
          />
        </div>
      )}
      {(nodes ?? []).map((node: any, idx: any) => {
        const currentPath = [...path, idx];
        const isLeaf = node.children?.length === 0;

        return (
          <div key={node.id} className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 shadow-sm">
            <div className="flex flex-col md:flex-row gap-4 mb-4 bg-[var(--neutral-50)] p-3 rounded-lg">
              <div className="flex-[2]">
                <label className="text-[10px] font-bold text-[var(--neutral-400)] uppercase tracking-widest">
                  {node.levelLabel || t('admin.variant.level_default', { depth })} {t('admin.variant.value')}
                </label>
                <input
                  placeholder={`e.g. ${depth === 1 ? 'Red' : depth === 2 ? 'Large' : 'Cotton'}`}
                  className="w-full bg-transparent font-bold border-b border-[var(--neutral-300)] focus:border-[var(--primary-500)] outline-none pb-1 text-lg text-[var(--foreground)]"
                  value={node.name}
                  onChange={(e) => updateNodeDeep(currentPath, 'name', e.target.value)}
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  if (confirm(t('admin.variant.delete_confirm', { name: node.name || t('admin.variant.unnamed') }))) {
                    deleteNodeDeep(currentPath);
                  }
                }}
                className="text-[10px] font-bold text-[var(--destructive-500)] uppercase hover:text-[var(--destructive-700)]"
              >
                {t('common.delete')}
              </button>

            </div>

            {isLeaf && (
              <div className="space-y-4 p-4 bg-[var(--neutral-50)] rounded-xl border border-[var(--neutral-200)] mb-4 animate-in fade-in zoom-in duration-200">
                {/* Identification Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[var(--neutral-400)] uppercase">{t('admin.field.sku_required')}</label>
                    <input
                      placeholder="SKU-12345"
                      className="w-full p-2 border border-[var(--input)] rounded text-sm font-mono bg-[var(--background)] focus:ring-2 focus:ring-[var(--primary-500)] outline-none text-[var(--foreground)]"
                      value={node.sku}
                      onChange={e => updateNodeDeep(currentPath, 'sku', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[var(--neutral-400)] uppercase">{t('admin.field.barcode')}</label>
                    <input
                      placeholder="EAN/UPC"
                      className="w-full p-2 border border-[var(--input)] rounded text-sm bg-[var(--background)] outline-none text-[var(--foreground)]"
                      value={node.barcode || ""}
                      onChange={e => updateNodeDeep(currentPath, 'barcode', e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[var(--neutral-400)] uppercase">{t('admin.field.weight_kg')}</label>
                    <input
                      type="number"
                      placeholder="0.00"
                      className="w-full p-2 border border-[var(--input)] rounded text-sm bg-[var(--background)] outline-none text-[var(--foreground)]"
                      value={node.weight || ""}
                      onChange={e => updateNodeDeep(currentPath, 'weight', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-[var(--neutral-200)]">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-[var(--neutral-400)] uppercase tracking-wider">
                      {t('admin.variant.market_pricing')}
                    </label>
                    <div className="bg-[var(--neutral-50)] p-4 rounded-lg border border-dashed border-[var(--neutral-300)]">
                      <label className="text-xs font-bold text-[var(--neutral-500)] uppercase block mb-2">{t('admin.variant.add_market')}</label>
                      <select
                        value=""
                        onChange={(e) => {
                          let currencyCode = e.target.value;
                          const currentPricing = node.pricing || [];
                          const missingMarkets = CURRENCY_OPTIONS
                            .filter(opt => opt.code === currencyCode)
                            .map(opt => ({
                              region: opt.label.split(' - ')[1] || opt.label, // Extract region name
                              currency: opt.code,
                              originalPrice: "",
                              salePrice: ""
                            }));
                          updateNodeDeep(currentPath, 'pricing', [...currentPricing, missingMarkets[0]]);
                        }}
                        className="w-full md:w-64 border-[var(--neutral-300)] rounded-lg border p-2 text-sm bg-[var(--background)] focus:ring-2 focus:ring-[var(--primary-500)] outline-none text-[var(--foreground)]"
                      >
                        <option value="" disabled>{t('admin.variant.select_currency')}</option>
                        {CURRENCY_OPTIONS.map((curr: any) => (
                          <option
                            key={curr.code}
                            value={curr.code}
                            disabled={node.pricing.some((p: any) => p.currency === curr.code)}
                          >
                            {curr.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {(node.pricing || []).map((pGroup: any, pIdx: any) => {
                      const selectedCurrency = CURRENCY_OPTIONS.find(c => c.code === pGroup.currency) || CURRENCY_OPTIONS[0];
                      const pPath = [...currentPath, 'pricing', pIdx];

                      return (
                        <div key={pIdx} className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-3 shadow-sm relative group/price">
                          {
                            !['INR', 'USD'].includes(pGroup.currency) && <button
                              type="button"
                              onClick={() => {
                                const filtered = node.pricing.filter((_: any, i: any) => i !== pIdx);
                                updateNodeDeep(currentPath, 'pricing', filtered);
                              }}
                              className="absolute -top-2 -right-2 bg-[var(--card)] text-[var(--destructive-500)] border border-[var(--destructive-100)] rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover/price:opacity-100 transition-opacity shadow-sm"
                            >
                              ×
                            </button>
                          }

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                              <label className="text-[8px] font-black text-[var(--neutral-400)] uppercase">{t('admin.field.currency')}</label>
                              <select
                                value={pGroup.currency}
                                onChange={(e) => updateNodeDeep(pPath, 'currency', e.target.value)}
                                className="w-full mt-1 p-1.5 border border-[var(--input)] rounded text-xs bg-[var(--neutral-50)] outline-none focus:ring-1 focus:ring-[var(--primary-500)] text-[var(--foreground)]"
                              >
                                {CURRENCY_OPTIONS.map((curr) => (
                                  <option key={curr.code} value={curr.code}>{curr.label}</option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="text-[8px] font-black text-[var(--neutral-400)] uppercase">{t('admin.field.regular_price')}</label>
                              <div className="relative mt-1">
                                <span className="absolute left-2 top-1.5 text-[10px] text-[var(--neutral-400)] font-bold">{selectedCurrency.symbol}</span>
                                <input
                                  type="number"
                                  placeholder="0.00"
                                  className="w-full p-1.5 pl-5 border border-[var(--input)] rounded text-xs outline-none focus:ring-1 focus:ring-[var(--primary-500)] bg-[var(--background)] text-[var(--foreground)]"
                                  value={pGroup.originalPrice}
                                  onChange={(e) => updateNodeDeep(pPath, 'originalPrice', e.target.value)}
                                />
                              </div>
                            </div>

                            <div>
                              <label className="text-[8px] font-black text-[var(--neutral-400)] uppercase">{t('admin.field.sale_price')}</label>
                              <div className="relative mt-1">
                                <span className="absolute left-2 top-1.5 text-[10px] text-[var(--success-500)] font-bold">{selectedCurrency.symbol}</span>
                                <input
                                  type="number"
                                  placeholder="0.00"
                                  className="w-full p-1.5 pl-5 border border-[var(--input)] rounded text-xs text-[var(--success-700)] font-bold outline-none focus:ring-1 focus:ring-[var(--success-500)] bg-[var(--background)]"
                                  value={pGroup.salePrice}
                                  onChange={(e) => updateNodeDeep(pPath, 'salePrice', e.target.value)}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-[var(--neutral-200)]">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[var(--info-500)] uppercase">{t('admin.stock.count')}</label>
                    <input
                      type="number"
                      className="w-full p-2 border border-[var(--info-100)] rounded text-sm bg-[var(--background)] text-[var(--foreground)]"
                      value={node.inventory.stock}
                      onChange={e => updateNodeDeep(currentPath, 'inventory.stock', e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[var(--info-500)] uppercase">{t('admin.stock.reserved')}</label>
                    <input
                      type="number"
                      disabled
                      className="w-full p-2 border border-[var(--info-50)] rounded text-sm bg-[var(--neutral-100)] cursor-not-allowed text-[var(--neutral-500)]"
                      value={node.inventory.reserved || 0}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[var(--info-500)] uppercase">{t('admin.stock.low_limit')}</label>
                    <input
                      type="number"
                      className="w-full p-2 border border-[var(--info-100)] rounded text-sm bg-[var(--background)] text-[var(--foreground)]"
                      value={node.inventory.lowStockThreshold || 5}
                      onChange={e => updateNodeDeep(currentPath, 'inventory.lowStockThreshold', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1 pt-2 border-t border-[var(--neutral-200)]">
                  <label className="text-[10px] font-bold text-[var(--neutral-400)] uppercase block">{t('admin.field.dimensions')}</label>
                  <div className="flex gap-2">
                    <input
                      placeholder="L"
                      type="number"
                      className="w-1/3 p-2 border border-[var(--input)] rounded text-sm text-center bg-[var(--background)] text-[var(--foreground)]"
                      value={node.dimensions.length}
                      onChange={e => updateNodeDeep(currentPath, 'dimensions.length', e.target.value)}
                    />
                    <input
                      placeholder="W"
                      type="number"
                      className="w-1/3 p-2 border border-[var(--input)] rounded text-sm text-center bg-[var(--background)] text-[var(--foreground)]"
                      value={node.dimensions.width}
                      onChange={e => updateNodeDeep(currentPath, 'dimensions.width', e.target.value)}
                    />
                    <input
                      placeholder="H"
                      type="number"
                      className="w-1/3 p-2 border border-[var(--input)] rounded text-sm text-center bg-[var(--background)] text-[var(--foreground)]"
                      value={node.dimensions.height}
                      onChange={e => updateNodeDeep(currentPath, 'dimensions.height', e.target.value)}
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-[var(--neutral-200)]">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[10px] font-bold text-[var(--neutral-400)] uppercase block">
                      {t('admin.variant.media')}
                    </label>
                    <span className="text-[9px] text-[var(--neutral-400)] italic">{t('admin.media.hint')}</span>
                  </div>

                  <div className="flex flex-wrap gap-3 mb-3">
                    {node.media?.map((m: any, mIdx: any) => (
                      <div key={`old-${mIdx}`} className="relative w-16 h-16 group">
                        {m.type === 'video' ? (
                          <div className="w-full h-full bg-black flex items-center justify-center rounded-lg border border-[var(--neutral-200)] shadow-sm overflow-hidden">
                            <svg className="w-6 h-6 text-white/50" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" /></svg>
                          </div>
                        ) : (
                          <img
                            src={`${m.url}`}
                            alt="Saved"
                            className="w-full h-full object-cover rounded-lg border border-[var(--neutral-200)] shadow-sm"
                          />
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                          <button
                            type="button"
                            onClick={() => handleRemoveExistingVariantImage(currentPath, m.url)}
                            className="bg-[var(--destructive-500)] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-[var(--destructive-600)] shadow-lg"
                          >
                            ×
                          </button>
                        </div>
                        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[7px] font-bold bg-[var(--card)] px-1 rounded border border-[var(--border)] text-[var(--neutral-400)] uppercase">Saved</span>
                      </div>
                    ))}

                    {node.imageFiles?.map((file: any, fIdx: any) => {
                      const isVideo = file.type.startsWith('video/');
                      const previewUrl = URL.createObjectURL(file);

                      return (
                        <div key={`new-${fIdx}`} className="relative w-16 h-16 group">
                          {isVideo ? (
                            <div className="w-full h-full bg-[var(--primary-900)] flex items-center justify-center rounded-lg border-2 border-dashed border-[var(--primary-200)]">
                              <span className="text-[8px] font-bold text-[var(--primary-200)] uppercase">Video</span>
                            </div>
                          ) : (
                            <img
                              src={previewUrl}
                              alt="New"
                              className="w-full h-full object-cover rounded-lg border-2 border-dashed border-[var(--primary-300)] shadow-sm"
                              onLoad={() => URL.revokeObjectURL(previewUrl)} // Optional: free memory after load
                            />
                          )}
                          <div className="absolute inset-0 bg-[var(--primary-600)]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                            <button
                              type="button"
                              onClick={() => {
                                const updatedFiles = node.imageFiles.filter((_: any, i: any) => i !== fIdx);
                                updateNodeDeep(currentPath, 'imageFiles', updatedFiles);
                              }}
                              className="bg-[var(--primary-600)] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-[var(--primary-700)]"
                            >
                              ×
                            </button>
                          </div>
                          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[7px] font-bold bg-[var(--primary-600)] px-1 rounded border border-[var(--primary-600)] text-white uppercase">{t('common.new')}</span>
                        </div>
                      );
                    })}

                    <label className="w-16 h-16 flex flex-col items-center justify-center border-2 border-dashed border-[var(--neutral-200)] rounded-lg cursor-pointer hover:border-[var(--primary-400)] hover:bg-[var(--primary-50)] transition-all text-[var(--neutral-400)] hover:text-[var(--primary-500)]">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                      <span className="text-[8px] font-bold mt-1 uppercase">{t('common.add')}</span>
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
                </div>
              </div>
            )}

            <VariantNode
              deleteNodeDeep={deleteNodeDeep}
              nodes={node.children ?? []} path={[...currentPath, 'children']} depth={depth + 1} addNode={addNode} updateNodeDeep={updateNodeDeep}
              levelLabels={levelLabels}
              setForm={setForm}
            />

            <button
              type="button"
              onClick={() => addNode([...currentPath, 'children'])}
              className="text-[10px] font-bold text-[var(--primary-600)] uppercase mt-2 hover:text-[var(--primary-800)]"
            >
              {t('admin.variant.add_sub_option', { name: node.name || t('common.this') })}
            </button>
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
    { region: "Overseas", currency: "USD", originalPrice: "", salePrice: "" }
  ];

  const [form, setForm]: any = useState({
    name: "",
    description: "",
    shortDescription: "",
    brand: "",
    levelLabels: [],
    categories: [],
    media: [], // combine images & videos
    pricing: initialPricing,
    seo: { title: "", description: "", keywords: [] },
    isActive: true,
    isFeatured: false,
    isOnlyProduct: false,
    productData: {},
    variants: [],
    rating: 0,
    reviewCount: 0,
    soldCount: 0,
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
  const [imageFiles, setImageFiles] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [removedMedia, setRemovedMedia] = useState<any>([]);
  const [removedVariantImages, setRemovedVariantImages] = useState([]);
  const [removedVariantMedia, setRemovedVariantMedia] = useState([]);

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
    const files = Array.from(e.target.files);
    const newMedia = files.map((file: any) => {
      const isVideo = file.type.startsWith("video/");
      return {
        file, // actual File object for upload
        url: URL.createObjectURL(file), // preview
        alt: file.name,
        type: isVideo ? "video" : "image",
        videoType: isVideo ? "uploaded" : null, // you can use 'youtube', 'vimeo' later
      };
    });

    setForm((prev: any) => ({
      ...prev,
      media: [...prev.media, ...newMedia],
    }));
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
      productData: {},
      variants: [],
      rating: 0,
      reviewCount: 0,
      soldCount: 0,
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
    setImageFiles([]);
    setRemovedImages([]);
    setRemovedMedia([]);
    setRemovedVariantImages([]);
    setRemovedVariantMedia([]);
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

    setImageFiles([]);
    setRemovedImages([]);
    setRemovedMedia([]);
    setRemovedVariantImages([]);
    setRemovedVariantMedia([]);
  };

  const handleDelete = async (id: any) => {
    if (!confirm(('admin.product.delete_confirm'))) return;
    await apiFetch(`/products/${id}`, { method: "DELETE" });
    setProducts(products.filter((p: any) => p._id !== id));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault(); // Prevents page refresh
    try {
      const data = new FormData();

      // --- Basic product fields ---
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

      // --- Product media (images + videos) ---
      form.media.forEach((m: any) => {
        if (m.type === "image") data.append("images", m.file);
        if (m.type === "video") data.append("videos", m.file);
      });

      // --- Multi-variants ---
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

              // Append all variant media under a single field for backend
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

      // --- Removed files ---
      if (removedMedia.length) data.append("removedMedia", JSON.stringify(removedMedia));

      // --- API request ---
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
    } catch (err: any) {
      toast({ title: err.message || "Error saving product" });
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
      const newForm: any = {
        ...prev,
        nestedVariants: structuredClone(prev.nestedVariants)
      };

      // 🌱 ROOT LEVEL
      if (path.length === 0) {
        newForm.nestedVariants.push(createEmptyNode());
        return newForm;
      }

      let current: any = newForm.nestedVariants;

      for (let i = 0; i < path.length; i++) {
        const key = path[i];

        if (typeof key === "number") {
          current = current[key];
        } else if (key === "children") {
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
      { region: "Overseas", currency: "USD", originalPrice: "", salePrice: "" }
    ],
    inventory: { stock: 0, reserved: 0, lowStockThreshold: 5 },
    dimensions: { length: 0, width: 0, height: 0 },
    children: [],
    imageFiles: []
  });

  const deleteNodeDeep = (path: any) => {
    setForm((prev: any) => {
      const newNestedVariants = structuredClone(prev.nestedVariants);

      // 🌱 Root delete
      if (path.length === 1) {
        newNestedVariants.splice(path[0], 1);
        return { ...prev, nestedVariants: newNestedVariants };
      }

      let current: any = newNestedVariants;

      // Walk to parent
      for (let i = 0; i < path.length - 1; i++) {
        const key = path[i];
        current = key === "children" ? current.children : current[key];
      }

      // Remove node
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
    // Check if it already exists to avoid duplicates
    if (form.pricing.find((p: any) => p.currency === currencyCode)) return;

    const currencyInfo: any = CURRENCY_OPTIONS.find(c => c.code === currencyCode);

    setForm((prev: any) => ({
      ...prev,
      pricing: [
        ...prev.pricing,
        {
          region: currencyInfo.label, // Use label as region name
          currency: currencyCode,
          originalPrice: "",
          salePrice: ""
        }
      ]
    }));
  };

  const handleRemoveRegion = (index: any) => {
    setForm((prev: any) => ({
      ...prev,
      pricing: prev.pricing.filter((_: any, i: any) => i !== index)
    }));
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-[var(--foreground)]">{editingId ? "Edit Product" : "Add Product"}</h2>

      <form onSubmit={handleSubmit} className="bg-[var(--card)] shadow rounded p-4 mb-6 border border-[var(--border)]">
        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> */}
        {/* Main Product Info Card */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-sm overflow-hidden mb-6">
          <div className="bg-[var(--neutral-50)] px-4 py-3 border-b border-[var(--neutral-200)] flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--primary-600)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <h4 className="font-semibold text-[var(--neutral-700)]">General Information</h4>
          </div>

          <div className="p-5 space-y-5">
            <div>
              <label className="text-xs font-bold text-[var(--neutral-500)] uppercase tracking-wider mb-1 block">Product Name</label>
              <input
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Wireless Noise Cancelling Headphones"
                className="w-full border-[var(--input)] rounded-lg shadow-sm focus:ring-[var(--primary-500)] focus:border-[var(--primary-500)] sm:text-sm border p-2.5 bg-[var(--background)] text-[var(--foreground)]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[var(--neutral-500)] uppercase tracking-wider">Brand</label>
                <select
                  name="brand"
                  value={form.brand}
                  onChange={handleChange}
                  className="w-full border-[var(--input)] rounded-lg shadow-sm focus:ring-[var(--primary-500)] focus:border-[var(--primary-500)] sm:text-sm border p-2.5 bg-[var(--background)] text-[var(--foreground)]"
                >
                  <option value="">Select Brand</option>
                  {brands.map((b: any) => (
                    <option key={b._id} value={b._id}>{b.title}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-[var(--neutral-500)] uppercase tracking-wider">Primary Category</label>
                <select
                  name="category"
                  value={form.categories?.[0] || ""}
                  onChange={(e: any) => setForm({ ...form, categories: [e.target.value] })}
                  className="w-full border-[var(--input)] rounded-lg shadow-sm focus:ring-[var(--primary-500)] focus:border-[var(--primary-500)] sm:text-sm border p-2.5 bg-[var(--background)] text-[var(--foreground)]"
                >
                  <option value="">Select Category</option>
                  {categories.map((c: any) => (
                    <option key={c._id} value={c._id}>{c.title}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[var(--neutral-500)] uppercase tracking-wider">Short Description</label>
                <textarea
                  name="shortDescription"
                  // rows="2"
                  value={form.shortDescription}
                  onChange={handleChange}
                  placeholder="Brief summary for search results..."
                  className="w-full border-[var(--input)] rounded-lg shadow-sm focus:ring-[var(--primary-500)] focus:border-[var(--primary-500)] sm:text-sm border p-2.5 bg-[var(--background)] text-[var(--foreground)]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-[var(--neutral-500)] uppercase tracking-wider">Full Description</label>
                <textarea
                  name="description"
                  // rows="2"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Detailed product features and specifications..."
                  className="w-full border-[var(--input)] rounded-lg shadow-sm focus:ring-[var(--primary-500)] focus:border-[var(--primary-500)] sm:text-sm border p-2.5 bg-[var(--background)] text-[var(--foreground)]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Card */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-sm overflow-hidden mb-6">
          {/* Header */}
          <div className="bg-[var(--neutral-50)] px-4 py-3 border-b border-[var(--neutral-200)] flex justify-between items-center">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--success-600)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h4 className="font-semibold text-[var(--neutral-700)]">Market Pricing</h4>
            </div>
            <span className="text-[10px] font-bold text-[var(--primary-600)] bg-[var(--primary-50)] px-2 py-1 rounded">
              {form.pricing?.length} Markets Active
            </span>
          </div>

          <div className="p-5 space-y-6">
            {/* Currency Selector Tool */}
            <div className="bg-[var(--neutral-50)] p-4 rounded-lg border border-dashed border-[var(--neutral-300)]">
              <label className="text-xs font-bold text-[var(--neutral-500)] uppercase block mb-2">Add New Market / Currency</label>
              <select
                value=""
                onChange={(e) => handleAddRegion(e.target.value)}
                className="w-full md:w-64 border-[var(--input)] rounded-lg border p-2 text-sm bg-[var(--background)] focus:ring-2 focus:ring-[var(--primary-500)] outline-none text-[var(--foreground)]"
              >
                <option value="" disabled>+ Select currency to add market</option>
                {CURRENCY_OPTIONS.map((curr) => (
                  <option
                    key={curr.code}
                    value={curr.code}
                    disabled={(form.pricing ?? [])?.some((p: any) => p.currency === curr.code)}
                  >
                    {curr.label} {form.pricing.some((p: any) => p.currency === curr.code) ? '(Added)' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Dynamic Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {form.pricing.map((priceGroup: any, idx: any) => {
                const currencyDetail = CURRENCY_OPTIONS.find(c => c.code === priceGroup.currency);

                return (
                  <div key={priceGroup.currency} className="border border-[var(--border)] rounded-xl p-4 bg-[var(--card)] shadow-sm hover:shadow-md transition-shadow relative group">
                    {/* Remove Button */}
                    {
                      !['INR', 'USD'].includes(priceGroup.currency) && <button
                        type="button"
                        onClick={() => handleRemoveRegion(idx)}
                        className="absolute -top-2 -right-2 bg-[var(--destructive-100)] text-[var(--destructive-600)] rounded-full w-6 h-6 flex items-center justify-center border border-[var(--destructive-200)] opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    }

                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-full bg-[var(--primary-600)] text-white flex items-center justify-center text-xs font-bold">
                        {currencyDetail?.symbol}
                      </div>
                      <div>
                        <h5 className="text-sm font-bold text-[var(--neutral-800)]">{priceGroup.currency} Market</h5>
                        <p className="text-[10px] text-[var(--neutral-400)] font-mono">{currencyDetail?.label}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-[10px] font-bold text-[var(--neutral-400)] uppercase">Regular Price</label>
                        <div className="relative mt-1">
                          <span className="absolute left-3 top-2 text-[var(--neutral-400)] text-xs font-bold">{currencyDetail?.symbol}</span>
                          <input
                            type="number"
                            value={priceGroup.originalPrice}
                            onChange={(e) => handlePricingChange(idx, "originalPrice", e.target.value)}
                            className="w-full border-[var(--input)] rounded-lg border p-2 pl-7 text-sm focus:ring-1 focus:ring-[var(--primary-500)] outline-none bg-[var(--background)] text-[var(--foreground)]"
                            placeholder="0.00"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-[var(--neutral-400)] uppercase">Sale Price</label>
                        <div className="relative mt-1">
                          <span className="absolute left-3 top-2 text-[var(--success-600)] text-xs font-bold">{currencyDetail?.symbol}</span>
                          <input
                            type="number"
                            value={priceGroup.salePrice}
                            onChange={(e) => handlePricingChange(idx, "salePrice", e.target.value)}
                            className="w-full border-[var(--input)] rounded-lg border p-2 pl-7 text-sm text-[var(--success-700)] font-bold focus:ring-1 focus:ring-[var(--success-500)] outline-none bg-[var(--background)]"
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {form.pricing.length === 0 && (
                <div className="col-span-full py-10 text-center border-2 border-dashed border-[var(--neutral-100)] rounded-xl">
                  <p className="text-[var(--neutral-400)] text-sm">No markets selected. Select a currency above to set prices.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Settings / Flags Row */}
        <div className="flex flex-wrap gap-4 mb-6 bg-[var(--primary-50)] p-4 rounded-xl border border-[var(--primary-100)]">
          <label className="flex items-center gap-2 px-3 py-2 bg-[var(--card)] rounded-lg border border-[var(--border)] cursor-pointer hover:border-[var(--primary-300)] transition-all select-none shadow-sm">
            <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} className="w-4 h-4 text-[var(--primary-600)] rounded focus:ring-[var(--primary-500)]" />
            <span className="text-sm font-medium text-[var(--neutral-700)]">Active Status</span>
          </label>

          <label className="flex items-center gap-2 px-3 py-2 bg-[var(--card)] rounded-lg border border-[var(--border)] cursor-pointer hover:border-[var(--warning-300)] transition-all select-none shadow-sm">
            <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} className="w-4 h-4 text-[var(--warning-500)] rounded focus:ring-[var(--warning-500)]" />
            <span className="text-sm font-medium text-[var(--neutral-700)]">Featured Product</span>
          </label>

          <label className="flex items-center gap-2 px-3 py-2 bg-[var(--card)] rounded-lg border border-[var(--border)] cursor-pointer hover:border-[var(--info-300)] transition-all select-none shadow-sm">
            <input type="checkbox" name="isOnlyProduct" checked={form.isOnlyProduct} onChange={handleChange} className="w-4 h-4 text-[var(--info-600)] rounded focus:ring-[var(--info-500)]" />
            <span className="text-sm font-medium text-[var(--neutral-700)]">Single Product (No Variants)</span>
          </label>
        </div>

        {/* Single Product Details */}
        {
          form.isOnlyProduct && (
            <div className="mt-6 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-sm overflow-hidden">
                {/* Section Header */}
                <div className="bg-[var(--neutral-50)] px-4 py-3 border-b border-[var(--neutral-200)] flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--primary-600)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <h4 className="font-semibold text-[var(--neutral-700)]">Inventory & Logistics Details</h4>
                </div>

                <div className="p-5 space-y-6">
                  {/* Row 1: Identifiers and Stock */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[var(--neutral-500)] uppercase tracking-wider">Product SKU</label>
                      <input
                        name="sku"
                        value={form.sku}
                        onChange={handleChange}
                        placeholder="e.g. PRD-12345"
                        className="w-full border-[var(--input)] rounded-lg shadow-sm focus:ring-[var(--primary-500)] focus:border-[var(--primary-500)] sm:text-sm border p-2.5 bg-[var(--background)] text-[var(--foreground)]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[var(--neutral-500)] uppercase tracking-wider">Available Stock</label>
                      <input
                        type="number"
                        name="stock"
                        value={form.stock}
                        onChange={handleChange}
                        className="w-full border-[var(--input)] rounded-lg shadow-sm focus:ring-[var(--primary-500)] focus:border-[var(--primary-500)] sm:text-sm border p-2.5 bg-[var(--background)] text-[var(--foreground)]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[var(--neutral-500)] uppercase tracking-wider">Reserved Stock</label>
                      <input
                        name="reserved"
                        type="number"
                        value={form.reserved}
                        onChange={handleChange}
                        className="w-full border-[var(--input)] rounded-lg shadow-sm sm:text-sm border p-2.5 bg-[var(--neutral-50)] cursor-not-allowed text-[var(--neutral-500)]"
                        readOnly
                      />
                    </div>
                  </div>

                  {/* Row 2: Thresholds and Logistics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-[var(--neutral-100)]">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[var(--neutral-500)] uppercase tracking-wider">Low Stock Warning</label>
                      <input
                        name="lowStockThreshold"
                        type="number"
                        value={form.lowStockThreshold}
                        onChange={handleChange}
                        className="w-full border-[var(--input)] rounded-lg shadow-sm focus:ring-[var(--primary-500)] focus:border-[var(--primary-500)] sm:text-sm border p-2.5 bg-[var(--background)] text-[var(--foreground)]"
                      />
                      <p className="text-[10px] text-[var(--neutral-400)]">Notify when stock hits this level</p>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[var(--neutral-500)] uppercase tracking-wider">Weight (kg)</label>
                      <div className="relative">
                        <input
                          name="weight"
                          type="text"
                          value={form.weight}
                          onChange={handleChange}
                          placeholder="0.00"
                          className="w-full border-[var(--input)] rounded-lg shadow-sm focus:ring-[var(--primary-500)] focus:border-[var(--primary-500)] sm:text-sm border p-2.5 bg-[var(--background)] text-[var(--foreground)]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[var(--neutral-500)] uppercase tracking-wider">Dimensions (L x W x H cm)</label>
                      <div className="flex gap-2">
                        <input
                          name="length"
                          type="number"
                          value={form.dimensions.length}
                          onChange={(e) => handleDimensionChange("length", e.target.value)}
                          placeholder="L"
                          className="border-[var(--input)] rounded-lg shadow-sm focus:ring-[var(--primary-500)] focus:border-[var(--primary-500)] sm:text-sm border p-2.5 w-1/3 text-center bg-[var(--background)] text-[var(--foreground)]"
                        />
                        <input
                          name="width"
                          type="number"
                          value={form.dimensions.width}
                          onChange={(e) => handleDimensionChange("width", e.target.value)}
                          placeholder="W"
                          className="border-[var(--input)] rounded-lg shadow-sm focus:ring-[var(--primary-500)] focus:border-[var(--primary-500)] sm:text-sm border p-2.5 w-1/3 text-center bg-[var(--background)] text-[var(--foreground)]"
                        />
                        <input
                          name="height"
                          type="number"
                          value={form.dimensions.height}
                          onChange={(e) => handleDimensionChange("height", e.target.value)}
                          placeholder="H"
                          className="border-[var(--input)] rounded-lg shadow-sm focus:ring-[var(--primary-500)] focus:border-[var(--primary-500)] sm:text-sm border p-2.5 w-1/3 text-center bg-[var(--background)] text-[var(--foreground)]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        }

        {/* Variants Section */}
        {
          !form.isOnlyProduct && (
            <div className="mt-6 border-t pt-4">
              <h4 className="font-semibold text-lg mb-4">Variants</h4>
              <VariantNode
                deleteNodeDeep={deleteNodeDeep}
                nodes={form.nestedVariants}
                addNode={addNode}
                updateNodeDeep={updateNodeDeep}
                levelLabels={form.levelLabels}
                setForm={setForm}
              />

              <button
                type="button"
                onClick={() => addNode([])}
                className="w-full py-4 border-2 border-dashed border-[var(--primary-200)] text-[var(--primary-500)] font-bold rounded-xl hover:bg-[var(--primary-50)] transition-all"
              >
                + Add New Root Variant (Color/Group)
              </button>

            </div>
          )
        }

        {/* Global Images */}
        <div className="mt-8 border-t border-[var(--neutral-200)] pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-bold text-[var(--neutral-700)] uppercase tracking-wider">Global Product Media</h4>
              <p className="text-[11px] text-[var(--neutral-400)]">Main images and videos for the product showcase</p>
            </div>
            <label className="cursor-pointer bg-[var(--primary-50)] hover:bg-[var(--primary-100)] text-[var(--primary-600)] px-4 py-2 rounded-lg text-xs font-bold transition-colors border border-[var(--primary-200)]">
              <span>+ Add Media</span>
              <input
                type="file"
                accept="image/*,video/*"
                multiple
                className="hidden"
                onChange={handleMediaChange}
              />
            </label>
          </div>

          <div className="flex flex-wrap gap-4">
            {/* --- 1. EXISTING SAVED MEDIA --- */}
            {form.media?.map((m: any, idx: any) => (
              <div key={`saved-${idx}`} className="relative w-24 h-24 group">
                {m.type === 'video' ? (
                  <div className="w-full h-full bg-black flex items-center justify-center rounded-xl overflow-hidden border border-[var(--neutral-200)] shadow-sm">
                    <div className="text-white flex flex-col items-center">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" /></svg>
                      <span className="text-[8px] font-bold uppercase mt-1">Video</span>
                    </div>
                  </div>
                ) : (
                  <img
                    src={m.url.startsWith('http') || m.url.startsWith('blob') ? m.url : `${m.url}`}
                    alt={m.alt || "Product"}
                    className="w-full h-full object-cover rounded-xl border border-[var(--neutral-200)] shadow-sm"
                  />
                )}

                {/* Delete Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                  <button
                    type="button"
                    onClick={() => handleRemoveMedia(m.url)}
                    className="bg-[var(--destructive-500)] text-white rounded-full w-7 h-7 flex items-center justify-center shadow-lg hover:bg-[var(--destructive-600)] transform hover:scale-110 transition-all"
                  >
                    <span className="text-lg leading-none">×</span>
                  </button>
                </div>

                <span className="absolute -top-2 -right-1 text-[8px] font-black bg-[var(--card)] text-[var(--neutral-400)] px-1.5 py-0.5 rounded-full border shadow-sm uppercase">Saved</span>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="mt-8 flex gap-4">
          <button
            type="submit"
            className="bg-[var(--primary-600)] px-8 py-3 rounded font-bold hover:bg-[var(--primary-700)] shadow-lg"
          >
            {editingId ? "Update Product" : "Create Product"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-[var(--neutral-500)] text-white px-8 py-3 rounded font-bold hover:bg-[var(--neutral-600)]"
            >
              Cancel
            </button>
          )}
        </div>
      </form >

      {/* Product List */}
      < div className="mt-12 bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-sm overflow-hidden" >
        {/* Table Header Section */}
        < div className="px-6 py-4 border-b border-[var(--border)] bg-[var(--neutral-50)] flex justify-between items-center" >
          <div>
            <h2 className="text-lg font-bold text-[var(--neutral-800)]">Product Inventory</h2>
            <p className="text-sm text-[var(--neutral-500)]">Manage your product catalog and stock levels</p>
          </div>
          <span className="px-3 py-1 bg-[var(--primary-100)] text-[var(--primary-700)] rounded-full text-xs font-bold uppercase tracking-wider">
            {products.length} Products Total
          </span>
        </div >

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--card)] border-b border-[var(--border)]">
                <th className="px-6 py-4 text-xs font-bold text-[var(--neutral-400)] uppercase tracking-wider">Product Detail</th>
                <th className="px-6 py-4 text-xs font-bold text-[var(--neutral-400)] uppercase tracking-wider">Brand</th>
                <th className="px-6 py-4 text-xs font-bold text-[var(--neutral-400)] uppercase tracking-wider">Categories</th>
                <th className="px-6 py-4 text-xs font-bold text-[var(--neutral-400)] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--neutral-100)]">
              {products.map((p: any) => (
                <tr key={p._id} className="hover:bg-[var(--neutral-50)] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {/* Product Thumbnail Placeholder */}
                      <div className="w-10 h-10 rounded bg-[var(--neutral-100)] flex-shrink-0 flex items-center justify-center border border-[var(--neutral-200)] overflow-hidden">
                        {p.images?.[0]?.url ? (
                          <img
                            src={`${apiUrl.replace('api', '')}${p.images[0].url}`}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--neutral-400)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[var(--neutral-900)]">{p.name}</div>
                        <div className="text-xs text-[var(--neutral-500)] font-mono uppercase tracking-tighter">{p.sku || "No SKU"}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--neutral-100)] text-[var(--neutral-800)] border border-[var(--neutral-200)]">
                      {p.brand?.title || "No Brand"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {p.categories?.length > 0 ? p.categories.map((c: any) => (
                        <span key={c._id} className="text-[11px] font-semibold text-[var(--primary-600)] bg-[var(--primary-50)] px-2 py-0.5 rounded border border-[var(--primary-100)]">
                          {c.title}
                        </span>
                      )) : (
                        <span className="text-xs text-[var(--neutral-400)] italic">Uncategorized</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleEdit(p)}
                        className="p-2 text-[var(--primary-600)] hover:bg-[var(--primary-50)] rounded-lg transition-colors group-hover:shadow-sm"
                        title="Edit Product"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(p._id)}
                        className="p-2 text-[var(--destructive-500)] hover:bg-[var(--destructive-50)] rounded-lg transition-colors group-hover:shadow-sm"
                        title="Delete Product"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td className="px-6 py-12 text-center">
                    <div className="text-[var(--neutral-400)] italic">No products found in your inventory.</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div >
    </div >
  );
}