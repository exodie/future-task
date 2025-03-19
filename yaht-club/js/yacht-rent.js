console.log('Страница аренды яхт загружена!');

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация календаря
    const datePicker = flatpickr('#date-range', {
        mode: 'range',
        minDate: 'today',
        dateFormat: 'd.m.Y',
        locale: document.documentElement.lang === 'ru' ? 'ru' : 'en',
        showMonths: 1,
        closeOnSelect: false,
        disableMobile: false
    });
    
    // Обновление локализации календаря при смене языка
    document.getElementById('language-select').addEventListener('change', function() {
        const selectedLang = this.value;
        datePicker.set('locale', selectedLang === 'ru' ? 'ru' : 'en');
    });
    
    // Переменные
    const filterToggle = document.querySelector('.filter-toggle');
    const filters = document.querySelector('.filters');
    const priceRange = document.getElementById('price-min');
    const minPriceInput = document.getElementById('min-price-input');
    const maxPriceInput = document.getElementById('max-price-input');
    const applyFiltersBtn = document.querySelector('.apply-filters');
    const resetFiltersBtn = document.querySelector('.reset-filters');
    const currencySelect = document.getElementById('currency-select');
    const currencyLabel = document.querySelector('.currency-label');
    const currencySymbols = document.querySelectorAll('.currency-symbol');
    const durationRadios = document.querySelectorAll('input[name="duration"]');
    const hoursSelect = document.querySelector('.hours-select');
    const daysSelect = document.querySelector('.days-select');
    const weeksSelect = document.querySelector('.weeks-select');
    
    // ОБНОВЛЕННЫЙ ПОИСК - точно соответствует yacht-sale.js
    const searchInput = document.getElementById('yacht-search');
    const clearSearchBtn = document.getElementById('clear-search');
    const yachtCards = document.querySelectorAll('.yacht-card');
    const yachtList = document.querySelector('.yacht-list');
    
    // Проверка на наличие элементов поиска
    if (searchInput && clearSearchBtn && yachtCards.length > 0 && yachtList) {
        console.log('Элементы поиска на странице аренды яхт найдены!');
        
        // Функция поиска
        function searchYachts() {
            const searchTerm = searchInput.value.toLowerCase().trim();
            console.log('Поисковый запрос на странице аренды:', searchTerm);
            
            let resultsFound = false;
            let visibleCount = 0;
            
            // Показываем/скрываем кнопку очистки
            if (searchTerm.length > 0) {
                clearSearchBtn.classList.add('visible');
            } else {
                clearSearchBtn.classList.remove('visible');
            }
            
            // Удаляем сообщение "нет результатов", если оно есть
            const existingNoResults = document.querySelector('.no-results');
            if (existingNoResults) {
                existingNoResults.remove();
            }
            
            // Проверяем каждую карточку
            yachtCards.forEach(card => {
                const yachtName = card.querySelector('.yacht-name').textContent.toLowerCase();
                const yachtSpecs = card.querySelector('.yacht-specs') ? 
                                   card.querySelector('.yacht-specs').textContent.toLowerCase() : '';
                const yachtType = card.querySelector('.yacht-additional-info') ? 
                                 card.querySelector('.yacht-additional-info').textContent.toLowerCase() : '';
                const yachtPrice = card.querySelector('.yacht-price') ? 
                                  card.querySelector('.yacht-price').textContent.toLowerCase() : '';
                
                // Проверяем совпадение с любым из элементов
                if (yachtName.includes(searchTerm) || 
                    yachtSpecs.includes(searchTerm) || 
                    yachtType.includes(searchTerm) ||
                    yachtPrice.includes(searchTerm)) {
                    card.style.display = '';
                    resultsFound = true;
                    visibleCount++;
                    console.log('Совпадение найдено в аренде:', yachtName);
                } else {
                    card.style.display = 'none';
                }
            });
            
            // Добавляем класс search-results, если идет поиск
            if (searchTerm.length > 0) {
                yachtList.classList.add('search-results');
            } else {
                yachtList.classList.remove('search-results');
            }
            
            // Если мало результатов, применяем дополнительный класс
            if (visibleCount <= 2 && visibleCount > 0) {
                yachtList.classList.add('few-results');
            } else {
                yachtList.classList.remove('few-results');
            }
            
            // Если нет результатов, показываем сообщение
            if (!resultsFound && searchTerm.length > 0) {
                console.log('Результаты не найдены в аренде');
                
                const languageSelect = document.getElementById('language-select');
                const currentLang = languageSelect ? languageSelect.value : 'ru';
                
                const noResults = document.createElement('div');
                noResults.className = 'no-results';
                
                const noResultsTitle = currentLang === 'ru' ? 
                                      'Ничего не найдено' : 
                                      'No results found';
                const noResultsText = currentLang === 'ru' ? 
                                     'Попробуйте изменить запрос или сбросить поиск' : 
                                     'Try changing your search query or clear the search';
                
                noResults.innerHTML = `
                    <h3>${noResultsTitle}</h3>
                    <p>${noResultsText}</p>
                `;
                
                // Вставляем сообщение в контейнер yacht-list вместо всех карточек
                yachtList.innerHTML = '';
                yachtList.appendChild(noResults);
            }
        }
        
        // Явно добавляем обработчики событий для поиска
        searchInput.addEventListener('input', function() {
            console.log('Событие input на поле поиска аренды');
            searchYachts();
        });
        
        searchInput.addEventListener('keyup', function() {
            console.log('Событие keyup на поле поиска аренды');
            searchYachts();
        });
        
        clearSearchBtn.addEventListener('click', function() {
            console.log('Нажата кнопка очистки на странице аренды');
            searchInput.value = '';
            searchYachts();
            searchInput.focus();
        });
    } else {
        console.error('Не найдены элементы поиска на странице аренды!');
        // Выводим детальную информацию об отсутствующих элементах
        if (!searchInput) console.error('Не найден элемент #yacht-search');
        if (!clearSearchBtn) console.error('Не найден элемент #clear-search');
        if (!yachtCards.length) console.error('Не найдены карточки .yacht-card');
        if (!yachtList) console.error('Не найден элемент .yacht-list');
    }
    
    // Переключение видимости фильтров на мобильных устройствах
    if (filterToggle) {
        filterToggle.addEventListener('click', function() {
            filters.classList.toggle('active');
            
            // Изменение иконки
            const icon = this.querySelector('.fa-chevron-down') || this.querySelector('.fa-chevron-up');
            if (icon) {
                icon.classList.toggle('fa-chevron-down');
                icon.classList.toggle('fa-chevron-up');
            }
        });
    }
    
    // Обновление значения ползунка цены
    priceRange.addEventListener('input', function() {
        minPriceInput.value = this.value;
    });
    
    // Обновление ползунка цены при вводе значения
    minPriceInput.addEventListener('input', function() {
        priceRange.value = this.value;
    });
    
    // Переключение типа продолжительности
    durationRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            // Скрываем все селекты продолжительности
            hoursSelect.style.display = 'none';
            daysSelect.style.display = 'none';
            weeksSelect.style.display = 'none';
            
            // Показываем нужный
            if (this.value === 'hours') {
                hoursSelect.style.display = 'block';
            } else if (this.value === 'days') {
                daysSelect.style.display = 'block';
            } else if (this.value === 'weeks') {
                weeksSelect.style.display = 'block';
            }
        });
    });
    
    // Сброс фильтров
    resetFiltersBtn.addEventListener('click', function() {
        // Сброс календаря
        const datePicker = document.getElementById('date-range')._flatpickr;
        datePicker.clear();
        
        // Сброс продолжительности
        document.getElementById('hours').checked = true;
        hoursSelect.style.display = 'block';
        daysSelect.style.display = 'none';
        weeksSelect.style.display = 'none';
        document.getElementById('hours-count').value = '8';
        document.getElementById('days-count').value = '3';
        document.getElementById('weeks-count').value = '1';
        
        // Сброс цены
        priceRange.value = 0;
        minPriceInput.value = 0;
        maxPriceInput.value = 2000;
        
        // Сброс вместимости
        document.getElementById('capacity').value = 'all';
        
        // Отметить все чекбоксы типов яхт
        document.querySelectorAll('.checkbox-item input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = true;
        });
    });
    
    // Переключение валюты
    const exchangeRates = {
        USD: 1,
        EUR: 0.92,
        RUB: 91.5
    };
    
    const currencySymbolMap = {
        USD: '$',
        EUR: '€',
        RUB: '₽'
    };
    
    // Обновление валюты и цен при загрузке страницы
    updateCurrencyDisplay(currencySelect.value);
    
    currencySelect.addEventListener('change', function() {
        const selectedCurrency = this.value;
        updateCurrencyDisplay(selectedCurrency);
        updatePrices(selectedCurrency);
    });
    
    function updateCurrencyDisplay(currency) {
        // Обновляем надпись валюты в заголовке фильтра
        currencyLabel.textContent = currency;
        
        // Обновляем символы валюты перед полями ввода
        currencySymbols.forEach(symbol => {
            symbol.textContent = currencySymbolMap[currency];
        });
        
        // Обновляем максимальное значение в зависимости от валюты
        const maxValues = {
            USD: 2000,
            EUR: 1840,
            RUB: 183000
        };
        
        maxPriceInput.value = maxValues[currency];
        
        // Если пользователь переключил валюту, нужно обновить и минимальное значение
        if (minPriceInput.value > 0) {
            minPriceInput.value = Math.round(parseFloat(minPriceInput.value) * 
                                 exchangeRates[currency] / exchangeRates[currencySelect.value]);
        }
    }
    
    function updatePrices(selectedCurrency) {
        const priceElements = document.querySelectorAll('.yacht-price');
        
        priceElements.forEach(element => {
            const basePrice = parseFloat(element.getAttribute('data-base-price'));
            const convertedPrice = basePrice * exchangeRates[selectedCurrency];
            
            let formattedPrice;
            if (selectedCurrency === 'RUB') {
                formattedPrice = Math.round(convertedPrice).toLocaleString('ru-RU');
            } else {
                formattedPrice = convertedPrice.toLocaleString('en-US', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                });
            }
            
            element.textContent = `${currencySymbolMap[selectedCurrency]}${formattedPrice} / час`;
        });
    }
    
    // Имитация применения фильтров
    applyFiltersBtn.addEventListener('click', function() {
        // Собираем данные фильтров
        const dateRange = document.getElementById('date-range').value;
        const durationType = document.querySelector('input[name="duration"]:checked').value;
        let duration;
        if (durationType === 'hours') {
            duration = document.getElementById('hours-count').value + ' часов';
        } else if (durationType === 'days') {
            duration = document.getElementById('days-count').value + ' дней';
        } else {
            duration = document.getElementById('weeks-count').value + ' недель';
        }
        
        const minPrice = minPriceInput.value;
        const capacity = document.getElementById('capacity').value;
        
        alert(`Фильтры применены!\n
               Даты: ${dateRange || 'не выбраны'}\n
               Продолжительность: ${duration}\n
               Цена от: ${currencySymbolMap[currencySelect.value]}${minPrice}\n
               Вместимость: ${capacity === 'all' ? 'любая' : 'до ' + capacity + ' человек'}`);
    });

    // Проверка наличия элементов для поиска после полной загрузки страницы
    window.addEventListener('load', function() {
        console.log('=== Проверка элементов поиска ===');
        console.log('Поле поиска #yacht-search:', !!document.getElementById('yacht-search'));
        console.log('Кнопка очистки #clear-search:', !!document.getElementById('clear-search'));
        console.log('Карточки .yacht-card:', document.querySelectorAll('.yacht-card').length);
        console.log('Контейнер .yacht-list:', !!document.querySelector('.yacht-list'));
        console.log('================================');
    });
}); 