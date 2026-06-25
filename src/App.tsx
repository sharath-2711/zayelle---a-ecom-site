import React, { useState, useEffect } from 'react';
import { 
  Instagram, 
  Sparkles, 
  Heart, 
  MessageCircle, 
  Calendar, 
  ChevronRight, 
  Star, 
  Flower2, 
  Lock, 
  Send, 
  ArrowUpRight, 
  ChevronLeft, 
  CheckCircle,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getProducts, getApprovedReviews, getGalleryItems } from './firebaseService';
import { Product, Review, GalleryItem } from './types';
import PetalRain from './components/PetalRain';
import ProductModal from './components/ProductModal';
import ReviewForm from './components/ReviewForm';
import AdminPanel from './components/AdminPanel';

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals visibility states
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  
  // Mobile navigation drawer state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Fetch all collections
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [prodList, revList, galList] = await Promise.all([
        getProducts(),
        getApprovedReviews(),
        getGalleryItems()
      ]);
      setProducts(prodList);
      setReviews(revList);
      setGallery(galList);
    } catch (error) {
      console.error("Failed to load catalog data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Smooth scroll handler
  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9F5] text-charcoal font-sans relative selection:bg-blush selection:text-rosegold selection:font-semibold">
      
      {/* 1. Subtle, slow floating flower petals */}
      <PetalRain />

      {/* Decorative Floral Elements (Simulated Editorial Accents) */}
      <div className="absolute top-0 right-0 w-80 h-80 opacity-10 pointer-events-none z-0 overflow-hidden">
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full translate-x-20 -translate-y-20">
          <path d="M100 20C120 50 180 30 180 80C180 130 140 180 100 180C60 180 20 130 20 80C20 30 80 50 100 20Z" fill="#B76E79"/>
        </svg>
      </div>
      <div className="absolute bottom-20 left-0 w-96 h-96 opacity-5 pointer-events-none z-0 overflow-hidden">
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full -translate-x-24 translate-y-24">
          <path d="M100 20C120 50 180 30 180 80C180 130 140 180 100 180C60 180 20 130 20 80C20 30 80 50 100 20Z" fill="#B76E79"/>
        </svg>
      </div>

      {/* 2. Top Luxury Navigation Bar */}
      <nav className="sticky top-0 z-40 bg-[#FFF9F5]/80 backdrop-blur-md border-b border-rosegold/20 py-4.5 px-6 md:px-10 flex justify-between items-center transition-all duration-300">
        <div 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
          className="flex items-center gap-3 cursor-pointer group"
          id="nav_logo"
        >
          <span className="font-display text-2xl tracking-[0.3em] font-light text-charcoal hover:text-rosegold transition-colors">
            ZAYELLE
          </span>
          <span className="text-[9px] font-mono tracking-[0.25em] text-rosegold uppercase hidden sm:inline-block ml-1 bg-blush/35 px-2.5 py-0.5 rounded-sm">
            GIFTS
          </span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-[11px] uppercase tracking-widest font-medium">
          <button 
            onClick={() => scrollToSection('collection')} 
            className="text-charcoal/80 hover:text-rosegold transition-colors cursor-pointer"
            id="link_showcase"
          >
            The Collection
          </button>
          <button 
            onClick={() => scrollToSection('about')} 
            className="text-charcoal/80 hover:text-rosegold transition-colors cursor-pointer"
            id="link_about"
          >
            Our Story
          </button>
          <button 
            onClick={() => scrollToSection('process')} 
            className="text-charcoal/80 hover:text-rosegold transition-colors cursor-pointer"
            id="link_process"
          >
            Our Process
          </button>
          <button 
            onClick={() => scrollToSection('testimonials')} 
            className="text-charcoal/80 hover:text-rosegold transition-colors cursor-pointer"
            id="link_reviews"
          >
            Customer Stories
          </button>
          <button 
            onClick={() => scrollToSection('gallery')} 
            className="text-charcoal/80 hover:text-rosegold transition-colors cursor-pointer font-bold"
            id="link_gallery"
          >
            Instagram
          </button>
          <a
            href="https://www.instagram.com/direct/t/18102416863828766/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-rosegold hover:bg-[#a15d68] text-white px-5 py-2.5 rounded-sm tracking-widest text-[10px] transition-all transform hover:-translate-y-0.5 flex items-center gap-1.5 shadow-sm font-semibold"
            id="nav_dm_btn"
          >
            <Instagram className="w-3.5 h-3.5" />
            DM to Order
          </a>
        </div>

        {/* Mobile Menu Trigger */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-charcoal hover:text-rosegold transition-colors p-1"
          aria-label="Toggle Menu"
          id="mobile_menu_trigger"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Drawer menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-16 left-0 right-0 bg-[#FFF9F5] border-b border-rosegold/20 z-30 p-6 shadow-xl flex flex-col gap-4 text-center text-xs font-semibold tracking-widest uppercase md:hidden"
            id="mobile_drawer"
          >
            <button onClick={() => scrollToSection('collection')} className="py-2 text-charcoal hover:text-rosegold border-b border-blush/20 cursor-pointer">The Collection</button>
            <button onClick={() => scrollToSection('about')} className="py-2 text-charcoal hover:text-rosegold border-b border-blush/20 cursor-pointer">Our Story</button>
            <button onClick={() => scrollToSection('process')} className="py-2 text-charcoal hover:text-rosegold border-b border-blush/20 cursor-pointer">Our Process</button>
            <button onClick={() => scrollToSection('testimonials')} className="py-2 text-charcoal hover:text-rosegold border-b border-blush/20 cursor-pointer">Customer Stories</button>
            <button onClick={() => scrollToSection('gallery')} className="py-2 text-charcoal hover:text-rosegold border-b border-blush/20 cursor-pointer">Instagram</button>
            <a
              href="https://www.instagram.com/direct/t/18102416863828766/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-rosegold hover:bg-[#a15d68] text-white py-3 rounded-sm flex items-center justify-center gap-2 mt-2 shadow-md cursor-pointer tracking-widest text-[11px]"
            >
              <Instagram className="w-4 h-4" />
              <span>DM on Instagram</span>
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Hero Lifestyle Banner Section */}
      <header className="relative py-24 md:py-36 px-6 md:px-12 flex flex-col items-center text-center overflow-hidden bg-[#FFF9F5] border-b border-rosegold/10">
        {/* Soft decorative flower SVGs around the corners */}
        <div className="absolute top-10 left-4 md:left-24 opacity-20 pointer-events-none animate-pulse">
          <svg width="120" height="120" viewBox="0 0 100 100" fill="none">
            <path d="M50 0C55 25 75 45 100 50C75 55 55 75 50 100C45 75 25 55 0 50C25 45 45 25 50 0Z" fill="#B76E79" />
          </svg>
        </div>
        <div className="absolute bottom-10 right-4 md:right-24 opacity-20 pointer-events-none animate-bounce" style={{ animationDuration: '6s' }}>
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="30" fill="#FFDDE8" />
            <circle cx="25" cy="50" r="15" fill="#B76E79" />
            <circle cx="75" cy="50" r="15" fill="#B76E79" />
            <circle cx="50" cy="25" r="15" fill="#B76E79" />
            <circle cx="50" cy="75" r="15" fill="#B76E79" />
          </svg>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl z-10"
        >
          {/* Aesthetic Tagline badge */}
          <span className="text-[11px] uppercase tracking-[0.4em] text-rosegold mb-5 block font-semibold">
            Est. 2024 — Boutique Gifting
          </span>

          {/* Premium Headline */}
          <h1 className="font-display text-5xl sm:text-6xl md:text-7.5xl text-charcoal leading-[0.95] mb-8 italic font-light tracking-tight">
            Personalized Gifts<br />
            <span className="text-rosegold not-italic font-normal tracking-wide">Made Beautiful</span>
          </h1>

          {/* Subheading */}
          <p className="text-charcoal/70 text-sm md:text-base leading-relaxed max-w-xl mx-auto mb-10 font-sans font-light">
            Thoughtfully crafted gifts customized just for your loved ones. Discover our luxury catalog and order via DM to curate flower preservation resins, custom calligraphies, and exquisite candle gift sets.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
              onClick={() => scrollToSection('collection')}
              className="w-full sm:w-auto bg-rosegold hover:bg-[#a15d68] text-white py-4 px-10 text-xs uppercase tracking-widest rounded-sm transition-all hover:shadow-md cursor-pointer font-semibold"
              id="hero_explore"
            >
              Explore Collection
            </button>
            <a
              href="https://www.instagram.com/direct/t/18102416863828766/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto border border-rosegold text-rosegold py-4 px-10 text-xs uppercase tracking-widest text-center rounded-sm hover:bg-rosegold hover:text-white transition-all cursor-pointer font-semibold flex items-center justify-center gap-2"
              id="hero_instagram"
            >
              <Instagram className="w-4 h-4" />
              <span>Message on Instagram</span>
            </a>
          </div>

          {/* Instagram prompt bar */}
          <p className="text-[10px] uppercase tracking-widest text-charcoal/40 mt-6 font-mono">
            * Every creation is handmade. Customizations arranged via DMs 🌸
          </p>
        </motion.div>
      </header>

      {/* 4. Products Catalog Section (Showcase Grid) */}
      <section id="collection" className="py-24 md:py-32 px-6 md:px-12 bg-white scroll-mt-10">
        <div className="max-w-7xl mx-auto">
          
          {/* Header titles */}
          <div className="text-center max-w-xl mx-auto mb-20">
            <span className="text-[11px] uppercase tracking-[0.35em] text-rosegold mb-2.5 block font-semibold">
              The Collection Catalog
            </span>
            <h2 className="font-display text-3xl md:text-4.5xl text-charcoal font-light italic tracking-tight mb-4">
              The Gifting Showcase
            </h2>
            <p className="text-charcoal/65 text-xs md:text-sm font-sans font-light leading-relaxed">
              A premium curated showcase of our most popular customized gifts. Click on any design to view customization options, sample layouts, and consult directly on Instagram.
            </p>
            <div className="h-[1px] bg-rosegold/20 w-24 mx-auto mt-6" />
          </div>

          {/* Responsive Product Grid */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-8 h-8 border-2 border-rosegold border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-charcoal/50 font-mono tracking-wider">Gathering beautiful catalogs...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {products.map((prod, index) => (
                <motion.div
                  key={prod.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05, duration: 0.5 }}
                  className="group bg-[#FFF9F5]/40 rounded-sm p-5 border border-rosegold/10 hover:border-rosegold/30 hover:shadow-xs hover:bg-white transition-all duration-300 flex flex-col justify-between"
                  id={`product_card_${prod.id}`}
                >
                  <div>
                    {/* Visual Photo wrapper */}
                    <div className="aspect-[3/4] rounded-sm overflow-hidden mb-5 bg-[#FFDDE8]/20 border border-[#FFDDE8]/60 relative">
                      <img
                        src={prod.imageUrl}
                        alt={prod.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      {/* Gentle rose gold tint overlay on hover */}
                      <div className="absolute inset-0 bg-[#B76E79]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    {/* Meta Title & Description */}
                    <div className="px-1">
                      <div className="flex justify-between items-baseline mt-2 mb-1.5 gap-2">
                        <h3 className="font-display text-base md:text-lg text-charcoal font-medium italic group-hover:text-rosegold transition-colors">
                          {prod.name}
                        </h3>
                        <span className="text-xs font-semibold text-rosegold font-sans shrink-0">
                          ₹{prod.startingPrice}+
                        </span>
                      </div>
                      <p className="text-charcoal/70 text-xs leading-relaxed mb-4 line-clamp-3 font-sans font-light">
                        {prod.description}
                      </p>
                    </div>
                  </div>

                  {/* Actions bar inside card */}
                  <div className="pt-3 px-1 flex items-center justify-between gap-3 border-t border-rosegold/10 mt-3">
                    <button
                      onClick={() => setSelectedProduct(prod)}
                      className="text-[10px] tracking-widest uppercase font-semibold text-charcoal/80 hover:text-rosegold transition-colors flex items-center gap-1 cursor-pointer"
                      id={`view_details_${prod.id}`}
                    >
                      <span>View Customization</span>
                      <ChevronRight className="w-3.5 h-3.5 text-rosegold" />
                    </button>
                    <a
                      href="https://www.instagram.com/direct/t/18102416863828766/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[9px] tracking-wider uppercase font-bold text-rosegold border-b border-rosegold/40 hover:border-rosegold hover:text-[#a15d68] transition-all cursor-pointer"
                      id={`dm_order_${prod.id}`}
                    >
                      Inquire via DM
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. About the Brand / Romantic Story Section */}
      <section id="about" className="py-24 md:py-32 px-6 md:px-12 bg-[#FFF9F5] scroll-mt-10 overflow-hidden relative border-b border-rosegold/10">
        <div className="absolute -top-10 -right-10 opacity-15 pointer-events-none">
          <svg width="240" height="240" viewBox="0 0 100 100" fill="none">
            <path d="M50 0C55 25 75 45 100 50C75 55 55 75 50 100C45 75 25 55 0 50C25 45 45 25 50 0Z" fill="#B76E79" />
          </svg>
        </div>

        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-16 z-10 relative">
          {/* Left: Romantic Styled Photo Showcase */}
          <div className="w-full md:w-1/2 relative">
            <div className="aspect-[4/5] rounded-sm overflow-hidden shadow-lg border border-rosegold/20 relative z-10 bg-white p-3">
              <img
                src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=600"
                alt="Romantic gifting table lookbook"
                className="w-full h-full object-cover rounded-sm"
              />
            </div>
            {/* Ambient decorative frame */}
            <div className="absolute -bottom-4 -left-4 w-full h-full border border-rosegold/30 rounded-sm z-0 pointer-events-none translate-x-4 translate-y-4" />
          </div>

          {/* Right: Editorial Narrative */}
          <div className="w-full md:w-1/2">
            <span className="text-xs font-semibold tracking-widest text-rosegold uppercase mb-2 block font-mono">
              Crafting Pure Memories
            </span>
            <h2 className="font-display text-3xl md:text-4.5xl text-charcoal font-light tracking-tight mb-6 leading-tight">
              Our Story, Preserved <br />
              <span className="italic font-normal text-rosegold">In Floral Details</span>
            </h2>

            <p className="text-charcoal/85 text-sm leading-relaxed mb-5 font-sans font-light">
              At <strong>Zayelle Gifts</strong>, we believe a truly meaningful gift can never be mass-produced. It requires patience, exquisite materials, and an artistic touch. Inspired by botanical aesthetics, delicate French lace, and vintage lookbooks, we design and compile customized gifting experiences.
            </p>
            <p className="text-charcoal/75 text-sm leading-relaxed mb-8 font-sans font-light">
              We specialize in custom eternal roses, hand-poured soy wax candles, gold-embossed leather journals, and pressed floral resin preservation plaques. Every gift is beautifully layered with fine silk ribbons and customized letter calligraphy, turning simple celebrations into lasting memories.
            </p>

            {/* Quote block */}
            <div className="border-l-2 border-rosegold/40 pl-4 py-1.5 mb-8">
              <p className="text-xs text-rosegold font-sans font-medium italic">
                "No standard shopping carts. No automated checkout lines. Just personal discussions to help design a gift that completely matches your feelings."
              </p>
            </div>

            <a
              href="https://www.instagram.com/direct/t/18102416863828766/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-charcoal hover:bg-charcoal/90 text-white font-sans text-xs tracking-widest uppercase font-medium px-6 py-3.5 rounded-sm transition-colors cursor-pointer"
            >
              <Instagram className="w-4 h-4 text-blush" />
              <span>Discuss Your Gift In DMs</span>
            </a>
          </div>
        </div>
      </section>

      {/* 6. Ordering Process Section */}
      <section id="process" className="py-24 md:py-32 px-6 md:px-12 bg-white border-b border-rosegold/10 scroll-mt-10">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center max-w-xl mx-auto mb-20">
            <span className="text-xs font-semibold tracking-widest text-rosegold uppercase mb-2 block font-mono">
              Simple & Tailored
            </span>
            <h2 className="font-display text-3xl md:text-4xl text-charcoal font-light tracking-tight mb-4">
              How Ordering Works
            </h2>
            <p className="text-charcoal/65 text-xs md:text-sm font-sans font-light leading-relaxed">
              We do not use confusing shopping checkouts. Instead, we discuss every rose petal, paper texture, and handwriting design directly with you!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="flex flex-col items-start border-l border-rosegold/20 pl-6 py-2">
              <span className="font-display italic text-3xl text-rosegold/40 mb-2 font-light">01</span>
              <h4 className="font-display font-medium text-charcoal text-sm mb-2 italic">Browse & Spark</h4>
              <p className="text-charcoal/70 text-xs leading-relaxed font-sans font-light">
                Explore our catalog of handcrafted signature bases and gather botanical inspiration.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-start border-l border-rosegold/20 pl-6 py-2">
              <span className="font-display italic text-3xl text-rosegold/40 mb-2 font-light">02</span>
              <h4 className="font-display font-medium text-charcoal text-sm mb-2 italic">Select & Screenshot</h4>
              <p className="text-charcoal/70 text-xs leading-relaxed font-sans font-light">
                Click details to see our sample customizations. Take a screenshot or note the gift name.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-start border-l border-rosegold/20 pl-6 py-2">
              <span className="font-display italic text-3xl text-rosegold/40 mb-2 font-light">03</span>
              <h4 className="font-display font-medium text-charcoal text-sm mb-2 italic">Send Us a DM</h4>
              <p className="text-charcoal/70 text-xs leading-relaxed font-sans font-light">
                Click "Order Through Instagram" and send us a direct message with your design preferences.
              </p>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-start border-l border-rosegold/20 pl-6 py-2">
              <span className="font-display italic text-3xl text-rosegold/80 mb-2 font-medium">04</span>
              <h4 className="font-display font-medium text-charcoal text-sm mb-2 italic">Personal Crafting</h4>
              <p className="text-charcoal/70 text-xs leading-relaxed font-sans font-light">
                We will share photographs of the final assembly for approval before packaging and shipping!
              </p>
            </div>
          </div>

          <div className="bg-[#FFF9F5] rounded-sm p-8 mt-20 max-w-2xl mx-auto border border-rosegold/10 text-center flex flex-col items-center">
            <p className="text-xs text-charcoal/80 max-w-lg mb-5 font-sans italic leading-relaxed font-light">
              "We take pride in keeping our packaging custom-designed. Your gift is packed using elegant wax seal stamps, chiffon silk ribbons, and premium floral wraps."
            </p>
            <a
              href="https://www.instagram.com/direct/t/18102416863828766/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-rosegold hover:bg-[#a15d68] text-white font-sans text-xs tracking-widest uppercase font-medium px-6 py-3 rounded-sm flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Instagram className="w-4 h-4" />
              <span>Let's Start Your DM Inquiry</span>
            </a>
          </div>

        </div>
      </section>

      {/* 7. Customer Reviews Section (Testimonials) */}
      <section id="testimonials" className="py-24 md:py-32 px-6 md:px-12 bg-[#FFF9F5] scroll-mt-10 border-b border-rosegold/10">
        <div className="max-w-6xl mx-auto">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-16">
            <div>
              <span className="text-xs font-semibold tracking-widest text-rosegold uppercase mb-2 block font-mono">
                Pure Experiences
              </span>
              <h2 className="font-display text-3xl md:text-4.5xl text-charcoal font-light tracking-tight">
                Customer Stories
              </h2>
            </div>
            <button
              onClick={() => setIsReviewOpen(true)}
              className="bg-white hover:bg-blush text-rosegold border border-rosegold/25 text-xs font-sans tracking-widest uppercase font-medium px-5 py-2.5 rounded-sm transition-colors cursor-pointer shadow-xs"
              id="write_testimonial_btn"
            >
              Write a Testimonial
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {reviews.map(rev => (
              <div 
                key={rev.id} 
                className="bg-white p-6 md:p-8 rounded-sm border border-rosegold/10 shadow-xs flex flex-col justify-between"
                id={`review_card_${rev.id}`}
              >
                <div>
                  {/* Rating Stars */}
                  <div className="flex text-amber-400 mb-4">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-4.5 h-4.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  {/* Comment */}
                  <p className="text-charcoal/80 text-xs md:text-sm leading-relaxed font-sans mb-6 italic">
                    "{rev.comment}"
                  </p>
                </div>

                {/* Customer Info row */}
                <div className="flex items-center gap-3.5 pt-4 border-t border-blush/10 mt-2">
                  {rev.imageUrl ? (
                    <img
                      src={rev.imageUrl}
                      alt={rev.customerName}
                      className="w-10 h-10 rounded-full object-cover border border-blush"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#FFF2F5] flex items-center justify-center font-display font-medium text-rosegold border border-blush">
                      {rev.customerName.charAt(0)}
                    </div>
                  )}
                  <div>
                    <span className="block font-display font-semibold text-charcoal text-xs md:text-sm">{rev.customerName}</span>
                    <span className="block text-[9px] text-rosegold uppercase font-semibold tracking-wider font-sans mt-0.5">Verified Instagram Buyer</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Instagram Lookbook Gallery Section */}
      <section id="gallery" className="py-24 md:py-32 px-6 md:px-12 bg-white border-b border-rosegold/10 scroll-mt-10">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-xl mx-auto mb-20">
            <span className="text-xs font-semibold tracking-widest text-rosegold uppercase mb-2 block font-mono">
              Pinterest & Lookbook Inspiration
            </span>
            <h2 className="font-display text-3xl md:text-4xl text-charcoal font-light tracking-tight mb-4">
              Daily Floral Inspiration
            </h2>
            <p className="text-charcoal/65 text-xs md:text-sm font-sans font-light leading-relaxed">
              Follow our aesthetic journey of ribbons, dried petals, calligraphy, and botanical hampers.
            </p>
            <a
              href="https://www.instagram.com/zayelle.gifts._/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-rosegold hover:text-rosegold-light tracking-widest font-sans mt-3 inline-block hover:underline uppercase"
            >
              @zayelle.gifts._
            </a>
          </div>

          {/* Gallery Posts Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {gallery.map(item => (
              <div 
                key={item.id} 
                className="group relative rounded-sm overflow-hidden aspect-square border border-rosegold/10 shadow-xs bg-[#FFF9F5]"
                id={`gallery_card_${item.id}`}
              >
                <img
                  src={item.imageUrl}
                  alt={item.title || "Instagram lookbook"}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                
                {/* Overlay details on hover */}
                <div className="absolute inset-0 bg-[#2B2B2B]/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 md:p-6 flex flex-col justify-between text-white z-10 pointer-events-none">
                  <div className="flex justify-between items-center text-[10px] tracking-widest font-mono">
                    <span>INSTAGRAM POST</span>
                    <Instagram className="w-4 h-4 text-blush" />
                  </div>
                  <div>
                    <p className="text-[10px] md:text-xs leading-relaxed font-sans mb-2 line-clamp-3 italic">
                      "{item.title || "Beautiful customizable gifting details."}"
                    </p>
                    <span className="text-[10px] text-blush font-semibold tracking-wider font-sans block">
                      ❤️ {item.likes} Likes
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <a
              href="https://www.instagram.com/zayelle.gifts._/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-rosegold hover:bg-[#a15d68] text-white font-sans text-xs tracking-widest uppercase font-semibold px-8 py-4 rounded-sm transition-all shadow-xs cursor-pointer"
            >
              <Instagram className="w-4.5 h-4.5" />
              <span>Explore More On Instagram</span>
            </a>
          </div>

        </div>
      </section>

      {/* 9. Final Contact CTA Section */}
      <section className="py-28 md:py-36 px-6 md:px-12 bg-gradient-to-b from-[#FFF9F5] to-[#FFEBF1]/50 text-center relative overflow-hidden">
        
        {/* Absolute design accents */}
        <div className="absolute -bottom-16 -left-16 opacity-10 pointer-events-none">
          <svg width="240" height="240" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="40" fill="#B76E79" />
          </svg>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto relative z-10"
        >
          <div className="w-10 h-10 bg-[#FFF2F5] rounded-full flex items-center justify-center mx-auto mb-6 border border-rosegold/20">
            <Heart className="w-5 h-5 text-rosegold fill-rosegold/10" />
          </div>

          <h2 className="font-display text-4xl sm:text-5xl text-charcoal font-light tracking-tight mb-4 leading-tight">
            Start Creating Your <br />
            <span className="italic font-normal text-rosegold font-display">Dream Gift Today</span>
          </h2>

          <p className="text-charcoal/70 text-sm md:text-base leading-relaxed mb-10 font-sans font-light max-w-lg mx-auto">
            Ready to design a completely bespoke rose preservation frame, customizable leather ledger, or a signature wax-sealed botanical basket? Send us a message on Instagram and let us bring your thoughts to life.
          </p>

          <a
            href="https://www.instagram.com/direct/t/18102416863828766/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-rosegold hover:bg-[#a15d68] text-white font-sans text-xs tracking-widest uppercase font-medium px-10 py-5 rounded-sm transition-all transform hover:-translate-y-0.5 shadow-md shadow-rosegold/10 cursor-pointer"
            id="final_cta_btn"
          >
            <Instagram className="w-5 h-5" />
            <span>Order Through Instagram DM</span>
          </a>

          <p className="text-[10px] uppercase tracking-widest text-charcoal/40 font-mono mt-6">
            * We respond within 1-2 hours and ship nationwide 🌸📦
          </p>
        </motion.div>
      </section>

      {/* 10. Luxury Editorial Footer */}
      <footer className="bg-charcoal text-[#FFF9F5]/90 py-16 px-6 md:px-12 border-t border-rosegold/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center gap-2 mb-3">
              <span className="font-display text-xl tracking-[0.2em] font-light">ZAYELLE GIFTS</span>
            </div>
            <p className="text-[11px] text-[#FFF9F5]/40 max-w-xs font-sans font-light leading-relaxed">
              Handcrafted customizable flower resin frames, vintage scrapbook journals, and luxury eternal rose hampers.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end text-center md:text-right">
            <div className="flex items-center gap-5 mb-4 text-[11px] tracking-widest uppercase font-medium font-sans text-[#FFF9F5]/80">
              <a href="https://www.instagram.com/zayelle.gifts._/" target="_blank" rel="noopener noreferrer" className="hover:text-blush transition-colors cursor-pointer">Instagram</a>
              <span className="text-[#FFF9F5]/20">|</span>
              <button 
                onClick={() => setIsAdminOpen(true)} 
                className="hover:text-blush transition-colors flex items-center gap-1 cursor-pointer font-sans"
                id="footer_admin_space"
              >
                <Lock className="w-3 h-3" />
                <span>Curator Space</span>
              </button>
            </div>
            <p className="text-[9px] text-[#FFF9F5]/30 font-mono tracking-widest">
              © {new Date().getFullYear()} Zayelle Gifts. Handcrafted in India.
            </p>
          </div>

        </div>
      </footer>

      {/* 11. Modals Overlay */}
      {/* Product Detail Popup */}
      <ProductModal 
        product={selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
      />

      {/* Submit Review modal */}
      <ReviewForm 
        isOpen={isReviewOpen} 
        onClose={() => setIsReviewOpen(false)} 
        onSuccess={fetchData} 
      />

      {/* Admin Panel dashboard */}
      <AdminPanel 
        isOpen={isAdminOpen} 
        onClose={() => setIsAdminOpen(false)} 
        onRefreshData={fetchData} 
      />

    </div>
  );
}
