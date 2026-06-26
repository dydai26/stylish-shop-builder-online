import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Trash2, Plus, MessageSquare, Calendar } from "lucide-react";
import { fetchAllReviews, addReview, deleteReview, Review } from "@/lib/reviewsService";
import { useToast } from "@/hooks/use-toast";

export const ReviewsSection = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newReview, setNewReview] = useState({
    name: "",
    text: "",
    rating: 5
  });
  const { toast } = useToast();

  const loadReviews = async () => {
    try {
      setLoading(true);
      const data = await fetchAllReviews();
      setReviews(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load reviews",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating = ratingFilter === "all" || review.rating.toString() === ratingFilter;
    return matchesSearch && matchesRating;
  });

  const handleAddReview = async () => {
    if (!newReview.name || !newReview.text) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      await addReview({
        name: newReview.name,
        text: newReview.text,
        rating: newReview.rating,
        date: new Date().toISOString()
      });
      
      toast({
        title: "Success",
        description: "Review added successfully"
      });
      
      setIsAddDialogOpen(false);
      setNewReview({ name: "", text: "", rating: 5 });
      loadReviews();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add review",
        variant: "destructive"
      });
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      await deleteReview(reviewId);
      toast({
        title: "Success",
        description: "Review deleted successfully"
      });
      loadReviews();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete review",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Reviews Management</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Review
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Review</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Customer Name *</Label>
                <Input
                  id="name"
                  value={newReview.name}
                  onChange={(e) => setNewReview(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter customer name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rating">Rating *</Label>
                <Select
                  value={newReview.rating.toString()}
                  onValueChange={(value) => setNewReview(prev => ({ ...prev, rating: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <SelectItem key={rating} value={rating.toString()}>
                        {rating} Star{rating !== 1 ? 's' : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="text">Review Text *</Label>
                <Textarea
                  id="text"
                  value={newReview.text}
                  onChange={(e) => setNewReview(prev => ({ ...prev, text: e.target.value }))}
                  placeholder="Enter review text"
                  rows={4}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddReview}>
                  Add Review
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reviews.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reviews.length > 0 
                ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
                : '0.0'
              }
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">5 Star Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reviews.filter(review => review.rating === 5).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Recent Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reviews.filter(review => {
                const reviewDate = new Date(review.created_at);
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return reviewDate > weekAgo;
              }).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <Input
          placeholder="Search reviews..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select value={ratingFilter} onValueChange={setRatingFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Ratings</SelectItem>
            <SelectItem value="5">5 Stars</SelectItem>
            <SelectItem value="4">4 Stars</SelectItem>
            <SelectItem value="3">3 Stars</SelectItem>
            <SelectItem value="2">2 Stars</SelectItem>
            <SelectItem value="1">1 Star</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Reviews Found</h3>
                <p className="text-muted-foreground">
                  {reviews.length === 0 
                    ? "No reviews have been submitted yet."
                    : "No reviews match your current filters."
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredReviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium text-left w-full">{review.name}</h3>
                      {renderStars(review.rating)}
                      <div variant="outline">
                        {review.rating} star{review.rating !== 1 ? 's' : ''}
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-3 text-left w-full">{review.text}</p>
                    {review.email && (
                      <p className="text-sm text-muted-foreground mb-2 text-left w-full">
                        <strong>Email:</strong> {review.email}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground text-left w-full justify-start">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(review.created_at)}</span>
                    </div>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-destructive ">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Review</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this review from {review.name}? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteReview(review.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};