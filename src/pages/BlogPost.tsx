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

  const formatContent = (content: string) => {
    const urlPattern = /(https?:\/\/[^\s]+)/g;

    return content.split('\n\n').map((paragraph, index) => {
      const parts = paragraph.split(urlPattern);

      return (
        <p key={index} className="mb-4 text-base leading-relaxed">
          {parts.map((part, i) => {
            if (urlPattern.test(part)) {
              urlPattern.lastIndex = 0;
              return (
                <a
                  key={i}
                  href={part}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-brown hover:underline break-all"
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

  return (
    <Layout>
      <BlogArticleSchema 
        title={title}
        url={`/blog/${post.slug}`}
        datePublished={post.created_at}
        imageUrl={imageUrl}
        authorName={post.author}
        description={description}
      />
      <Helmet>
        <title>{title} | ECOVLUU Blog</title>
        <meta name="description" content={description} />

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

        <link rel="canonical" href={articleUrl} />
      </Helmet>

      <div className="container-custom py-12 md:py-16">
        {/* Back link */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-brand-brown hover:underline mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        <article className="max-w-4xl mx-auto">
          {/* Featured Image */}
          <div className="relative rounded-2xl overflow-hidden h-56 md:h-[500px] mb-8">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            {post.title}
          </h1>



          {/* Content */}
          <div className="mt-8 text-gray-900 space-y-4 text-justify leading-relaxed">
            {formatContent(post.content)}
          </div>

          {/* Author */}
          {post.author && (
            <p className="mt-8 text-sm text-gray-600 italic">
              By {post.author}
            </p>
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