const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const glob = require('glob');

// Директорія зі збіркою
const distDir = path.join(__dirname, 'dist');

// Функція для стиснення файлу
function compressFile(filePath) {
  const fileContent = fs.readFileSync(filePath);
  const fileExt = path.extname(filePath).toLowerCase();
  
  // Визначаємо, які файли стискати
  const shouldCompress = ['.js', '.css', '.html', '.json', '.svg', '.xml'].includes(fileExt);
  
  if (!shouldCompress) {
    return;
  }
  
  // Стиснення gzip
  const gzipOutput = filePath + '.gz';
  fs.writeFileSync(gzipOutput, zlib.gzipSync(fileContent, { level: 9 }));
  
  // Стиснення brotli (якщо доступне)
  try {
    const brotliOutput = filePath + '.br';
    fs.writeFileSync(brotliOutput, zlib.brotliCompressSync(fileContent, {
      params: {
        [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
      },
    }));
  } catch (err) {
    console.log(`Brotli compression not available for ${filePath}`);
  }
  
  const originalSize = fileContent.length;
  const gzipSize = fs.statSync(gzipOutput).size;
  
  console.log(`Compressed: ${path.basename(filePath)}`);
  console.log(`  Original: ${(originalSize / 1024).toFixed(2)} KB`);
  console.log(`  Gzip: ${(gzipSize / 1024).toFixed(2)} KB`);
  console.log(`  Saved: ${((originalSize - gzipSize) / originalSize * 100).toFixed(2)}%`);
}

// Функція для стиснення всіх файлів у директорії
function compressAllFiles() {
  // Перевіряємо, чи існує директорія dist
  if (!fs.existsSync(distDir)) {
    console.error('Error: dist directory does not exist. Run "npm run build" first.');
    process.exit(1);
  }
  
  // Знаходимо всі файли в директорії dist
  const files = glob.sync(path.join(distDir, '**/*.*'));
  
  console.log(`Found ${files.length} files to compress`);
  
  // Стискаємо кожен файл
  for (const file of files) {
    compressFile(file);
  }
  
  console.log('Compression complete!');
}

// Запускаємо стиснення
compressAllFiles(); 