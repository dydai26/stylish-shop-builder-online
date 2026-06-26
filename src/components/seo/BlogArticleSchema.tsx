import { Helmet } from "react-helmet-async";

interface BlogArticleSchemaProps {
  title: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  imageUrl: string;
  authorName?: string;
  description?: string;
}

export const BlogArticleSchema = ({ 
  title, 
  url, 
  datePublished, 
  dateModified, 
  imageUrl,
  authorName = "ECOVLUU",
  description
}: BlogArticleSchemaProps) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url.startsWith('http') ? url : `https://ecovluu.com${url}`
    },
    "headline": title,
    ...(description && { "description": description }),
    "image": imageUrl.startsWith('http') ? imageUrl : `https://ecovluu.com${imageUrl}`,
    "author": {
      "@type": "Organization",
      "name": authorName,
      "url": "https://ecovluu.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "ECOVLUU",
      "logo": {
        "@type": "ImageObject",
        "url": "https://ecovluu.com/ecovluu-logo.png"
      }
    },
    "datePublished": datePublished,
    "dateModified": dateModified || datePublished
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};
