// common.js - Общие функции для всех страниц

// Проверка авторизации
function checkAuth() {
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

// Функция выхода
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    localStorage.removeItem('lastLogin');
    window.location.href = 'index.html';
}

// Форматирование даты
function formatDate(date, format = 'dd.mm.yyyy') {
    if (!date) return '';
    
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const seconds = d.getSeconds().toString().padStart(2, '0');
    
    switch(format) {
        case 'dd.mm.yyyy':
            return `${day}.${month}.${year}`;
        case 'dd.mm.yyyy HH:MM':
            return `${day}.${month}.${year} ${hours}:${minutes}`;
        case 'dd.mm.yyyy HH:MM:SS':
            return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
        case 'yyyy-mm-dd':
            return `${year}-${month}-${day}`;
        case 'yyyy-mm-dd HH:MM':
            return `${year}-${month}-${day} ${hours}:${minutes}`;
        default:
            return `${day}.${month}.${year}`;
    }
}

// Валидация номера телефона
function validatePhone(phone) {
    const phoneRegex = /^(\+7|8)[\s\-]?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$/;
    return phoneRegex.test(phone);
}

// Валидация email
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Валидация ИНН
function validateINN(inn) {
    const innRegex = /^\d{10}$|^\d{12}$/;
    return innRegex.test(inn);
}

// Маска для номера телефона
function phoneMask(input) {
    let value = input.value.replace(/\D/g, '');
    
    if (value.startsWith('7') || value.startsWith('8')) {
        value = value.substring(1);
    }
    
    if (value.length > 0) {
        value = '+7 ' + value;
        if (value.length > 6) {
            value = value.substring(0, 6) + ' ' + value.substring(6);
        }
        if (value.length > 10) {
            value = value.substring(0, 10) + ' ' + value.substring(10);
        }
        if (value.length > 13) {
            value = value.substring(0, 13) + ' ' + value.substring(13);
        }
        if (value.length > 16) {
            value = value.substring(0, 16);
        }
    }
    
    input.value = value;
}

// Маска для номера автомобиля
function vehicleNumberMask(input) {
    let value = input.value.toUpperCase().replace(/[^А-Я0-9]/g, '');
    
    if (value.length > 9) {
        value = value.substring(0, 9);
    }
    
    input.value = value;
}

// Показать/скрыть уведомление
function showNotification(message, type = 'info', duration = 5000) {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade-in`;
    notification.innerHTML = `
        <div class="alert-icon">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 
                              type === 'danger' ? 'exclamation-circle' : 
                              type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
        </div>
        <div class="alert-content">${message}</div>
        <button class="close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    if (duration > 0) {
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, duration);
    }
    
    return notification;
}

// Подтверждение действия
function confirmAction(message, callback) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal fade-in">
            <div class="modal-header">
                <h3>Подтверждение</h3>
                <button class="close" onclick="this.closest('.modal-overlay').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <p>${message}</p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-outline-primary" onclick="this.closest('.modal-overlay').remove()">
                    Отмена
                </button>
                <button class="btn btn-danger" onclick="
                    if (typeof callback === 'function') callback();
                    this.closest('.modal-overlay').remove();
                ">
                    Подтвердить
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Загрузка файла
function uploadFile(fileInput, callback) {
    if (!fileInput.files || fileInput.files.length === 0) {
        return;
    }
    
    const file = fileInput.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        if (typeof callback === 'function') {
            callback(e.target.result, file);
        }
    };
    
    reader.onerror = function(e) {
        showNotification('Ошибка при загрузке файла', 'danger');
    };
    
    reader.readAsDataURL(file);
}

// Генерация ID
function generateId(prefix = '') {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 9);
    return `${prefix}${timestamp}${random}`.toUpperCase();
}

// Сохранение данных в localStorage
function saveToStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (e) {
        console.error('Ошибка сохранения в localStorage:', e);
        return false;
    }
}

// Загрузка данных из localStorage
function loadFromStorage(key, defaultValue = null) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
        console.error('Ошибка загрузки из localStorage:', e);
        return defaultValue;
    }
}

// Удаление данных из localStorage
function removeFromStorage(key) {
    localStorage.removeItem(key);
}

// Экспорт данных в файл
function exportToFile(data, filename = 'data.json', type = 'application/json') {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Импорт данных из файла
function importFromFile(fileInput, callback) {
    if (!fileInput.files || fileInput.files.length === 0) {
        return;
    }
    
    const file = fileInput.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            if (typeof callback === 'function') {
                callback(data);
            }
        } catch (e) {
            showNotification('Ошибка при чтении файла', 'danger');
        }
    };
    
    reader.onerror = function(e) {
        showNotification('Ошибка при загрузке файла', 'danger');
    };
    
    reader.readAsText(file);
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Добавляем год в футер
    const yearElements = document.querySelectorAll('.current-year');
    yearElements.forEach(el => {
        el.textContent = new Date().getFullYear();
    });
    
    // Инициализация подсказок
    const tooltips = document.querySelectorAll('[title]');
    tooltips.forEach(el => {
        el.addEventListener('mouseenter', function() {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.title;
            tooltip.style.position = 'absolute';
            tooltip.style.background = '#333';
            tooltip.style.color = 'white';
            tooltip.style.padding = '5px 10px';
            tooltip.style.borderRadius = '4px';
            tooltip.style.fontSize = '12px';
            tooltip.style.zIndex = '10000';
            
            const rect = this.getBoundingClientRect();
            tooltip.style.top = (rect.top - 30) + 'px';
            tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';
            
            document.body.appendChild(tooltip);
            
            this._tooltip = tooltip;
        });
        
        el.addEventListener('mouseleave', function() {
            if (this._tooltip) {
                this._tooltip.remove();
                this._tooltip = null;
            }
        });
    });
});