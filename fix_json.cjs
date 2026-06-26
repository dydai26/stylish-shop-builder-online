const fs = require('fs');
const path = './src/components/admin/ProductsSection.tsx';
let content = fs.readFileSync(path, 'utf8');

const replacement = `
    // Helpers for JSON updates
    const updateJsonField = (field: keyof typeof localFormData, newValue: any) => {
      setLocalFormData(prev => ({ ...prev, [field]: newValue }));
      setFormData(prev => ({ ...prev, [field]: newValue }));
    };
`;

content = content.replace(
  /\/\/ Helpers for JSON updates\s*const updateJsonField = \(field: keyof typeof localFormData, newValue: any\) => \{\s*setLocalFormData\(prev => \(\{ \.\.\.prev, \[field\]: newValue \}\)\);\s*\};/,
  replacement
);

fs.writeFileSync(path, content, 'utf8');
console.log('Fixed json update');
