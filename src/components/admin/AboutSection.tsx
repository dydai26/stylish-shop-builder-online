import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { getAboutContent, updateAboutContent, type AboutSettings } from '@/lib/aboutService';
import { uploadImage } from '@/lib/imageUploadService';
import { Loader2, Save, Upload, Trash2, Plus, Eye } from 'lucide-react';
import ImageUpload from '@/components/ui/ImageUpload';

const AboutSection: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // State for home philosophy
  const [homePhilosophy, setHomePhilosophy] = useState<AboutSettings | null>(null);
  
  // State for about page
  const [aboutPage, setAboutPage] = useState<AboutSettings | null>(null);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setLoading(true);
      const homeData = await getAboutContent('home_philosophy');
      const aboutData = await getAboutContent('about_page');
      
      if (homeData) {
        const meta_title = homeData.meta_title || (homeData.title ? `${homeData.title} - Restore, Hydrate & Strengthen | EcoVluu` : "");
        let meta_description = homeData.meta_description;
        if (!meta_description && homeData.description) {
          const textOnly = homeData.description.replace(/<[^>]*>/g, "");
          meta_description = textOnly.slice(0, 150).trim();
          if (textOnly.length > 150) {
            meta_description += "...";
          }
        }
        setHomePhilosophy({
          ...homeData,
          meta_title,
          meta_description: meta_description || ""
        });
      }
      if (aboutData) {
        const meta_title = aboutData.meta_title || (aboutData.title ? `${aboutData.title} | ECOVLUU` : "");
        let meta_description = aboutData.meta_description;
        if (!meta_description && aboutData.description) {
          const textOnly = aboutData.description.replace(/<[^>]*>/g, "");
          meta_description = textOnly.slice(0, 150).trim();
          if (textOnly.length > 150) {
            meta_description += "...";
          }
        }
        setAboutPage({
          ...aboutData,
          meta_title,
          meta_description: meta_description || ""
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load content data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveHome = async () => {
    if (!homePhilosophy) return;
    try {
      setSaving(true);
      const success = await updateAboutContent('home_philosophy', {
        title: homePhilosophy.title,
        description: homePhilosophy.description,
        images: homePhilosophy.images,
        meta_title: homePhilosophy.meta_title,
        meta_description: homePhilosophy.meta_description,
      });

      if (success) {
        toast({
          title: "Success",
          description: "Homepage philosophy updated successfully!",
        });
        loadContent();
      } else {
        throw new Error();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save homepage philosophy",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAbout = async () => {
    if (!aboutPage) return;
    try {
      setSaving(true);
      const success = await updateAboutContent('about_page', {
        title: aboutPage.title,
        description: aboutPage.description,
        images: aboutPage.images,
        content: aboutPage.content,
        meta_title: aboutPage.meta_title,
        meta_description: aboutPage.meta_description,
      });

      if (success) {
        toast({
          title: "Success",
          description: "About page content updated successfully!",
        });
        loadContent();
      } else {
        throw new Error();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save About page content",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAddSlide = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !aboutPage) return;

    try {
      setSaving(true);
      const result = await uploadImage(file, 'about');
      const updatedImages = [...(aboutPage.images || []), result.url];
      setAboutPage({ ...aboutPage, images: updatedImages });
      
      toast({
        title: "Uploaded",
        description: "New slide added to the list",
      });
    } catch (error) {
      toast({
        title: "Upload Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSlide = (index: number) => {
    if (!aboutPage || !aboutPage.images) return;
    const updatedImages = aboutPage.images.filter((_, i) => i !== index);
    setAboutPage({ ...aboutPage, images: updatedImages });
  };

  const handleUpdateApproach = (index: number, field: string, value: string) => {
    if (!aboutPage || !aboutPage.content || !aboutPage.content.approach) return;
    const updatedApproach = [...aboutPage.content.approach];
    updatedApproach[index] = { ...updatedApproach[index], [field]: value };
    setAboutPage({
      ...aboutPage,
      content: { ...aboutPage.content, approach: updatedApproach }
    });
  };

  const handleUpdateFounderText = (text: string) => {
    if (!aboutPage || !aboutPage.content || !aboutPage.content.founder) return;
    setAboutPage({
      ...aboutPage,
      content: {
        ...aboutPage.content,
        founder: { ...aboutPage.content.founder, text }
      }
    });
  };

  const handleUpdateFounderImage = (imgIndex: number, url: string) => {
    if (!aboutPage || !aboutPage.content || !aboutPage.content.founder || !aboutPage.content.founder.images) return;
    const updatedImages = [...aboutPage.content.founder.images];
    updatedImages[imgIndex] = url;
    setAboutPage({
      ...aboutPage,
      content: {
        ...aboutPage.content,
        founder: { ...aboutPage.content.founder, images: updatedImages }
      }
    });
  };

  const handleUpdateStep = (index: number, field: string, value: string) => {
    if (!aboutPage || !aboutPage.content || !aboutPage.content.steps) return;
    const updatedSteps = [...aboutPage.content.steps];
    updatedSteps[index] = { ...updatedSteps[index], [field]: value };
    setAboutPage({
      ...aboutPage,
      content: { ...aboutPage.content, steps: updatedSteps }
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-brand-brown" />
        <span className="ml-2 text-gray-500">Loading content...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center text-left">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">About Us CMS</h2>
          <p className="text-gray-500">Edit description text, carousel slides, active ingredients, and care steps.</p>
        </div>
      </div>

      <Tabs defaultValue="home" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6 max-w-md">
          <TabsTrigger value="home">Homepage Block</TabsTrigger>
          <TabsTrigger value="about">About Page</TabsTrigger>
        </TabsList>

        {/* 1. HOME PHILOSOPHY TAB */}
        <TabsContent value="home">
          {homePhilosophy && (
            <Card className="text-left">
              <CardHeader>
                <CardTitle>Homepage "About Ecovluu" Philosophy Block</CardTitle>
                <CardDescription>
                  Edit the image and philosophy text displayed in the "About Us" section on the homepage.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="home-title">Title</Label>
                      <Input
                        id="home-title"
                        value={homePhilosophy.title || ''}
                        onChange={(e) => setHomePhilosophy({ ...homePhilosophy, title: e.target.value })}
                        placeholder="e.g., About Ecovluu"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="home-desc">Philosophy Text</Label>
                      <Textarea
                        id="home-desc"
                        rows={6}
                        value={homePhilosophy.description || ''}
                        onChange={(e) => setHomePhilosophy({ ...homePhilosophy, description: e.target.value })}
                        placeholder="Enter brand description..."
                      />
                    </div>
                  </div>
                  <div>
                    <ImageUpload
                      label="Section Image"
                      value={homePhilosophy.images?.[0] || '/2.jpg'}
                      onChange={(url) => setHomePhilosophy({ ...homePhilosophy, images: [url] })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                  <div className="space-y-2">
                    <Label htmlFor="home-meta-title">SEO Title (Auto)</Label>
                    <Input
                      id="home-meta-title"
                      value={homePhilosophy.meta_title || ''}
                      onChange={(e) => setHomePhilosophy({ ...homePhilosophy, meta_title: e.target.value })}
                      placeholder="Leave blank for auto-generation"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="home-meta-desc">SEO Description (Auto)</Label>
                    <Input
                      id="home-meta-desc"
                      value={homePhilosophy.meta_description || ''}
                      onChange={(e) => setHomePhilosophy({ ...homePhilosophy, meta_description: e.target.value })}
                      placeholder="Leave blank for auto-generation"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t">
                  <Button 
                    onClick={handleSaveHome} 
                    disabled={saving}
                    className="bg-[#8B4513] hover:bg-[#A0522D] text-white"
                  >
                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Save className="mr-2 h-4 w-4" />
                    Save Homepage Block
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* 2. ABOUT PAGE CONTENT TAB */}
        <TabsContent value="about">
          {aboutPage && (
            <div className="space-y-6 text-left">
              {/* Main Banner Text & Meta */}
              <Card>
                <CardHeader>
                  <CardTitle>Page Title & SEO Metadata</CardTitle>
                  <CardDescription>
                    Configure the page title and search engine optimization. Meta tags will generate automatically if left blank.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="about-title">Main Title</Label>
                      <Input
                        id="about-title"
                        value={aboutPage.title || ''}
                        onChange={(e) => setAboutPage({ ...aboutPage, title: e.target.value })}
                        placeholder="e.g. About Us"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="about-desc">Short Description</Label>
                      <Input
                        id="about-desc"
                        value={aboutPage.description || ''}
                        onChange={(e) => setAboutPage({ ...aboutPage, description: e.target.value })}
                        placeholder="Brand tagline..."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-2">
                      <Label htmlFor="meta-title">SEO Title (Auto)</Label>
                      <Input
                        id="meta-title"
                        value={aboutPage.meta_title || ''}
                        onChange={(e) => setAboutPage({ ...aboutPage, meta_title: e.target.value })}
                        placeholder="Leave blank for auto-generation"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="meta-desc">SEO Description (Auto)</Label>
                      <Input
                        id="meta-desc"
                        value={aboutPage.meta_description || ''}
                        onChange={(e) => setAboutPage({ ...aboutPage, meta_description: e.target.value })}
                        placeholder="Leave blank for auto-generation"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Slider Images */}
              <Card>
                <CardHeader>
                  <CardTitle>About Page Carousel Photos</CardTitle>
                  <CardDescription>
                    These photos are displayed in the carousel slider. Recommended square ratio (1:1) and maximum 1600px size.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {aboutPage.images && aboutPage.images.map((slide, index) => (
                      <div key={index} className="relative group rounded-lg overflow-hidden border bg-gray-50 aspect-square">
                        <img 
                          src={slide} 
                          alt={`Slide ${index + 1}`} 
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => handleDeleteSlide(index)}
                          className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-full shadow transition-opacity opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="absolute bottom-1 left-2 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
                          Slide {index + 1}
                        </div>
                      </div>
                    ))}

                    <div className="border-2 border-dashed border-gray-300 hover:border-brand-brown rounded-lg flex flex-col justify-center items-center aspect-square cursor-pointer transition-colors relative">
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleAddSlide} 
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        disabled={saving}
                      />
                      <Plus className="w-8 h-8 text-gray-400" />
                      <span className="text-xs text-gray-500 mt-2 font-medium">Add Photo</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Approach (Ingredients - 6 items) */}
              <Card>
                <CardHeader>
                  <CardTitle>Our Approach & Active Ingredients (6 Blocks)</CardTitle>
                  <CardDescription>
                    Edit images, titles, and descriptions of your active product ingredients.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {aboutPage.content && aboutPage.content.approach && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {aboutPage.content.approach.map((item: any, index: number) => (
                        <div key={index} className="flex flex-col sm:flex-row gap-4 p-4 border rounded-xl bg-gray-50/50">
                          <div className="flex flex-col items-center gap-2 flex-shrink-0 w-full sm:w-24">
                            <div className="relative w-20 h-20 rounded-lg overflow-hidden border bg-white group shadow-sm">
                              <img 
                                src={item.image} 
                                alt={item.title} 
                                className="w-full h-full object-cover"
                              />
                              <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity text-white text-[10px] text-center font-medium">
                                <Upload className="w-4 h-4 mb-1" />
                                Change
                                <input 
                                  type="file" 
                                  accept="image/*"
                                  className="hidden"
                                  disabled={saving}
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    try {
                                      setSaving(true);
                                      const result = await uploadImage(file, 'about');
                                      handleUpdateApproach(index, 'image', result.url);
                                      toast({ title: "Success", description: "Ingredient image updated!" });
                                    } catch (err) {
                                      toast({ title: "Error", description: "Failed to upload image", variant: "destructive" });
                                    } finally {
                                      setSaving(false);
                                    }
                                  }}
                                />
                              </label>
                            </div>
                            <span className="text-[10px] text-gray-400 font-bold tracking-wider">PHOTO #{index + 1}</span>
                          </div>
                          <div className="flex-1 space-y-3">
                            <div>
                              <Label className="text-[11px] font-bold text-gray-400 tracking-wider">INGREDIENT #{index + 1}</Label>
                              <Input
                                value={item.title}
                                onChange={(e) => handleUpdateApproach(index, 'title', e.target.value)}
                                className="font-semibold text-sm mt-1"
                              />
                            </div>
                            <div>
                              <Label className="text-[11px] font-bold text-gray-400">DESCRIPTION</Label>
                              <Textarea
                                value={item.description}
                                rows={2}
                                onChange={(e) => handleUpdateApproach(index, 'description', e.target.value)}
                                className="text-xs mt-1"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Founder Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Founder Section</CardTitle>
                  <CardDescription>
                    Block about the brand's creation story and philosophy from the founder.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {aboutPage.content && aboutPage.content.founder && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-2 space-y-2">
                        <Label htmlFor="founder-text">Founder Story</Label>
                        <Textarea
                          id="founder-text"
                          rows={8}
                          value={aboutPage.content.founder.text}
                          onChange={(e) => handleUpdateFounderText(e.target.value)}
                          placeholder="Creation story in first-person..."
                        />
                      </div>
                      <div className="space-y-4">
                        <Label>Founder Photos (3 items)</Label>
                        <div className="grid grid-cols-3 gap-2">
                          {aboutPage.content.founder.images && aboutPage.content.founder.images.map((img: string, idx: number) => (
                            <div key={idx} className="space-y-1">
                              <div className="h-16 rounded border overflow-hidden">
                                <img src={img} className="w-full h-full object-cover" alt="" />
                              </div>
                              <input 
                                type="file" 
                                accept="image/*"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  try {
                                    setSaving(true);
                                    const result = await uploadImage(file, 'about');
                                    handleUpdateFounderImage(idx, result.url);
                                  } catch (err) {
                                    toast({ title: "Error", description: "Failed to upload photo", variant: "destructive" });
                                  } finally {
                                    setSaving(false);
                                  }
                                }}
                                className="w-full text-[10px] hidden"
                                id={`founder-img-file-${idx}`}
                              />
                              <Button
                                size="sm" 
                                variant="outline" 
                                className="w-full text-[10px] h-6 px-1"
                                onClick={() => document.getElementById(`founder-img-file-${idx}`)?.click()}
                              >
                                Change #{idx + 1}
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Steps of Care */}
              <Card>
                <CardHeader>
                  <CardTitle>Steps of Care (4 Steps)</CardTitle>
                  <CardDescription>
                    Step-by-step instructions for correct application and usage of hair care products.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {aboutPage.content && aboutPage.content.steps && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {aboutPage.content.steps.map((step: any, index: number) => (
                        <div key={index} className="p-4 border rounded-xl bg-gray-50 space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#E08F35] text-white font-bold text-sm">
                              {step.num}
                            </span>
                            <span className="text-[10px] font-bold text-gray-400">STEP #{index + 1}</span>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-[10px] text-gray-400 font-bold">ACTION NAME</Label>
                            <Input
                              value={step.title}
                              onChange={(e) => handleUpdateStep(index, 'title', e.target.value)}
                              className="font-medium text-sm"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-[10px] text-gray-400 font-bold">DESCRIPTION</Label>
                            <Textarea
                              value={step.desc}
                              rows={3}
                              onChange={(e) => handleUpdateStep(index, 'desc', e.target.value)}
                              className="text-xs"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex justify-end pt-4 border-t gap-4">
                <Button 
                  onClick={handleSaveAbout} 
                  disabled={saving}
                  className="bg-[#8B4513] hover:bg-[#A0522D] text-white"
                >
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Save className="mr-2 h-4 w-4" />
                  Save About Page
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AboutSection;
