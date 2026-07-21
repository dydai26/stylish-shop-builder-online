const fs = require('fs');
const path = './src/components/admin/ProductsSection.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Revert renderProductForm back to a proper component ProductFormComponent
content = content.replace(/const renderProductForm = \(isEdit: boolean = false\) => {/g, 'const ProductFormComponent = ({ isEdit = false }: { isEdit?: boolean }) => {');
content = content.replace(/\{renderProductForm\(\)\}/g, '<ProductFormComponent />');
content = content.replace(/\{renderProductForm\(true\)\}/g, '<ProductFormComponent isEdit />');

// Now, move the Edit Dialog outside the map.
// To do this, I need to find the exact block and replace it.

fs.writeFileSync(path, content, 'utf8');
console.log('Reverted to component');
