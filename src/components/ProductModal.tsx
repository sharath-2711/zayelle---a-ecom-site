import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Instagram, Sparkles, Heart, Copy, Check, MessageSquare, HelpCircle, Palette } from 'lucide-react';
import { Product } from '../types';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  if (!product) return null;

  // Personalization form state
  const [customerName, setCustomerName] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [chosenColor, setChosenColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [copied, setCopied] = useState(false);

  // Fallbacks to match prompt's example order summary
  const displayName = customerName.trim() || 'Priya';
  const displayMessage = customMessage.trim() || 'Happy Birthday ❤️';
  const displayColor = chosenColor.trim() || 'Pink';

  // Construct the formatted order summary text
  const getOrderSummaryText = () => {
    return `Product: ${product.name}
Name: ${displayName}
Custom Message: ${displayMessage}
Color: ${displayColor}
Quantity: ${quantity}`;
  };

  const handleCopy = () => {
    const text = getOrderSummaryText();
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
      console.error("Failed to copy text: ", err);
    });
  };

  const handleButtonClick = (buttonName: string) => {
    // 1. Copy the summary details to clipboard
    handleCopy();
    
    // 2. Open Instagram direct message thread in a new window/tab
    window.open("https://www.instagram.com/direct/t/18102416863828766/", "_blank");
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2B2B2B]/60 backdrop-blur-xs">
        {/* Modal Backdrop click closes the modal */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0"
          onClick={onClose}
        />

        {/* Modal Content container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 15 }}
          transition={{ duration: 0.4 }}
          className="relative w-full max-w-4xl bg-white rounded-sm overflow-hidden shadow-2xl border border-rosegold/20 z-10 flex flex-col md:flex-row max-h-[92vh]"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 bg-white hover:bg-blush text-charcoal p-2 rounded-sm transition-colors border border-rosegold/15 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left: Beautiful Product Image */}
          <div className="w-full md:w-1/2 relative bg-[#FFF9F5]/40 h-64 md:h-auto overflow-hidden flex items-center justify-center">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-4 left-4 bg-rosegold text-white text-[10px] tracking-widest uppercase px-3 py-1.5 rounded-sm font-semibold">
              Handcrafted
            </div>
          </div>

          {/* Right: Detailed Info */}
          <div className="w-full md:w-1/2 p-6 md:p-8 overflow-y-auto flex flex-col justify-between bg-white">
            <div className="space-y-6">
              {/* Product Title */}
              <div>
                <h2 className="font-display text-2xl md:text-3xl text-charcoal mb-1.5 font-medium tracking-tight italic">
                  {product.name}
                </h2>

                {/* Price */}
                <div className="text-lg font-sans font-semibold text-rosegold">
                  Starting From <span className="text-xl">₹{product.startingPrice}</span>
                </div>
              </div>

              {/* Line Divider */}
              <div className="h-[1px] bg-rosegold/10 w-full" />

              {/* Description */}
              <p className="text-charcoal/80 text-xs md:text-sm leading-relaxed font-sans font-light">
                {product.description}
              </p>

              {/* Customization Options Info Box */}
              <div>
                <h3 className="text-[11px] font-semibold tracking-widest text-rosegold uppercase mb-2 flex items-center gap-1.5 font-sans">
                  <Sparkles className="w-3.5 h-3.5" />
                  Customization Choices
                </h3>
                <div className="bg-[#FFF9F5] rounded-sm p-4 border border-rosegold/10">
                  <p className="text-charcoal/80 text-xs leading-relaxed font-sans font-light">
                    {product.customizationOptions || "Fully customizable. Mention your preferred colors, custom messages, names, and patterns."}
                  </p>
                </div>
              </div>

              {/* Personalization Fields (Form) */}
              <div className="border-t border-rosegold/10 pt-4 space-y-4">
                <h3 className="text-[11px] font-semibold tracking-widest text-rosegold uppercase mb-1 flex items-center gap-1.5 font-sans">
                  <Palette className="w-3.5 h-3.5" />
                  Configure Your Gift
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-charcoal/60 font-semibold mb-1">
                      Recipient Name
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Priya"
                      className="w-full bg-[#FFF9F5]/65 border border-rosegold/20 rounded-sm px-3 py-2 text-xs text-charcoal placeholder:text-charcoal/30 focus:border-rosegold focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-charcoal/60 font-semibold mb-1">
                      Preferred Color
                    </label>
                    <input
                      type="text"
                      value={chosenColor}
                      onChange={(e) => setChosenColor(e.target.value)}
                      placeholder="e.g. Pink"
                      className="w-full bg-[#FFF9F5]/65 border border-rosegold/20 rounded-sm px-3 py-2 text-xs text-charcoal placeholder:text-charcoal/30 focus:border-rosegold focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] uppercase tracking-wider text-charcoal/60 font-semibold mb-1">
                      Custom Message
                    </label>
                    <input
                      type="text"
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      placeholder="e.g. Happy Birthday ❤️"
                      className="w-full bg-[#FFF9F5]/65 border border-rosegold/20 rounded-sm px-3 py-2 text-xs text-charcoal placeholder:text-charcoal/30 focus:border-rosegold focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-charcoal/60 font-semibold mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full bg-[#FFF9F5]/65 border border-rosegold/20 rounded-sm px-3 py-2 text-xs text-charcoal focus:border-rosegold focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Dynamic Copyable Order Summary Box */}
              <div className="border-t border-rosegold/10 pt-4">
                <div className="flex justify-between items-center mb-2.5">
                  <h3 className="text-[11px] font-semibold tracking-widest text-rosegold uppercase flex items-center gap-1.5 font-sans">
                    <Heart className="w-3.5 h-3.5" />
                    Order Summary Details
                  </h3>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 bg-white border border-rosegold/20 hover:bg-blush hover:text-rosegold text-charcoal/70 py-1.5 px-3 rounded-sm text-[10px] tracking-wider uppercase font-semibold transition-all cursor-pointer shadow-2xs"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5 text-rosegold" />}
                    <span>{copied ? "Copied!" : "Copy Order Details"}</span>
                  </button>
                </div>

                <div className="bg-[#FFF9F5]/90 border border-rosegold/15 rounded-sm p-4 relative font-mono text-xs text-charcoal/90 whitespace-pre-wrap leading-relaxed">
                  {getOrderSummaryText()}
                </div>
                
                <p className="text-[10px] text-charcoal/50 italic mt-1.5 leading-normal">
                  💡 We encourage you to copy these details and paste them into our Instagram DM for quick processing!
                </p>
              </div>
            </div>

            {/* Bottom Actions section */}
            <div className="mt-8 pt-6 border-t border-rosegold/10 space-y-4">
              {/* Primary Order Button */}
              <button
                onClick={() => handleButtonClick('Order via Instagram DM')}
                className="w-full bg-rosegold hover:bg-[#a15d68] text-white font-sans py-3.5 px-6 rounded-sm flex items-center justify-center gap-2.5 transition-all text-xs tracking-widest uppercase font-semibold cursor-pointer shadow-xs"
              >
                <Instagram className="w-4.5 h-4.5" />
                <span>Order via Instagram DM</span>
              </button>

              {/* Secondary Buttons Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => handleButtonClick('Contact Us on Instagram')}
                  className="w-full border border-rosegold text-rosegold bg-white hover:bg-blush/30 font-sans py-3 px-4 rounded-sm flex items-center justify-center gap-2 transition-all text-xs tracking-widest uppercase font-semibold cursor-pointer"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>Contact Us on Instagram</span>
                </button>

                <button
                  onClick={() => handleButtonClick('Request Custom Design')}
                  className="w-full border border-rosegold text-rosegold bg-white hover:bg-blush/30 font-sans py-3 px-4 rounded-sm flex items-center justify-center gap-2 transition-all text-xs tracking-widest uppercase font-semibold cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Request Custom Design</span>
                </button>
              </div>

              {/* Tiny Instruction Alert */}
              <p className="text-[9px] text-charcoal/40 text-center uppercase tracking-widest">
                * Click any button to copy order details and open Instagram
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
