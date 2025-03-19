document.addEventListener('DOMContentLoaded', function() {
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
    
    // Поиск яхт - исправленный код
    const searchInput = document.getElementById('yacht-search');
    const clearSearchBtn = document.getElementById('clear-search');
    const yachtCards = document.querySelectorAll('.yacht-card');
    
    // Убедимся, что элементы существуют перед добавлением обработчиков событий
    if (searchInput && clearSearchBtn && yachtCards.length > 0) {
        console.log('Элементы поиска найдены!'); // Отладочное сообщение
        
        // Функция поиска
        function searchYachts() {
            const searchTerm = searchInput.value.toLowerCase().trim();
            console.log('Поисковый запрос:', searchTerm);
            
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
            
            // Получаем контейнер списка яхт
            const yachtList = document.querySelector('.yacht-list');
            
            // Проверяем каждую карточку
            yachtCards.forEach(card => {
                const yachtName = card.querySelector('.yacht-name').textContent.toLowerCase();
                const yachtSpecs = card.querySelector('.yacht-specs') ? 
                                   card.querySelector('.yacht-specs').textContent.toLowerCase() : '';
                
                // Проверяем совпадение
                if (yachtName.includes(searchTerm) || yachtSpecs.includes(searchTerm)) {
                    card.style.display = '';
                    resultsFound = true;
                    visibleCount++;
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
                console.log('Результаты не найдены');
                
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
        
        // Явно добавляем обработчики событий
        searchInput.addEventListener('input', function() {
            console.log('Событие input на поле поиска'); // Отладочное сообщение
            searchYachts();
        });
        
        searchInput.addEventListener('keyup', function() {
            console.log('Событие keyup на поле поиска'); // Отладочное сообщение
            searchYachts();
        });
        
        clearSearchBtn.addEventListener('click', function() {
            console.log('Нажата кнопка очистки'); // Отладочное сообщение
            searchInput.value = '';
            searchYachts();
            searchInput.focus();
        });
    } else {
        console.error('Не найдены элементы поиска!'); // Отладочное сообщение об ошибке
    }
    
    // Переключение видимости фильтров на мобильных устройствах
    if (filterToggle) {
        filterToggle.addEventListener('click', function() {
            filters.classList.toggle('active');
            
            // Изменение иконки
            const icon = this.querySelector('.fa-chevron-down');
            if (icon.classList.contains('fa-chevron-down')) {
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
            } else {
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
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
    
    // Сброс фильтров
    resetFiltersBtn.addEventListener('click', function() {
        priceRange.value = 0;
        minPriceInput.value = 0;
        maxPriceInput.value = 10000000;
        
        // Отметить все чекбоксы
        document.querySelectorAll('.checkbox-item input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = true;
        });
        
        // Сброс селектов годов
        document.getElementById('year-from').value = 2010;
        document.getElementById('year-to').value = 2025;
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
            USD: 10000000,
            EUR: 9200000,
            RUB: 915000000
        };
        
        maxPriceInput.value = maxValues[currency];
        
        // Если пользователь переключил валюту, нужно обновить и минимальное значение
        if (minPriceInput.value > 0) {
            minPriceInput.value = Math.round(parseFloat(minPriceInput.value) * 
                                 exchangeRates[currency] / exchangeRates[currencyLabel.textContent]);
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
            
            element.textContent = `${currencySymbolMap[selectedCurrency]}${formattedPrice}`;
        });
    }
    
    // Имитация применения фильтров
    applyFiltersBtn.addEventListener('click', function() {
        alert('Фильтры применены! Выбранная валюта: ' + currencyLabel.textContent);
    });
    
    // Обработчик события для обновления поиска при смене языка
    document.getElementById('language-select').addEventListener('change', function() {
        if (searchInput.value.trim().length > 0) {
            searchYachts();
        }
    });
}); 