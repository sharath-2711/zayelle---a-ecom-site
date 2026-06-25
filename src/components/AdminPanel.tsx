import React, { useState, useEffect, useRef } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  User 
} from 'firebase/auth';
import { 
  Lock, 
  Unlock, 
  Plus, 
  Edit, 
  Trash, 
  Check, 
  X, 
  Sparkles, 
  Upload, 
  Eye, 
  MessageCircle, 
  Camera, 
  RotateCcw,
  BookOpen,
  Image as ImageIcon
} from 'lucide-react';
import { motion } from 'motion/react';
import { auth } from '../firebase';
import { 
  getProducts, 
  saveProduct, 
  deleteProduct, 
  getAllReviews, 
  setReviewApproval, 
  deleteReview, 
  getGalleryItems, 
  saveGalleryItem, 
  deleteGalleryItem, 
  seedAllDefaults 
} from '../firebaseService';
import { Product, Review, GalleryItem } from '../types';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onRefreshData: () => void;
}

type TabType = 'products' | 'reviews' | 'gallery';

export default function AdminPanel({ isOpen, onClose, onRefreshData }: AdminPanelProps) {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState('admin@zayelle.gifts');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);

  // Active state
  const [activeTab, setActiveTab] = useState<TabType>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [systemMessage, setSystemMessage] = useState('');
  const [systemError, setSystemError] = useState('');

  // Editing states
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [editingGallery, setEditingGallery] = useState<Partial<GalleryItem> | null>(null);

  // File upload reference
  const prodFileRef = useRef<HTMLInputElement>(null);
  const galFileRef = useRef<HTMLInputElement>(null);

  // Listen to Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser && currentUser.email === 'admin@zayelle.gifts') {
        loadAdminData();
      }
    });
    return () => unsubscribe();
  }, []);

  const loadAdminData = async () => {
    setIsLoadingData(true);
    try {
      const prodList = await getProducts();
      const revList = await getAllReviews();
      const galList = await getGalleryItems();
      setProducts(prodList);
      setReviews(revList);
      setGallery(galList);
    } catch (err) {
      console.error(err);
      setSystemError('Failed to fetch collections.');
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsLoadingAuth(true);

    try {
      if (isRegistering) {
        if (email !== 'admin@zayelle.gifts') {
          setAuthError('Only the admin address admin@zayelle.gifts can be registered.');
          setIsLoadingAuth(false);
          return;
        }
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      setAuthError('');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/user-not-found') {
        setAuthError('This email is not registered. Toggle the "Register Admin" checkbox below to create it with this password.');
      } else if (err.code === 'auth/wrong-password') {
        setAuthError('Invalid Curator password.');
      } else {
        setAuthError(err.message || 'Login failed.');
      }
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  // Base64 image uploader with strict size constraints and compression
  const compressAndConvert = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (file.size > 5 * 1024 * 1024) {
        reject(new Error('File size exceeds 5MB.'));
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.src = reader.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 450;
          const MAX_HEIGHT = 450;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', 0.75));
          } else {
            reject(new Error('Canvas compilation failed'));
          }
        };
      };
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  };

  // Product Operations
  const handleProductImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await compressAndConvert(file);
      setEditingProduct(prev => prev ? { ...prev, imageUrl: base64 } : { imageUrl: base64 });
    } catch (err: any) {
      setSystemError(err.message || 'Image compression failed');
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.name || !editingProduct?.description || !editingProduct?.startingPrice || !editingProduct?.imageUrl) {
      setSystemError('Please fill in Name, Description, Starting Price, and provide an image.');
      return;
    }

    try {
      await saveProduct(editingProduct as Product);
      setEditingProduct(null);
      setSystemMessage('Product saved beautifully!');
      loadAdminData();
      onRefreshData();
      setTimeout(() => setSystemMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setSystemError('Could not save product.');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you absolutely sure you want to remove this product from the luxury catalog?')) return;
    try {
      await deleteProduct(id);
      setSystemMessage('Product removed.');
      loadAdminData();
      onRefreshData();
      setTimeout(() => setSystemMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setSystemError('Failed to delete product.');
    }
  };

  // Gallery Operations
  const handleGalleryImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await compressAndConvert(file);
      setEditingGallery(prev => prev ? { ...prev, imageUrl: base64 } : { imageUrl: base64 });
    } catch (err: any) {
      setSystemError(err.message || 'Image compression failed');
    }
  };

  const handleSaveGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGallery?.imageUrl) {
      setSystemError('Please provide a photograph.');
      return;
    }

    try {
      await saveGalleryItem({
        title: editingGallery.title || '',
        imageUrl: editingGallery.imageUrl,
        likes: editingGallery.likes || Math.floor(Math.random() * 200) + 50
      });
      setEditingGallery(null);
      setSystemMessage('Gallery updated beautifully!');
      loadAdminData();
      onRefreshData();
      setTimeout(() => setSystemMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setSystemError('Failed to save gallery item.');
    }
  };

  const handleDeleteGallery = async (id: string) => {
    if (!confirm('Are you sure you want to delete this Instagram post from your layout?')) return;
    try {
      await deleteGalleryItem(id);
      setSystemMessage('Gallery post deleted.');
      loadAdminData();
      onRefreshData();
      setTimeout(() => setSystemMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setSystemError('Failed to delete gallery post.');
    }
  };

  // Review Operations
  const handleReviewToggle = async (id: string, currentApproved: boolean) => {
    try {
      await setReviewApproval(id, !currentApproved);
      setSystemMessage(currentApproved ? 'Review hidden.' : 'Review approved and published!');
      loadAdminData();
      onRefreshData();
      setTimeout(() => setSystemMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setSystemError('Failed to modify review state.');
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!confirm('Delete this testimonial forever?')) return;
    try {
      await deleteReview(id);
      setSystemMessage('Review deleted.');
      loadAdminData();
      onRefreshData();
      setTimeout(() => setSystemMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setSystemError('Failed to delete review.');
    }
  };

  // Seed default data
  const handleRestoreDefaults = async () => {
    if (!confirm('This will write all 10 default products, reviews, and gallery posts to your live Firebase database. Continue?')) return;
    setIsLoadingData(true);
    setSystemError('');
    try {
      await seedAllDefaults();
      setSystemMessage('Showcase default template restored perfectly!');
      loadAdminData();
      onRefreshData();
      setTimeout(() => setSystemMessage(''), 4000);
    } catch (err) {
      console.error(err);
      setSystemError('Seeding failed. Make sure you are logged in as admin@zayelle.gifts');
    } finally {
      setIsLoadingData(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2B2B2B]/65 backdrop-blur-xs overflow-y-auto">
      {/* Background click closes admin if they click outside (and they are not in edit mode) */}
      <div className="absolute inset-0" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-5xl bg-ivory rounded-2xl p-6 md:p-8 shadow-2xl border border-blush/30 z-10 max-h-[92vh] flex flex-col overflow-hidden"
      >
        {/* Header bar */}
        <div className="flex justify-between items-center pb-4 border-b border-blush/30 mb-5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-rosegold" />
            <h2 className="font-display text-2xl text-charcoal font-medium tracking-tight">
              Curator Workshop Space
            </h2>
          </div>
          <button
            onClick={onClose}
            className="bg-white hover:bg-blush text-charcoal p-1.5 rounded-full transition-colors border border-blush/10 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Not Logged In Screen */}
        {!user || user.email !== 'admin@zayelle.gifts' ? (
          <div className="max-w-md mx-auto w-full py-10 flex flex-col justify-center items-center">
            <div className="w-14 h-14 bg-blush/50 rounded-full flex items-center justify-center mb-5 border border-blush">
              <Lock className="w-6 h-6 text-rosegold" />
            </div>

            <h3 className="font-display text-xl text-charcoal mb-2 font-medium text-center">
              Curator Authorization
            </h3>
            <p className="text-charcoal/60 text-xs text-center mb-6 font-sans">
              Access the digital studio backend to upload custom boutique designs, approve reviews, and manage catalog prices.
            </p>

            <form onSubmit={handleLogin} className="w-full space-y-4">
              <div>
                <label className="block text-xs font-semibold tracking-widest text-rosegold uppercase mb-1 font-sans">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  disabled
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/55 border border-blush/40 rounded-xl px-4 py-2.5 text-sm text-charcoal/60 font-sans cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold tracking-widest text-rosegold uppercase mb-1 font-sans">
                  Curator Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter curator password"
                  className="w-full bg-white border border-blush/40 rounded-xl px-4 py-2.5 text-sm text-charcoal focus:outline-hidden focus:ring-1 focus:ring-rosegold font-sans"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="regCheck"
                  checked={isRegistering}
                  onChange={(e) => setIsRegistering(e.target.checked)}
                  className="rounded-sm border-blush text-rosegold focus:ring-rosegold cursor-pointer"
                />
                <label htmlFor="regCheck" className="text-xs text-charcoal/70 font-sans cursor-pointer select-none">
                  Register Admin account (First time setup only)
                </label>
              </div>

              {authError && (
                <p className="text-red-500 text-xs font-medium bg-red-50 p-2.5 rounded-lg border border-red-100 font-sans">
                  {authError}
                </p>
              )}

              <button
                type="submit"
                disabled={isLoadingAuth}
                className="w-full bg-rosegold hover:bg-rosegold-light text-white font-sans font-medium py-3 rounded-xl transition-all shadow-md shadow-rosegold/10 text-sm disabled:opacity-50 cursor-pointer"
              >
                {isLoadingAuth ? 'Authorizing Studio...' : isRegistering ? 'Register & Enter Studio' : 'Sign In as Curator'}
              </button>
            </form>
          </div>
        ) : (
          /* Logged In Workspace */
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Admin Controls sub-header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-3.5 rounded-xl border border-blush/20 mb-5">
              <div className="flex items-center gap-2">
                <Unlock className="w-4 h-4 text-emerald-500" />
                <span className="text-xs text-charcoal/70 font-sans font-medium">
                  Authenticated: <strong>{user.email}</strong>
                </span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={handleRestoreDefaults}
                  disabled={isLoadingData}
                  className="flex-1 sm:flex-none text-xs bg-[#FFF2F5] hover:bg-blush text-rosegold border border-blush/40 px-3.5 py-2 rounded-lg font-sans font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  title="Restores the beautiful 10 products catalog if database was empty"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset to Beautiful Template
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 sm:flex-none text-xs bg-charcoal hover:bg-charcoal/80 text-white px-3.5 py-2 rounded-lg font-sans font-medium transition-colors cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            </div>

            {/* Status alerts */}
            {systemMessage && (
              <p className="bg-emerald-50 text-emerald-700 text-xs p-3 rounded-xl border border-emerald-100 mb-4 font-sans font-medium">
                {systemMessage}
              </p>
            )}
            {systemError && (
              <div className="flex justify-between items-center bg-red-50 text-red-600 text-xs p-3 rounded-xl border border-red-100 mb-4 font-sans font-medium">
                <span>{systemError}</span>
                <button onClick={() => setSystemError('')} className="text-red-800 font-bold px-1">X</button>
              </div>
            )}

            {/* Tabs Selector */}
            <div className="flex gap-1 border-b border-blush/20 mb-5">
              <button
                onClick={() => { setActiveTab('products'); setEditingProduct(null); }}
                className={`flex items-center gap-2 px-4 py-2.5 font-sans text-xs tracking-wider uppercase font-semibold border-b-2 transition-all cursor-pointer ${
                  activeTab === 'products'
                    ? 'border-rosegold text-rosegold'
                    : 'border-transparent text-charcoal/50 hover:text-charcoal/80'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                Showcase Products
              </button>

              <button
                onClick={() => { setActiveTab('reviews'); }}
                className={`flex items-center gap-2 px-4 py-2.5 font-sans text-xs tracking-wider uppercase font-semibold border-b-2 transition-all cursor-pointer ${
                  activeTab === 'reviews'
                    ? 'border-rosegold text-rosegold'
                    : 'border-transparent text-charcoal/50 hover:text-charcoal/80'
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                Customer Testimonials
              </button>

              <button
                onClick={() => { setActiveTab('gallery'); setEditingGallery(null); }}
                className={`flex items-center gap-2 px-4 py-2.5 font-sans text-xs tracking-wider uppercase font-semibold border-b-2 transition-all cursor-pointer ${
                  activeTab === 'gallery'
                    ? 'border-rosegold text-rosegold'
                    : 'border-transparent text-charcoal/50 hover:text-charcoal/80'
                }`}
              >
                <Camera className="w-4 h-4" />
                Instagram Gallery
              </button>
            </div>

            {/* Tab content screens */}
            <div className="flex-1 overflow-y-auto pr-1">
              
              {/* TAB 1: PRODUCTS */}
              {activeTab === 'products' && (
                <div>
                  {editingProduct ? (
                    <form onSubmit={handleSaveProduct} className="bg-white p-5 rounded-xl border border-blush/25 mb-6 space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-display font-medium text-charcoal text-base">
                          {editingProduct.id ? 'Edit Gift Item' : 'Assemble New Gift Design'}
                        </h4>
                        <button
                          type="button"
                          onClick={() => setEditingProduct(null)}
                          className="text-xs text-charcoal/60 hover:text-charcoal"
                        >
                          Cancel
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-semibold tracking-wider text-rosegold uppercase mb-1">
                            Product Name
                          </label>
                          <input
                            type="text"
                            required
                            value={editingProduct.name || ''}
                            onChange={(e) => setEditingProduct(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="e.g. Personalized Flower Preservation Art"
                            className="w-full bg-ivory border border-blush/30 rounded-lg px-3 py-2 text-xs text-charcoal font-sans"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold tracking-wider text-rosegold uppercase mb-1">
                            Starting Price (₹)
                          </label>
                          <input
                            type="number"
                            required
                            value={editingProduct.startingPrice || ''}
                            onChange={(e) => setEditingProduct(prev => ({ ...prev, startingPrice: Number(e.target.value) }))}
                            placeholder="Starting price (e.g. 899)"
                            className="w-full bg-ivory border border-blush/30 rounded-lg px-3 py-2 text-xs text-charcoal font-sans"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-[11px] font-semibold tracking-wider text-rosegold uppercase mb-1">
                            Boutique Description
                          </label>
                          <textarea
                            required
                            rows={3}
                            value={editingProduct.description || ''}
                            onChange={(e) => setEditingProduct(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Write a warm luxury-style product catalog description..."
                            className="w-full bg-ivory border border-blush/30 rounded-lg px-3 py-2 text-xs text-charcoal font-sans resize-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold tracking-wider text-rosegold uppercase mb-1">
                            Customization Options
                          </label>
                          <input
                            type="text"
                            value={editingProduct.customizationOptions || ''}
                            onChange={(e) => setEditingProduct(prev => ({ ...prev, customizationOptions: e.target.value }))}
                            placeholder="e.g. Resin Shape, Preserved Flowers, Font Design"
                            className="w-full bg-ivory border border-blush/30 rounded-lg px-3 py-2 text-xs text-charcoal font-sans"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold tracking-wider text-rosegold uppercase mb-1">
                            Customization Examples
                          </label>
                          <input
                            type="text"
                            value={editingProduct.examples || ''}
                            onChange={(e) => setEditingProduct(prev => ({ ...prev, examples: e.target.value }))}
                            placeholder="e.g. Preserved Meera's wedding flower frame with date '25.04.2025'"
                            className="w-full bg-ivory border border-blush/30 rounded-lg px-3 py-2 text-xs text-charcoal font-sans"
                          />
                        </div>

                        {/* Image uploads */}
                        <div className="md:col-span-2">
                          <label className="block text-[11px] font-semibold tracking-wider text-rosegold uppercase mb-1.5">
                            Product Image
                          </label>
                          <div className="flex items-center gap-4">
                            <button
                              type="button"
                              onClick={() => prodFileRef.current?.click()}
                              className="bg-ivory hover:bg-blush/10 border border-dashed border-rosegold/30 text-charcoal rounded-xl p-4 flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors w-28 h-28 text-center"
                            >
                              <Upload className="w-5 h-5 text-rosegold" />
                              <span className="text-[10px] font-sans font-semibold">Select File</span>
                            </button>
                            <input
                              ref={prodFileRef}
                              type="file"
                              accept="image/*"
                              onChange={handleProductImageSelect}
                              className="hidden"
                            />

                            {editingProduct.imageUrl ? (
                              <div className="relative w-28 h-28 rounded-xl overflow-hidden border border-blush">
                                <img
                                  src={editingProduct.imageUrl}
                                  alt="Product preview"
                                  className="w-full h-full object-cover"
                                />
                                <button
                                  type="button"
                                  onClick={() => setEditingProduct(prev => ({ ...prev, imageUrl: '' }))}
                                  className="absolute top-1 right-1 bg-charcoal/70 text-white rounded-full p-1 hover:bg-charcoal"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ) : (
                              <div className="text-xs text-charcoal/50 font-sans italic">
                                Or type direct URL:
                                <input
                                  type="text"
                                  value={editingProduct.imageUrl || ''}
                                  onChange={(e) => setEditingProduct(prev => ({ ...prev, imageUrl: e.target.value }))}
                                  placeholder="https://images.unsplash.com/..."
                                  className="w-full bg-ivory border border-blush/30 rounded-lg px-2 py-1 text-[11px] text-charcoal font-sans mt-1"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="bg-rosegold hover:bg-rosegold-light text-white font-sans text-xs font-semibold py-2.5 px-5 rounded-lg transition-colors cursor-pointer"
                      >
                        {editingProduct.id ? 'Save Boutique Updates' : 'Add to Catalog Showcase'}
                      </button>
                    </form>
                  ) : (
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-xs text-charcoal/60 font-sans italic">
                        Configure the list of products displayed in your storefront grid (Total: {products.length}).
                      </p>
                      <button
                        onClick={() => setEditingProduct({})}
                        className="bg-rosegold hover:bg-rosegold-light text-white text-xs font-sans font-semibold px-3 py-2 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Create New Product
                      </button>
                    </div>
                  )}

                  {/* Grid lists */}
                  {isLoadingData ? (
                    <p className="text-center py-8 text-xs text-charcoal/50 font-sans">Loading catalog items...</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {products.map(prod => (
                        <div key={prod.id} className="bg-white p-4 rounded-xl border border-blush/20 flex gap-4 items-center">
                          <img
                            src={prod.imageUrl}
                            alt={prod.name}
                            className="w-16 h-16 object-cover rounded-lg bg-ivory"
                            referrerPolicy="no-referrer"
                          />
                          <div className="flex-1 min-w-0">
                            <h5 className="font-display font-medium text-charcoal text-sm truncate">{prod.name}</h5>
                            <span className="text-xs font-semibold text-rosegold font-sans">Starting at ₹{prod.startingPrice}</span>
                            <p className="text-[11px] text-charcoal/55 truncate font-sans">{prod.description}</p>
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <button
                              onClick={() => setEditingProduct(prod)}
                              className="p-1.5 hover:bg-blush text-rosegold rounded-lg transition-colors cursor-pointer"
                              title="Edit item details"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(prod.id)}
                              className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg transition-colors cursor-pointer"
                              title="Remove item"
                            >
                              <Trash className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: REVIEWS */}
              {activeTab === 'reviews' && (
                <div className="space-y-4">
                  <p className="text-xs text-charcoal/60 font-sans italic mb-4">
                    Approve or hide customer submissions. Approved reviews are showcased on the live scrolling testimonials feed.
                  </p>

                  {isLoadingData ? (
                    <p className="text-center py-8 text-xs text-charcoal/50 font-sans">Syncing testimonials...</p>
                  ) : reviews.length === 0 ? (
                    <p className="text-center py-8 text-xs text-charcoal/50 font-sans italic">No submissions yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {reviews.map(rev => (
                        <div
                          key={rev.id}
                          className={`bg-white p-4 rounded-xl border transition-all flex flex-col md:flex-row justify-between gap-4 ${
                            rev.isApproved ? 'border-blush/30' : 'border-amber-200 bg-amber-50/20'
                          }`}
                        >
                          <div className="flex gap-4 items-start flex-1">
                            {rev.imageUrl ? (
                              <img
                                src={rev.imageUrl}
                                alt={rev.customerName}
                                className="w-12 h-12 rounded-full object-cover border border-blush"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-blush/30 flex items-center justify-center font-display font-medium text-rosegold border border-blush text-sm">
                                {rev.customerName.charAt(0)}
                              </div>
                            )}
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-display font-medium text-charcoal text-sm">{rev.customerName}</span>
                                <div className="flex text-amber-400">
                                  {Array.from({ length: rev.rating }).map((_, i) => (
                                    <span key={i} className="text-xs">★</span>
                                  ))}
                                </div>
                              </div>
                              <p className="text-xs text-charcoal/75 mt-1 font-sans italic">"{rev.comment}"</p>
                              <span className="text-[10px] text-charcoal/40 font-mono mt-2 block">
                                Submitted on: {new Date(rev.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>

                          <div className="flex md:flex-col justify-end items-center gap-2">
                            <button
                              onClick={() => handleReviewToggle(rev.id, rev.isApproved)}
                              className={`w-full md:w-auto text-xs px-3 py-1.5 rounded-lg font-sans font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                                rev.isApproved
                                  ? 'bg-[#FFF2F5] hover:bg-blush text-rosegold border border-blush/20'
                                  : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                              }`}
                            >
                              {rev.isApproved ? (
                                <>
                                  <X className="w-3 h-3" />
                                  Unpublish
                                </>
                              ) : (
                                <>
                                  <Check className="w-3 h-3" />
                                  Approve & Live Publish
                                </>
                              )}
                            </button>

                            <button
                              onClick={() => handleDeleteReview(rev.id)}
                              className="text-xs bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg font-sans font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <Trash className="w-3 h-3" />
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: GALLERY */}
              {activeTab === 'gallery' && (
                <div>
                  {editingGallery ? (
                    <form onSubmit={handleSaveGallery} className="bg-white p-5 rounded-xl border border-blush/25 mb-6 space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-display font-medium text-charcoal text-base">Add Lookbook Photograph</h4>
                        <button
                          type="button"
                          onClick={() => setEditingGallery(null)}
                          className="text-xs text-charcoal/60 hover:text-charcoal"
                        >
                          Cancel
                        </button>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-[11px] font-semibold tracking-wider text-rosegold uppercase mb-1">
                            Instagram Post Caption / Title
                          </label>
                          <textarea
                            rows={2}
                            value={editingGallery.title || ''}
                            onChange={(e) => setEditingGallery(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="e.g. Gorgeous bridal preservations! DM us to secure your flowers 🌸💍"
                            className="w-full bg-ivory border border-blush/30 rounded-lg px-3 py-2 text-xs text-charcoal font-sans resize-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold tracking-wider text-rosegold uppercase mb-1">
                            Likes Count (Simulated)
                          </label>
                          <input
                            type="number"
                            value={editingGallery.likes || ''}
                            onChange={(e) => setEditingGallery(prev => ({ ...prev, likes: Number(e.target.value) }))}
                            placeholder="Default is randomized (50-250)"
                            className="w-full bg-ivory border border-blush/30 rounded-lg px-3 py-2 text-xs text-charcoal font-sans"
                          />
                        </div>

                        {/* Image file select */}
                        <div>
                          <label className="block text-[11px] font-semibold tracking-wider text-rosegold uppercase mb-1.5">
                            Post Photo
                          </label>
                          <div className="flex items-center gap-4">
                            <button
                              type="button"
                              onClick={() => galFileRef.current?.click()}
                              className="bg-ivory hover:bg-blush/10 border border-dashed border-rosegold/30 text-charcoal rounded-xl p-4 flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors w-28 h-28 text-center"
                            >
                              <Upload className="w-5 h-5 text-rosegold" />
                              <span className="text-[10px] font-sans font-semibold">Select File</span>
                            </button>
                            <input
                              ref={galFileRef}
                              type="file"
                              accept="image/*"
                              onChange={handleGalleryImageSelect}
                              className="hidden"
                            />

                            {editingGallery.imageUrl ? (
                              <div className="relative w-28 h-28 rounded-xl overflow-hidden border border-blush">
                                <img
                                  src={editingGallery.imageUrl}
                                  alt="Gallery preview"
                                  className="w-full h-full object-cover"
                                />
                                <button
                                  type="button"
                                  onClick={() => setEditingGallery(prev => ({ ...prev, imageUrl: '' }))}
                                  className="absolute top-1 right-1 bg-charcoal/70 text-white rounded-full p-1 hover:bg-charcoal"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ) : (
                              <div className="text-xs text-charcoal/50 font-sans italic">
                                Or paste direct URL:
                                <input
                                  type="text"
                                  value={editingGallery.imageUrl || ''}
                                  onChange={(e) => setEditingGallery(prev => ({ ...prev, imageUrl: e.target.value }))}
                                  placeholder="https://images.unsplash.com/..."
                                  className="w-full bg-ivory border border-blush/30 rounded-lg px-2 py-1 text-[11px] text-charcoal font-sans mt-1"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="bg-rosegold hover:bg-rosegold-light text-white font-sans text-xs font-semibold py-2.5 px-5 rounded-lg transition-colors cursor-pointer"
                      >
                        Publish to Instagram Grid
                      </button>
                    </form>
                  ) : (
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-xs text-charcoal/60 font-sans italic">
                        Display recent aesthetic lookbooks to emulate a premium Instagram shopping feel (Total: {gallery.length}).
                      </p>
                      <button
                        onClick={() => setEditingGallery({})}
                        className="bg-rosegold hover:bg-rosegold-light text-white text-xs font-sans font-semibold px-3 py-2 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Create New Grid Item
                      </button>
                    </div>
                  )}

                  {/* List gallery items */}
                  {isLoadingData ? (
                    <p className="text-center py-8 text-xs text-charcoal/50 font-sans">Loading photo layouts...</p>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {gallery.map(item => (
                        <div key={item.id} className="bg-white rounded-xl overflow-hidden border border-blush/20 relative group">
                          <img
                            src={item.imageUrl}
                            alt="Instagram post preview"
                            className="w-full aspect-square object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div className="p-2 bg-white">
                            <p className="text-[10px] text-charcoal/65 truncate font-sans">{item.title || 'Instagram Showcase'}</p>
                            <span className="text-[9px] text-rosegold font-sans">❤️ {item.likes} Likes</span>
                          </div>
                          <button
                            onClick={() => handleDeleteGallery(item.id)}
                            className="absolute top-2 right-2 bg-red-50 hover:bg-red-100 text-red-600 p-1.5 rounded-full border border-red-200 transition-colors cursor-pointer opacity-0 group-hover:opacity-100 shadow-md"
                            title="Delete post"
                          >
                            <Trash className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
