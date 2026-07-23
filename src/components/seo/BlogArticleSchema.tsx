import { Helmet } from "react-helmet-async";

interface BlogArticleSchemaProps {
  title: string;
  slug: string;
  datePublished: string;
  dateModified?: string;
  imageUrl: string;
  description?: string;
  content?: string;
}

const BLOG_ABOUT_MAP: Record<string, Array<{ "@type": string; name: string; description: string }>> = {
  "dry-hair-water-lipid-balance": [
    {
      "@type": "Thing",
      "name": "Dry Hair",
      "description": "A hair condition where the hair fibre lacks sufficient water, internal structure, or lipids to maintain softness, elasticity and natural shine."
    },
    {
      "@type": "Thing",
      "name": "Hair Hydration",
      "description": "The process of restoring and retaining water within the hair fibre using water-binding ingredients and amino acids."
    },
    {
      "@type": "Thing",
      "name": "Hair Lipids",
      "description": "Natural fats and oils that protect the hair surface, seal in moisture, reduce moisture loss and enhance softness and shine."
    },
    {
      "@type": "Thing",
      "name": "Water Lipid Balance",
      "description": "The correct balance between internal water hydration and lipid protection in hair care routines that leads to genuinely healthier hair over time."
    }
  ]
};

export const BlogArticleSchema = ({ 
  title, 
  slug, 
  datePublished, 
  dateModified, 
  imageUrl,
  description,
  content
}: BlogArticleSchemaProps) => {
  const articleUrl = `https://www.ecovluu.com/blog/${slug}`;
  const formattedDatePublished = datePublished;
  const formattedDateModified = dateModified || datePublished;
  
  // Dynamic word count estimation
  const wordCount = content ? content.split(/\s+/).filter(Boolean).length.toString() : "450";
  
  // Dynamic about section
  const about = BLOG_ABOUT_MAP[slug] || [
    {
      "@type": "Thing",
      "name": title,
      "description": description || title
    }
  ];

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${articleUrl}/#article`,
    "headline": title,
    "description": description || title,
    "url": articleUrl,
    "image": {
      "@type": "ImageObject",
      "url": imageUrl.startsWith('http') ? imageUrl : `https://www.ecovluu.com${imageUrl}`,
      "inLanguage": "en"
    },
    "inLanguage": "en",
    "author": {
      "@type": "Organization",
      "@id": "https://www.ecovluu.com/#organization",
      "name": "Ecovluu",
      "url": "https://www.ecovluu.com/"
    },
    "publisher": {
      "@type": "Organization",
      "@id": "https://www.ecovluu.com/#organization",
      "name": "Ecovluu",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.ecovluu.com/Layer_1.png"
      }
    },
    "datePublished": formattedDatePublished,
    "dateModified": formattedDateModified,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": articleUrl,
      "url": articleUrl,
      "name": title,
      "isPartOf": { "@id": "https://www.ecovluu.com/#website" },
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://www.ecovluu.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Blog",
            "item": "https://www.ecovluu.com/blog"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": title,
            "item": articleUrl
          }
        ]
      }
    },
    "about": about,
    "articleSection": "Hair Care Education",
    "wordCount": wordCount,
    "isAccessibleForFree": true
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};
