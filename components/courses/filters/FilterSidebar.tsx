"use client";

import React, { useState } from 'react';
import { Filter, X, RotateCcw, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Define the allowed keys for the categories
type FilterCategory = 'age' | 'price' | 'type';

export default function FilterSidebar() {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<FilterCategory>('age');
    
    // We'll track selected options in a simple object state
    const [selectedValues, setSelectedValues] = useState<Record<string, string[]>>({
        age: [],
        price: [],
        type: []
    });

    const filterOptions: Record<FilterCategory, string[]> = {
        age: ['5-7 Years', '8-10 Years', '11-14 Years', '14+ Years'],
        price: ['Under ₹1000', '₹1000 - ₹5000', '₹5000 - ₹10000', 'Above ₹10000'],
        type: ['Beginner', 'Intermediate', 'Advanced']
    };

    const categories = Object.keys(filterOptions) as FilterCategory[];

    const handleToggleOption = (category: string, option: string) => {
        setSelectedValues(prev => {
            const current = prev[category] || [];
            return {
                ...prev,
                [category]: current.includes(option)
                    ? current.filter(item => item !== option)
                    : [...current, option]
            };
        });
    };

    const resetFilters = () => {
        setSelectedValues({ age: [], price: [], type: [] });
    };

    const totalSelected = Object.values(selectedValues).flat().length;

    return (
        <>
            {/* --- HEADER BAR --- */}
            <div className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 py-4 px-4 md:px-8">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                            <Filter className="w-4 h-4 text-white" />
                        </div>
                        <h1 className="text-xl font-black text-slate-900 tracking-tight">Marketplace</h1>
                    </div>
                    
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsFilterOpen(true)}
                        className="relative flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-full shadow-lg shadow-slate-200 transition-colors hover:bg-slate-800"
                    >
                        <Filter className="w-4 h-4" />
                        <span className="font-bold text-sm">Filter</span>
                        {totalSelected > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                                {totalSelected}
                            </span>
                        )}
                    </motion.button>
                </div>
            </div>

            {/* --- DRAWER SYSTEM --- */}
            <AnimatePresence>
                {isFilterOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsFilterOpen(false)}
                            className="fixed inset-0 z-[1000] bg-slate-900/40 backdrop-blur-sm"
                        />

                        {/* Drawer Content */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 right-0 z-[1001] w-full max-w-md bg-white shadow-2xl flex flex-col"
                        >
                            {/* Drawer Header */}
                            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-50">
                                <div>
                                    <h2 className="text-xl font-black text-slate-900">Filters</h2>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Refine your results</p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <button 
                                        onClick={resetFilters}
                                        className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-red-50"
                                    >
                                        <RotateCcw className="w-3 h-3" /> Reset
                                    </button>
                                    <button
                                        onClick={() => setIsFilterOpen(false)}
                                        className="p-2 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
                                    >
                                        <X className="w-5 h-5 text-slate-600" />
                                    </button>
                                </div>
                            </div>

                            {/* Body: Dual Pane Layout */}
                            <div className="flex flex-1 overflow-hidden">
                                {/* Left: Category Sidebar */}
                                <div className="w-1/3 bg-slate-50 border-r border-slate-100">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => setSelectedCategory(cat)}
                                            className={`
                                                w-full text-left px-6 py-5 text-xs font-black uppercase tracking-widest transition-all relative
                                                ${selectedCategory === cat
                                                    ? 'bg-white text-blue-600'
                                                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}
                                            `}
                                        >
                                            {selectedCategory === cat && (
                                                <motion.div layoutId="activeTab" className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600" />
                                            )}
                                            {cat}
                                            {selectedValues[cat].length > 0 && (
                                                <span className="ml-2 w-1.5 h-1.5 bg-blue-600 rounded-full inline-block" />
                                            )}
                                        </button>
                                    ))}
                                </div>

                                {/* Right: Options List */}
                                <div className="w-2/3 p-8 overflow-y-auto bg-white">
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">
                                        Select {selectedCategory}
                                    </h3>
                                    <div className="space-y-4">
                                        {filterOptions[selectedCategory].map((option) => {
                                            const isChecked = selectedValues[selectedCategory].includes(option);
                                            return (
                                                <label 
                                                    key={option} 
                                                    className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 cursor-pointer group hover:border-blue-100 hover:bg-blue-50/30 transition-all"
                                                >
                                                    <span className={`text-sm font-bold transition-colors ${isChecked ? 'text-blue-600' : 'text-slate-600'}`}>
                                                        {option}
                                                    </span>
                                                    <div className="relative flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={isChecked}
                                                            onChange={() => handleToggleOption(selectedCategory, option)}
                                                            className="peer appearance-none w-6 h-6 border-2 border-slate-200 rounded-lg checked:bg-blue-600 checked:border-blue-600 transition-all"
                                                        />
                                                        <Check className="absolute w-4 h-4 text-white opacity-0 peer-checked:opacity-100 left-1 top-1 transition-opacity pointer-events-none stroke-[3]" />
                                                    </div>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="p-6 bg-white border-t border-slate-50 grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setIsFilterOpen(false)}
                                    className="px-4 py-4 rounded-2xl border border-slate-200 text-slate-600 text-sm font-black uppercase tracking-widest hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => setIsFilterOpen(false)}
                                    className="px-4 py-4 rounded-2xl bg-orange-500 text-white text-sm font-black uppercase tracking-widest hover:bg-orange-600 shadow-xl shadow-orange-200 transition-all active:scale-95"
                                >
                                    Apply
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}