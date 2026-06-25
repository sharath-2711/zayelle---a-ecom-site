import React, { useState, useRef } from 'react';
import { X, Star, Upload, Sparkles, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { submitReview } from '../firebaseService';

interface ReviewFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ReviewForm({ isOpen, onClose, onSuccess }: ReviewFormProps) {
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [image, setImage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Compressor utility
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError('Please select an image smaller than 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.src = reader.result as string;
      img.onload = () => {
        // Create canvas to resize/compress image
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 300;
        const MAX_HEIGHT = 300;
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
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7); // compress at 70% quality
          setImage(compressedBase64);
          setError('');
        }
      };
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) {
      setError('Please fill in your name and review text.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await submitReview({
        customerName: name,
        rating,
        comment,
        imageUrl: image || undefined
      });
      setIsSubmitted(true);
      setTimeout(() => {
        onSuccess();
        onClose();
        // Reset
        setName('');
        setRating(5);
        setComment('');
        setImage('');
        setIsSubmitted(false);
      }, 3500);
    } catch (err) {
      console.error(err);
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2B2B2B]/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-md bg-ivory rounded-2xl p-6 md:p-8 overflow-hidden shadow-2xl border border-blush/30 z-10"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white hover:bg-blush text-charcoal p-1.5 rounded-full transition-colors border border-blush/10 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {isSubmitted ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 bg-[#FFF2F5] rounded-full flex items-center justify-center mx-auto mb-4 border border-blush">
                <Check className="w-8 h-8 text-rosegold" />
              </div>
              <h3 className="font-display text-2xl text-charcoal mb-2 font-medium">Thank You, {name}!</h3>
              <p className="text-charcoal/70 text-sm font-sans leading-relaxed">
                Your heartful review has been submitted. It will display on our luxury gallery once approved by our boutique curators! 🌸
              </p>
            </motion.div>
          ) : (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-rosegold" />
                <h3 className="font-display text-2xl text-charcoal font-medium">Write a Review</h3>
              </div>
              <p className="text-charcoal/70 text-xs mb-6 font-sans">
                Tell others about your beautiful customized gifts and Instagram shopping experience.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold tracking-widest text-rosegold uppercase mb-1.5 font-sans">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Priyanjali Sen"
                    className="w-full bg-white border border-blush/40 rounded-xl px-4 py-2.5 text-sm text-charcoal focus:outline-hidden focus:ring-1 focus:ring-rosegold font-sans"
                  />
                </div>

                {/* Stars */}
                <div>
                  <label className="block text-xs font-semibold tracking-widest text-rosegold uppercase mb-1.5 font-sans">
                    Rating
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="text-2xl transition-transform hover:scale-110 cursor-pointer"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            star <= rating ? 'fill-rosegold text-rosegold' : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-xs font-semibold tracking-widest text-rosegold uppercase mb-1.5 font-sans">
                    Your Testimonial
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="How was the gift? Tell us about the flowers, resin, ribbon packaging, and our Instagram service..."
                    className="w-full bg-white border border-blush/40 rounded-xl px-4 py-2.5 text-sm text-charcoal focus:outline-hidden focus:ring-1 focus:ring-rosegold font-sans resize-none"
                  />
                </div>

                {/* Optional Image */}
                <div>
                  <label className="block text-xs font-semibold tracking-widest text-rosegold uppercase mb-1.5 font-sans">
                    Product Photo (Optional)
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-white hover:bg-blush/25 border border-dashed border-rosegold/30 hover:border-rosegold text-charcoal/80 rounded-xl p-3 flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors w-24 h-24 text-center"
                    >
                      <Upload className="w-5 h-5 text-rosegold" />
                      <span className="text-[10px] font-sans font-medium">Upload</span>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />

                    {image ? (
                      <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-blush">
                        <img
                          src={image}
                          alt="Review attachment preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setImage('')}
                          className="absolute top-1 right-1 bg-charcoal/70 text-white rounded-full p-1 hover:bg-charcoal"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-charcoal/50 font-sans italic">
                        Share a snapshot of your customized gift box or card.
                      </span>
                    )}
                  </div>
                </div>

                {error && <p className="text-red-500 text-xs font-sans font-medium">{error}</p>}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-rosegold hover:bg-rosegold-light text-white font-sans font-medium py-3 rounded-xl transition-colors mt-2 text-sm shadow-md shadow-rosegold/5 disabled:opacity-55 cursor-pointer"
                >
                  {isSubmitting ? 'Submitting Testimonial...' : 'Submit to Curators'}
                </button>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
