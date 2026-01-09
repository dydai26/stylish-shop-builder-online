// Захист від копіювання тексту
export const preventTextCopy = () => {
  document.addEventListener('copy', (e) => {
    e.preventDefault();
    alert('Copying text is prohibited.');
  });

  document.addEventListener('cut', (e) => {
    e.preventDefault();
    alert('Text clipping is prohibited.');
  });
};

// Захист від копіювання зображень
export const preventImageCopy = () => {
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('dragstart', (e) => {
      e.preventDefault();
    });
    
    img.style.pointerEvents = 'none';
    img.style.userSelect = 'none';
  });
};

// Ініціалізація всіх захистів
export const initializeProtection = () => {
  preventTextCopy();
  preventImageCopy();
}; 