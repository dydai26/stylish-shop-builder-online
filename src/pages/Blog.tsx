import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import OptimizedImage from "@/components/ui/OptimizedImage";

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
  author_avatar?: string | null;
}

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
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

  return (
    <Layout>
      <Helmet>
        <title>Hair Care Tips & Blog | ECOVLUU</title>
        <meta name="description" content="Discover expert hair care tips, natural beauty advice, and the latest trends in organic hair care. Learn about ingredients and best practices for healthy hair." />
        <meta name="keywords" content="hair care blog, natural hair tips, organic hair care, beauty blog, ECOVLUU blog" />
        <link rel="canonical" href="https://www.ecovluu.com/blog" />
      </Helmet>
      
      {/* Background container wrapper */}
      <div className="bg-gray-50/30 min-h-screen py-12 md:py-16">
        <div className="container-custom">
          {/* Header section */}
          <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand-brown mb-4 tracking-tight">
              Blog Posts
            </h1>
            <p className="text-gray-600 text-base md:text-lg">
              Guides, tips, and expert advice on organic hair care. Find the right routine for your healthy hair.
            </p>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm max-w-lg mx-auto">
              <p className="text-lg text-gray-600">No blog posts available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12 md:mb-16">
              {posts.map((post) => (
                <article 
                  key={post.id} 
                  className="group flex flex-col h-full bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Image Area */}
                  <Link to={`/blog/${post.slug}`} className="relative overflow-hidden aspect-[4/4] shrink-0 block">
                    <OptimizedImage 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                    />
                  </Link>

                  {/* Content Area */}
                  <div className="p-6 flex flex-col flex-1 text-left">
                    {/* Title */}
                    <h2 className="text-lg sm:text-xl font-bold text-brand-brown hover:text-brand-orange transition-colors line-clamp-2 leading-snug mb-3">
                      <Link to={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h2>

                    {/* Read More Link */}
                    <div className="mb-6">
                      <Link 
                        to={`/blog/${post.slug}`} 
                        className="text-sm font-semibold text-brand-orange hover:underline inline-flex items-center"
                      >
                        Read more →
                      </Link>
                    </div>

                    {/* Footer: Author details and date */}
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50 w-full">
                      {/* Author Info */}
                      <div className="flex items-center gap-2">
                        {post.author_avatar ? (
                          <img
                            src={post.author_avatar}
                            alt={post.author || "Author"}
                            className="w-7 h-7 rounded-full object-cover border border-gray-100"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange font-bold text-xs">
                            {(post.author || "E").charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span className="text-xs font-semibold text-gray-700">
                          {post.author || "EcoVluu"}
                        </span>
                      </div>

                      {/* Date */}
                      <span className="text-xs text-gray-500 font-medium">
                        {formatDate(post.created_at)}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Blog;