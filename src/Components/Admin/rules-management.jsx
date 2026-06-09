
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FaPlus, FaTrash, FaChevronDown, FaChevronRight } from "react-icons/fa";
import { API } from "../../axios";

// Helper function to transform MongoDB _id to id for frontend consistency
const transformIds = (data) => {
  if (!Array.isArray(data)) return [];
  return data.map((cat) => ({
    ...cat,
    id: cat._id,
    subCategories: cat.subCategories.map((sub) => ({
      ...sub,
      id: sub._id,
      rules: sub.rules.map((rule) => ({ ...rule, id: rule._id })),
      pointsToNote: sub.pointsToNote.map((point) => ({
        ...point,
        id: point._id,
      })),
    })),
  }));
};

// --- API Functions ---
const fetchRules = async () => {
  const { data } = await API.get("/rules/get-all-rules", {
    headers: {
      Authorization: localStorage.getItem("authToken"),
    },
  });
  // Assuming the backend returns { success: true, data: [...] }
  return transformIds(data.data);
};

const saveRules = async (categories) => {
  // Optional: Clean frontend-only 'id's before sending if they are timestamps
  const cleanedCategories = categories.map(cat => {
    const { ...restCat } = cat;
    return {
      ...restCat,
      subCategories: cat.subCategories.map(sub => {
        const {...restSub } = sub;
        return {
          ...restSub,
          rules: sub.rules.map(rule => ({ content: rule.content })),
          pointsToNote: sub.pointsToNote.map(point => ({ content: point.content }))
        }
      })
    }
  });

  const { data } = await API.post("/rules/create", cleanedCategories, {
    headers: {
      Authorization: localStorage.getItem("authToken"),
    },
  });
  return data;
};


export default function RulesManagement() {
  const queryClient = useQueryClient();
  const [categories, setCategories] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [expandedSubCategories, setExpandedSubCategories] = useState(new Set());

  // Form states
  const [newCategoryName, setNewCategoryName] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [newSubCategoryName, setNewSubCategoryName] = useState("");
  
  // *** FIX 2: SEPARATE STATE FOR EACH FORM ***
  const [subCategoryForRule, setSubCategoryForRule] = useState(null);
  const [subCategoryForPoint, setSubCategoryForPoint] = useState(null);

  const [newRule, setNewRule] = useState("");
  const [newPoint, setNewPoint] = useState("");

  // --- React Query for Data Fetching ---
  const { data: fetchedCategories, isLoading, isError } = useQuery({
    queryKey: ['rules'],
    queryFn: fetchRules,
  });

  // --- React Query for Saving Data ---
  const mutation = useMutation({
    mutationFn: saveRules,
    onSuccess: () => {
      alert("Rules saved successfully!");
      // This automatically refetches the rules after a successful save
      queryClient.invalidateQueries({ queryKey: ['rules'] });
    },
    onError: (error) => {
      console.error("Failed to save rules:", error);
      alert("Error saving rules. See console for details.");
    }
  });


  // *** FIX 1: Correctly update state from fetched data ***
  useEffect(() => {
    if (fetchedCategories) {
      setCategories(fetchedCategories);
    }
  }, [fetchedCategories]);

  // --- Handler Functions (Updated for new state) ---

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    const newCategory = {
      id: `local_${Date.now()}`, // Prefix local IDs to distinguish them
      name: newCategoryName,
      subCategories: [],
    };
    setCategories([...categories, newCategory]);
    setNewCategoryName("");
  };

  const handleDeleteCategory = (categoryId) => {
    setCategories(categories.filter((cat) => cat.id !== categoryId && cat._id !== categoryId));
  };

  const handleAddSubCategory = () => {
    if (!newSubCategoryName.trim() || !selectedCategoryId) return;
    const newSubCategory = {
      id: `local_${Date.now()}`,
      name: newSubCategoryName,
      rules: [],
      pointsToNote: [],
    };
    setCategories(
      categories.map((cat) =>
        (cat.id === selectedCategoryId || cat._id === selectedCategoryId)
          ? { ...cat, subCategories: [...cat.subCategories, newSubCategory] }
          : cat
      )
    );
    setNewSubCategoryName("");
  };

  const handleDeleteSubCategory = (categoryId, subCategoryId) => {
    setCategories(
      categories.map((cat) =>
        (cat.id === categoryId || cat._id === categoryId)
          ? {
              ...cat,
              subCategories: cat.subCategories.filter(
                (sub) => (sub.id !== subCategoryId && sub._id !== subCategoryId)
              ),
            }
          : cat
      )
    );
  };
  
  // *** FIX 2: Update handler to use `subCategoryForRule` ***
  const handleAddRule = () => {
    if (!newRule.trim() || !subCategoryForRule) return;
    const newRuleObj = {
      id: `local_${Date.now()}`,
      content: newRule,
    };
    setCategories(
      categories.map((cat) => ({
        ...cat,
        subCategories: cat.subCategories.map((sub) =>
          (sub.id === subCategoryForRule || sub._id === subCategoryForRule)
            ? { ...sub, rules: [...sub.rules, newRuleObj] }
            : sub
        ),
      }))
    );
    setNewRule("");
  };

  const handleDeleteRule = (subCategoryId, ruleId) => {
    setCategories(
      categories.map((cat) => ({
        ...cat,
        subCategories: cat.subCategories.map((sub) =>
          (sub.id === subCategoryId || sub._id === subCategoryId)
            ? { ...sub, rules: sub.rules.filter((rule) => (rule.id !== ruleId && rule._id !== ruleId)) }
            : sub
        ),
      }))
    );
  };

  // *** FIX 2: Update handler to use `subCategoryForPoint` ***
  const handleAddPoint = () => {
    if (!newPoint.trim() || !subCategoryForPoint) return;
    const newPointObj = {
      id: `local_${Date.now()}`,
      content: newPoint,
    };
    setCategories(
      categories.map((cat) => ({
        ...cat,
        subCategories: cat.subCategories.map((sub) =>
          (sub.id === subCategoryForPoint || sub._id === subCategoryForPoint)
            ? { ...sub, pointsToNote: [...sub.pointsToNote, newPointObj] }
            : sub
        ),
      }))
    );
    setNewPoint("");
  };

  const handleDeletePoint = (subCategoryId, pointId) => {
     setCategories(
      categories.map((cat) => ({
        ...cat,
        subCategories: cat.subCategories.map((sub) =>
          (sub.id === subCategoryId || sub._id === subCategoryId)
            ? {
                ...sub,
                pointsToNote: sub.pointsToNote.filter(
                  (point) => (point.id !== pointId && point._id !== pointId)
                ),
              }
            : sub
        ),
      }))
    );
  };

  const toggleCategory = (categoryId) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const toggleSubCategory = (subCategoryId) => {
    const newExpanded = new Set(expandedSubCategories);
    if (newExpanded.has(subCategoryId)) {
      newExpanded.delete(subCategoryId);
    } else {
      newExpanded.add(subCategoryId);
    }
    setExpandedSubCategories(newExpanded);
  };

  const handleSaveToBackend = () => {
    mutation.mutate(categories);
  };

  if (isLoading) {
    return <div className="min-h-screen bg-gradient-to-br from-[#1a1f3a] to-black p-8 text-white text-center">Loading rules...</div>
  }

  if (isError) {
    return <div className="min-h-screen bg-gradient-to-br from-[#1a1f3a] to-black p-8 text-red-500 text-center">Error fetching rules.</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1f3a] to-black p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Rules Management</h1>
          <button
            onClick={handleSaveToBackend}
            disabled={mutation.isPending}
            className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg font-medium transition-all disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed"
          >
            {mutation.isPending ? 'Saving...' : 'Save to Backend'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Add Category & Sub-Category */}
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Add Category</h2>
              <div className="space-y-3">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Category name"
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={handleAddCategory}
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <FaPlus /> Add Category
                </button>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Add Sub-Category</h2>
              <div className="space-y-3">
                <select
                  value={selectedCategoryId || ""}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id || cat._id} value={cat.id || cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={newSubCategoryName}
                  onChange={(e) => setNewSubCategoryName(e.target.value)}
                  placeholder="Sub-category name"
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={handleAddSubCategory}
                  disabled={!selectedCategoryId}
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <FaPlus /> Add Sub-Category
                </button>
              </div>
            </div>
          </div>

          {/* Middle Panel - Add Rules & Points */}
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Add Rule</h2>
              <div className="space-y-3">
                 {/* *** FIX 2: Use `subCategoryForRule` state *** */}
                <select
                  value={subCategoryForRule || ""}
                  onChange={(e) => setSubCategoryForRule(e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                >
                  <option value="">Select Sub-Category</option>
                  {categories.flatMap((cat) =>
                    cat.subCategories.map((sub) => (
                      <option key={sub.id || sub._id} value={sub.id || sub._id}>
                        {cat.name} → {sub.name}
                      </option>
                    ))
                  )}
                </select>
                <textarea
                  value={newRule}
                  onChange={(e) => setNewRule(e.target.value)}
                  placeholder="Enter rule description"
                  rows={4}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-500 resize-none"
                />
                <button
                  onClick={handleAddRule}
                  disabled={!subCategoryForRule}
                  className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <FaPlus /> Add Rule
                </button>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Add Point to Note</h2>
              <div className="space-y-3">
                 {/* *** FIX 2: Use `subCategoryForPoint` state *** */}
                <select
                  value={subCategoryForPoint || ""}
                  onChange={(e) => setSubCategoryForPoint(e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                >
                  <option value="">Select Sub-Category</option>
                  {categories.flatMap((cat) =>
                    cat.subCategories.map((sub) => (
                      <option key={sub.id || sub._id} value={sub.id || sub._id}>
                        {cat.name} → {sub.name}
                      </option>
                    ))
                  )}
                </select>
                <textarea
                  value={newPoint}
                  onChange={(e) => setNewPoint(e.target.value)}
                  placeholder="Enter point to note"
                  rows={4}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-500 resize-none"
                />
                <button
                  onClick={handleAddPoint}
                  disabled={!subCategoryForPoint}
                  className="w-full px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <FaPlus /> Add Point to Note
                </button>
              </div>
            </div>
          </div>
          
          {/* Right Panel - Preview */}
          {/* Note: Updated all "key" and "onClick" props to check for "item.id || item._id" */}
          {/* This makes the component work with both new local data and saved DB data */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 lg:col-span-1">
             <h2 className="text-xl font-semibold text-white mb-4">Rules Preview</h2>
             <div className="space-y-4 max-h-[800px] overflow-y-auto">
               {categories.length === 0 ? (
                 <p className="text-white/50 text-center py-8">No categories yet. Start by adding a category.</p>
               ) : (
                 categories.map((category) => (
                   <div key={category.id || category._id} className="border border-white/20 rounded-lg overflow-hidden">
                     <div className="bg-blue-600/20 border-b border-white/20 p-3 flex items-center justify-between">
                       <button
                         onClick={() => toggleCategory(category.id || category._id)}
                         className="flex items-center gap-2 text-white font-semibold flex-1 text-left"
                       >
                         {expandedCategories.has(category.id || category._id) ? <FaChevronDown /> : <FaChevronRight />}
                         {category.name}
                       </button>
                       <button
                         onClick={() => handleDeleteCategory(category.id || category._id)}
                         className="text-red-400 hover:text-red-300 p-2"
                       >
                         <FaTrash />
                       </button>
                     </div>
                     {expandedCategories.has(category.id || category._id) && (
                       <div className="p-2 space-y-2">
                         {category.subCategories.length === 0 ? (
                           <p className="text-white/50 text-sm p-2">No sub-categories</p>
                         ) : (
                           category.subCategories.map((subCategory) => (
                             <div key={subCategory.id || subCategory._id} className="border border-white/10 rounded-lg overflow-hidden">
                               <div className="bg-white/5 p-2 flex items-center justify-between">
                                 <button
                                   onClick={() => toggleSubCategory(subCategory.id || subCategory._id)}
                                   className="flex items-center gap-2 text-white/90 text-sm flex-1 text-left"
                                 >
                                   {expandedSubCategories.has(subCategory.id || subCategory._id) ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />}
                                   {subCategory.name}
                                 </button>
                                 <button
                                   onClick={() => handleDeleteSubCategory(category.id || category._id, subCategory.id || subCategory._id)}
                                   className="text-red-400 hover:text-red-300 p-1"
                                 >
                                   <FaTrash size={12} />
                                 </button>
                               </div>
                               {expandedSubCategories.has(subCategory.id || subCategory._id) && (
                                 <div className="p-3 space-y-3">
                                   <div>
                                     <h4 className="text-purple-400 text-xs font-semibold mb-2">Rules:</h4>
                                     {subCategory.rules.length === 0 ? (
                                       <p className="text-white/40 text-xs">No rules</p>
                                     ) : (
                                       <ul className="space-y-2">
                                         {subCategory.rules.map((rule, idx) => (
                                           <li key={rule.id || rule._id} className="flex items-start gap-2 text-white/80 text-xs">
                                             <span className="text-purple-400 font-semibold">{idx + 1}.</span>
                                             <span className="flex-1">{rule.content}</span>
                                             <button
                                               onClick={() => handleDeleteRule(subCategory.id || subCategory._id, rule.id || rule._id)}
                                               className="text-red-400 hover:text-red-300"
                                             >
                                               <FaTrash size={10} />
                                             </button>
                                           </li>
                                         ))}
                                       </ul>
                                     )}
                                   </div>
                                   <div>
                                     <h4 className="text-amber-400 text-xs font-semibold mb-2">Points to Note:</h4>
                                     {subCategory.pointsToNote.length === 0 ? (
                                       <p className="text-white/40 text-xs">No points</p>
                                     ) : (
                                       <ul className="space-y-2">
                                         {subCategory.pointsToNote.map((point) => (
                                           <li key={point.id || point._id} className="flex items-start gap-2 text-white/80 text-xs">
                                             <span className="text-amber-400 font-semibold">•</span>
                                             <span className="flex-1">{point.content}</span>
                                             <button
                                               onClick={() => handleDeletePoint(subCategory.id || subCategory._id, point.id || point._id)}
                                               className="text-red-400 hover:text-red-300"
                                             >
                                               <FaTrash size={10} />
                                             </button>
                                           </li>
                                         ))}
                                       </ul>
                                     )}
                                   </div>
                                 </div>
                               )}
                             </div>
                           ))
                         )}
                       </div>
                     )}
                   </div>
                 ))
               )}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}