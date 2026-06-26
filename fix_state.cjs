const fs = require('fs');
const path = './src/components/admin/ProductsSection.tsx';
let content = fs.readFileSync(path, 'utf8');

const initialDataBlock = `const initialFormData = {
    name: "",
    slug: "",
    price: "",
    image: "",
    images: "",
    description: "",
    category: "",
    sku: "",
    tags: "",
    benefits: "",
    usage: "",
    ingredients: "",
    metaTitle: "",
    metaDescription: "",
    ogImage: "",
    status: "active",
    educationContent: {} as Record<string, import('@/lib/productsService').EducationContentItem>,
    clinicalResults: {} as Record<string, import('@/lib/productsService').ClinicalResultItem>,
    faqs: [] as import('@/lib/productsService').FaqItem[],
    ugcVideos: [] as import('@/lib/productsService').UgcVideoItem[],
  };

  const [formData, setFormData] = useState(initialFormData);
  const [localFormData, setLocalFormData] = useState(initialFormData);
  const [activeTab, setActiveTab] = useState("basic");

  useEffect(() => {
    setLocalFormData(formData);
  }, [formData]);
`;

// Replace the original formData state
content = content.replace(
  /const \[formData, setFormData\] = useState\(\{[\s\S]*?ugcVideos: \[\] as UgcVideoItem\[\],\s*\}\);/,
  initialDataBlock
);

fs.writeFileSync(path, content, 'utf8');
console.log('Fixed state definitions');
