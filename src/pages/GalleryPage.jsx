import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useSEO } from '../hooks/useSEO';
import {
  Heart, Upload, X, Image as ImageIcon, Sparkles, Home,
  ChevronLeft, Camera, Trash2, ZoomIn, Download, Share2,
  CheckCircle, AlertCircle
} from 'lucide-react';

// ── Local storage key for persisted gallery images
const STORAGE_KEY = 'biodata_gallery_images';

const CATEGORIES = ['All', 'Ceremony', 'Portraits', 'Mehendi', 'Reception', 'My Uploads'];

const DEFAULT_IMAGES = [
  { id: 'd1', src: "https://images.unsplash.com/photo-1733759414886-6b3a5423ceb3?w=600&auto=format&fit=crop&q=80&fm=webp", tag: 'Ceremony', likes: 284, photographer: 'Ravi Studios', isDefault: true },
  { id: 'd2', src: "https://images.unsplash.com/photo-1600685912448-8bc35c141e18?w=600&auto=format&fit=crop&q=80&fm=webp", tag: 'Portraits', likes: 431, photographer: 'Akash Lens', isDefault: true },
  { id: 'd3', src: "https://images.unsplash.com/photo-1645856049928-d544f6b80ce2?w=600&auto=format&fit=crop&q=80&fm=webp", tag: 'Reception', likes: 197, photographer: 'Mehta Clicks', isDefault: true },
  { id: 'd4', src: "https://images.unsplash.com/photo-1754782915842-aa4fca6c203a?w=600&auto=format&fit=crop&q=80&fm=webp", tag: 'Mehendi', likes: 312, photographer: 'Golden Hour', isDefault: true },
  { id: 'd5', src: "https://images.unsplash.com/photo-1760080903792-874870c70902?w=600&auto=format&fit=crop&q=80&fm=webp", tag: 'Ceremony', likes: 528, photographer: 'Ravi Studios', isDefault: true },
  { id: 'd6', src: "https://images.unsplash.com/photo-1740418762511-b3927603599a?w=600&auto=format&fit=crop&q=80&fm=webp", tag: 'Portraits', likes: 164, photographer: 'Akash Lens', isDefault: true },
  { id: 'd7', src: "https://images.unsplash.com/photo-1754782915524-714d8534a5df?w=600&auto=format&fit=crop&q=80&fm=webp", tag: 'Reception', likes: 391, photographer: 'Mehta Clicks', isDefault: true },
  { id: 'd8', src: "https://images.unsplash.com/photo-1703044412297-166a93480d1f?w=600&auto=format&fit=crop&q=80&fm=webp", tag: 'Mehendi', likes: 247, photographer: 'Golden Hour', isDefault: true },
  { id: 'd9', src: "https://images.unsplash.com/photo-1703044412383-fa6b9884e802?w=600&auto=format&fit=crop&q=80&fm=webp", tag: 'Ceremony', likes: 183, photographer: 'Ravi Studios', isDefault: true },
  { id: 'd10', src: "https://images.unsplash.com/photo-1722952934708-749c22eb2e58?w=600&auto=format&fit=crop&q=80&fm=webp", tag: 'Portraits', likes: 462, photographer: 'Akash Lens', isDefault: true },
];

// ── Upload Modal Component
const UploadModal = ({ onClose, onUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [previews, setPreviews] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('My Uploads');
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);
  const fileInputRef = useRef();

  const processFiles = (files) => {
    const validFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviews(prev => [...prev, {
          id: Date.now() + Math.random(),
          src: e.target.result,
          name: file.name,
          size: (file.size / 1024).toFixed(1) + ' KB'
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  }, []);

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);

  const removePreview = (id) => setPreviews(prev => prev.filter(p => p.id !== id));

  const handleSubmit = () => {
    if (!previews.length) return;
    setUploading(true);
    setTimeout(() => {
      const newImages = previews.map(p => ({
        id: p.id,
        src: p.src,
        tag: selectedCategory,
        likes: 0,
        photographer: 'My Upload',
        isDefault: false,
      }));
      onUpload(newImages);
      setUploading(false);
      setDone(true);
      setTimeout(onClose, 1200);
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 20 }}
        className="w-full max-w-2xl rounded-3xl overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, #1a0a00, #2a1200)',
          border: '1px solid rgba(212,160,23,0.4)',
          boxShadow: '0 25px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(212,160,23,0.1)',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'rgba(212,160,23,0.2)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #d4a017, #f0c040)' }}>
              <Camera className="w-5 h-5 text-[#1a0800]" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                Upload Wedding Photos
              </h2>
              <p className="text-xs" style={{ color: '#a89060' }}>Share your beautiful moments</p>
            </div>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-white/10"
            style={{ color: '#a89060' }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Drop Zone */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className="relative rounded-2xl border-2 border-dashed p-10 text-center cursor-pointer transition-all duration-300"
            style={{
              borderColor: isDragging ? '#d4a017' : 'rgba(212,160,23,0.35)',
              background: isDragging ? 'rgba(212,160,23,0.08)' : 'rgba(212,160,23,0.03)',
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => processFiles(e.target.files)}
            />
            <motion.div animate={{ scale: isDragging ? 1.1 : 1 }} transition={{ duration: 0.2 }}>
              <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, rgba(212,160,23,0.2), rgba(240,192,64,0.1))' }}>
                <Upload className="w-8 h-8" style={{ color: '#d4a017' }} />
              </div>
              <p className="text-white font-semibold text-lg mb-1" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                {isDragging ? 'Drop your photos here!' : 'Drag & Drop Photos'}
              </p>
              <p className="text-sm" style={{ color: '#a89060' }}>
                or <span style={{ color: '#f0c040' }}>click to browse</span> from your device
              </p>
              <p className="text-xs mt-3 px-6" style={{ color: '#6b5030' }}>
                Supports JPG, PNG, WEBP • Multiple files allowed
              </p>
            </motion.div>
          </div>

          {/* Category Selector */}
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: '#d4a017' }}>
              Category
            </p>
            <div className="flex flex-wrap gap-2">
              {['Ceremony', 'Portraits', 'Mehendi', 'Reception', 'My Uploads'].map(cat => (
                <button key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className="px-4 py-1.5 rounded-full text-xs font-medium border transition-all"
                  style={{
                    borderColor: selectedCategory === cat ? '#d4a017' : 'rgba(212,160,23,0.3)',
                    background: selectedCategory === cat ? 'linear-gradient(135deg, #d4a017, #f0c040)' : 'rgba(212,160,23,0.05)',
                    color: selectedCategory === cat ? '#1a0800' : '#a89060',
                  }}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Previews Grid */}
          {previews.length > 0 && (
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: '#d4a017' }}>
                Selected ({previews.length})
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                <AnimatePresence>
                  {previews.map(p => (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="relative group rounded-xl overflow-hidden aspect-square"
                      style={{ border: '1px solid rgba(212,160,23,0.3)' }}
                    >
                      <img src={p.src} alt={p.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button onClick={() => removePreview(p.id)}
                          className="w-7 h-7 rounded-full flex items-center justify-center"
                          style={{ background: 'rgba(220,38,38,0.9)' }}>
                          <X className="w-4 h-4 text-white" />
                        </button>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-1 text-[9px] text-white/70 truncate"
                        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)' }}>
                        {p.size}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={!previews.length || uploading || done}
            className="w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: done
                ? 'linear-gradient(135deg, #16a34a, #22c55e)'
                : 'linear-gradient(135deg, #d4a017, #f0c040)',
              color: '#1a0800',
              boxShadow: done ? '0 0 20px rgba(34,197,94,0.4)' : '0 0 20px rgba(212,160,23,0.3)',
            }}
          >
            {done ? (
              <><CheckCircle className="w-5 h-5" /> Uploaded Successfully!</>
            ) : uploading ? (
              <><div className="w-4 h-4 border-2 border-[#1a0800]/40 border-t-[#1a0800] rounded-full animate-spin" /> Uploading...</>
            ) : (
              <><Upload className="w-4 h-4" /> Upload {previews.length > 0 ? `${previews.length} Photo${previews.length > 1 ? 's' : ''}` : 'Photos'}</>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ── Lightbox Component
const Lightbox = ({ image, onClose, onPrev, onNext }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[9998] flex items-center justify-center"
    style={{ background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(12px)' }}
    onClick={(e) => e.target === e.currentTarget && onClose()}
  >
    <button onClick={onClose}
      className="absolute top-5 right-5 w-10 h-10 rounded-full flex items-center justify-center z-10 transition-colors hover:bg-white/10"
      style={{ color: '#f5ead0' }}>
      <X className="w-6 h-6" />
    </button>
    <button onClick={onPrev}
      className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110"
      style={{ background: 'rgba(212,160,23,0.2)', border: '1px solid rgba(212,160,23,0.4)', color: '#f0c040' }}>
      <ChevronLeft className="w-6 h-6" />
    </button>
    <button onClick={onNext}
      className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110"
      style={{ background: 'rgba(212,160,23,0.2)', border: '1px solid rgba(212,160,23,0.4)', color: '#f0c040' }}>
      <ChevronLeft className="w-6 h-6 rotate-180" />
    </button>
    <motion.div
      initial={{ scale: 0.85 }} animate={{ scale: 1 }} exit={{ scale: 0.85 }}
      className="max-w-4xl max-h-[85vh] rounded-2xl overflow-hidden relative"
      style={{ border: '1px solid rgba(212,160,23,0.3)', boxShadow: '0 25px 80px rgba(0,0,0,0.9)' }}
    >
      <img src={image.src} alt={image.tag} width="1200" height="900" decoding="async" className="max-w-full max-h-[85vh] object-contain" />
      <div className="absolute bottom-0 left-0 right-0 px-6 py-4"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)' }}>
        <div className="flex items-center justify-between">
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
              style={{ background: 'rgba(212,160,23,0.8)', color: '#1a0800' }}>
              {image.tag}
            </span>
            <p className="text-white text-sm mt-1 font-semibold" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              📷 {image.photographer}
            </p>
          </div>
          <div className="flex items-center gap-1 text-sm" style={{ color: '#f0c040' }}>
            <Heart className="w-4 h-4 fill-current" />
            <span className="font-bold">{image.likes}</span>
          </div>
        </div>
      </div>
    </motion.div>
  </motion.div>
);

// ── Main Gallery Page
const GalleryPage = () => {
  useSEO('/gallery');

  const [images, setImages] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const userImages = stored ? JSON.parse(stored) : [];
      return [...DEFAULT_IMAGES, ...userImages];
    } catch { return DEFAULT_IMAGES; }
  });
  const [activeCategory, setActiveCategory] = useState('All');
  const [showUpload, setShowUpload] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const [likedIds, setLikedIds] = useState(new Set());
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const filtered = activeCategory === 'All'
    ? images
    : images.filter(img => img.tag === activeCategory);

  const lightboxIdx = lightbox !== null ? filtered.findIndex(img => img.id === lightbox) : -1;

  const handleUpload = (newImages) => {
    setImages(prev => {
      const updated = [...prev, ...newImages];
      const userImages = updated.filter(img => !img.isDefault);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userImages));
      return updated;
    });
    setShowUpload(false);
  };

  const handleDelete = (id) => {
    setImages(prev => {
      const updated = prev.filter(img => img.id !== id);
      const userImages = updated.filter(img => !img.isDefault);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userImages));
      return updated;
    });
    setDeleteConfirm(null);
    if (lightbox === id) setLightbox(null);
  };

  const toggleLike = (id) => {
    setLikedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
    setImages(prev => prev.map(img =>
      img.id === id ? { ...img, likes: img.likes + (likedIds.has(id) ? -1 : 1) } : img
    ));
  };

  const userCount = images.filter(img => !img.isDefault).length;

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(160deg, #0d0500 0%, #1a0800 30%, #0f0300 60%, #1f0e00 100%)' }}>

      {/* ── Background Pattern */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `linear-gradient(rgba(212,160,23,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(212,160,23,0.8) 1px, transparent 1px)`,
          backgroundSize: '48px 48px'
        }} />
        <div className="absolute top-0 left-1/3 w-[600px] h-[600px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #d4a017 0%, transparent 70%)', transform: 'translate(-50%,-50%)' }} />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full opacity-8"
          style={{ background: 'radial-gradient(circle, #8b0000 0%, transparent 70%)', transform: 'translate(50%,50%)' }} />
      </div>

      <div className="relative z-10 pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

        {/* ── Back Button */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-sm transition-colors hover:text-[#f0c040]"
            style={{ color: '#a89060' }}>
            <ChevronLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </motion.div>

        {/* ── Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="h-px w-12" style={{ background: 'linear-gradient(to right, transparent, #d4a017)' }} />
            <span className="text-xs font-semibold tracking-[4px] uppercase" style={{ color: '#d4a017' }}>Inspiration</span>
            <div className="h-px w-12" style={{ background: 'linear-gradient(to left, transparent, #d4a017)' }} />
          </div>
          <h1 className="text-5xl md:text-7xl font-light text-white mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Wedding <span className="italic font-medium" style={{ color: '#f0c040' }}>Gallery</span>
          </h1>
          <p className="text-[#a89060] max-w-lg mx-auto text-sm leading-relaxed">
            A curated collection of beautiful Indian wedding moments. Upload your own to inspire others.
          </p>

          {/* Stats row */}
          <div className="flex items-center justify-center gap-8 mt-8">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{images.length}</p>
              <p className="text-xs uppercase tracking-wider" style={{ color: '#a89060' }}>Total Photos</p>
            </div>
            <div className="w-px h-10" style={{ background: 'rgba(212,160,23,0.3)' }} />
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{userCount}</p>
              <p className="text-xs uppercase tracking-wider" style={{ color: '#a89060' }}>Uploaded</p>
            </div>
            <div className="w-px h-10" style={{ background: 'rgba(212,160,23,0.3)' }} />
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{likedIds.size}</p>
              <p className="text-xs uppercase tracking-wider" style={{ color: '#a89060' }}>Liked</p>
            </div>
          </div>
        </motion.div>

        {/* ── Actions Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="flex flex-wrap items-center justify-between gap-4 mb-8"
        >
          {/* Category filters */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat, i) => {
              const count = cat === 'All' ? images.length : images.filter(img => img.tag === cat).length;
              return (
                <button key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium border transition-all"
                  style={{
                    borderColor: activeCategory === cat ? '#d4a017' : 'rgba(212,160,23,0.3)',
                    background: activeCategory === cat ? 'linear-gradient(135deg, #d4a017, #f0c040)' : 'rgba(212,160,23,0.06)',
                    color: activeCategory === cat ? '#1a0800' : '#a89060',
                  }}>
                  {cat}
                  <span className="px-1.5 py-0.5 rounded-full text-[10px]"
                    style={{
                      background: activeCategory === cat ? 'rgba(0,0,0,0.2)' : 'rgba(212,160,23,0.15)',
                      color: activeCategory === cat ? '#1a0800' : '#d4a017'
                    }}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Upload button */}
          <motion.button
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            onClick={() => setShowUpload(true)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all"
            style={{
              background: 'linear-gradient(135deg, #d4a017, #f0c040)',
              color: '#1a0800',
              boxShadow: '0 4px 20px rgba(212,160,23,0.35)',
            }}>
            <Upload className="w-4 h-4" />
            Upload Photos
          </motion.button>
        </motion.div>

        {/* ── Masonry Grid */}
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div key="empty"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-center py-32">
              <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-30" style={{ color: '#d4a017' }} />
              <p className="text-white text-xl mb-2" style={{ fontFamily: 'Cormorant Garamond, serif' }}>No photos yet</p>
              <p className="text-sm mb-6" style={{ color: '#a89060' }}>Be the first to share your wedding moments!</p>
              <button onClick={() => setShowUpload(true)}
                className="px-6 py-2.5 rounded-full text-sm font-bold"
                style={{ background: 'linear-gradient(135deg, #d4a017, #f0c040)', color: '#1a0800' }}>
                Upload Now
              </button>
            </motion.div>
          ) : (
            <motion.div key={activeCategory}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4"
              style={{ columnFill: 'balance' }}>
              {filtered.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  className="relative overflow-hidden rounded-2xl group break-inside-avoid mb-4 cursor-pointer"
                  style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}
                >
                  {/* Image */}
                  <img
                    src={item.src}
                    alt={item.tag}
                    loading="lazy"
                    decoding="async"
                    width="600"
                    height="800"
                    onClick={() => setLightbox(item.id)}
                    className="w-full h-auto object-cover block transition-transform duration-700 group-hover:scale-[1.06]"
                  />

                  {/* Category tag */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                      style={{ background: 'rgba(212,160,23,0.88)', color: '#1a0800', boxShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
                      {item.tag}
                    </span>
                  </div>

                  {/* User-uploaded badge */}
                  {!item.isDefault && (
                    <div className="absolute top-3 left-3 mt-7 z-10">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider"
                        style={{ background: 'rgba(22,163,74,0.85)', color: 'white' }}>
                        ✓ My Upload
                      </span>
                    </div>
                  )}

                  {/* Action buttons (top-right) on hover */}
                  <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                    {/* Like */}
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleLike(item.id); }}
                      className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 backdrop-blur-md"
                      style={{
                        background: likedIds.has(item.id) ? 'rgba(220,38,38,0.9)' : 'rgba(30,15,0,0.8)',
                        border: '1px solid rgba(212,160,23,0.5)'
                      }}>
                      <Heart className={`w-3.5 h-3.5 ${likedIds.has(item.id) ? 'fill-current text-white' : 'text-[#f0c040]'}`} />
                    </button>
                    {/* Zoom */}
                    <button
                      onClick={(e) => { e.stopPropagation(); setLightbox(item.id); }}
                      className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 backdrop-blur-md"
                      style={{ background: 'rgba(30,15,0,0.8)', border: '1px solid rgba(212,160,23,0.5)' }}>
                      <ZoomIn className="w-3.5 h-3.5 text-[#f0c040]" />
                    </button>
                    {/* Delete (only for user uploads) */}
                    {!item.isDefault && (
                      <button
                        onClick={(e) => { e.stopPropagation(); setDeleteConfirm(item.id); }}
                        className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 backdrop-blur-md"
                        style={{ background: 'rgba(220,38,38,0.8)', border: '1px solid rgba(220,38,38,0.5)' }}>
                        <Trash2 className="w-3.5 h-3.5 text-white" />
                      </button>
                    )}
                  </div>

                  {/* Bottom overlay */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-400 pointer-events-none"
                    style={{ background: 'linear-gradient(to top, rgba(10,4,0,0.9) 0%, rgba(10,4,0,0.3) 40%, transparent 70%)' }} />
                  <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-white font-semibold truncate" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '12px' }}>
                        📷 {item.photographer}
                      </p>
                      <div className="flex items-center gap-1 text-[10px]" style={{ color: '#f0c040' }}>
                        <Heart className={`w-3 h-3 ${likedIds.has(item.id) ? 'fill-current' : ''}`} />
                        <span className="font-semibold">{item.likes + (likedIds.has(item.id) ? 0 : 0)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Gold border on hover */}
                  <div className="absolute inset-0 rounded-2xl pointer-events-none border border-transparent group-hover:border-[#d4a017]/50 transition-colors duration-400" />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Delete Confirm Modal */}
        <AnimatePresence>
          {deleteConfirm && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9997] flex items-center justify-center"
              style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                className="rounded-2xl p-6 text-center max-w-sm w-full mx-4"
                style={{ background: '#1a0a00', border: '1px solid rgba(220,38,38,0.4)', boxShadow: '0 20px 60px rgba(0,0,0,0.8)' }}>
                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
                <h3 className="text-white text-lg font-bold mb-2">Delete Photo?</h3>
                <p className="text-sm mb-6" style={{ color: '#a89060' }}>This action cannot be undone.</p>
                <div className="flex gap-3">
                  <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 rounded-xl text-sm font-medium border transition-colors hover:bg-white/5"
                    style={{ borderColor: 'rgba(212,160,23,0.3)', color: '#a89060' }}>
                    Cancel
                  </button>
                  <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-90"
                    style={{ background: 'linear-gradient(135deg, #dc2626, #ef4444)', color: 'white' }}>
                    Delete
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Upload Modal */}
      <AnimatePresence>
        {showUpload && <UploadModal onClose={() => setShowUpload(false)} onUpload={handleUpload} />}
      </AnimatePresence>

      {/* ── Lightbox */}
      <AnimatePresence>
        {lightbox !== null && lightboxIdx !== -1 && (
          <Lightbox
            image={filtered[lightboxIdx]}
            onClose={() => setLightbox(null)}
            onPrev={() => setLightbox(filtered[(lightboxIdx - 1 + filtered.length) % filtered.length].id)}
            onNext={() => setLightbox(filtered[(lightboxIdx + 1) % filtered.length].id)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default GalleryPage;
