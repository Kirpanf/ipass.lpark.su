document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const login = document.getElementById('login').value;
    const password = document.getElementById('password').value;
    
    // Проверка учетных данных
    if (login === '5040071960' && password === '1234') {
        // Сохраняем статус входа
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('user', login);
        
        // Переходим на главную страницу
        window.location.href = 'main.html';
    } else {
        document.getElementById('errorMessage').style.display = 'block';
        setTimeout(() => {
            document.getElementById('errorMessage').style.display = 'none';
        }, 3000);
    }
});

// Проверка, если пользователь уже вошел
if (localStorage.getItem('isLoggedIn') === 'true') {
    window.location.href = 'main.html';
} 
