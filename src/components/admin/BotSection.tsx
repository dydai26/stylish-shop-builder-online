import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Pencil, Trash2, MoveUp, MoveDown } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface BotFAQ {
  id: string;
  question: string;
  answer: string;
  display_order: number;
  created_at: string;
}

const BotSection = () => {
  const [faqs, setFaqs] = useState<BotFAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingFaq, setEditingFaq] = useState<BotFAQ | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    display_order: 0,
  });

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from("bot_faqs")
        .select("*")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (error) throw error;
      setFaqs(data || []);
    } catch (error) {
      console.error("Error fetching bot FAQs:", error);
      toast({
        title: "Error",
        description: "Failed to fetch bot FAQs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.question || !formData.answer) {
      toast({
        title: "Error",
        description: "Please fill in all required fields (Question, Answer)",
        variant: "destructive",
      });
      return;
    }

    try {
      const payload = {
        question: formData.question,
        answer: formData.answer,
        display_order: formData.display_order,
      };

      if (editingFaq) {
        const { error } = await (supabase as any)
          .from("bot_faqs")
          .update(payload)
          .eq("id", editingFaq.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "FAQ updated successfully",
        });
      } else {
        const { error } = await (supabase as any)
          .from("bot_faqs")
          .insert([payload]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "FAQ created successfully",
        });
      }

      resetForm();
      fetchFaqs();
    } catch (error: any) {
      console.error("Error saving FAQ:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save FAQ",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (faq: BotFAQ) => {
    setEditingFaq(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      display_order: faq.display_order,
    });
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!faqToDelete) return;

    try {
      const { error } = await (supabase as any)
        .from("bot_faqs")
        .delete()
        .eq("id", faqToDelete);

      if (error) throw error;

      toast({
        title: "Success",
        description: "FAQ deleted successfully",
      });

      fetchFaqs();
    } catch (error) {
      console.error("Error deleting FAQ:", error);
      toast({
        title: "Error",
        description: "Failed to delete FAQ",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setFaqToDelete(null);
    }
  };

  const handleMove = async (faqId: string, direction: "up" | "down") => {
    const currentIndex = faqs.findIndex((f) => f.id === faqId);
    if (
      (direction === "up" && currentIndex === 0) ||
      (direction === "down" && currentIndex === faqs.length - 1)
    ) {
      return;
    }

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    const currentFaq = faqs[currentIndex];
    const targetFaq = faqs[newIndex];

    try {
      // Swap display orders in database
      await (supabase as any)
        .from("bot_faqs")
        .update({ display_order: targetFaq.display_order })
        .eq("id", currentFaq.id);

      await (supabase as any)
        .from("bot_faqs")
        .update({ display_order: currentFaq.display_order })
        .eq("id", targetFaq.id);

      fetchFaqs();
    } catch (error) {
      console.error("Error moving FAQ:", error);
      toast({
        title: "Error",
        description: "Failed to reorder FAQs",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      question: "",
      answer: "",
      display_order: 0,
    });
    setEditingFaq(null);
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
        <h2 className="text-2xl font-bold">Chatbot FAQs</h2>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-2" />
          {showForm ? "Cancel" : "Add New FAQ"}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardContent className="pt-6 text-left">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="question" className="block mb-1 font-semibold">Question *</Label>
                <Input
                  id="question"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  placeholder="Enter the question (e.g. Shipping Time)"
                  required
                />
              </div>

              <div>
                <Label htmlFor="answer" className="block mb-1 font-semibold">Answer *</Label>
                <Textarea
                  id="answer"
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  placeholder="Enter the response answer text..."
                  rows={4}
                  required
                />
              </div>

              <div>
                <Label htmlFor="display_order" className="block mb-1 font-semibold">Display Order</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>

              <div className="flex gap-2 pt-2 border-t">
                <Button type="submit">
                  {editingFaq ? "Update FAQ" : "Create FAQ"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {faqs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No chatbot FAQs configured. The bot will run on local defaults until you add questions here.
          </div>
        ) : (
          faqs.map((faq, index) => (
            <Card key={faq.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 text-left">
                    <h3 className="text-lg font-bold mb-1 text-brand-brown">{faq.question}</h3>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{faq.answer}</p>
                    <div className="mt-2">
                      <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2.5 py-1 rounded font-medium">
                        Order: {faq.display_order}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(faq)}
                      title="Edit FAQ"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setFaqToDelete(faq.id);
                        setDeleteDialogOpen(true);
                      }}
                      title="Delete FAQ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleMove(faq.id, "up")}
                      disabled={index === 0}
                      title="Move Up"
                    >
                      <MoveUp className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleMove(faq.id, "down")}
                      disabled={index === faqs.length - 1}
                      title="Move Down"
                    >
                      <MoveDown className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this FAQ from the chatbot questions list.
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

export default BotSection;
