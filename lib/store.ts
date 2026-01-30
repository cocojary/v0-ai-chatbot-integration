"use client";

import { create } from "zustand";
import type { User, Product, Negotiation, Transaction, ChatMessage, Wish, WishMatch, Notification, ProductWishMatch } from "./types";
import { products as mockProducts, mockNegotiations, mockTransactions, mockWishes, mockWishMatches, mockNotifications, mockProductWishMatches } from "./mock-data";
import { findMatchingWishes, createMatchNotification, deduplicateMatches, shouldNotify, findPotentialBuyers, createSellerNotification } from "./wish-matching";

interface AppState {
  // Auth
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;

  // Products
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;

  // Cart/Favorites
  favorites: string[];
  toggleFavorite: (productId: string) => void;

  // Negotiations
  negotiations: Negotiation[];
  addNegotiation: (negotiation: Negotiation) => void;
  updateNegotiation: (id: string, updates: Partial<Negotiation>) => void;

  // Transactions
  transactions: Transaction[];
  addTransaction: (transaction: Transaction) => void;

  // Chat
  chatMessages: ChatMessage[];
  addChatMessage: (message: ChatMessage) => void;
  clearChatMessages: () => void;
  clearChat: () => void;

  // Search Results (for AI Spec Finder detail page)
  lastSearchQuery: string | null;
  lastSearchResults: import("./types").ProductMatch[] | null;
  setLastSearchResults: (query: string, results: import("./types").ProductMatch[]) => void;
  clearLastSearchResults: () => void;

  // Wishes
  wishes: Wish[];
  wishMatches: WishMatch[];
  addWish: (wish: Wish) => void;
  updateWish: (id: string, updates: Partial<Wish>) => void;
  deleteWish: (id: string) => void;
  addWishMatch: (match: WishMatch) => void;

  // Notifications
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  getUnreadCount: () => number;

  // Product-Wish Matches (for sellers)
  productWishMatches: ProductWishMatch[];
  addProductWishMatches: (matches: ProductWishMatch[]) => void;
  markProductWishContacted: (matchId: string) => void;
  getProductPotentialBuyers: (productId: string) => ProductWishMatch[];

  // Matching
  checkWishMatches: (product: Product) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Auth - Default to seller-001 for demo
  currentUser: {
    id: "seller-001",
    name: "東京機械商事",
    email: "info@tokyo-kikai.co.jp",
    avatar: "/avatars/seller-001.jpg",
    role: "seller",
  },
  setCurrentUser: (user) => set({ currentUser: user }),

  // Products
  products: mockProducts,
  addProduct: (product) => {
    set((state) => ({ products: [...state.products, product] }));
    // Check for wish matches when a new product is added
    useAppStore.getState().checkWishMatches(product);
  },
  updateProduct: (id, updates) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    })),

  // Favorites - Default favorites for demo
  favorites: ["prod-001", "prod-003", "prod-007"],
  toggleFavorite: (productId) =>
    set((state) => ({
      favorites: state.favorites.includes(productId)
        ? state.favorites.filter((id) => id !== productId)
        : [...state.favorites, productId],
    })),

  // Negotiations
  negotiations: mockNegotiations,
  addNegotiation: (negotiation) =>
    set((state) => ({ negotiations: [...state.negotiations, negotiation] })),
  updateNegotiation: (id, updates) =>
    set((state) => ({
      negotiations: state.negotiations.map((n) =>
        n.id === id ? { ...n, ...updates } : n
      ),
    })),

  // Transactions
  transactions: mockTransactions,
  addTransaction: (transaction) =>
    set((state) => ({ transactions: [...state.transactions, transaction] })),

  // Chat
  chatMessages: [],
  addChatMessage: (message) =>
    set((state) => ({ chatMessages: [...state.chatMessages, message] })),
  clearChatMessages: () => set({ chatMessages: [] }),
  clearChat: () => set({ chatMessages: [] }),

  // Search Results
  lastSearchQuery: null,
  lastSearchResults: null,
  setLastSearchResults: (query, results) =>
    set({ lastSearchQuery: query, lastSearchResults: results }),
  clearLastSearchResults: () =>
    set({ lastSearchQuery: null, lastSearchResults: null }),

  // Wishes
  wishes: mockWishes,
  wishMatches: mockWishMatches,
  addWish: (wish) =>
    set((state) => ({ wishes: [...state.wishes, wish] })),
  updateWish: (id, updates) =>
    set((state) => ({
      wishes: state.wishes.map((w) =>
        w.id === id ? { ...w, ...updates, updatedAt: new Date().toISOString() } : w
      ),
    })),
  deleteWish: (id) =>
    set((state) => ({
      wishes: state.wishes.filter((w) => w.id !== id),
      wishMatches: state.wishMatches.filter((m) => m.wishId !== id),
    })),
  addWishMatch: (match) =>
    set((state) => ({ wishMatches: [...state.wishMatches, match] })),

  // Notifications
  notifications: mockNotifications,
  addNotification: (notification) =>
    set((state) => ({ notifications: [notification, ...state.notifications] })),
  markNotificationRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),
  markAllNotificationsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    })),
  getUnreadCount: () => {
    const state = useAppStore.getState();
    return state.notifications.filter((n) => !n.read).length;
  },

  // Product-Wish Matches (for sellers)
  productWishMatches: mockProductWishMatches,
  addProductWishMatches: (matches) =>
    set((state) => ({ productWishMatches: [...state.productWishMatches, ...matches] })),
  markProductWishContacted: (matchId) =>
    set((state) => ({
      productWishMatches: state.productWishMatches.map((m) =>
        m.id === matchId ? { ...m, contacted: true } : m
      ),
    })),
  getProductPotentialBuyers: (productId) => {
    const state = useAppStore.getState();
    return state.productWishMatches.filter((m) => m.productId === productId);
  },

  // Matching - check if new product matches any wishes
  checkWishMatches: (product) =>
    set((state) => {
      // Find all matching wishes (for buyers)
      const newMatches = findMatchingWishes(product, state.wishes);
      
      // Deduplicate against existing matches
      const uniqueMatches = deduplicateMatches(newMatches, state.wishMatches);
      
      // Create notifications for unique matches (notify buyers)
      const newNotifications: Notification[] = [];
      const updatedWishes = [...state.wishes];
      
      for (const match of uniqueMatches) {
        const wish = state.wishes.find((w) => w.id === match.wishId);
        if (!wish) continue;
        
        // Check rate limit
        if (!shouldNotify(wish.userId, state.notifications)) continue;
        
        // Create notification for buyer
        const notification = createMatchNotification(wish, product, match.matchScore);
        newNotifications.push(notification);
        
        // Mark match as notified
        match.notified = true;
        match.notifiedAt = new Date().toISOString();
        
        // Update wish match count
        const wishIndex = updatedWishes.findIndex((w) => w.id === wish.id);
        if (wishIndex !== -1) {
          updatedWishes[wishIndex] = {
            ...updatedWishes[wishIndex],
            matchCount: updatedWishes[wishIndex].matchCount + 1,
            lastMatchAt: new Date().toISOString(),
          };
        }
      }
      
      // Find potential buyers for seller
      const potentialBuyers = findPotentialBuyers(product, state.wishes);
      
      // Notify seller if there are potential buyers
      if (potentialBuyers.length > 0) {
        const sellerNotification = createSellerNotification(product, potentialBuyers.length);
        newNotifications.push(sellerNotification);
      }
      
      return {
        wishMatches: [...state.wishMatches, ...uniqueMatches],
        productWishMatches: [...state.productWishMatches, ...potentialBuyers],
        notifications: [...newNotifications, ...state.notifications],
        wishes: updatedWishes,
      };
    }),
}));
