const fs = require('fs');

const modifyFile = (file, replacements) => {
  let content = fs.readFileSync(file, 'utf8');
  for (const [search, replace] of replacements) {
    content = content.replace(search, replace);
  }
  fs.writeFileSync(file, content, 'utf8');
  console.log(`Modified ${file}`);
};

// OrdersSection.tsx
modifyFile('./src/components/admin/OrdersSection.tsx', [
  ['<h3 className="font-medium">{order.order_id}</h3>', '<h3 className="font-medium text-left w-full">{order.order_id}</h3>'],
  ['<p className="text-sm text-muted-foreground">\n                          {order.customer_first_name}', '<p className="text-sm text-muted-foreground text-left w-full">\n                          {order.customer_first_name}'],
  ['<div className="text-right">', '<div className="text-left w-full flex flex-col items-start">'],
  ['<p className="font-medium">€{order.total.toFixed(2)}</p>', '<p className="font-medium text-left w-full">€{order.total.toFixed(2)}</p>']
]);

// BlogSection.tsx
modifyFile('./src/components/admin/BlogSection.tsx', [
  ['<h3 className="text-xl font-bold">{post.title}</h3>', '<h3 className="text-xl font-bold text-left w-full">{post.title}</h3>'],
  ['<p className="text-sm text-gray-600 mb-2">/{post.slug}</p>', '<p className="text-sm text-gray-600 mb-2 text-left w-full">/{post.slug}</p>'],
  ['<p className="text-sm text-gray-700 line-clamp-2">{post.content}</p>', '<p className="text-sm text-gray-700 line-clamp-2 text-left w-full">{post.content}</p>']
]);

// ReviewsSection.tsx
modifyFile('./src/components/admin/ReviewsSection.tsx', [
  ['<h3 className="font-medium">{review.name}</h3>', '<h3 className="font-medium text-left w-full">{review.name}</h3>'],
  ['<p className="text-muted-foreground mb-3">{review.text}</p>', '<p className="text-muted-foreground mb-3 text-left w-full">{review.text}</p>'],
  ['<p className="text-sm text-muted-foreground mb-2">', '<p className="text-sm text-muted-foreground mb-2 text-left w-full">'],
  ['<div className="flex items-center gap-2 text-sm text-muted-foreground">', '<div className="flex items-center gap-2 text-sm text-muted-foreground text-left w-full justify-start">']
]);
