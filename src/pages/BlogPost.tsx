import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ArrowLeft } from "lucide-react";
import ShareButtons from "@/components/blog/ShareButtons";
import { BlogArticleSchema } from "@/components/seo/BlogArticleSchema";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  image: string;
  author: string;
  is_published: boolean;
  created_at: string;
  meta_title: string | null;
  meta_description: string | null;
  canonical_url?: string | null;
  noindex?: boolean;
  nofollow?: boolean;
  author_avatar?: string | null;
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  const BASE_URL = "https://www.ecovluu.com";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single();

      if (error) throw error;
      setPost(data);
    } catch (error) {
      console.error('Error fetching blog post:', error);
    } finally {
      setLoading(false);
    }
  };

  const isHtml = (str: string) => {
    return /<\/?[a-z][\s\S]*>/i.test(str);
  };

  const formatContent = (content: string) => {
    const urlPattern = /(https?:\/\/[^\s]+)/g;

    return content.split('\n\n').map((paragraph, index) => {
      const parts = paragraph.split(urlPattern);

      return (
        <p key={index} className="mb-4 text-base leading-relaxed text-justify">
          {parts.map((part, i) => {
            if (urlPattern.test(part)) {
              urlPattern.lastIndex = 0;
              return (
                <a
                  key={i}
                  href={part}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-orange hover:underline break-all font-medium"
                >
                  {part}
                </a>
              );
            }
            return part;
          })}
        </p>
      );
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[50vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-brand-brown" />
        </div>
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout>
        <div className="container-custom py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Post not found</h1>
          <Link to="/blog" className="text-brand-brown hover:underline">
            ← Back to Blog
          </Link>
        </div>
      </Layout>
    );
  }

  const articleUrl = `${BASE_URL}/blog/${post.slug}`;
  const imageUrl = post.image.startsWith('http') ? post.image : `${BASE_URL}${post.image}`;
  const description = post.meta_description || post.excerpt || post.content.slice(0, 160);
  const title = post.meta_title || post.title;
  const normalizeCanonicalUrl = (inputUrl?: string | null, fallback?: string) => {
    if (!inputUrl || inputUrl.trim() === '') return fallback || articleUrl;
    let url = inputUrl.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      if (url.startsWith('/')) {
        url = `${BASE_URL}${url}`;
      } else {
        url = `${BASE_URL}/blog/${url}`;
      }
    }
    return url.replace('https://ecovluu.com', BASE_URL)
              .replace('http://ecovluu.com', BASE_URL)
              .replace('http://www.ecovluu.com', BASE_URL);
  };

  const canonicalHref = normalizeCanonicalUrl(post.canonical_url, articleUrl);

  return (
    <Layout>
      <BlogArticleSchema 
        title={title}
        slug={post.slug}
        datePublished={post.created_at}
        imageUrl={imageUrl}
        description={description}
        content={post.content}
      />
      <Helmet>
        <title>{title} | ECOVLUU Blog</title>
        <meta name="description" content={description} />

        {/* Robots Directives */}
        {(post.noindex || post.nofollow) && (
          <meta 
            name="robots" 
            content={`${post.noindex ? 'noindex' : 'index'}, ${post.nofollow ? 'nofollow' : 'follow'}`} 
          />
        )}

        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:url" content={articleUrl} />
        <meta property="og:site_name" content="ECOVLUU" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={imageUrl} />

        {/* Pinterest */}
        <meta name="pinterest-rich-pin" content="true" />

        <link rel="canonical" href={canonicalHref} />
      </Helmet>

      <div className="container-custom py-8 md:py-12 px-4 max-w-5xl mx-auto">
        {/* Back link */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-brand-brown hover:underline mb-6 text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        <article className="max-w-4xl mx-auto w-full overflow-hidden">
          {/* Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 leading-snug text-left text-brand-brown">
            {post.title}
          </h1>

          {/* Featured Image */}
          {post.image && (
            <div className="relative rounded-2xl overflow-hidden max-h-[450px] mb-8 bg-gray-50 flex items-center justify-center w-full">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full max-h-[700px] object-cover rounded-2xl"
              />
            </div>
          )}

          {/* Content */}
          <div className="mt-6 text-gray-900 leading-relaxed blog-content text-left w-full overflow-hidden">
            {isHtml(post.content) ? (
              <div dangerouslySetInnerHTML={{ __html: post.content.replace(/&nbsp;/g, ' ').replace(/\u00a0/g, ' ') }} />
            ) : (
              formatContent(post.content.replace(/&nbsp;/g, ' ').replace(/\u00a0/g, ' '))
            )}
          </div>

          {/* Author */}
          {post.author && (
            <div className="flex items-center gap-3 mt-8 pt-6 border-t border-gray-200">
              {post.author_avatar ? (
                <img
                  src={post.author_avatar}
                  alt={post.author}
                  className="w-10 h-10 rounded-full object-cover border"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange font-bold text-sm">
                  {post.author.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-800">Written by</p>
                <p className="text-sm text-gray-600">{post.author}</p>
              </div>
            </div>
          )}

          {/* Bottom share buttons */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-3">Enjoyed this article? Share it:</p>
            <ShareButtons
              url={articleUrl}
              facebookUrl={`${BASE_URL}/share.php?slug=${encodeURIComponent(post.slug)}`}
              title={post.title}
              description={description}
              imageUrl={imageUrl}
            />
          </div>
        </article>
      </div>
    </Layout>
  );
};

export default BlogPost;