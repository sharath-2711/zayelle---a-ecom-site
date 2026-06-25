import { Product, Review, GalleryItem } from './types';

export const defaultProducts: Product[] = [
  {
    id: "prod_1",
    name: "Luxury Eternal Rose Gift Box",
    description: "An elegant, velvet-lined gift box featuring preserved eternal roses, a personalized greeting card, and space for a custom piece of jewelry or keepsake.",
    startingPrice: 1299,
    imageUrl: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=600",
    customizationOptions: "Box Color (Blush, Ivory, Onyx), Initial Monogramming, Personal Letter Inscription, Preserved Flower Colors.",
    examples: "Customized for Rhea's 25th birthday with standard pink preserved roses, a gold-embossed 'R' monogram, and a hand-written poem inside.",
    createdAt: new Date().toISOString()
  },
  {
    id: "prod_2",
    name: "Preserved Botanical Resin Frame",
    description: "A premium glass-like resin frame containing hand-pressed seasonal flowers, gold leaf flakes, and a personalized name or quote in elegant calligraphy.",
    startingPrice: 899,
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600",
    customizationOptions: "Flower Theme (Wildflower, Golden Sunflower, Pastel Peony), Calligraphy Style (Script, Minimalist), Metallic Flakes (Gold, Rose Gold, Silver).",
    examples: "Preserved wedding bouquet petals with the couple's wedding date '12.10.2025' in rose gold calligraphy.",
    createdAt: new Date().toISOString()
  },
  {
    id: "prod_3",
    name: "Handcrafted Memories Scrapbook",
    description: "A beautifully bound scrapbook featuring 15 custom-designed layouts, interactive envelopes, pull-out message cards, and gorgeous floral accents.",
    startingPrice: 1599,
    imageUrl: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?q=80&w=600",
    customizationOptions: "Page Count (15 to 30), Theme (Anniversary, Travel, Best Friends), Cover Typography (Gold Foil Embossing), Ribbon Style.",
    examples: "Created as an anniversary gift with 30 high-quality polaroid photos, custom retro lettering, and pocket letters.",
    createdAt: new Date().toISOString()
  },
  {
    id: "prod_4",
    name: "Premium Dried Flower Hamper",
    description: "A luxury woven basket adorned with dry pampas grass, lavender, and bunny tails, complete with a customized soy candle and organic hand-poured soaps.",
    startingPrice: 1899,
    imageUrl: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?q=80&w=600",
    customizationOptions: "Hamper Size (Medium, Royal Luxe), Candle Scent (Warm Vanilla, English Lavender), Soap Text Engraving, Custom Tag.",
    examples: "A corporate congratulations hamper featuring custom tag 'With Love, Team Alpha' and gold-accented lavender candles.",
    createdAt: new Date().toISOString()
  },
  {
    id: "prod_5",
    name: "Custom Calligraphy Wood Board",
    description: "A rustic yet refined dark walnut wooden plank with elegant hand-painted modern calligraphy quotes, sealed with a glossy waterproof lacquer finish.",
    startingPrice: 699,
    imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=600",
    customizationOptions: "Wood Stain (Teak, Natural Oak, Dark Walnut), Quote text (up to 12 words), Hanging hardware (Chiffon Ribbon, Brass Hook).",
    examples: "'Home Sweet Home' painted in white script calligraphy with dynamic gold-leaf borders.",
    createdAt: new Date().toISOString()
  },
  {
    id: "prod_6",
    name: "Engraved Wooden Photo Plaque",
    description: "High-definition laser engraving of your favorite photograph on premium imported beechwood, with a matching wooden display stand.",
    startingPrice: 599,
    imageUrl: "https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=600",
    customizationOptions: "Plaque Dimensions (A5, A4), Custom Backside Message Engraving, Portrait or Landscape Orientation.",
    examples: "A golden wedding anniversary portrait engraved with the inscription '50 Years of Togetherness' at the base.",
    createdAt: new Date().toISOString()
  },
  {
    id: "prod_7",
    name: "Monogram Leather Journal & Pen Set",
    description: "A full-grain vegan leather notebook with refillable pages, paired with a matching golden-accented metal rollerball pen. Includes standard initial embossing.",
    startingPrice: 999,
    imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=600",
    customizationOptions: "Leather Color (Tan, Emerald, Rose Quartz), Embossing Finish (Gold Foil, Rose Gold Foil, Blind Deboss), Monogram (Up to 3 Letters).",
    examples: "Rose Quartz leather journal with 'A.K.' embossed in premium Rose Gold Foil, packed in a customized dust bag.",
    createdAt: new Date().toISOString()
  },
  {
    id: "prod_8",
    name: "Pressed-Flower Resin Keychain",
    description: "A durable, crystal-clear resin monogram letter keychain preserving hand-picked real flowers and gorgeous sparkling metal flakes.",
    startingPrice: 299,
    imageUrl: "https://images.unsplash.com/photo-1622737133809-d95047b9e673?q=80&w=600",
    customizationOptions: "Initial Letter (A-Z), Flower Accent (Blush Rose, Baby's Breath, Blue Hydrangea), Tassel Accent Color.",
    examples: "Letter 'M' with real Baby's Breath petals, gold flakes, and a matching soft pink silk tassel.",
    createdAt: new Date().toISOString()
  },
  {
    id: "prod_9",
    name: "Golden Trim Customized Mug",
    description: "A premium ceramic matte-finished coffee mug featuring a hand-painted 24k gold-rimmed handle and your custom quote or name written on it.",
    startingPrice: 499,
    imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600",
    customizationOptions: "Mug Outer Color (Warm Cream, Sage Green, Lilac), Font Style (Elegant Cursive, Classic Block), Quote Text.",
    examples: "Sage Green mug with 'Warmth & Peace' written on one side and a delicate golden branch on the other.",
    createdAt: new Date().toISOString()
  },
  {
    id: "prod_10",
    name: "Scented Soy Candle Gift Trio",
    description: "A gorgeous set of three premium hand-poured soy wax candles in ceramic pots, decorated with dry rosebuds and customized label titles.",
    startingPrice: 799,
    imageUrl: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=600",
    customizationOptions: "Scent Combination (Vanilla Bean, Sandalwood, Rose Petals), Pot Paint Colors, Custom Label Typography & Messages.",
    examples: "A 'Bridesmaid Proposal' set of 3 with custom labels reading 'Will You Be My Bridesmaid?' in script lettering.",
    createdAt: new Date().toISOString()
  }
];

export const defaultReviews: Review[] = [
  {
    id: "rev_1",
    customerName: "Aishwarya Sen",
    rating: 5,
    comment: "I ordered the Preserved Botanical Resin Frame for my sister's wedding. It was absolutely gorgeous, and she was in tears! The craftsmanship is top-notch. Zayelle Gifts made the entire customization process so seamless on Instagram.",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200",
    isApproved: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "rev_2",
    customerName: "Kabir Malhotra",
    rating: 5,
    comment: "Excellent experience. The Monogram Leather Journal is beautifully made, very high quality. Discussing details on Instagram DM felt very personal and premium. Highly recommended!",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200",
    isApproved: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "rev_3",
    customerName: "Mira Nair",
    rating: 5,
    comment: "The Luxury Eternal Rose Gift Box is a masterclass in elegant gifting. The roses smell so fresh even after weeks! Zayelle's customer service via DMs is exceptionally polite and professional.",
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200",
    isApproved: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "rev_4",
    customerName: "Rohan Das",
    rating: 5,
    comment: "Ordered the Pressed-Flower Resin Keychains in bulk for bridesmaids proposal. They are beautiful, unique, and so sturdy. Love the minimalist floral aesthetic!",
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200",
    isApproved: true,
    createdAt: new Date().toISOString()
  }
];

export const defaultGallery: GalleryItem[] = [
  {
    id: "gal_1",
    title: "Hand-packaging our Luxury Eternal Rose Gift Boxes today 🌸✨ Every detail is crafted with utmost love and care.",
    imageUrl: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=400",
    likes: 124,
    createdAt: new Date().toISOString()
  },
  {
    id: "gal_2",
    title: "A beautiful Botanical Frame customized with real rosebuds & gold leaf accents. DM to lock your dates!",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400",
    likes: 245,
    createdAt: new Date().toISOString()
  },
  {
    id: "gal_3",
    title: "Pouring hand-crafted soy candles for our upcoming Botanical hampers. Pure relaxation in a jar. 🕯️✨",
    imageUrl: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=400",
    likes: 189,
    createdAt: new Date().toISOString()
  },
  {
    id: "gal_4",
    title: "A look inside Rhea's anniversary Scrapbook Album. Filled with gold calligraphy & lovely memories. 📖💕",
    imageUrl: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?q=80&w=400",
    likes: 312,
    createdAt: new Date().toISOString()
  },
  {
    id: "gal_5",
    title: "Sage Green & matte gold ceramic monogram coffee mugs ready to ship. Make your morning cup of coffee special. ☕",
    imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=400",
    likes: 156,
    createdAt: new Date().toISOString()
  },
  {
    id: "gal_6",
    title: "Elegant dried wildflower gift hamper basket. Lavender, vanilla soy candles, and custom tag notes. 🌾🌸",
    imageUrl: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?q=80&w=400",
    likes: 423,
    createdAt: new Date().toISOString()
  }
];
