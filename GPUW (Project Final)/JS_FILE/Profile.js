	const backHomeBtn = document.getElementById('backHomeBtn');
	backHomeBtn.addEventListener('click', function() {
		window.location.href = 'Main.html';
	});

document.addEventListener('DOMContentLoaded', function() {
	const form = document.getElementById('profileForm');
	const fields = ['username', 'email', 'fullname', 'phone', 'address'];
	const editBtn = document.getElementById('editBtn');
	const saveBtn = document.getElementById('saveBtn');
	const cancelBtn = document.getElementById('cancelBtn');
	const avatarPreview = document.getElementById('avatarPreview');
	const avatarUrlInput = document.getElementById('avatarUrlInput');

	function loadProfile() {
		let user = JSON.parse(localStorage.getItem('currentUser')) || {};
		if (!user.username || !user.email) {
			const users = JSON.parse(localStorage.getItem('users')) || [];
			if (users.length > 0) user = users[0];
		}
		fields.forEach(f => {
			document.getElementById(f).value = user[f] || '';
		});
		if (user.avatar) {
			avatarPreview.src = user.avatar;
			avatarUrlInput.value = user.avatar;
		} else {
			avatarPreview.src = 'https://ui-avatars.com/api/?name=' + (user.username || 'User');
			avatarUrlInput.value = '';
		}
	}

	function enableEdit() {
		fields.forEach(f => {
			document.getElementById(f).disabled = false;
		});
		avatarUrlInput.style.display = 'block';
		avatarUrlInput.disabled = false;
		editBtn.style.display = 'none';
		saveBtn.style.display = 'inline-block';
		cancelBtn.style.display = 'inline-block';
	}

	function disableEdit() {
		fields.forEach(f => {
			document.getElementById(f).disabled = true;
		});
		avatarUrlInput.style.display = 'none';
		avatarUrlInput.disabled = true;
		editBtn.style.display = 'inline-block';
		saveBtn.style.display = 'none';
		cancelBtn.style.display = 'none';
	}

	function saveProfile(e) {
		e.preventDefault();
		let user = {};
		fields.forEach(f => {
			user[f] = document.getElementById(f).value.trim();
		});
		user.avatar = avatarUrlInput.value.trim() || avatarPreview.src;
		avatarPreview.src = user.avatar;
		localStorage.setItem('currentUser', JSON.stringify(user));
		let users = JSON.parse(localStorage.getItem('users')) || [];
		if (users.length > 0) {
			users[0] = user;
			localStorage.setItem('users', JSON.stringify(users));
		}
		disableEdit();
		alert('Profile updated!');
	}

	function cancelEdit() {
		loadProfile();
		disableEdit();
	}


	avatarUrlInput.addEventListener('input', function() {
		avatarPreview.src = avatarUrlInput.value.trim();
	});

	editBtn.addEventListener('click', enableEdit);
	cancelBtn.addEventListener('click', cancelEdit);
	form.addEventListener('submit', saveProfile);

	loadProfile();
	disableEdit();
});

