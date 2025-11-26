
function addToCart(product) {
  product.price = Number(product.price);
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  let found = false;
  for (let item of cart) {
    if (item.id === product.id) {
      item.quantity += 1;
      found = true;
      break;
    }
  }
  if (!found) {
    product.quantity = 1;
    cart.push(product);
  }
  localStorage.setItem('cart', JSON.stringify(cart));
}

window.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.product-card .btn.btn-primary.btn-sm').forEach(function (btn) {
    if (btn.textContent.includes('Add to cart')) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        const card = btn.closest('.product-card');
        const name = card.querySelector('.card-title')?.textContent.trim() || 'Monitor';
        const priceText = btn.textContent.split('|')[0].trim().replace(/\./g, '');
        const price = parseInt(priceText, 10) || 0;
        const image = card.querySelector('img.card-img-top')?.src || '';
        const description = card.querySelector('.card-text')?.textContent.trim() || '';
        const product = {
          id: name.replace(/\s+/g, '').toLowerCase(),
          name,
          price,
          image,
          description
        };
        addToCart(product);
        alert('Đã thêm vào giỏ hàng!');
      });
    }
  });
});
