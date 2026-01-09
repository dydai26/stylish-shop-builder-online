const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const glob = require('glob');

// Директорія з зображеннями
const imageDir = path.join(__dirname, 'public');

// Функція для оптимізації JPEG/PNG зображень
async function optimizeImage(imagePath) {
  const ext = path.extname(imagePath).toLowerCase();
  const filename = path.basename(imagePath);
  const outputDir = path.dirname(imagePath);
  
  // Пропускаємо вже оптимізовані зображення
  if (filename.includes('.optimized.')) {
    return;
  }
  
  const newFilename = path.basename(imagePath, ext) + '.optimized' + ext;
  const outputPath = path.join(outputDir, newFilename);
  
  try {
    // Отримуємо метадані зображення
    const metadata = await sharp(imagePath).metadata();
    
    // Розмір зображення
    const width = metadata.width;
    const height = metadata.height;
    
    // Не оптимізуємо маленькі зображення
    if (width < 300 && height < 300) {
      return;
    }
    
    // Створюємо оптимізоване зображення
    let sharpInstance = sharp(imagePath);
    
    // Зменшуємо великі зображення
    if (width > 1920 || height > 1080) {
      sharpInstance = sharpInstance.resize({
        width: Math.min(width, 1920),
        height: Math.min(height, 1080),
        fit: 'inside',
        withoutEnlargement: true
      });
    }
    
    // Оптимізуємо залежно від типу
    if (ext === '.jpg' || ext === '.jpeg') {
      await sharpInstance
        .jpeg({ quality: 80, progressive: true })
        .toFile(outputPath);
    } else if (ext === '.png') {
      await sharpInstance
        .png({ compressionLevel: 9, progressive: true })
        .toFile(outputPath);
    }
    
    // Порівнюємо розміри файлів
    const originalSize = fs.statSync(imagePath).size;
    const optimizedSize = fs.statSync(outputPath).size;
    
    console.log(`Optimized: ${filename}`);
    console.log(`  Original: ${(originalSize / 1024).toFixed(2)} KB`);
    console.log(`  Optimized: ${(optimizedSize / 1024).toFixed(2)} KB`);
    console.log(`  Saved: ${((originalSize - optimizedSize) / originalSize * 100).toFixed(2)}%`);
    
  } catch (err) {
    console.error(`Error optimizing ${filename}:`, err);
  }
}

// Оптимізуємо всі зображення
async function optimizeAllImages() {
  // Знаходимо всі JPEG та PNG зображення
  const images = [
    ...glob.sync(path.join(imageDir, '**/*.jpg')),
    ...glob.sync(path.join(imageDir, '**/*.jpeg')),
    ...glob.sync(path.join(imageDir, '**/*.png'))
  ];
  
  console.log(`Found ${images.length} images to optimize`);
  
  // Оптимізуємо кожне зображення
  for (const image of images) {
    await optimizeImage(image);
  }
  
  console.log('Optimization complete!');
}

// Запускаємо оптимізацію
optimizeAllImages(); 