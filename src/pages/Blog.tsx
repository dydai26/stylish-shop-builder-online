import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

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
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatContent = (content: string, limit?: number) => {
    // URL regex pattern
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    
    const paragraphs = content.split('\n\n');
    const displayParagraphs = limit ? paragraphs.slice(0, limit) : paragraphs;
    
    return displayParagraphs.map((paragraph, index) => {
      // Split paragraph by URLs and create elements
      const parts = paragraph.split(urlPattern);
      
      return (
        <p key={index} className="mb-4 text-base leading-relaxed">
          {parts.map((part, i) => {
            if (urlPattern.test(part)) {
              // Reset regex lastIndex
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

  const hasMoreContent = (content: string, limit: number) => {
    return content.split('\n\n').length > limit;
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
      <div className="container-custom py-12 md:py-16">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12 md:mb-16">
          Blog
        </h1>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">No blog posts available yet.</p>
          </div>
        ) : (
          <div className="space-y-0">
            {posts.map((post, index) => {
              const isEven = index % 2 === 0;
              
              return (
                <div key={post.id}>
                  <article className="py-12 md:py-16 clear-both overflow-hidden">
                    <div>
                      {/* Image with float */}
                      <div className={`${isEven ? 'float-right ml-8 mb-6' : 'float-left mr-8 mb-6'} w-full md:w-[45%]`}>
                        <div className="relative rounded-2xl overflow-hidden aspect-[4/4]">
                          <img 
                            src={post.image} 
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                      {/* Text wrapping around image */}
                      <div>
                        <h2 className="text-2xl md:text-3xl font-bold mb-6 leading-tight">
                          <Link to={`/blog/${post.slug}`} className="hover:text-brand-brown transition-colors">
                            {post.title}
                          </Link>
                        </h2>
                        <div className="text-gray-900 space-y-4 text-justify leading-relaxed">
                          {formatContent(post.content, 3)}
                        </div>
                        {post.author && (
                          <p className="mt-6 text-sm text-gray-600 italic">
                            By {post.author}
                          </p>
                        )}
                        
                        {/* Read more link - always show since full content is on BlogPost */}
                        <Link 
                          to={`/blog/${post.slug}`} 
                          className=" inline-block mt-4 text-brand-orange hover:underline font-medium"
                        >
                          Read more →
                        </Link>
                      </div>
                    </div>
                  </article>
                  
                  {/* Separator line between posts */}
                  {index < posts.length - 1 && (
                    <div className="border-t border-gray-300 clear-both"></div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Blog;