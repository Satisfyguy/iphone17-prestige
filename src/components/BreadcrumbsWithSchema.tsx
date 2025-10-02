import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { getProductById } from '@/data/products';

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbsWithSchemaProps {
  customItems?: BreadcrumbItem[];
}

export const BreadcrumbsWithSchema = ({ customItems }: BreadcrumbsWithSchemaProps) => {
  const location = useLocation();
  const baseUrl = window.location.origin;

  // Génération automatique des breadcrumbs basée sur l'URL
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (customItems) return customItems;

    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { name: 'Accueil', url: '/' }
    ];

    let currentPath = '';
    
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      switch (segment) {
        case 'produit':
          // Ne pas ajouter "produit" dans les breadcrumbs, attendre le nom du produit
          break;
        case 'comparateur':
          breadcrumbs.push({ name: 'Comparateur', url: currentPath });
          break;
        case 'accessoires':
          breadcrumbs.push({ name: 'Accessoires', url: currentPath });
          break;
        case 'support':
          breadcrumbs.push({ name: 'Support', url: currentPath });
          break;
        case 'a-propos':
          breadcrumbs.push({ name: 'À propos', url: currentPath });
          break;
        default:
          // Si c'est un ID de produit après /produit
          if (pathSegments[index - 1] === 'produit') {
            const product = getProductById(segment);
            if (product) {
              breadcrumbs.push({ 
                name: 'Produits', 
                url: '/#produits' 
              });
              breadcrumbs.push({ 
                name: product.fullName, 
                url: currentPath 
              });
            }
          }
          break;
      }
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Génération du JSON-LD pour les breadcrumbs
  useEffect(() => {
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.name,
        "item": item.url.startsWith('http') ? item.url : `${baseUrl}${item.url}`
      }))
    };

    // Supprimer l'ancien script s'il existe
    const existingScript = document.querySelector('script[type="application/ld+json"][data-schema="breadcrumb"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Ajouter le nouveau script
    const script = document.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    script.setAttribute('data-schema', 'breadcrumb');
    script.textContent = JSON.stringify(breadcrumbSchema);
    document.head.appendChild(script);

    return () => {
      const scriptToRemove = document.querySelector('script[type="application/ld+json"][data-schema="breadcrumb"]');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [breadcrumbs, baseUrl]);

  // Ne pas afficher les breadcrumbs sur la page d'accueil
  if (location.pathname === '/' || breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
        {breadcrumbs.map((item, index) => (
          <li key={item.url} className="flex items-center">
            {index > 0 && <ChevronRight className="h-4 w-4 mx-2" />}
            
            {index === 0 && <Home className="h-4 w-4 mr-2" />}
            
            {index === breadcrumbs.length - 1 ? (
              // Dernier élément (page actuelle) - pas de lien
              <span className="font-medium text-foreground" aria-current="page">
                {item.name}
              </span>
            ) : (
              // Éléments précédents - avec liens
              <Link 
                to={item.url} 
                className="hover:text-foreground transition-colors"
                itemProp="item"
              >
                <span itemProp="name">{item.name}</span>
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};
