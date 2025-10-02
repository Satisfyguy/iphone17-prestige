import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface EnhancedSEOProps {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
  type?: 'website' | 'product' | 'article';
  noindex?: boolean;
  nofollow?: boolean;
  hreflang?: { [key: string]: string }; // ex: { 'fr': '/fr/produit', 'en': '/en/product' }
  structuredData?: object; // JSON-LD personnalisé
}

// Fonction pour générer l'URL de l'image OG optimale
const getOptimalOGImage = (ogImage?: string, fallback = 'https://tekloop.vercel.app/iphone-17-colors.webp') => {
  if (!ogImage) return fallback;
  
  // Si c'est déjà une URL complète, la retourner
  if (ogImage.startsWith('http')) return ogImage;
  
  // Si c'est un chemin relatif, construire l'URL complète
  const baseUrl = window.location.origin;
  return ogImage.startsWith('/') ? `${baseUrl}${ogImage}` : `${baseUrl}/${ogImage}`;
};

export const EnhancedSEO = ({ 
  title, 
  description, 
  keywords, 
  ogImage = 'https://tekloop.vercel.app/iphone-17-colors.webp',
  canonical,
  type = 'website',
  noindex = false,
  nofollow = false,
  hreflang,
  structuredData
}: EnhancedSEOProps) => {
  const location = useLocation();
  const baseUrl = window.location.origin;
  const fullUrl = canonical || `${baseUrl}${location.pathname}`;
  const optimizedOGImage = getOptimalOGImage(ogImage);
  
  useEffect(() => {
    // Update title
    document.title = title;
    
    // Update meta tags
    const updateMetaTag = (selector: string, attribute: string, value: string) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        if (selector.includes('property')) {
          element.setAttribute('property', selector.replace('meta[property="', '').replace('"]', ''));
        } else if (selector.includes('name')) {
          element.setAttribute('name', selector.replace('meta[name="', '').replace('"]', ''));
        }
        document.head.appendChild(element);
      }
      element.setAttribute(attribute, value);
    };
    
    // Basic meta tags
    updateMetaTag('meta[name="description"]', 'content', description);
    
    // Robots meta
    const robotsContent = [
      noindex ? 'noindex' : 'index',
      nofollow ? 'nofollow' : 'follow',
      'max-image-preview:large',
      'max-snippet:-1',
      'max-video-preview:-1'
    ].join(', ');
    updateMetaTag('meta[name="robots"]', 'content', robotsContent);
    
    if (keywords) {
      updateMetaTag('meta[name="keywords"]', 'content', keywords);
    }
    
    // Open Graph
    updateMetaTag('meta[property="og:title"]', 'content', title);
    updateMetaTag('meta[property="og:description"]', 'content', description);
    updateMetaTag('meta[property="og:type"]', 'content', type);
    updateMetaTag('meta[property="og:url"]', 'content', fullUrl);
    updateMetaTag('meta[property="og:image"]', 'content', optimizedOGImage);
    updateMetaTag('meta[property="og:image:width"]', 'content', '1200');
    updateMetaTag('meta[property="og:image:height"]', 'content', '630');
    updateMetaTag('meta[property="og:image:alt"]', 'content', title);
    updateMetaTag('meta[property="og:site_name"]', 'content', 'TekL∞p');
    updateMetaTag('meta[property="og:locale"]', 'content', 'fr_FR');
    
    // Twitter Card
    updateMetaTag('meta[name="twitter:card"]', 'content', 'summary_large_image');
    updateMetaTag('meta[name="twitter:title"]', 'content', title);
    updateMetaTag('meta[name="twitter:description"]', 'content', description);
    updateMetaTag('meta[name="twitter:image"]', 'content', optimizedOGImage);
    updateMetaTag('meta[name="twitter:image:alt"]', 'content', title);
    
    // Canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', fullUrl);
    
    // Hreflang links
    if (hreflang) {
      // Supprimer les anciens liens hreflang
      document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(link => link.remove());
      
      Object.entries(hreflang).forEach(([lang, url]) => {
        const hreflangLink = document.createElement('link');
        hreflangLink.setAttribute('rel', 'alternate');
        hreflangLink.setAttribute('hreflang', lang);
        hreflangLink.setAttribute('href', url.startsWith('http') ? url : `${baseUrl}${url}`);
        document.head.appendChild(hreflangLink);
      });
    }
    
    // Structured Data JSON-LD
    if (structuredData) {
      // Supprimer l'ancien script s'il existe
      const existingScript = document.querySelector('script[type="application/ld+json"][data-schema="custom"]');
      if (existingScript) {
        existingScript.remove();
      }
      
      // Ajouter le nouveau script
      const script = document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      script.setAttribute('data-schema', 'custom');
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }
    
  }, [title, description, keywords, optimizedOGImage, fullUrl, type, noindex, nofollow, hreflang, structuredData]);
  
  return null;
};
