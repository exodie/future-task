// Переключение мобильного меню
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navList = document.querySelector('.nav-list');

    if (mobileMenuBtn && navList) {
        mobileMenuBtn.addEventListener('click', function() {
            navList.classList.toggle('active');
        });
    }

    // Переключение валюты
    const currencySelect = document.getElementById('currency-select');
    if (currencySelect) {
        currencySelect.addEventListener('change', function() {
            changeCurrency(this.value);
        });
    }

    // Закрытие меню при клике на ссылку
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navList.classList.remove('active');
        });
    });
});

// Функция для изменения валюты
function changeCurrency(currency) {
    const priceElements = document.querySelectorAll('.yacht-price');
    const exchangeRates = {
        'USD': 1,
        'EUR': 0.92,
        'RUB': 92.5
    };

    priceElements.forEach(element => {
        const basePrice = parseFloat(element.dataset.basePrice);
        const newPrice = (basePrice * exchangeRates[currency]).toFixed(0);
        
        let symbol = '$';
        if (currency === 'EUR') symbol = '€';
        if (currency === 'RUB') symbol = '₽';
        
        element.textContent = `${symbol}${numberWithCommas(newPrice)}`;
    });
}

// Функция для форматирования чисел с разделителями
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
} 