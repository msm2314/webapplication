import { useState, useEffect } from 'react';
import { supabase, MenuCategory, MenuItem } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Plus, Edit2, Trash2, Package, ClipboardList } from 'lucide-react';

export default function OwnerDashboard({ onViewOrders }: { onViewOrders?: () => void }) {
  const { signOut, profile } = useAuth();
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showItemForm, setShowItemForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const [categoryName, setCategoryName] = useState('');
  const [categoryDesc, setCategoryDesc] = useState('');

  const [itemName, setItemName] = useState('');
  const [itemDesc, setItemDesc] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemCategory, setItemCategory] = useState('');
  const [itemAvailable, setItemAvailable] = useState(true);

  useEffect(() => {
    fetchCategories();
    fetchItems();
  }, []);

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('menu_categories')
      .select('*')
      .order('display_order');
    if (data) setCategories(data);
  };

  const fetchItems = async () => {
    const { data } = await supabase
      .from('menu_items')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setItems(data);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      await supabase
        .from('menu_categories')
        .update({ name: categoryName, description: categoryDesc })
        .eq('id', editingCategory.id);
    } else {
      await supabase
        .from('menu_categories')
        .insert({ name: categoryName, description: categoryDesc, display_order: categories.length });
    }
    setCategoryName('');
    setCategoryDesc('');
    setEditingCategory(null);
    setShowCategoryForm(false);
    fetchCategories();
  };

  const handleDeleteCategory = async (id: string) => {
    if (confirm('Delete this category? All items in it will also be deleted.')) {
      await supabase.from('menu_categories').delete().eq('id', id);
      fetchCategories();
      fetchItems();
    }
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    const itemData = {
      name: itemName,
      description: itemDesc,
      price: parseFloat(itemPrice),
      category_id: itemCategory,
      available: itemAvailable,
    };

    if (editingItem) {
      await supabase.from('menu_items').update(itemData).eq('id', editingItem.id);
    } else {
      await supabase.from('menu_items').insert(itemData);
    }

    resetItemForm();
    fetchItems();
  };

  const handleDeleteItem = async (id: string) => {
    if (confirm('Delete this item?')) {
      await supabase.from('menu_items').delete().eq('id', id);
      fetchItems();
    }
  };

  const resetItemForm = () => {
    setItemName('');
    setItemDesc('');
    setItemPrice('');
    setItemCategory('');
    setItemAvailable(true);
    setEditingItem(null);
    setShowItemForm(false);
  };

  const openEditCategory = (category: MenuCategory) => {
    setEditingCategory(category);
    setCategoryName(category.name);
    setCategoryDesc(category.description);
    setShowCategoryForm(true);
  };

  const openEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setItemName(item.name);
    setItemDesc(item.description);
    setItemPrice(item.price.toString());
    setItemCategory(item.category_id);
    setItemAvailable(item.available);
    setShowItemForm(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Owner Dashboard</h1>
            <p className="text-sm text-gray-600">Welcome, {profile?.full_name}</p>
          </div>
          <div className="flex gap-3">
            {onViewOrders && (
              <button
                onClick={onViewOrders}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <ClipboardList className="w-5 h-5" />
                View Orders
              </button>
            )}
            <button
              onClick={signOut}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Menu Categories</h2>
            <button
              onClick={() => setShowCategoryForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Category
            </button>
          </div>

          {showCategoryForm && (
            <form onSubmit={handleSaveCategory} className="bg-white p-6 rounded-lg shadow mb-4">
              <h3 className="font-bold mb-4">{editingCategory ? 'Edit' : 'New'} Category</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Category name"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={categoryDesc}
                  onChange={(e) => setCategoryDesc(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                />
                <div className="flex gap-2">
                  <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCategoryForm(false);
                      setEditingCategory(null);
                      setCategoryName('');
                      setCategoryDesc('');
                    }}
                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <div key={category.id} className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-bold text-lg">{category.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditCategory(category)}
                    className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="flex items-center gap-1 px-3 py-1 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Menu Items</h2>
            <button
              onClick={() => setShowItemForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Item
            </button>
          </div>

          {showItemForm && (
            <form onSubmit={handleSaveItem} className="bg-white p-6 rounded-lg shadow mb-4">
              <h3 className="font-bold mb-4">{editingItem ? 'Edit' : 'New'} Menu Item</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Item name"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={itemDesc}
                  onChange={(e) => setItemDesc(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Price"
                  value={itemPrice}
                  onChange={(e) => setItemPrice(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
                <select
                  value={itemCategory}
                  onChange={(e) => setItemCategory(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={itemAvailable}
                    onChange={(e) => setItemAvailable(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span>Available</span>
                </label>
                <div className="flex gap-2">
                  <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={resetItemForm}
                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => {
              const category = categories.find((c) => c.id === item.category_id);
              return (
                <div key={item.id} className="bg-white p-4 rounded-lg shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg">{item.name}</h3>
                    <span className="text-emerald-600 font-bold">${item.price.toFixed(2)}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                  <div className="flex items-center gap-2 mb-3">
                    <Package className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-500">{category?.name}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-xs px-2 py-1 rounded ${item.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {item.available ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditItem(item)}
                      className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="flex items-center gap-1 px-3 py-1 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
