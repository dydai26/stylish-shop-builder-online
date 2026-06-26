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
}

const BlogSection = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content || !formData.image) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const slug = formData.slug || generateSlug(formData.title);
      
      if (editingPost) {
        const { error } = await supabase
          .from('blog_posts')
          .update({ ...formData, slug })
          .eq('id', editingPost.id);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Blog post updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('blog_posts')
          .insert([{ ...formData, slug }]);

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
    });
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
    });
    setEditingPost(null);
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
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter post title"
                  required
                />
              </div>

              <div>
                <Label htmlFor="slug">Slug </Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="post-url-slug"
                />
              </div>

              <div>
                <Label htmlFor="content">Content * (Use double line breaks for paragraphs)</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Enter post content. Use double line breaks to separate paragraphs."
                  rows={10}
                  required
                />
              </div>

              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Short description (optional)"
                  rows={3}
                />
              </div>

              <div>
                <ImageUpload
                  label="Blog Post Image"
                  value={formData.image}
                  onChange={handleImageChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  placeholder="Author name"
                />
              </div>

              <div>
                <Label htmlFor="display_order">Display Order</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_published"
                  checked={formData.is_published}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
                />
                <Label htmlFor="is_published">Published</Label>
              </div>

              <div className="flex gap-2">
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
                  <p className="text-sm text-gray-700 line-clamp-2 text-left w-full">{post.content}</p>
                  {post.image && (
                    <img src={post.image} alt={post.title} className="mt-3 w-32 h-20 object-cover rounded" />
                  )}
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
