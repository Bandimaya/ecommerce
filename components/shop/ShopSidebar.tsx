import { cn } from "@/lib/utils";
import { Package2 } from "lucide-react";

interface ShopSidebarProps {
    categories: any[];
    selectedCategory: string;
    onSelectCategory: (id: string) => void;
    totalProducts?: number;
    getProductCount: (catId: string) => number;
    className?: string;
}

export const ShopSidebar = ({
    categories,
    selectedCategory,
    onSelectCategory,
    totalProducts = 0,
    getProductCount,
    className
}: ShopSidebarProps) => {
    return (
        <div className={cn("flex flex-col gap-2", className)}>
            <div className="pb-4 mb-2 border-b border-dashed border-slate-200">
                <h3 className="font-black text-lg text-slate-900 flex items-center gap-2">
                    <Package2 className="w-5 h-5" />
                    Categories
                </h3>
            </div>

            <div className="space-y-2">
                <SidebarItem
                    active={selectedCategory === "all"}
                    onClick={() => onSelectCategory("all")}
                    label="All Products"
                    count={totalProducts}
                />

                {categories.map((category) => (
                    <SidebarItem
                        key={category._id}
                        active={selectedCategory === category._id}
                        onClick={() => onSelectCategory(category._id)}
                        label={category.title}
                        count={getProductCount(category._id)}
                    />
                ))}
            </div>
        </div>
    );
};

const SidebarItem = ({ active, onClick, label, count }: { active: boolean, onClick: () => void, label: string, count: number }) => (
    <button
        onClick={onClick}
        className={cn(
            "w-full flex items-center justify-between px-4 py-3 rounded-[10px] text-sm font-bold transition-all border group text-left",
            active
                ? "bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/20"
                : "bg-white text-slate-600 border-transparent hover:bg-slate-50 hover:border-slate-200 hover:shadow-sm"
        )}
    >
        <span>{label}</span>
        <span className={cn(
            "text-[10px] px-2 py-0.5 rounded-[6px] transition-colors font-extrabold",
            active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-400 group-hover:text-slate-600"
        )}>
            {count}
        </span>
    </button>
);
