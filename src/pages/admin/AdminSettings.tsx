import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSiteSettings, useUpdateSiteSettings } from '@/hooks/useSiteSettings';
import { SiteSettings, SiteFeature, HowItWorksStep, MenuItem, FooterLink } from '@/lib/siteSettings';
import { Palette, Type, MessageCircle, Layout, FileText, Menu, Plus, Trash2, Save } from 'lucide-react';

const AdminSettings = () => {
  const { data: settings, isLoading } = useSiteSettings();
  const updateSettings = useUpdateSiteSettings();
  const [activeTab, setActiveTab] = useState('branding');

  if (isLoading || !settings) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-bold">Site Settings</h2>
        <p className="text-muted-foreground">Customize your website appearance and content</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-2 lg:grid-cols-6 gap-2 h-auto">
          <TabsTrigger value="branding" className="gap-2">
            <Type className="w-4 h-4" />
            <span className="hidden sm:inline">Branding</span>
          </TabsTrigger>
          <TabsTrigger value="colors" className="gap-2">
            <Palette className="w-4 h-4" />
            <span className="hidden sm:inline">Colors</span>
          </TabsTrigger>
          <TabsTrigger value="contact" className="gap-2">
            <MessageCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Contact</span>
          </TabsTrigger>
          <TabsTrigger value="hero" className="gap-2">
            <Layout className="w-4 h-4" />
            <span className="hidden sm:inline">Hero</span>
          </TabsTrigger>
          <TabsTrigger value="menu" className="gap-2">
            <Menu className="w-4 h-4" />
            <span className="hidden sm:inline">Menu</span>
          </TabsTrigger>
          <TabsTrigger value="content" className="gap-2">
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Content</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="branding">
          <BrandingSettings settings={settings} onUpdate={updateSettings.mutate} isUpdating={updateSettings.isPending} />
        </TabsContent>

        <TabsContent value="colors">
          <ColorSettings settings={settings} onUpdate={updateSettings.mutate} isUpdating={updateSettings.isPending} />
        </TabsContent>

        <TabsContent value="contact">
          <ContactSettings settings={settings} onUpdate={updateSettings.mutate} isUpdating={updateSettings.isPending} />
        </TabsContent>

        <TabsContent value="hero">
          <HeroSettings settings={settings} onUpdate={updateSettings.mutate} isUpdating={updateSettings.isPending} />
        </TabsContent>

        <TabsContent value="menu">
          <MenuSettings settings={settings} onUpdate={updateSettings.mutate} isUpdating={updateSettings.isPending} />
        </TabsContent>

        <TabsContent value="content">
          <ContentSettings settings={settings} onUpdate={updateSettings.mutate} isUpdating={updateSettings.isPending} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface SettingsCardProps {
  settings: SiteSettings;
  onUpdate: (data: Partial<SiteSettings>) => void;
  isUpdating: boolean;
}

// Branding Settings
const BrandingSettings = ({ settings, onUpdate, isUpdating }: SettingsCardProps) => {
  const [brandName, setBrandName] = useState(settings.brand_name);
  const [tagline, setTagline] = useState(settings.tagline || '');
  const [logoUrl, setLogoUrl] = useState(settings.logo_url || '');

  const handleSave = () => {
    onUpdate({ brand_name: brandName, tagline, logo_url: logoUrl || null });
    toast.success('Branding settings updated!');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Branding</CardTitle>
        <CardDescription>Your brand name, tagline, and logo</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="brandName">Brand Name</Label>
          <Input
            id="brandName"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            placeholder="Baby Carrier Rental"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tagline">Tagline</Label>
          <Input
            id="tagline"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            placeholder="Sling Library"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="logoUrl">Logo URL</Label>
          <Input
            id="logoUrl"
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
            placeholder="https://example.com/logo.png"
          />
          {logoUrl && (
            <div className="mt-2 p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Preview:</p>
              <img src={logoUrl} alt="Logo preview" className="h-12 w-auto object-contain" />
            </div>
          )}
        </div>
        <Button onClick={handleSave} disabled={isUpdating} className="gap-2">
          <Save className="w-4 h-4" />
          Save Branding
        </Button>
      </CardContent>
    </Card>
  );
};

// Color Settings
const ColorSettings = ({ settings, onUpdate, isUpdating }: SettingsCardProps) => {
  const [primary, setPrimary] = useState(settings.primary_color);
  const [secondary, setSecondary] = useState(settings.secondary_color);
  const [accent, setAccent] = useState(settings.accent_color);
  const [background, setBackground] = useState(settings.background_color);
  const [foreground, setForeground] = useState(settings.foreground_color);

  const handleSave = () => {
    onUpdate({
      primary_color: primary,
      secondary_color: secondary,
      accent_color: accent,
      background_color: background,
      foreground_color: foreground,
    });
    toast.success('Colors updated! Refresh to see changes.');
  };

  const ColorInput = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="25 95% 53%"
          className="flex-1"
        />
        <div 
          className="w-10 h-10 rounded border"
          style={{ backgroundColor: `hsl(${value})` }}
        />
      </div>
      <p className="text-xs text-muted-foreground">Format: H S% L% (e.g., 25 95% 53%)</p>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Color Scheme</CardTitle>
        <CardDescription>Customize your website colors (HSL format)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <ColorInput label="Primary Color" value={primary} onChange={setPrimary} />
          <ColorInput label="Secondary Color" value={secondary} onChange={setSecondary} />
          <ColorInput label="Accent Color" value={accent} onChange={setAccent} />
          <ColorInput label="Background Color" value={background} onChange={setBackground} />
          <ColorInput label="Foreground Color" value={foreground} onChange={setForeground} />
        </div>
        <Button onClick={handleSave} disabled={isUpdating} className="gap-2">
          <Save className="w-4 h-4" />
          Save Colors
        </Button>
      </CardContent>
    </Card>
  );
};

// Contact Settings
const ContactSettings = ({ settings, onUpdate, isUpdating }: SettingsCardProps) => {
  const [whatsapp, setWhatsapp] = useState(settings.whatsapp_number);
  const [whatsappMessage, setWhatsappMessage] = useState(settings.whatsapp_message || '');
  const [email, setEmail] = useState(settings.email || '');
  const [instagram, setInstagram] = useState(settings.instagram_url || '');

  const handleSave = () => {
    onUpdate({
      whatsapp_number: whatsapp,
      whatsapp_message: whatsappMessage || null,
      email: email || null,
      instagram_url: instagram || null,
    });
    toast.success('Contact settings updated!');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
        <CardDescription>WhatsApp, email, and social media links</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="whatsapp">WhatsApp Number</Label>
          <Input
            id="whatsapp"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="919876543210"
          />
          <p className="text-xs text-muted-foreground">Include country code without + (e.g., 919876543210)</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="whatsappMessage">Default WhatsApp Message</Label>
          <Input
            id="whatsappMessage"
            value={whatsappMessage}
            onChange={(e) => setWhatsappMessage(e.target.value)}
            placeholder="Hi! I am interested in renting a baby carrier."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="hello@example.com"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="instagram">Instagram URL</Label>
          <Input
            id="instagram"
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
            placeholder="https://instagram.com/yourusername"
          />
        </div>
        <Button onClick={handleSave} disabled={isUpdating} className="gap-2">
          <Save className="w-4 h-4" />
          Save Contact Info
        </Button>
      </CardContent>
    </Card>
  );
};

// Hero Settings
const HeroSettings = ({ settings, onUpdate, isUpdating }: SettingsCardProps) => {
  const [heroTitle, setHeroTitle] = useState(settings.hero_title);
  const [heroSubtitle, setHeroSubtitle] = useState(settings.hero_subtitle || '');
  const [heroImage, setHeroImage] = useState(settings.hero_image_url || '');
  const [heroCta, setHeroCta] = useState(settings.hero_cta_text || '');
  const [heroLink, setHeroLink] = useState(settings.hero_cta_link || '');
  const [features, setFeatures] = useState<SiteFeature[]>(settings.features);

  const handleSave = () => {
    onUpdate({
      hero_title: heroTitle,
      hero_subtitle: heroSubtitle || null,
      hero_image_url: heroImage || null,
      hero_cta_text: heroCta || null,
      hero_cta_link: heroLink || null,
      features,
    });
    toast.success('Hero section updated!');
  };

  const updateFeature = (index: number, field: keyof SiteFeature, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    setFeatures(newFeatures);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hero Section</CardTitle>
        <CardDescription>Main banner content and features</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="heroTitle">Hero Title</Label>
          <Input
            id="heroTitle"
            value={heroTitle}
            onChange={(e) => setHeroTitle(e.target.value)}
            placeholder="Baby Carrier Rental & Sling Library"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
          <Textarea
            id="heroSubtitle"
            value={heroSubtitle}
            onChange={(e) => setHeroSubtitle(e.target.value)}
            placeholder="Description text..."
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="heroImage">Hero Image URL</Label>
          <Input
            id="heroImage"
            value={heroImage}
            onChange={(e) => setHeroImage(e.target.value)}
            placeholder="https://example.com/hero.jpg"
          />
          {heroImage && (
            <div className="mt-2">
              <img src={heroImage} alt="Hero preview" className="w-full max-w-md rounded-lg" />
            </div>
          )}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="heroCta">CTA Button Text</Label>
            <Input
              id="heroCta"
              value={heroCta}
              onChange={(e) => setHeroCta(e.target.value)}
              placeholder="Browse Collection"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="heroLink">CTA Button Link</Label>
            <Input
              id="heroLink"
              value={heroLink}
              onChange={(e) => setHeroLink(e.target.value)}
              placeholder="/category/ring-slings"
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <Label>Features (shown below hero)</Label>
          {features.map((feature, index) => (
            <div key={index} className="grid gap-2 md:grid-cols-3 p-4 border rounded-lg">
              <Input
                value={feature.icon}
                onChange={(e) => updateFeature(index, 'icon', e.target.value)}
                placeholder="Icon (Award, Shield, Heart)"
              />
              <Input
                value={feature.title}
                onChange={(e) => updateFeature(index, 'title', e.target.value)}
                placeholder="Title"
              />
              <Input
                value={feature.description}
                onChange={(e) => updateFeature(index, 'description', e.target.value)}
                placeholder="Description"
              />
            </div>
          ))}
        </div>

        <Button onClick={handleSave} disabled={isUpdating} className="gap-2">
          <Save className="w-4 h-4" />
          Save Hero Section
        </Button>
      </CardContent>
    </Card>
  );
};

// Menu Settings
const MenuSettings = ({ settings, onUpdate, isUpdating }: SettingsCardProps) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(settings.menu_items);
  const [footerLinks, setFooterLinks] = useState<FooterLink[]>(settings.footer_links);
  const [footerDescription, setFooterDescription] = useState(settings.footer_description || '');

  const handleSave = () => {
    onUpdate({
      menu_items: menuItems,
      footer_links: footerLinks,
      footer_description: footerDescription || null,
    });
    toast.success('Menu and footer updated!');
  };

  const addMenuItem = () => {
    setMenuItems([...menuItems, { name: '', href: '/' }]);
  };

  const removeMenuItem = (index: number) => {
    setMenuItems(menuItems.filter((_, i) => i !== index));
  };

  const updateMenuItem = (index: number, field: keyof MenuItem, value: string) => {
    const newItems = [...menuItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setMenuItems(newItems);
  };

  const addFooterLink = () => {
    setFooterLinks([...footerLinks, { name: '', href: '/' }]);
  };

  const removeFooterLink = (index: number) => {
    setFooterLinks(footerLinks.filter((_, i) => i !== index));
  };

  const updateFooterLink = (index: number, field: keyof FooterLink, value: string) => {
    const newLinks = [...footerLinks];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setFooterLinks(newLinks);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Navigation Menu</CardTitle>
          <CardDescription>Header navigation links</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {menuItems.map((item, index) => (
            <div key={index} className="flex gap-2 items-center">
              <Input
                value={item.name}
                onChange={(e) => updateMenuItem(index, 'name', e.target.value)}
                placeholder="Link Name"
                className="flex-1"
              />
              <Input
                value={item.href}
                onChange={(e) => updateMenuItem(index, 'href', e.target.value)}
                placeholder="/path"
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeMenuItem(index)}
                className="text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button variant="outline" onClick={addMenuItem} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Menu Item
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Footer</CardTitle>
          <CardDescription>Footer description and links</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Footer Description</Label>
            <Textarea
              value={footerDescription}
              onChange={(e) => setFooterDescription(e.target.value)}
              placeholder="Brief description of your business..."
              rows={2}
            />
          </div>
          
          <Label>Footer Links</Label>
          {footerLinks.map((link, index) => (
            <div key={index} className="flex gap-2 items-center">
              <Input
                value={link.name}
                onChange={(e) => updateFooterLink(index, 'name', e.target.value)}
                placeholder="Link Name"
                className="flex-1"
              />
              <Input
                value={link.href}
                onChange={(e) => updateFooterLink(index, 'href', e.target.value)}
                placeholder="/path"
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeFooterLink(index)}
                className="text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button variant="outline" onClick={addFooterLink} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Footer Link
          </Button>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={isUpdating} className="gap-2">
        <Save className="w-4 h-4" />
        Save Menu & Footer
      </Button>
    </div>
  );
};

// Content Settings
const ContentSettings = ({ settings, onUpdate, isUpdating }: SettingsCardProps) => {
  const [policyContent, setPolicyContent] = useState(settings.policy_content || '');
  const [safetyContent, setSafetyContent] = useState(settings.safety_content || '');
  const [categoriesTitle, setCategoriesTitle] = useState(settings.categories_title || '');
  const [categoriesSubtitle, setCategoriesSubtitle] = useState(settings.categories_subtitle || '');
  const [howItWorksTitle, setHowItWorksTitle] = useState(settings.how_it_works_title || '');
  const [steps, setSteps] = useState<HowItWorksStep[]>(settings.how_it_works_steps);

  const handleSave = () => {
    onUpdate({
      policy_content: policyContent || null,
      safety_content: safetyContent || null,
      categories_title: categoriesTitle || null,
      categories_subtitle: categoriesSubtitle || null,
      how_it_works_title: howItWorksTitle || null,
      how_it_works_steps: steps,
    });
    toast.success('Content updated!');
  };

  const updateStep = (index: number, field: keyof HowItWorksStep, value: string | number) => {
    const newSteps = [...steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setSteps(newSteps);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Section Titles</CardTitle>
          <CardDescription>Customize homepage section headings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Categories Section Title</Label>
              <Input
                value={categoriesTitle}
                onChange={(e) => setCategoriesTitle(e.target.value)}
                placeholder="Browse by Category"
              />
            </div>
            <div className="space-y-2">
              <Label>Categories Section Subtitle</Label>
              <Input
                value={categoriesSubtitle}
                onChange={(e) => setCategoriesSubtitle(e.target.value)}
                placeholder="Find the perfect carrier..."
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>How It Works Title</Label>
            <Input
              value={howItWorksTitle}
              onChange={(e) => setHowItWorksTitle(e.target.value)}
              placeholder="How It Works"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How It Works Steps</CardTitle>
          <CardDescription>Steps shown on the homepage</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {steps.map((step, index) => (
            <div key={index} className="grid gap-2 md:grid-cols-3 p-4 border rounded-lg">
              <div className="space-y-1">
                <Label className="text-xs">Step Number</Label>
                <Input
                  type="number"
                  value={step.step}
                  onChange={(e) => updateStep(index, 'step', parseInt(e.target.value) || index + 1)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Title</Label>
                <Input
                  value={step.title}
                  onChange={(e) => updateStep(index, 'title', e.target.value)}
                  placeholder="Step title"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Description</Label>
                <Input
                  value={step.description}
                  onChange={(e) => updateStep(index, 'description', e.target.value)}
                  placeholder="Step description"
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Page Content (HTML)</CardTitle>
          <CardDescription>Custom content for policy and safety pages. Leave empty to use defaults.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Policy Page Content (HTML)</Label>
            <Textarea
              value={policyContent}
              onChange={(e) => setPolicyContent(e.target.value)}
              placeholder="<h2>Custom Policy</h2><p>Your policy content...</p>"
              rows={6}
            />
          </div>
          <div className="space-y-2">
            <Label>Safety Page Content (HTML)</Label>
            <Textarea
              value={safetyContent}
              onChange={(e) => setSafetyContent(e.target.value)}
              placeholder="<h2>Custom Safety Tips</h2><p>Your safety content...</p>"
              rows={6}
            />
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={isUpdating} className="gap-2">
        <Save className="w-4 h-4" />
        Save Content
      </Button>
    </div>
  );
};

export default AdminSettings;
