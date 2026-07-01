import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Pencil, Trash2, MoveUp, MoveDown } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import ImageUpload from "@/components/ui/ImageUpload";
import { uploadImage, deleteImage, replaceImage, extractPathFromUrl } from "@/lib/imageUploadService";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  image: string;
  author: string;
  is_published: boolean;
  display_order: number;
  created_at: string;
  meta_title: string | null;
  meta_description: string | null;
  canonical_url?: string | null;
  noindex?: boolean;
  nofollow?: boolean;
  author_avatar?: string | null;
}

const BlogSection = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [formTab, setFormTab] = useState<"general" | "content" | "author" | "seo">("general");
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    image: "",
    author: "Ecovluu",
    is_published: false,
    display_order: 0,
    meta_title: "",
    meta_description: "",
    canonical_url: "",
    noindex: false,
    nofollow: false,
    author_avatar: "",
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      toast({
        title: "Error",
        description: "Failed to fetch blog posts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleImageChange = (url: string) => {
    setFormData(prev => ({ ...prev, image: url }));
  };

  const stripHtml = (html: string) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content || !formData.image) {
      toast({
        title: "Error",
        description: "Please fill in all required fields (Title, Content, Image)",
        variant: "destructive",
      });
      return;
    }

    try {
      const slug = formData.slug || generateSlug(formData.title);
      
      const payload = {
        title: formData.title,
        slug: slug,
        content: formData.content,
        excerpt: formData.excerpt || null,
        image: formData.image,
        author: formData.author,
        is_published: formData.is_published,
        display_order: formData.display_order,
        meta_title: formData.meta_title || null,
        meta_description: formData.meta_description || null,
        canonical_url: formData.canonical_url || null,
        noindex: formData.noindex,
        nofollow: formData.nofollow,
        author_avatar: formData.author_avatar || null,
      };

      if (editingPost) {
        const { error } = await supabase
          .from('blog_posts')
          .update(payload)
          .eq('id', editingPost.id);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Blog post updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('blog_posts')
          .insert([payload]);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Blog post created successfully",
        });
      }

      resetForm();
      fetchPosts();
    } catch (error: any) {
      console.error('Error saving blog post:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save blog post",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt || "",
      image: post.image,
      author: post.author,
      is_published: post.is_published,
      display_order: post.display_order,
      meta_title: post.meta_title || "",
      meta_description: post.meta_description || "",
      canonical_url: post.canonical_url || "",
      noindex: post.noindex || false,
      nofollow: post.nofollow || false,
      author_avatar: post.author_avatar || "",
    });
    setFormTab("general");
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!postToDelete) return;

    try {
      const postToDeleteData = posts.find(p => p.id === postToDelete);
      
      const { error } = await supabase
          .from('blog_posts')
          .delete()
          .eq('id', postToDelete);

      if (error) throw error;

      // Delete image from storage if it exists
      if (postToDeleteData?.image && postToDeleteData.image.includes('supabase')) {
        const imagePath = extractPathFromUrl(postToDeleteData.image);
        if (imagePath) {
          try {
            await deleteImage(imagePath);
          } catch (err) {
            console.warn('Failed to delete image:', err);
          }
        }
      }

      toast({
        title: "Success",
        description: "Blog post deleted successfully",
      });
      
      fetchPosts();
    } catch (error) {
      console.error('Error deleting blog post:', error);
      toast({
        title: "Error",
        description: "Failed to delete blog post",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setPostToDelete(null);
    }
  };

  const handleMove = async (postId: string, direction: 'up' | 'down') => {
    const currentIndex = posts.findIndex(p => p.id === postId);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === posts.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const currentPost = posts[currentIndex];
    const targetPost = posts[newIndex];

    try {
      await supabase
        .from('blog_posts')
        .update({ display_order: targetPost.display_order })
        .eq('id', currentPost.id);

      await supabase
        .from('blog_posts')
        .update({ display_order: currentPost.display_order })
        .eq('id', targetPost.id);

      fetchPosts();
    } catch (error) {
      console.error('Error moving post:', error);
      toast({
        title: "Error",
        description: "Failed to reorder posts",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      image: "",
      author: "Ecovluu",
      is_published: false,
      display_order: 0,
      meta_title: "",
      meta_description: "",
      canonical_url: "",
      noindex: false,
      nofollow: false,
      author_avatar: "",
    });
    setEditingPost(null);
    setFormTab("general");
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Blog Posts</h2>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-2" />
          {showForm ? "Cancel" : "Add New Post"}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Tab Navigation */}
              <div className="flex border-b border-gray-200 mb-6 gap-6">
                <button
                  type="button"
                  className={`pb-2 px-1 font-semibold text-sm border-b-2 transition-all ${
                    formTab === "general"
                      ? "border-brand-orange text-brand-orange"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setFormTab("general")}
                >
                  General Info
                </button>
                <button
                  type="button"
                  className={`pb-2 px-1 font-semibold text-sm border-b-2 transition-all ${
                    formTab === "content"
                      ? "border-brand-orange text-brand-orange"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setFormTab("content")}
                >
                  Article Content
                </button>
                <button
                  type="button"
                  className={`pb-2 px-1 font-semibold text-sm border-b-2 transition-all ${
                    formTab === "author"
                      ? "border-brand-orange text-brand-orange"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setFormTab("author")}
                >
                  Author Details
                </button>
                <button
                  type="button"
                  className={`pb-2 px-1 font-semibold text-sm border-b-2 transition-all ${
                    formTab === "seo"
                      ? "border-brand-orange text-brand-orange"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setFormTab("seo")}
                >
                  SEO Fields
                </button>
              </div>

              {/* Tab Panels */}
              {formTab === "general" && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="image" className="block text-left mb-1 font-semibold">Featured Image *</Label>
                    <ImageUpload
                      label="Feature Image"
                      value={formData.image}
                      onChange={handleImageChange}
                      onUploadSuccess={(fileName) => {
                        const nameWithoutExtension = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
                        const formattedTitle = nameWithoutExtension
                          .replace(/[-_]/g, ' ')
                          .replace(/\b\w/g, c => c.toUpperCase());
                        
                        setFormData(prev => ({
                          ...prev,
                          title: prev.title ? prev.title : formattedTitle,
                          meta_title: prev.meta_title ? prev.meta_title : formattedTitle,
                          slug: prev.slug ? prev.slug : generateSlug(formattedTitle)
                        }));
                        toast({
                          title: "Auto-titling applied",
                          description: `Set title to: "${formattedTitle}"`,
                        });
                      }}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="title" className="block text-left mb-1 font-semibold">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Enter post title"
                      className="text-left"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="slug" className="block text-left mb-1 font-semibold">Slug (URL path)</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="post-url-slug"
                      className="text-left"
                    />
                  </div>

                  <div>
                    <Label htmlFor="excerpt" className="block text-left mb-1 font-semibold">Short Description / Excerpt</Label>
                    <Textarea
                      id="excerpt"
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      placeholder="Short summary of the article"
                      className="text-left"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="display_order" className="block text-left mb-1 font-semibold">Display Order</Label>
                      <Input
                        id="display_order"
                        type="number"
                        value={formData.display_order}
                        onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                        placeholder="0"
                        className="text-left"
                      />
                    </div>

                    <div className="flex items-center space-x-2 pt-6">
                      <Switch
                        id="is_published"
                        checked={formData.is_published}
                        onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
                      />
                      <Label htmlFor="is_published" className="font-semibold">Published</Label>
                    </div>
                  </div>
                </div>
              )}

              {formTab === "content" && (
                <div className="space-y-4 text-left">
                  <div>
                    <Label htmlFor="content" className="block text-left mb-2 font-semibold">Article Content *</Label>
                    <div className="bg-white rounded-md border">
                      <ReactQuill
                        theme="snow"
                        value={formData.content}
                        onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                        modules={{
                          toolbar: [
                            [{ 'header': [1, 2, 3, 4, false] }],
                            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                            [{'list': 'ordered'}, {'list': 'bullet'}],
                            ['link', 'image', 'clean']
                          ]
                        }}
                        style={{ height: '350px', marginBottom: '50px' }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {formTab === "author" && (
                <div className="space-y-4 text-left">
                  <div>
                    <Label htmlFor="author" className="block mb-1 font-semibold">Author Name</Label>
                    <Input
                      id="author"
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      placeholder="Author name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="author_avatar" className="block mb-1 font-semibold">Author Avatar Image</Label>
                    <ImageUpload
                      label="Upload Avatar"
                      value={formData.author_avatar}
                      onChange={(url) => setFormData(prev => ({ ...prev, author_avatar: url }))}
                    />
                  </div>
                </div>
              )}

              {formTab === "seo" && (
                <div className="space-y-4 text-left">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-sm">SEO Meta Tags</h3>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        const tempText = stripHtml(formData.content);
                        setFormData(prev => ({
                          ...prev,
                          meta_title: prev.title,
                          meta_description: tempText.slice(0, 160)
                        }));
                        toast({
                          title: "Generated automatically",
                          description: "Meta tags have been populated from title and content.",
                        });
                      }}
                    >
                      Auto-generate from Content
                    </Button>
                  </div>

                  <div>
                    <Label htmlFor="meta_title" className="block mb-1 font-semibold">Meta Title (Page Title)</Label>
                    <Input
                      id="meta_title"
                      value={formData.meta_title}
                      onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                      placeholder="SEO Title (recommended 50-60 characters)"
                      maxLength={60}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {formData.meta_title.length}/60 characters
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="meta_description" className="block mb-1 font-semibold">Meta Description (Page Description)</Label>
                    <Textarea
                      id="meta_description"
                      value={formData.meta_description}
                      onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                      placeholder="SEO Description (recommended 150-160 characters)"
                      rows={3}
                      maxLength={160}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {formData.meta_description.length}/160 characters
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="canonical_url" className="block mb-1 font-semibold">Canonical URL</Label>
                    <Input
                      id="canonical_url"
                      value={formData.canonical_url}
                      onChange={(e) => setFormData({ ...formData, canonical_url: e.target.value })}
                      placeholder="https://www.ecovluu.com/blog/example-slug"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-6 pt-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="noindex"
                        checked={formData.noindex}
                        onCheckedChange={(checked) => setFormData({ ...formData, noindex: checked })}
                      />
                      <Label htmlFor="noindex" className="font-semibold text-sm">Noindex (Hide from search engines)</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="nofollow"
                        checked={formData.nofollow}
                        onCheckedChange={(checked) => setFormData({ ...formData, nofollow: checked })}
                      />
                      <Label htmlFor="nofollow" className="font-semibold text-sm">Nofollow (Do not follow links on page)</Label>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-4 border-t">
                <Button type="submit">
                  {editingPost ? "Update Post" : "Create Post"}
                </Button>
                {editingPost && (
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel Edit
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {posts.map((post, index) => (
          <Card key={post.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold text-left w-full">{post.title}</h3>
                    {post.is_published ? (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Published</span>
                    ) : (
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">Draft</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2 text-left w-full">/{post.slug}</p>
                  <p className="text-sm text-gray-700 line-clamp-2 text-left w-full">{stripHtml(post.content)}</p>
                  <div className="flex gap-4 items-center mt-3">
                    {post.image && (
                      <img src={post.image} alt={post.title} className="w-32 h-20 object-cover rounded border" />
                    )}
                    {post.author && (
                      <div className="flex items-center gap-2">
                        {post.author_avatar ? (
                          <img src={post.author_avatar} alt={post.author} className="w-8 h-8 rounded-full object-cover border" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange font-bold text-xs">
                            {post.author.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span className="text-xs text-gray-600 font-medium">By {post.author}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(post)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setPostToDelete(post.id);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleMove(post.id, 'up')}
                    disabled={index === 0}
                  >
                    <MoveUp className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleMove(post.id, 'down')}
                    disabled={index === posts.length - 1}
                  >
                    <MoveDown className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the blog post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BlogSection;
