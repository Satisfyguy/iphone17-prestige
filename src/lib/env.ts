// Configuration des variables d'environnement pour l'offre de lancement

export const ENV_CONFIG = {
  // Date de fin de l'offre (vous pouvez modifier cette date)
  LAUNCH_END_AT: import.meta.env.VITE_LAUNCH_END_AT || '2025-10-15T23:59:59+02:00',
  
  // Durée de réservation en secondes (10 minutes par défaut)
  RESERVATION_TTL_SECONDS: parseInt(import.meta.env.VITE_RESERVATION_TTL_SECONDS || '600'),
  
  // Configuration Redis (à configurer avec vos vraies credentials Upstash)
  UPSTASH_REDIS_REST_URL: import.meta.env.VITE_UPSTASH_REDIS_REST_URL || '',
  UPSTASH_REDIS_REST_TOKEN: import.meta.env.VITE_UPSTASH_REDIS_REST_TOKEN || '',
};

// Instructions pour configurer Upstash Redis :
// 1. Allez sur https://console.upstash.com/
// 2. Créez une nouvelle base Redis (gratuite)
// 3. Copiez l'URL REST et le token REST
// 4. Ajoutez ces variables à votre fichier .env.local :
//    VITE_UPSTASH_REDIS_REST_URL=votre_url_redis
//    VITE_UPSTASH_REDIS_REST_TOKEN=votre_token_redis
//    VITE_LAUNCH_END_AT=2025-10-15T23:59:59+02:00
//    VITE_RESERVATION_TTL_SECONDS=600
