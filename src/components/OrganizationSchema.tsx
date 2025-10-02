import { useEffect } from 'react';

export const OrganizationSchema = () => {
  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "TechLoop",
      "url": "https://lovable.dev",
      "logo": "https://lovable.dev/opengraph-image-p98pqg.png",
      "description": "Revendeur Apple agréé spécialisé dans l'iPhone 17, iPhone 17 Air, iPhone 17 Pro et Pro Max",
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "Service Client",
        "availableLanguage": ["French"]
      },
      "sameAs": [
        "https://twitter.com/techloop",
        "https://facebook.com/techloop",
        "https://instagram.com/techloop"
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
