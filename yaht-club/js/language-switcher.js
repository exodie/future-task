document.addEventListener('DOMContentLoaded', function() {
    // Инициализация языка
    const languageSelect = document.getElementById('language-select');
    
    // Устанавливаем язык из localStorage или используем русский по умолчанию
    const currentLang = localStorage.getItem('language') || 'ru';
    languageSelect.value = currentLang;
    
    // Применяем язык при загрузке страницы
    applyLanguage(currentLang);
    
    // Обработчик события изменения языка
    languageSelect.addEventListener('change', function() {
        const selectedLang = this.value;
        localStorage.setItem('language', selectedLang);
        applyLanguage(selectedLang);
    });
    
    // Функция применения языка
    function applyLanguage(lang) {
        document.documentElement.lang = lang;
        
        // Находим все элементы с атрибутом data-lang-key
        const elements = document.querySelectorAll('[data-lang-key]');
        
        elements.forEach(element => {
            const key = element.getAttribute('data-lang-key');
            
            // Если элемент имеет атрибут placeholder, обновляем его
            if (element.hasAttribute('placeholder')) {
                element.placeholder = translations[lang][key] || key;
            }
            // Если элемент - option, обновляем его текст
            else if (element.tagName === 'OPTION') {
                element.textContent = translations[lang][key] || key;
            }
            // Иначе обновляем innerHTML, чтобы сохранить HTML-теги в переводах
            else {
                element.innerHTML = translations[lang][key] || key;
            }
        });
        
        // Обновляем заголовок страницы
        const titleKey = document.querySelector('title').getAttribute('data-lang-key');
        if (titleKey) {
            document.title = translations[lang][titleKey] || titleKey;
        }
    }
}); 