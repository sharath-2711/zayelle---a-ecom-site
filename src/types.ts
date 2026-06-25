export interface Product {
  id: string;
  name: string;
  description: string;
  startingPrice: number;
  imageUrl: string;
  customizationOptions: string;
  examples: string;
  createdAt: string;
}

export interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  imageUrl?: string;
  isApproved: boolean;
  createdAt: string;
}

export interface GalleryItem {
  id: string;
  title?: string;
  imageUrl: string;
  likes: number;
  createdAt: string;
}
