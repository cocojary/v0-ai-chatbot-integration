export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory?: string;
  manufacturer: string;
  model: string;
  year?: number;
  condition: "new" | "used" | "refurbished";
  location: string;
  images: string[];
  specifications: Record<string, string>;
  sellerId: string;
  sellerName: string;
  createdAt: string;
  status: "available" | "negotiating" | "sold" | "reserved";
  views: number;
  favorites: number;
}

export interface Category {
  id: string;
  name: string;
  nameJa: string;
  icon: string;
  subcategories: { id: string; name: string; nameJa: string }[];
  productCount: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  company?: string;
  role: "buyer" | "seller" | "admin";
  phone?: string;
  address?: string;
  verified: boolean;
  createdAt: string;
}

export interface Negotiation {
  id: string;
  productId: string;
  productName: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  status: "pending" | "accepted" | "rejected" | "countered" | "completed";
  messages: NegotiationMessage[];
  initialOffer: number;
  currentOffer: number;
  createdAt: string;
  updatedAt: string;
}

export interface NegotiationMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  offer?: number;
  createdAt: string;
}

export interface Transaction {
  id: string;
  productId: string;
  productName: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  amount: number;
  status: "pending" | "processing" | "completed" | "cancelled";
  paymentMethod: string;
  shippingAddress: string;
  createdAt: string;
  completedAt?: string;
}

export interface SpecMatch {
  matched: string[];
  partial: string[];
  missing: string[];
  notMatched: string[];
}

export interface ProductMatch {
  product: Product;
  matchScore: number;
  matchTier: "best" | "close" | "alternative";
  specMatch: SpecMatch;
  reason: string;
}

export interface ExtractedSpec {
  type?: string;
  range?: { min: number; max: number; unit: string };
  accuracy?: string;
  brand?: string;
  priceMax?: number;
  condition?: string;
  keywords: string[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  products?: Product[];
  productMatches?: ProductMatch[];
  extractedSpec?: ExtractedSpec;
  timestamp: string;
}

// Wish/希望 - Product Request System
export interface WishCriteria {
  category?: string;
  subcategory?: string;
  keywords?: string[];
  brand?: string;
  model?: string;
  yearMin?: number;
  yearMax?: number;
  priceMin?: number;
  priceMax?: number;
  condition?: ("new" | "used" | "refurbished")[];
  location?: string;
}

export interface Wish {
  id: string;
  userId: string;
  userName: string;
  title: string;
  description?: string;
  criteria: WishCriteria;
  matchThreshold: number; // 0-100, minimum match score to trigger notification
  status: "active" | "paused" | "fulfilled" | "expired";
  emailNotification: boolean;
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
  matchCount: number;
  lastMatchAt?: string;
}

export interface WishMatch {
  id: string;
  wishId: string;
  productId: string;
  matchScore: number;
  matchDetails: {
    categoryMatch: boolean;
    keywordMatches: string[];
    brandMatch: boolean;
    modelMatch: boolean;
    yearInRange: boolean;
    priceInRange: boolean;
    conditionMatch: boolean;
  };
  notified: boolean;
  notifiedAt?: string;
  createdAt: string;
}

// Notification System
export interface Notification {
  id: string;
  userId: string;
  type: "wish_match" | "seller_potential_buyer" | "negotiation" | "transaction" | "system";
  title: string;
  message: string;
  data?: {
    wishId?: string;
    productId?: string;
    negotiationId?: string;
    transactionId?: string;
    matchScore?: number;
    potentialBuyerCount?: number;
  };
  read: boolean;
  createdAt: string;
}

// Product-Wish Match for Sellers
export interface ProductWishMatch {
  id: string;
  productId: string;
  wishId: string;
  wishTitle: string;
  wishUserId: string;
  wishUserName: string;
  matchScore: number;
  matchDetails: WishMatch["matchDetails"];
  contacted: boolean;
  createdAt: string;
}
