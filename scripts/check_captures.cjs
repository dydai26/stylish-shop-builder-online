const fs = require('fs');
const path = './src/components/admin/ProductsSection.tsx';
let content = fs.readFileSync(path, 'utf8');

// Just print the whole ProductFormComponent so we can see what it captures
const match = content.match(/const ProductFormComponent = \(\{ isEdit = false \}: \{ isEdit\?: boolean \}\) => \{([\s\S]*?)\};[\s\n]*const statsCards/);
if (match) {
  // Check for undefined variables if we move it outside
  console.log("Found ProductFormComponent. Length: " + match[0].length);
} else {
  console.log("Not found");
}
