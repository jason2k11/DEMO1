import { auth, googleProvider } from './firebase-init.js';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js';
// Using centralized auth & googleProvider from firebase-init.js

document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('.form');
  if (form) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      const email = document.querySelector('.email-form').value.trim();
      const password = document.querySelector('.pass-form').value;

      if (!auth) {
        alert('Firebase chưa được cấu hình hoặc không thể khởi tạo. Kiểm tra JS_FILE/config.js');
        return;
      }

      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log('Signed in:', userCredential.user.uid);
        alert('✅ Đăng nhập thành công!');
        window.location.href = '../Main/Main.html';
      } catch (err) {
        console.error(err);
        let msg = '';
        switch (err.code) {
          case 'auth/wrong-password': msg = 'Mật khẩu không đúng.'; break;
          case 'auth/user-not-found': msg = 'Không tìm thấy tài khoản với email này.'; break;
          case 'auth/invalid-email': msg = 'Email không hợp lệ.'; break;
          default: msg = err.message || 'Đăng nhập thất bại.';
        }
        alert(msg);
      }
    });
  }

  // Google sign-in
  const googleBtn = document.querySelector('.google-btn');
  if (googleBtn) {
    // use googleProvider created in firebase-init.js
    googleBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      if (!auth || !googleProvider) {
        alert('Firebase hoặc Google provider chưa được cấu hình.');
        return;
      }
      try {
        const result = await signInWithPopup(auth, googleProvider);
        // get OAuth credential like your snippet
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        const user = result.user;

        // store basic user info and token for later use
        localStorage.setItem('firebaseUser', JSON.stringify({ uid: user.uid, email: user.email, displayName: user.displayName }));
        if (token) localStorage.setItem('google_access_token', token);

        console.log('Google sign-in result', user?.uid, 'token?', !!token);
        alert('Đăng nhập bằng Google thành công!');
        window.location.href = '../Main/Main.html';
      } catch (err) {
        console.error('Google sign-in failed', err);
        // handle unauthorized domain explicitly with a clearer message
        if (err?.code === 'auth/unauthorized-domain') {
          alert('Lỗi Google Sign-in — domain chưa được phép: \n' +
            'Thêm domain hiện tại vào Firebase Console → Authentication → Authorized domains.\n' +
            'Ví dụ: nếu bạn đang dùng Live Server ở cổng 5500, thêm http://127.0.0.1:5500 hoặc http://localhost:5500');
        } else {
          try { const cred = GoogleAuthProvider.credentialFromError(err); console.log('credential from error', cred); } catch (e) { /* no-op */ }
          alert('Đăng nhập Google thất bại: ' + (err.message || err));
        }
      }
    });
  }
});
