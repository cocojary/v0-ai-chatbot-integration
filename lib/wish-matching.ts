import type { Product, Wish, WishMatch, WishCriteria, Notification, ProductWishMatch } from "./types";

interface MatchResult {
  matchScore: number;
  matchDetails: WishMatch["matchDetails"];
}

/**
 * Calculate how well a product matches a wish criteria
 * Returns a score from 0-100 and detailed match information
 */
export function calculateMatch(product: Product, criteria: WishCriteria): MatchResult {
  const weights = {
    category: 25,
    keywords: 20,
    brand: 15,
    model: 10,
    year: 10,
    price: 15,
    condition: 5,
  };

  let totalScore = 0;
  const matchDetails: WishMatch["matchDetails"] = {
    categoryMatch: false,
    keywordMatches: [],
    brandMatch: false,
    modelMatch: false,
    yearInRange: false,
    priceInRange: false,
    conditionMatch: false,
  };

  // Category matching
  if (criteria.category) {
    if (product.category === criteria.category) {
      matchDetails.categoryMatch = true;
      totalScore += weights.category;
      
      // Bonus for subcategory match
      if (criteria.subcategory && product.subcategory === criteria.subcategory) {
        totalScore += 5;
      }
    }
  } else {
    // No category criteria, give full points
    totalScore += weights.category;
    matchDetails.categoryMatch = true;
  }

  // Keyword matching
  if (criteria.keywords && criteria.keywords.length > 0) {
    const searchText = `${product.name} ${product.description} ${product.manufacturer} ${product.model}`.toLowerCase();
    const matchedKeywords: string[] = [];
    
    for (const keyword of criteria.keywords) {
      if (searchText.includes(keyword.toLowerCase())) {
        matchedKeywords.push(keyword);
      }
    }
    
    matchDetails.keywordMatches = matchedKeywords;
    const keywordRatio = matchedKeywords.length / criteria.keywords.length;
    totalScore += weights.keywords * keywordRatio;
  } else {
    totalScore += weights.keywords;
  }

  // Brand matching
  if (criteria.brand) {
    const brandLower = criteria.brand.toLowerCase();
    const manufacturerLower = product.manufacturer.toLowerCase();
    
    if (manufacturerLower.includes(brandLower) || brandLower.includes(manufacturerLower)) {
      matchDetails.brandMatch = true;
      totalScore += weights.brand;
    }
  } else {
    totalScore += weights.brand;
    matchDetails.brandMatch = true;
  }

  // Model matching
  if (criteria.model) {
    const modelLower = criteria.model.toLowerCase();
    const productModelLower = product.model.toLowerCase();
    
    if (productModelLower.includes(modelLower) || modelLower.includes(productModelLower)) {
      matchDetails.modelMatch = true;
      totalScore += weights.model;
    }
  } else {
    totalScore += weights.model;
    matchDetails.modelMatch = true;
  }

  // Year range matching
  if (criteria.yearMin || criteria.yearMax) {
    const productYear = product.year;
    if (productYear) {
      const minOk = !criteria.yearMin || productYear >= criteria.yearMin;
      const maxOk = !criteria.yearMax || productYear <= criteria.yearMax;
      
      if (minOk && maxOk) {
        matchDetails.yearInRange = true;
        totalScore += weights.year;
      }
    }
  } else {
    totalScore += weights.year;
    matchDetails.yearInRange = true;
  }

  // Price range matching
  if (criteria.priceMin || criteria.priceMax) {
    const minOk = !criteria.priceMin || product.price >= criteria.priceMin;
    const maxOk = !criteria.priceMax || product.price <= criteria.priceMax;
    
    if (minOk && maxOk) {
      matchDetails.priceInRange = true;
      totalScore += weights.price;
    } else if (criteria.priceMax && product.price <= criteria.priceMax * 1.1) {
      // Within 10% of max price
      matchDetails.priceInRange = true;
      totalScore += weights.price * 0.7;
    }
  } else {
    totalScore += weights.price;
    matchDetails.priceInRange = true;
  }

  // Condition matching
  if (criteria.condition && criteria.condition.length > 0) {
    if (criteria.condition.includes(product.condition)) {
      matchDetails.conditionMatch = true;
      totalScore += weights.condition;
    }
  } else {
    totalScore += weights.condition;
    matchDetails.conditionMatch = true;
  }

  return {
    matchScore: Math.round(totalScore),
    matchDetails,
  };
}

/**
 * Find all wishes that match a given product
 * Returns matches that meet or exceed the threshold
 */
export function findMatchingWishes(product: Product, wishes: Wish[]): WishMatch[] {
  const matches: WishMatch[] = [];
  
  for (const wish of wishes) {
    // Only check active wishes
    if (wish.status !== "active") continue;
    
    // Check expiration
    if (wish.expiresAt && new Date(wish.expiresAt) < new Date()) continue;
    
    const result = calculateMatch(product, wish.criteria);
    
    if (result.matchScore >= wish.matchThreshold) {
      matches.push({
        id: `match-${Date.now()}-${wish.id}`,
        wishId: wish.id,
        productId: product.id,
        matchScore: result.matchScore,
        matchDetails: result.matchDetails,
        notified: false,
        createdAt: new Date().toISOString(),
      });
    }
  }
  
  return matches;
}

/**
 * Create a notification for a wish match
 */
export function createMatchNotification(
  wish: Wish,
  product: Product,
  matchScore: number
): Notification {
  return {
    id: `notif-${Date.now()}`,
    userId: wish.userId,
    type: "wish_match",
    title: "希望条件に合う商品が見つかりました",
    message: `「${wish.title}」に合致する商品「${product.name}」が出品されました。マッチ度: ${matchScore}%`,
    data: {
      wishId: wish.id,
      productId: product.id,
      matchScore,
    },
    read: false,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Deduplicate matches - prevent notifying same wish-product combo
 */
export function deduplicateMatches(
  newMatches: WishMatch[],
  existingMatches: WishMatch[]
): WishMatch[] {
  return newMatches.filter((newMatch) => {
    return !existingMatches.some(
      (existing) =>
        existing.wishId === newMatch.wishId &&
        existing.productId === newMatch.productId
    );
  });
}

/**
 * Rate limit check - prevent spam notifications
 * Returns true if notification should be sent
 */
export function shouldNotify(
  userId: string,
  notifications: Notification[],
  maxPerHour = 10
): boolean {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const recentNotifications = notifications.filter(
    (n) =>
      n.userId === userId &&
      n.type === "wish_match" &&
      new Date(n.createdAt) > oneHourAgo
  );
  
  return recentNotifications.length < maxPerHour;
}

/**
 * Find all wishes that match a seller's product
 * Returns ProductWishMatch array for the seller to see potential buyers
 */
export function findPotentialBuyers(product: Product, wishes: Wish[]): ProductWishMatch[] {
  const matches: ProductWishMatch[] = [];
  
  for (const wish of wishes) {
    // Only check active wishes
    if (wish.status !== "active") continue;
    
    // Check expiration
    if (wish.expiresAt && new Date(wish.expiresAt) < new Date()) continue;
    
    // Don't match seller's own wishes
    if (wish.userId === product.sellerId) continue;
    
    const result = calculateMatch(product, wish.criteria);
    
    // Use a lower threshold for potential buyers (50%)
    if (result.matchScore >= 50) {
      matches.push({
        id: `pwm-${Date.now()}-${wish.id}`,
        productId: product.id,
        wishId: wish.id,
        wishTitle: wish.title,
        wishUserId: wish.userId,
        wishUserName: wish.userName,
        matchScore: result.matchScore,
        matchDetails: result.matchDetails,
        contacted: false,
        createdAt: new Date().toISOString(),
      });
    }
  }
  
  // Sort by match score descending
  return matches.sort((a, b) => b.matchScore - a.matchScore);
}

/**
 * Create a notification for seller about potential buyers
 */
export function createSellerNotification(
  product: Product,
  potentialBuyerCount: number
): Notification {
  return {
    id: `notif-seller-${Date.now()}`,
    userId: product.sellerId,
    type: "seller_potential_buyer",
    title: "潜在的な購入希望者が見つかりました",
    message: `あなたの出品「${product.name}」に興味を持ちそうな${potentialBuyerCount}人の購入希望者がいます。`,
    data: {
      productId: product.id,
      potentialBuyerCount,
    },
    read: false,
    createdAt: new Date().toISOString(),
  };
}
