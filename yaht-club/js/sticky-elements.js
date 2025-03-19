document.addEventListener('DOMContentLoaded', function() {
    // Получаем высоту шапки
    const header = document.querySelector('.header');
    let headerHeight = header ? header.offsetHeight : 0;
    
    // Получаем элементы, которые будут фиксироваться
    const filterContainer = document.querySelector('.filter-container');
    
    // Устанавливаем правильные отступы с учетом высоты шапки
    function updateStickyPositions() {
        headerHeight = header ? header.offsetHeight : 0;
        
        if (filterContainer) {
            filterContainer.style.top = (headerHeight + 10) + 'px';
        }
    }
    
    // Вызываем функцию при загрузке и изменении размера окна
    updateStickyPositions();
    window.addEventListener('resize', updateStickyPositions);
    
    // Добавляем класс при прокрутке для визуальных эффектов
    let lastScrollPosition = 0;
    window.addEventListener('scroll', function() {
        const currentScrollPosition = window.pageYOffset;
        
        // Если прокрутили вниз больше чем на 100px, добавляем класс
        if (currentScrollPosition > 100) {
            document.body.classList.add('scrolled');
            
            // При прокрутке вниз делаем шапку компактнее
            if (currentScrollPosition > lastScrollPosition) {
                header.classList.add('compact');
            } else {
                header.classList.remove('compact');
            }
        } else {
            document.body.classList.remove('scrolled');
            header.classList.remove('compact');
        }
        
        lastScrollPosition = currentScrollPosition;
    });
}); 