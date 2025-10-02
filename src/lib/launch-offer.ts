import { format, isAfter, differenceInSeconds } from 'date-fns';
import { fr } from 'date-fns/locale';

// Configuration de l'offre de lancement
export const LAUNCH_OFFER_CONFIG = {
  // Date de fin de l'offre (15 octobre 2025 à 23:59)
  endDate: new Date('2025-10-15T23:59:59+02:00'),
  discountPercentage: 20,
  stockPerProduct: 10,
  maxPerCustomer: 1,
  reservationTTL: 600, // 10 minutes en secondes
};

// Types pour l'offre de lancement
export interface LaunchProduct {
  id: string;
  name: string;
  originalPrice: number;
  launchPrice: number;
  savings: number;
  image: string;
  features: string[];
  description: string;
  specs: {
    screen: string;
    chip: string;
    camera: string;
    battery: string;
  };
  colors: Array<{
    name: string;
    hex: string;
    image: string;
  }>;
  storage: Array<{
    size: string;
    price: number;
  }>;
}

// Utilitaires pour l'offre de lancement
export class LaunchOfferUtils {
  // Vérifier si l'offre est active
  static isOfferActive(): boolean {
    return !isAfter(new Date(), LAUNCH_OFFER_CONFIG.endDate);
  }

  // Obtenir le temps restant en secondes
  static getTimeRemaining(): number {
    if (!this.isOfferActive()) return 0;
    return Math.max(0, differenceInSeconds(LAUNCH_OFFER_CONFIG.endDate, new Date()));
  }

  // Formater le temps restant
  static formatTimeRemaining(): string {
    const seconds = this.getTimeRemaining();
    
    if (seconds <= 0) return "Offre terminée";
    
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (days > 0) {
      return `${days}j ${hours}h ${minutes}min`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}min ${remainingSeconds}s`;
    } else {
      return `${minutes}min ${remainingSeconds}s`;
    }
  }

  // Calculer le prix de lancement
  static calculateLaunchPrice(originalPrice: number): number {
    return Math.round(originalPrice * (1 - LAUNCH_OFFER_CONFIG.discountPercentage / 100));
  }

  // Calculer les économies
  static calculateSavings(originalPrice: number): number {
    return originalPrice - this.calculateLaunchPrice(originalPrice);
  }

  // Formater la date de fin
  static formatEndDate(): string {
    return format(LAUNCH_OFFER_CONFIG.endDate, "EEEE d MMMM 'à' HH:mm", { locale: fr });
  }

  // Obtenir le message de la barre sticky
  static getStickyBarMessage(): string {
    if (!this.isOfferActive()) {
      return "Offre de lancement terminée";
    }
    
    return `–${LAUNCH_OFFER_CONFIG.discountPercentage}% lancement. ${LAUNCH_OFFER_CONFIG.stockPerProduct} pièces par modèle. Fin le ${this.formatEndDate()}. Livraison 48h offerte.`;
  }

  // Obtenir le message d'urgence
  static getUrgencyMessage(stockRemaining: number): string {
    if (stockRemaining <= 0) {
      return "Épuisé";
    } else if (stockRemaining <= 3) {
      return `Plus que ${stockRemaining}/${LAUNCH_OFFER_CONFIG.stockPerProduct} disponibles`;
    } else if (stockRemaining <= 5) {
      return `${stockRemaining}/${LAUNCH_OFFER_CONFIG.stockPerProduct} disponibles`;
    }
    return `${stockRemaining}/${LAUNCH_OFFER_CONFIG.stockPerProduct} disponibles`;
  }

  // Obtenir le badge de stock
  static getStockBadge(stockRemaining: number): { text: string; variant: 'default' | 'destructive' | 'outline' | 'secondary' } {
    if (stockRemaining <= 0) {
      return { text: "Épuisé", variant: 'destructive' };
    } else if (stockRemaining <= 3) {
      return { text: "Stock limité", variant: 'destructive' };
    } else if (stockRemaining <= 5) {
      return { text: "Dernières pièces", variant: 'secondary' };
    }
    return { text: "Série limitée", variant: 'default' };
  }

  // Convertir un produit normal en produit de lancement
  static convertToLaunchProduct(product: any): LaunchProduct {
    const originalPrice = product.price;
    const launchPrice = this.calculateLaunchPrice(originalPrice);
    const savings = this.calculateSavings(originalPrice);

    return {
      ...product,
      originalPrice,
      launchPrice,
      savings
    };
  }

  // Obtenir le message de réservation
  static getReservationMessage(expiresAt: number): string {
    const remaining = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    
    return `Votre pièce est réservée ${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  // Vérifier si un client peut acheter (limite 1 par client)
  static canCustomerBuy(customerPurchases: number): boolean {
    return customerPurchases < LAUNCH_OFFER_CONFIG.maxPerCustomer;
  }

  // Obtenir le disclaimer légal
  static getLegalDisclaimer(): string {
    return `Offre de lancement –${LAUNCH_OFFER_CONFIG.discountPercentage}% valable jusqu'au ${this.formatEndDate()} (heure locale), dans la limite de ${LAUNCH_OFFER_CONFIG.stockPerProduct} pièces par modèle. Limite: ${LAUNCH_OFFER_CONFIG.maxPerCustomer} pièce par client. Prix affichés TTC.`;
  }
}
