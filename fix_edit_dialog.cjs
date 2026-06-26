const fs = require('fs');
const path = './src/components/admin/ProductsSection.tsx';
let content = fs.readFileSync(path, 'utf8');

// Find the Edit Dialog block
const dialogRegex = /<Dialog open=\{isEditDialogOpen\} onOpenChange=\{setIsEditDialogOpen\}>[\s\S]*?<\/Dialog>/;
const dialogMatch = content.match(dialogRegex);

if (dialogMatch) {
  let dialogCode = dialogMatch[0];
  
  // Remove it from its current location
  content = content.replace(dialogCode, '');
  
  // Remove the DialogTrigger from the extracted block
  const triggerRegex = /<DialogTrigger asChild>[\s\S]*?<\/DialogTrigger>/;
  dialogCode = dialogCode.replace(triggerRegex, '');
  
  // Insert it before the final </div></div> of the component
  const insertionPoint = '      </div>\n    </div>\n  );\n};';
  if (content.includes(insertionPoint)) {
    content = content.replace(insertionPoint, `      </div>\n      ${dialogCode}\n    </div>\n  );\n};`);
  } else {
    // fallback
    content = content.replace('    </div>\n  );\n};\n\nexport default ProductsSection;', `      ${dialogCode}\n    </div>\n  );\n};\n\nexport default ProductsSection;`);
  }
  
  fs.writeFileSync(path, content, 'utf8');
  console.log('Fixed Edit Dialog placement');
} else {
  console.log('Could not find Edit Dialog');
}
