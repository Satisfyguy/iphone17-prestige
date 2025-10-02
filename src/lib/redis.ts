import { Redis } from '@upstash/redis';

// Configuration Redis pour la gestion du stock et des réservations
const redisUrl = import.meta.env.VITE_UPSTASH_REDIS_REST_URL;
const redisToken = import.meta.env.VITE_UPSTASH_REDIS_REST_TOKEN;

// Créer l'instance Redis seulement si les credentials sont disponibles
export const redis = redisUrl && redisToken ? new Redis({
  url: redisUrl,
  token: redisToken,
}) : null;

// Mode développement sans Redis
const isDevelopment = !redisUrl || !redisToken;
const mockStock = new Map<string, StockInfo>();

// Types pour la gestion du stock
export interface StockInfo {
  productId: string;
  available: number;
  reserved: number;
  sold: number;
}

export interface Reservation {
  id: string;
  productId: string;
  userId?: string;
  sessionId: string;
  expiresAt: number;
  createdAt: number;
}

// Clés Redis
const STOCK_KEY = (productId: string) => `stock:${productId}`;
const RESERVATION_KEY = (reservationId: string) => `reservation:${reservationId}`;
const USER_RESERVATIONS_KEY = (sessionId: string) => `user_reservations:${sessionId}`;

// Utilitaires de gestion du stock
export class StockManager {
  // Initialiser le stock pour un produit (10 pièces par défaut)
  static async initializeStock(productId: string, initialStock: number = 10): Promise<void> {
    if (isDevelopment) {
      // Mode développement : utiliser le mock
      if (!mockStock.has(productId)) {
        mockStock.set(productId, {
          productId,
          available: initialStock,
          reserved: 0,
          sold: 0
        });
      }
      return;
    }

    if (!redis) return;
    
    const stockKey = STOCK_KEY(productId);
    const exists = await redis.exists(stockKey);
    
    if (!exists) {
      await redis.hset(stockKey, {
        productId,
        available: initialStock,
        reserved: 0,
        sold: 0
      });
    }
  }

  // Obtenir les informations de stock
  static async getStock(productId: string): Promise<StockInfo | null> {
    if (isDevelopment) {
      // Mode développement : utiliser le mock
      return mockStock.get(productId) || null;
    }

    if (!redis) return null;
    
    const stockKey = STOCK_KEY(productId);
    const stock = await redis.hgetall(stockKey);
    
    if (!stock || Object.keys(stock).length === 0) {
      return null;
    }

    return {
      productId: stock.productId as string,
      available: Number(stock.available),
      reserved: Number(stock.reserved),
      sold: Number(stock.sold)
    };
  }

  // Réserver un produit
  static async reserveProduct(
    productId: string, 
    sessionId: string, 
    ttlSeconds: number = 600
  ): Promise<{ success: boolean; reservationId?: string; message: string }> {
    if (isDevelopment) {
      // Mode développement : simulation simple
      const stock = mockStock.get(productId);
      if (!stock || stock.available <= 0) {
        return { success: false, message: "Stock épuisé" };
      }
      
      // Simuler la réservation
      stock.available -= 1;
      stock.reserved += 1;
      mockStock.set(productId, stock);
      
      return { 
        success: true, 
        reservationId: `mock_${productId}_${Date.now()}`, 
        message: "Produit réservé avec succès" 
      };
    }

    if (!redis) return { success: false, message: "Service indisponible" };
    
    const stockKey = STOCK_KEY(productId);
    
    // Vérifier le stock disponible
    const stock = await this.getStock(productId);
    if (!stock || stock.available <= 0) {
      return { success: false, message: "Stock épuisé" };
    }

    // Vérifier si l'utilisateur a déjà une réservation active
    const existingReservation = await this.getUserActiveReservation(sessionId, productId);
    if (existingReservation) {
      return { 
        success: true, 
        reservationId: existingReservation.id, 
        message: "Produit déjà réservé" 
      };
    }

    // Créer la réservation
    const reservationId = `${productId}_${sessionId}_${Date.now()}`;
    const reservation: Reservation = {
      id: reservationId,
      productId,
      sessionId,
      expiresAt: Date.now() + (ttlSeconds * 1000),
      createdAt: Date.now()
    };

    // Transaction Redis pour réserver
    const pipeline = redis.pipeline();
    pipeline.hincrby(stockKey, 'available', -1);
    pipeline.hincrby(stockKey, 'reserved', 1);
    pipeline.setex(RESERVATION_KEY(reservationId), ttlSeconds, JSON.stringify(reservation));
    pipeline.sadd(USER_RESERVATIONS_KEY(sessionId), reservationId);
    
    await pipeline.exec();

    return { 
      success: true, 
      reservationId, 
      message: "Produit réservé avec succès" 
    };
  }

  // Confirmer l'achat (convertir réservation en vente)
  static async confirmPurchase(reservationId: string): Promise<{ success: boolean; message: string }> {
    if (isDevelopment) {
      // Mode développement : simulation simple
      return { success: true, message: "Achat confirmé (mode dev)" };
    }

    if (!redis) return { success: false, message: "Service indisponible" };
    
    const reservationData = await redis.get(RESERVATION_KEY(reservationId));
    
    if (!reservationData) {
      return { success: false, message: "Réservation introuvable ou expirée" };
    }

    const reservation: Reservation = JSON.parse(reservationData as string);
    const stockKey = STOCK_KEY(reservation.productId);

    // Transaction pour confirmer l'achat
    const pipeline = redis.pipeline();
    pipeline.hincrby(stockKey, 'reserved', -1);
    pipeline.hincrby(stockKey, 'sold', 1);
    pipeline.del(RESERVATION_KEY(reservationId));
    pipeline.srem(USER_RESERVATIONS_KEY(reservation.sessionId), reservationId);
    
    await pipeline.exec();

    return { success: true, message: "Achat confirmé" };
  }

  // Annuler une réservation
  static async cancelReservation(reservationId: string): Promise<{ success: boolean; message: string }> {
    if (isDevelopment) {
      // Mode développement : simulation simple
      return { success: true, message: "Réservation annulée (mode dev)" };
    }

    if (!redis) return { success: false, message: "Service indisponible" };
    
    const reservationData = await redis.get(RESERVATION_KEY(reservationId));
    
    if (!reservationData) {
      return { success: false, message: "Réservation introuvable" };
    }

    const reservation: Reservation = JSON.parse(reservationData as string);
    const stockKey = STOCK_KEY(reservation.productId);

    // Transaction pour annuler la réservation
    const pipeline = redis.pipeline();
    pipeline.hincrby(stockKey, 'available', 1);
    pipeline.hincrby(stockKey, 'reserved', -1);
    pipeline.del(RESERVATION_KEY(reservationId));
    pipeline.srem(USER_RESERVATIONS_KEY(reservation.sessionId), reservationId);
    
    await pipeline.exec();

    return { success: true, message: "Réservation annulée" };
  }

  // Nettoyer les réservations expirées
  static async cleanupExpiredReservations(): Promise<void> {
    // Cette fonction devrait être appelée périodiquement
    // Pour simplifier, nous nous appuyons sur l'expiration automatique de Redis
  }

  // Obtenir la réservation active d'un utilisateur pour un produit
  static async getUserActiveReservation(sessionId: string, productId: string): Promise<Reservation | null> {
    if (isDevelopment) {
      // Mode développement : pas de réservations actives
      return null;
    }

    if (!redis) return null;
    
    const reservationIds = await redis.smembers(USER_RESERVATIONS_KEY(sessionId));
    
    for (const reservationId of reservationIds) {
      const reservationData = await redis.get(RESERVATION_KEY(reservationId));
      if (reservationData) {
        const reservation: Reservation = JSON.parse(reservationData as string);
        if (reservation.productId === productId && reservation.expiresAt > Date.now()) {
          return reservation;
        }
      }
    }
    
    return null;
  }

  // Obtenir toutes les réservations actives d'un utilisateur
  static async getUserReservations(sessionId: string): Promise<Reservation[]> {
    if (isDevelopment) {
      // Mode développement : pas de réservations
      return [];
    }

    if (!redis) return [];
    
    const reservationIds = await redis.smembers(USER_RESERVATIONS_KEY(sessionId));
    const reservations: Reservation[] = [];
    
    for (const reservationId of reservationIds) {
      const reservationData = await redis.get(RESERVATION_KEY(reservationId));
      if (reservationData) {
        const reservation: Reservation = JSON.parse(reservationData as string);
        if (reservation.expiresAt > Date.now()) {
          reservations.push(reservation);
        }
      }
    }
    
    return reservations;
  }
}
