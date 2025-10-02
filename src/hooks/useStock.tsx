import { useState, useEffect } from 'react';
import { StockManager, StockInfo } from '@/lib/redis';

// Hook pour gérer le stock d'un produit
export const useStock = (productId: string) => {
  const [stock, setStock] = useState<StockInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStock = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Initialiser le stock si nécessaire
      await StockManager.initializeStock(productId, 10);
      
      // Récupérer les informations de stock
      const stockInfo = await StockManager.getStock(productId);
      setStock(stockInfo);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement du stock');
      console.error('Erreur stock:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStock();
  }, [productId]);

  const refreshStock = () => {
    fetchStock();
  };

  return {
    stock,
    loading,
    error,
    refreshStock,
    available: stock?.available || 0,
    reserved: stock?.reserved || 0,
    sold: stock?.sold || 0
  };
};

// Hook pour gérer les réservations d'un utilisateur
export const useReservations = (sessionId: string) => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const userReservations = await StockManager.getUserReservations(sessionId);
      setReservations(userReservations);
    } catch (err) {
      console.error('Erreur réservations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sessionId) {
      fetchReservations();
    }
  }, [sessionId]);

  const reserveProduct = async (productId: string) => {
    try {
      const result = await StockManager.reserveProduct(productId, sessionId, 600);
      if (result.success) {
        await fetchReservations();
      }
      return result;
    } catch (err) {
      return { 
        success: false, 
        message: err instanceof Error ? err.message : 'Erreur lors de la réservation' 
      };
    }
  };

  const cancelReservation = async (reservationId: string) => {
    try {
      const result = await StockManager.cancelReservation(reservationId);
      if (result.success) {
        await fetchReservations();
      }
      return result;
    } catch (err) {
      return { 
        success: false, 
        message: err instanceof Error ? err.message : 'Erreur lors de l\'annulation' 
      };
    }
  };

  const confirmPurchase = async (reservationId: string) => {
    try {
      const result = await StockManager.confirmPurchase(reservationId);
      if (result.success) {
        await fetchReservations();
      }
      return result;
    } catch (err) {
      return { 
        success: false, 
        message: err instanceof Error ? err.message : 'Erreur lors de la confirmation' 
      };
    }
  };

  return {
    reservations,
    loading,
    reserveProduct,
    cancelReservation,
    confirmPurchase,
    refreshReservations: fetchReservations
  };
};

// Hook pour générer un ID de session unique
export const useSessionId = () => {
  const [sessionId, setSessionId] = useState<string>('');

  useEffect(() => {
    // Récupérer ou créer un ID de session
    let id = localStorage.getItem('sessionId');
    if (!id) {
      id = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('sessionId', id);
    }
    setSessionId(id);
  }, []);

  return sessionId;
};
