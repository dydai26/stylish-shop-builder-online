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
      
      if (homeData) setHomePhilosophy(homeData);
      if (aboutData) setAboutPage(aboutData);
    } catch (error) {
      toast({
        title: "Помилка",
        description: "Не вдалося завантажити дані контенту",
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
      });

      if (success) {
        toast({
          title: "Успішно",
          description: "Філософію на головній сторінці оновлено!",
        });
        loadContent();
      } else {
        throw new Error();
      }
    } catch (error) {
      toast({
        title: "Помилка",
        description: "Не вдалося зберегти філософію на головній сторінці",
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
          title: "Успішно",
          description: "Дані сторінки 'Про нас' оновлено!",
        });
        loadContent();
      } else {
        throw new Error();
      }
    } catch (error) {
      toast({
        title: "Помилка",
        description: "Не вдалося зберегти дані сторінки 'Про нас'",
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
        title: "Завантажено",
        description: "Новий слайд додано до списку",
      });
    } catch (error) {
      toast({
        title: "Помилка завантаження",
        description: "Не вдалося завантажити зображення",
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
        <span className="ml-2 text-gray-500">Завантаження контенту...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center text-left">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Керування сторінкою "Про нас" (CMS)</h2>
          <p className="text-gray-500">Редагування описів, картинок каруселі, інгредієнтів та кроків догляду.</p>
        </div>
      </div>

      <Tabs defaultValue="home" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6 max-w-md">
          <TabsTrigger value="home">Блок на Головній</TabsTrigger>
          <TabsTrigger value="about">Сторінка "Про нас"</TabsTrigger>
        </TabsList>

        {/* 1. HOME PHILOSOPHY TAB */}
        <TabsContent value="home">
          {homePhilosophy && (
            <Card className="text-left">
              <CardHeader>
                <CardTitle>Блок філософії "About Ecovluu" на Головній</CardTitle>
                <CardDescription>
                  Редагуйте зображення та текст філософії, що відображаються у блоці "Про нас" на головній сторінці.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="home-title">Заголовок</Label>
                      <Input
                        id="home-title"
                        value={homePhilosophy.title || ''}
                        onChange={(e) => setHomePhilosophy({ ...homePhilosophy, title: e.target.value })}
                        placeholder="Наприклад: About Ecovluu"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="home-desc">Текст філософії</Label>
                      <Textarea
                        id="home-desc"
                        rows={6}
                        value={homePhilosophy.description || ''}
                        onChange={(e) => setHomePhilosophy({ ...homePhilosophy, description: e.target.value })}
                        placeholder="Введіть опис бренду..."
                      />
                    </div>
                  </div>
                  <div>
                    <ImageUpload
                      label="Фото блоку"
                      value={homePhilosophy.images?.[0] || '/2.jpg'}
                      onChange={(url) => setHomePhilosophy({ ...homePhilosophy, images: [url] })}
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
                    Зберегти блок головної
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
                  <CardTitle>Основний заголовок та SEO мета-дані</CardTitle>
                  <CardDescription>
                    Налаштування назви сторінки та пошукової оптимізації. Мета-опис згенерується автоматично, якщо залишити поле порожнім.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="about-title">Головний заголовок</Label>
                      <Input
                        id="about-title"
                        value={aboutPage.title || ''}
                        onChange={(e) => setAboutPage({ ...aboutPage, title: e.target.value })}
                        placeholder="Наприклад: About Us"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="about-desc">Короткий опис під банером</Label>
                      <Input
                        id="about-desc"
                        value={aboutPage.description || ''}
                        onChange={(e) => setAboutPage({ ...aboutPage, description: e.target.value })}
                        placeholder="Короткий слоган бренду..."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-2">
                      <Label htmlFor="meta-title">SEO Title (Авто / Вручну)</Label>
                      <Input
                        id="meta-title"
                        value={aboutPage.meta_title || ''}
                        onChange={(e) => setAboutPage({ ...aboutPage, meta_title: e.target.value })}
                        placeholder="Залиште порожнім для автогенерації"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="meta-desc">SEO Description (Авто / Вручну)</Label>
                      <Input
                        id="meta-desc"
                        value={aboutPage.meta_description || ''}
                        onChange={(e) => setAboutPage({ ...aboutPage, meta_description: e.target.value })}
                        placeholder="Залиште порожнім для автогенерації"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Slider Images */}
              <Card>
                <CardHeader>
                  <CardTitle>Фотографії в каруселі сторінки "Про нас"</CardTitle>
                  <CardDescription>
                    Ці фото відображаються у слайдері сторінки. Рекомендується завантажувати квадратні фотографії (1:1 ratio) розміром не більше 1600px.
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
                          Слайд {index + 1}
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
                      <span className="text-xs text-gray-500 mt-2 font-medium">Додати фото</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Approach (Ingredients - 6 items) */}
              <Card>
                <CardHeader>
                  <CardTitle>Наш підхід та Інгредієнти (6 блоків)</CardTitle>
                  <CardDescription>
                    Редагуйте зображення, заголовки та опис активних інгредієнтів вашої продукції.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {aboutPage.content && aboutPage.content.approach && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {aboutPage.content.approach.map((item: any, index: number) => (
                        <div key={index} className="flex gap-4 p-4 border rounded-xl bg-gray-50/50">
                          <div className="w-24 flex-shrink-0">
                            <ImageUpload
                              label=""
                              value={item.image}
                              onChange={(url) => handleUpdateApproach(index, 'image', url)}
                            />
                          </div>
                          <div className="flex-1 space-y-3">
                            <div>
                              <Label className="text-[11px] font-bold text-gray-400 tracking-wider">ІНГРЕДІЄНТ #{index + 1}</Label>
                              <Input
                                value={item.title}
                                onChange={(e) => handleUpdateApproach(index, 'title', e.target.value)}
                                className="font-semibold text-sm mt-1"
                              />
                            </div>
                            <div>
                              <Label className="text-[11px] font-bold text-gray-400">ОПИС</Label>
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
                  <CardTitle>Розділ "Засновник" (Founder Section)</CardTitle>
                  <CardDescription>
                    Блок про історію створення та філософію від імені засновника бренду.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {aboutPage.content && aboutPage.content.founder && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-2 space-y-2">
                        <Label htmlFor="founder-text">Історія засновника</Label>
                        <Textarea
                          id="founder-text"
                          rows={8}
                          value={aboutPage.content.founder.text}
                          onChange={(e) => handleUpdateFounderText(e.target.value)}
                          placeholder="Історія створення від першої особи..."
                        />
                      </div>
                      <div className="space-y-4">
                        <Label>Фотографії засновника (3 шт.)</Label>
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
                                    toast({ title: "Помилка", description: "Не вдалося завантажити фото", variant: "destructive" });
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
                                Змінити #{idx + 1}
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
                  <CardTitle>Кроки Догляду (4 кроки)</CardTitle>
                  <CardDescription>
                    Покрокова інструкція правильного використання та застосування косметичних засобів.
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
                            <span className="text-[10px] font-bold text-gray-400">КРОК #{index + 1}</span>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-[10px] text-gray-400 font-bold">НАЗВА ДІЇ</Label>
                            <Input
                              value={step.title}
                              onChange={(e) => handleUpdateStep(index, 'title', e.target.value)}
                              className="font-medium text-sm"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-[10px] text-gray-400 font-bold">ОПИС</Label>
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
                  Зберегти сторінку Про нас
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
