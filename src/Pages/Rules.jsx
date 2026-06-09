"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronRight, AlertCircle, ShieldAlert } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { API } from "../axios";
import AuthLoader from "../Components/Loaders/AuthLoader";

export default function RulesPage() {
  const {
    data: { data: { data } = {} } = {},
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["rules"],
    queryFn: () => {
      return API.get("/rules/get-all-rules", {
        headers: {
          Authorization: localStorage.getItem("authToken"),
        },
      });
    },
  });

  const [expandedCategories, setExpandedCategories] = useState(
    new Set(data?.map((_, index) => index)),
  );

  const [expandedSubCategories, setExpandedSubCategories] = useState(
    new Set(
      data?.flatMap((category, catIndex) =>
        category.subCategories.map((_, subIndex) => `${catIndex}-${subIndex}`),
      ),
    ),
  );

  const toggleCategory = (index) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedCategories(newExpanded);
  };

  const toggleSubCategory = (key) => {
    const newExpanded = new Set(expandedSubCategories);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedSubCategories(newExpanded);
  };

  useEffect(() => {
    setExpandedCategories(new Set(data?.map((_, index) => index)));
    setExpandedSubCategories(
      new Set(
        data?.flatMap((category, catIndex) =>
          category.subCategories.map(
            (_, subIndex) => `${catIndex}-${subIndex}`,
          ),
        ),
      ),
    );
  }, [isLoading, data]);

  if (isLoading) {
    return <AuthLoader />;
  }

  return (
    <div className="min-h-screen bg-[#030305] text-white font-sans relative overflow-hidden pb-20">
      
      {/* =========================================
          BACKGROUND ENGINE
      ========================================= */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.15)_0%,transparent_70%)] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none z-0 opacity-30" />

      <div className="relative z-10 pt-[100px]">
        
        {/* =========================================
            HERO SECTION
        ========================================= */}
        <div className="relative px-4 sm:px-6 md:px-12 lg:px-24 xl:px-[200px] pb-8 sm:pb-16 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 backdrop-blur-md shadow-[0_0_15px_rgba(168,85,247,0.15)] mb-6">
            <ShieldAlert className="w-4 h-4 text-purple-400" />
            <span className="text-[10px] font-black text-purple-300 uppercase tracking-[0.3em]">
              Official Protocol
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-[5rem] font-black text-white uppercase tracking-tighter italic leading-none drop-shadow-2xl mb-4 text-balance">
            Tournament{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3b82f6] via-[#a855f7] to-[#ec4899]">
              Rules
            </span>
          </h1>
          <p className="text-base md:text-lg text-gray-400 font-bold tracking-[0.1em] uppercase max-w-2xl mx-auto leading-relaxed text-balance">
            {"সকল প্রতিযোগীদের জন্য টুর্নামেন্টের নিয়মাবলী। প্রতিটি নিয়ম মনোযোগ সহকারে পড়ুন এবং অনুসরণ করুন।"}
          </p>
        </div>

        {/* =========================================
            RULES ACCORDION CONTENT
        ========================================= */}
        {/* DRASCTICALLY REDUCED OUTER PADDING ON MOBILE (px-1.5) */}
        <div className=" sm:px-6 md:px-12 lg:px-24 xl:px-[200px]">
          <div className="max-w-4xl mx-auto space-y-3 sm:space-y-6">
            {data?.map((category, categoryIndex) => {
              const isExpanded = expandedCategories.has(categoryIndex);
              
              return (
                <div
                  key={categoryIndex}
                  className={`bg-[#0a0b10]/60 backdrop-blur-xl border transition-all duration-500 rounded-xl sm:rounded-2xl overflow-hidden ${
                    isExpanded 
                      ? "border-purple-500/30 shadow-[0_10px_40px_rgba(168,85,247,0.1)]" 
                      : "border-white/10 hover:border-white/20 hover:bg-[#111218]"
                  }`}
                >
                  {/* --- CATEGORY HEADER --- */}
                  <button
                    onClick={() => toggleCategory(categoryIndex)}
                    className="w-full px-2 sm:px-8 py-3 sm:py-6 flex items-center justify-between group outline-none"
                  >
                    <div className="flex items-center gap-3 sm:gap-6 flex-1 min-w-0">
                      <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-[10px] sm:rounded-xl bg-gradient-to-br from-[#3b82f6] via-[#a855f7] to-[#ec4899] p-[1.5px] flex-shrink-0 shadow-[0_0_15px_rgba(168,85,247,0.4)] group-hover:scale-105 transition-transform duration-300">
                        <div className="w-full h-full bg-[#030305] rounded-[8.5px] sm:rounded-[10.5px] flex items-center justify-center">
                          <span className="font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400 text-base sm:text-xl">
                            {categoryIndex + 1}
                          </span>
                        </div>
                      </div>
                      
                      <h2 className="text-lg sm:text-2xl font-black text-white uppercase tracking-wide text-left text-balance group-hover:text-purple-300 transition-colors">
                        {category.name}
                      </h2>
                    </div>
                    
                    <div className={`flex-shrink-0 ml-1.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full border flex items-center justify-center transition-all duration-300 ${isExpanded ? "bg-purple-500/20 border-purple-500/50 text-purple-400 rotate-180" : "bg-white/5 border-white/10 text-gray-400 group-hover:bg-white/10 group-hover:text-white"}`}>
                      <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                  </button>

                  {/* --- SUBCATEGORY CONTENT --- */}
                  <div
                    className={`grid transition-all duration-500 ease-in-out ${
                      isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      {/* DRASCTICALLY REDUCED INNER PADDING ON MOBILE (px-1.5) */}
                      <div className=" sm:px-8 pb-3 sm:pb-8 space-y-2.5 sm:space-y-4">
                        {category.subCategories.map((subCategory, subIndex) => {
                          const subKey = `${categoryIndex}-${subIndex}`;
                          const isSubExpanded = expandedSubCategories.has(subKey);

                          return (
                            <div
                              key={subIndex}
                              className="bg-black/40 border border-white/5 rounded-lg sm:rounded-xl overflow-hidden"
                            >
                              {/* SubCategory Header */}
                              <button
                                onClick={() => toggleSubCategory(subKey)}
                                className="w-full px-3 sm:px-6 py-3.5 sm:py-4 flex justify-between items-center hover:bg-white/5 transition-colors group outline-none"
                              >
                                <h3 className="text-base sm:text-lg font-bold text-gray-200 tracking-wide text-left text-balance group-hover:text-white transition-colors">
                                  {subCategory.name}
                                </h3>
                                <div className={`transition-transform duration-300 text-gray-500 group-hover:text-gray-300 ${isSubExpanded ? "rotate-90" : ""}`}>
                                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                                </div>
                              </button>

                              {/* Rules & Notes */}
                              <div
                                className={`grid transition-all duration-300 ease-in-out ${
                                  isSubExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                                }`}
                              >
                                <div className="overflow-hidden">
                                  {/* TIGHTENED RULES CONTAINER PADDING */}
                                  <div className="px-2.5 sm:px-6 pb-4 sm:pb-5 space-y-4">
                                    
                                    {/* Normal Rules - Restored Bullets & Large Text */}
                                    {subCategory.rules.length > 0 && (
                                      <ul className="space-y-4">
                                        {subCategory.rules.map((rule, ruleIndex) => (
                                          <li
                                            key={ruleIndex}
                                            className="flex items-start gap-2 sm:gap-3"
                                          >
                                            <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#3b82f6] to-[#a855f7] mt-2.5 flex-shrink-0 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                                            <span className="text-gray-300 text-base sm:text-lg leading-relaxed text-pretty">
                                              {rule.content}
                                            </span>
                                          </li>
                                        ))}
                                      </ul>
                                    )}

                                    {/* Alert / Points to Note */}
                                    {subCategory.pointsToNote.length > 0 && (
                                      <div className="mt-4 p-3.5 sm:p-6 bg-rose-500/10 border border-rose-500/20 rounded-lg sm:rounded-xl relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-rose-400 to-pink-600" />
                                        
                                        <div className="flex items-center gap-2.5 sm:gap-3 mb-3 sm:mb-4">
                                          <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-rose-400 flex-shrink-0" />
                                          <h4 className="font-bold text-rose-400 text-base sm:text-lg tracking-wide uppercase">
                                            {"বিশেষ দ্রষ্টব্য"}
                                          </h4>
                                        </div>
                                        
                                        <ul className="space-y-3">
                                          {subCategory.pointsToNote.map((note, noteIndex) => (
                                            <li
                                              key={noteIndex}
                                              className="flex items-start gap-2.5 text-rose-200/90 text-base sm:text-lg leading-relaxed text-pretty"
                                            >
                                              <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2.5 flex-shrink-0" />
                                              <span>{note.content}</span>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}

                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* =========================================
              FOOTER NOTE
          ========================================= */}
          <div className="max-w-4xl mx-auto mt-8 sm:mt-10 p-[1.5px] rounded-xl sm:rounded-2xl bg-gradient-to-r from-transparent via-purple-500/30 to-transparent">
            <div className="bg-[#0a0a14] rounded-[11px] sm:rounded-[15px] p-5 sm:p-8 text-center backdrop-blur-xl">
              <p className="text-gray-400 font-medium leading-relaxed text-pretty text-sm sm:text-base tracking-wide">
                {"পরিস্থিতি অনুযায়ী যেকোনো সময় কমিটি থেকে যেকোনো নিয়মাবলি সংশোধন, বিয়োজন অথবা নতুন নিয়মাবলি সংযোজন করা হতে পারে। সেক্ষেত্রে কমিটির সকল সিদ্ধান্ত মেনে নিতে সকল অংশগ্রহণকারী বাধ্য থাকিবে।"}
              </p>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}