const fs = require('fs');
const path = './src/components/admin/ProductsSection.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Lift state up to ProductsSection
if (!content.includes('const [activeTab, setActiveTab] = useState("basic");')) {
  content = content.replace(
    'const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);',
    'const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);\n  const [localFormData, setLocalFormData] = useState(initialFormData);\n  const [activeTab, setActiveTab] = useState("basic");'
  );
}

// 2. Remove state from ProductFormComponent and turn it back into renderProductForm
content = content.replace(/const ProductFormComponent = \(\{ isEdit = false \}: \{ isEdit\?: boolean \}\) => \{[\s\S]*?const updateJsonField =/m, 
`const renderProductForm = (isEdit: boolean = false) => {
    // Helpers for JSON updates
    const updateJsonField =`);

// 3. update handleEditProduct to also setLocalFormData
content = content.replace(
  'const handleEditProduct = (product: Product) => {',
  'const handleEditProduct = (product: Product) => {\n    setLocalFormData(product);'
);

// 4. Update the "Add Product" button to reset localFormData and activeTab
content = content.replace(
  'onClick={() => setIsAddDialogOpen(true)}',
  'onClick={() => { setFormData(initialFormData); setLocalFormData(initialFormData); setActiveTab("basic"); setIsAddDialogOpen(true); }}'
);

// 5. Replace <ProductFormComponent /> with {renderProductForm()}
content = content.replace(/<ProductFormComponent \/>/g, '{renderProductForm()}');
content = content.replace(/<ProductFormComponent isEdit \/>/g, '{renderProductForm(true)}');

// 6. Move the Edit Dialog OUTSIDE the map
// Let's find the Edit Dialog block
const editDialogRegex = /<Dialog open={isEditDialogOpen}[\s\S]*?<\/Dialog>/;
const editDialogMatch = content.match(editDialogRegex);

if (editDialogMatch) {
  const editDialogCode = editDialogMatch[0];
  // Remove it from the map
  content = content.replace(editDialogCode, '<Button size="sm" variant="outline" onClick={() => handleEditProduct(product)}><Edit className="h-4 w-4" /></Button>');
  
  // Place it near the Add Dialog (at the bottom, just before closing </CardContent>)
  content = content.replace('</CardContent>', `  ${editDialogCode}\n        </CardContent>`);
}

// 7. Ensure `useEffect` synchronizing formData and localFormData is at the parent level
if (!content.includes('useEffect(() => {\n    setLocalFormData(formData);\n  }, [formData]);')) {
  content = content.replace(
    'const [activeTab, setActiveTab] = useState("basic");',
    'const [activeTab, setActiveTab] = useState("basic");\n\n  useEffect(() => {\n    setLocalFormData(formData);\n  }, [formData]);'
  );
}

fs.writeFileSync(path, content, 'utf8');
console.log('Fixed React bugs');
