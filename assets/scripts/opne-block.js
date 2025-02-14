document.addEventListener('DOMContentLoaded', function () {
    const headers = document.querySelectorAll('.filters-form__block-header');
    headers.forEach(header => {
        const checkButton = header.querySelector('[data-toggle]');
        if (checkButton) {
            header.style.cursor = "pointer";
        }
        header.addEventListener('click', function (event) {
            event.preventDefault();
            const toggleButton = header.querySelector('[data-toggle]');
            if (!toggleButton) {
                return;
            }
            const toggleType = toggleButton.getAttribute('data-toggle');
            const contentBlock = document.querySelector(`.dropdown-content-block [data-block-content="${toggleType}"]`);
            const buttonIcon = toggleButton.querySelector('.filters-select__icon');

            if (contentBlock) {
                if (header.classList.contains('active')) {
                    contentBlock.style.maxHeight = '0px';
                    header.classList.remove('active');
                    buttonIcon.classList.remove('rotated');
                    contentBlock.classList.remove('open');
                } else {
                    contentBlock.style.maxHeight = `${contentBlock.scrollHeight}px`;
                    header.classList.add('active');
                    buttonIcon.classList.add('rotated');
                    contentBlock.classList.add('open');
                }
                // Обработка завершения анимации
                contentBlock.addEventListener('transitionend', function () {
                    if (contentBlock.style.maxHeight !== '0px') {
                        contentBlock.style.maxHeight = 'none'; // Сбрасываем ограничение после анимации
                    }
                }, { once: true });
            }
        });
    });

    // Обработка динамического изменения контента
    const observer = new MutationObserver(function (mutations) {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList' || mutation.type === 'attributes') {
                const openBlocks = document.querySelectorAll('.filters-form__block-content[style*="max-height"]');
                openBlocks.forEach(block => {
                    if (block.style.maxHeight !== '0px') {
                        block.style.maxHeight = `${block.scrollHeight}px`; // Обновляем max-height при изменении контента
                    }
                });
            }
        });
    });

    const contentBlocks = document.querySelectorAll('.filters-form__block-content');
    contentBlocks.forEach(block => {
        observer.observe(block, { childList: true, attributes: true, subtree: true });
    });
});