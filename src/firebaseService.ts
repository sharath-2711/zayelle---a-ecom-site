import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  addDoc,
  deleteDoc, 
  updateDoc, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { db } from './firebase';
import { Product, Review, GalleryItem } from './types';
import { defaultProducts, defaultReviews, defaultGallery } from './defaultData';

// Collection references
const PRODUCTS_COLL = 'products';
const REVIEWS_COLL = 'reviews';
const GALLERY_COLL = 'gallery';

// Helper to fetch products
export async function getProducts(): Promise<Product[]> {
  try {
    const q = query(collection(db, PRODUCTS_COLL), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      return defaultProducts;
    }
    const products: Product[] = [];
    snapshot.forEach(doc => {
      products.push({ id: doc.id, ...doc.data() } as Product);
    });
    return products;
  } catch (error) {
    console.warn("Failed to fetch products from Firestore, using offline defaults:", error);
    return defaultProducts;
  }
}

// Helper to save or update a product (requires admin)
export async function saveProduct(product: Omit<Product, 'id' | 'createdAt'> & { id?: string; createdAt?: string }): Promise<string> {
  const id = product.id || `prod_${Date.now()}`;
  const docRef = doc(db, PRODUCTS_COLL, id);
  const data = {
    ...product,
    id,
    createdAt: product.createdAt || new Date().toISOString()
  };
  await setDoc(docRef, data);
  return id;
}

// Helper to delete a product (requires admin)
export async function deleteProduct(id: string): Promise<void> {
  await deleteDoc(doc(db, PRODUCTS_COLL, id));
}

// Helper to fetch reviews
export async function getApprovedReviews(): Promise<Review[]> {
  try {
    const q = query(collection(db, REVIEWS_COLL), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const reviews: Review[] = [];
    snapshot.forEach(doc => {
      const data = doc.data() as Review;
      if (data.isApproved) {
        reviews.push({ id: doc.id, ...data });
      }
    });
    if (reviews.length === 0) {
      return defaultReviews;
    }
    return reviews;
  } catch (error) {
    console.warn("Failed to fetch reviews, using offline defaults:", error);
    return defaultReviews;
  }
}

// Helper to fetch ALL reviews (approved & pending) for admin dashboard
export async function getAllReviews(): Promise<Review[]> {
  try {
    const q = query(collection(db, REVIEWS_COLL), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      return defaultReviews;
    }
    const reviews: Review[] = [];
    snapshot.forEach(doc => {
      reviews.push({ id: doc.id, ...doc.data() } as Review);
    });
    return reviews;
  } catch (error) {
    console.warn("Failed to fetch all reviews, using offline defaults:", error);
    return defaultReviews;
  }
}

// Helper to submit a review (public)
export async function submitReview(review: Omit<Review, 'id' | 'isApproved' | 'createdAt'>): Promise<string> {
  const collectionRef = collection(db, REVIEWS_COLL);
  const data = {
    ...review,
    isApproved: false, // requires admin approval
    createdAt: new Date().toISOString()
  };
  const docRef = await addDoc(collectionRef, data);
  return docRef.id;
}

// Helper to approve/toggle a review (requires admin)
export async function setReviewApproval(id: string, isApproved: boolean): Promise<void> {
  const docRef = doc(db, REVIEWS_COLL, id);
  await updateDoc(docRef, { isApproved });
}

// Helper to delete a review (requires admin)
export async function deleteReview(id: string): Promise<void> {
  await deleteDoc(doc(db, REVIEWS_COLL, id));
}

// Helper to fetch gallery items
export async function getGalleryItems(): Promise<GalleryItem[]> {
  try {
    const q = query(collection(db, GALLERY_COLL), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      return defaultGallery;
    }
    const items: GalleryItem[] = [];
    snapshot.forEach(doc => {
      items.push({ id: doc.id, ...doc.data() } as GalleryItem);
    });
    return items;
  } catch (error) {
    console.warn("Failed to fetch gallery, using offline defaults:", error);
    return defaultGallery;
  }
}

// Helper to save a gallery item (requires admin)
export async function saveGalleryItem(item: Omit<GalleryItem, 'id' | 'createdAt'> & { id?: string; createdAt?: string }): Promise<string> {
  const id = item.id || `gal_${Date.now()}`;
  const docRef = doc(db, GALLERY_COLL, id);
  const data = {
    ...item,
    id,
    createdAt: item.createdAt || new Date().toISOString()
  };
  await setDoc(docRef, data);
  return id;
}

// Helper to delete a gallery item (requires admin)
export async function deleteGalleryItem(id: string): Promise<void> {
  await deleteDoc(doc(db, GALLERY_COLL, id));
}

// Self-seeding capability for administrative testing
export async function seedAllDefaults(): Promise<void> {
  try {
    console.log("Seeding default data...");
    for (const prod of defaultProducts) {
      await saveProduct(prod);
    }
    for (const rev of defaultReviews) {
      const docRef = doc(db, REVIEWS_COLL, rev.id);
      await setDoc(docRef, rev);
    }
    for (const gal of defaultGallery) {
      await saveGalleryItem(gal);
    }
    console.log("Successfully seeded defaults to Firestore.");
  } catch (error) {
    console.error("Failed to seed default data to Firestore. Ensure you are logged in as admin:", error);
    throw error;
  }
}
