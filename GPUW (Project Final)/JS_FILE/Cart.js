function renderCart() {
      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      console.log(cart);
      const cartContent = document.getElementById('cart-content');
      if (cart.length === 0) {
        cartContent.innerHTML = '<div class="cart-empty">Empty.</div>';
        document.getElementById('back-home-wrapper').style.display = 'block';
        return;
      } else {
        document.getElementById('back-home-wrapper').style.display = 'block';
      }
      let total = 0;
      let html = '<table class="cart-table"><thead><tr><th>Product Name</th><th>Price</th><th>Quantity</th><th>Total</th><th></th></tr></thead><tbody>';
      cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        html += `<tr>
          <td>${item.name}</td>
          <td>${item.price.toLocaleString()}₫</td>
          <td>${item.quantity}</td>
          <td>${itemTotal.toLocaleString()}₫</td>
          <td><button class="remove-btn" onclick="removeFromCart('${item.id}')">Delete</button></td>
        </tr>`;
      });
      html += '</tbody></table>';
      html += `<div class="cart-total">Total: ${total.toLocaleString()}₫</div>`;
      cartContent.innerHTML = html;
    }
    function removeFromCart(id) {
      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      cart = cart.filter(item => item.id !== id);
      localStorage.setItem('cart', JSON.stringify(cart));
      renderCart();
    }
    window.onload = renderCart;

      document.getElementById('back-home-btn').addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = 'Main.html';
      });