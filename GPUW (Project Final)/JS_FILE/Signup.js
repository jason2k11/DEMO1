
import { auth, googleProvider } from './firebase-init.js';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js';

document.addEventListener('DOMContentLoaded', function() {
	const form = document.querySelector('.form');
	if (form) {
		form.addEventListener('submit', async function(e) {
			e.preventDefault();
			const email = document.querySelector('.email-form').value.trim();
			const password = document.querySelector('.pass-form').value;

			if (!/^([\w.-]+)@([\w.-]+)\.([A-Za-z]{2,})$/.test(email)) {
				alert('Email không hợp lệ.');
				return;
			}
			if (password.length < 6) {
				alert('Mật khẩu phải có ít nhất 6 ký tự.');
				return;
			}

			if (!auth) {
				alert('Firebase chưa được cấu hình. Vui lòng kiểm tra JS_FILE/config.js');
				return;
			}

			try {
				const userCredential = await createUserWithEmailAndPassword(auth, email, password);
				console.log('Signed up:', userCredential.user.uid);
				alert('Đăng ký thành công! Vui lòng kiểm tra email nếu có xác thực.');
				form.reset();
				window.location.href = 'Login.html';
			} catch (err) {
				console.error(err);
				let msg = '';
				switch (err.code) {
					case 'auth/email-already-in-use': msg = 'Email này đã được sử dụng.'; break;
					case 'auth/invalid-email': msg = 'Email không hợp lệ.'; break;
					case 'auth/weak-password': msg = 'Mật khẩu quá yếu (ít nhất 6 ký tự).'; break;
					default: msg = err.message || 'Đã xảy ra lỗi khi đăng ký.';
				}
				alert(msg);
			}
		});
	}

	// Google sign-up button will sign the user in
	const googleBtn = document.querySelector('.google-btn');
	if (googleBtn) {
		googleBtn.addEventListener('click', async (e) => {
			e.preventDefault();
			if (!auth || !googleProvider) {
				alert('Firebase hoặc Google provider chưa được cấu hình.');
				return;
			}
			try {
				const result = await signInWithPopup(auth, googleProvider);
				const credential = GoogleAuthProvider.credentialFromResult(result);
				const token = credential?.accessToken;
				const user = result.user;

				localStorage.setItem('firebaseUser', JSON.stringify({ uid: user.uid, email: user.email, displayName: user.displayName }));
				if (token) localStorage.setItem('google_access_token', token);

				console.log('Google sign-in result', user?.uid, 'token?', !!token);
				alert('Đăng nhập bằng Google thành công!');
				window.location.href = '../Main/Main.html';
			} catch (err) {
				console.error('Google sign-in failed', err);
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