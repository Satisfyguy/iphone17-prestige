import { useEffect } from 'react';

export const OrganizationSchema = () => {
  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "TekL∞p",
      "url": "https://tekloop.vercel.app",
      "logo": "https://tekloop.vercel.app/iphone-17-colors.webp",
      "description": "Revendeur Apple agréé spécialisé dans l'iPhone 17, iPhone 17 Air, iPhone 17 Pro et Pro Max",
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "Service Client",
        "availableLanguage": ["French"]
      },
      "sameAs": [
        "https://twitter.com/tekloop",
        "https://facebook.com/tekloop",
        "https://instagram.com/tekloop"
      ]
    };
    
    let scriptTag = document.querySelector('script[type="application/ld+json"][data-schema="organization"]');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.setAttribute('type', 'application/ld+json');
      scriptTag.setAttribute('data-schema', 'organization');
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(schema);
    
    return () => {
      const tag = document.querySelector('script[type="application/ld+json"][data-schema="organization"]');
      if (tag) tag.remove();
    };
  }, []);
  
  return null;
};
