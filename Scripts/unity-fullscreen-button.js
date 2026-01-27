/**
 * Unity WebGL Fullscreen Button Component
 * Просто добавьте этот скрипт в свой index.html и вызовите UnityFullscreenButton.init()
 */

const UnityFullscreenButton = (function() {
    'use strict';
    
    let unityInstance = null;
    let button = null;
    
    // Стили для кнопки
    const styles = `
        #unity-fullscreen-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            background: rgba(0, 0, 0, 0.7);
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 8px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            color: white;
            transition: all 0.3s ease;
            z-index: 9999;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
        }
        
        #unity-fullscreen-btn:hover {
            background: rgba(0, 0, 0, 0.9);
            border-color: rgba(255, 255, 255, 0.6);
            transform: scale(1.05);
        }
        
        #unity-fullscreen-btn:active {
            transform: scale(0.95);
        }
        
        #unity-fullscreen-btn svg {
            width: 28px;
            height: 28px;
            fill: white;
        }
    `;
    
    // SVG иконки
    const icons = {
        expand: `<svg viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>`,
        compress: `<svg viewBox="0 0 24 24"><path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/></svg>`
    };
    
    // Добавить стили на страницу
    function injectStyles() {
        const styleElement = document.createElement('style');
        styleElement.textContent = styles;
        document.head.appendChild(styleElement);
    }
    
    // Создать кнопку
    function createButton() {
        button = document.createElement('button');
        button.id = 'unity-fullscreen-btn';
        button.title = 'Полноэкранный режим';
        button.innerHTML = icons.expand;
        document.body.appendChild(button);
        return button;
    }
    
    // Обновить иконку кнопки
    function updateButtonIcon() {
        if (!button) return;
        
        const isFullscreen = document.fullscreenElement || 
                           document.webkitFullscreenElement || 
                           document.mozFullScreenElement ||
                           document.msFullscreenElement;
        
        if (isFullscreen) {
            button.innerHTML = icons.compress;
            button.title = 'Выйти из полноэкранного режима';
        } else {
            button.innerHTML = icons.expand;
            button.title = 'Полноэкранный режим';
        }
    }
    
    // Переключить полноэкранный режим
    function toggleFullscreen() {
        const canvas = document.querySelector('#unity-canvas') || document.querySelector('canvas');
        
        if (!canvas) {
            console.error('Unity canvas не найден');
            return;
        }
        
        const isFullscreen = document.fullscreenElement || 
                           document.webkitFullscreenElement || 
                           document.mozFullScreenElement ||
                           document.msFullscreenElement;
        
        if (!isFullscreen) {
            // Войти в полноэкранный режим
            if (canvas.requestFullscreen) {
                canvas.requestFullscreen();
            } else if (canvas.webkitRequestFullscreen) {
                canvas.webkitRequestFullscreen();
            } else if (canvas.mozRequestFullScreen) {
                canvas.mozRequestFullScreen();
            } else if (canvas.msRequestFullscreen) {
                canvas.msRequestFullscreen();
            }
            
            // Использовать Unity API если доступен
            if (unityInstance && typeof unityInstance.SetFullscreen === 'function') {
                unityInstance.SetFullscreen(1);
            }
        } else {
            // Выйти из полноэкранного режима
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
            
            // Использовать Unity API если доступен
            if (unityInstance && typeof unityInstance.SetFullscreen === 'function') {
                unityInstance.SetFullscreen(0);
            }
        }
    }
    
    // Инициализация
    function init(unityInstanceParam, options = {}) {
        // Сохранить ссылку на Unity instance
        if (unityInstanceParam) {
            unityInstance = unityInstanceParam;
        }
        
        // Добавить стили
        injectStyles();
        
        // Создать кнопку
        const btn = createButton();
        
        // Применить пользовательские настройки позиции
        if (options.bottom) btn.style.bottom = options.bottom;
        if (options.right) btn.style.right = options.right;
        if (options.left) btn.style.left = options.left;
        if (options.top) btn.style.top = options.top;
        
        // Добавить обработчик клика
        btn.addEventListener('click', toggleFullscreen);
        
        // Слушать изменения полноэкранного режима
        document.addEventListener('fullscreenchange', updateButtonIcon);
        document.addEventListener('webkitfullscreenchange', updateButtonIcon);
        document.addEventListener('mozfullscreenchange', updateButtonIcon);
        document.addEventListener('MSFullscreenChange', updateButtonIcon);
        
        console.log('Unity Fullscreen Button инициализирован');
    }
    
    // Удалить кнопку
    function destroy() {
        if (button && button.parentNode) {
            button.parentNode.removeChild(button);
        }
        document.removeEventListener('fullscreenchange', updateButtonIcon);
        document.removeEventListener('webkitfullscreenchange', updateButtonIcon);
        document.removeEventListener('mozfullscreenchange', updateButtonIcon);
        document.removeEventListener('MSFullscreenChange', updateButtonIcon);
    }
    
    // Публичный API
    return {
        init: init,
        destroy: destroy,
        toggle: toggleFullscreen
    };
})();

// Если используется как модуль
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UnityFullscreenButton;
}
