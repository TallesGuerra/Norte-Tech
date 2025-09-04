// Módulo de Acessibilidade e Melhorias Mobile
class AccessibilityManager {
    constructor() {
        this.config = ACCESSIBILITY_CONFIG;
        this.mobileConfig = MOBILE_CONFIG;
        this.isMobile = this.detectMobile();
        this.isTouchDevice = this.detectTouchDevice();
        this.currentFontSize = 'medium';
        this.highContrast = false;
        this.reducedMotion = false;
        
        this.init();
    }

    // Detecta se é dispositivo mobile
    detectMobile() {
        return window.innerWidth <= this.mobileConfig.breakpoints.mobile;
    }

    // Detecta se é dispositivo touch
    detectTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }

    // Inicializa o módulo
    init() {
        this.setupEventListeners();
        this.applyInitialSettings();
        this.setupMobileOptimizations();
        this.setupAccessibilityFeatures();
        this.setupScreenReaderSupport();
    }

    // Configura event listeners
    setupEventListeners() {
        // Resize listener para responsividade
        window.addEventListener('resize', this.handleResize.bind(this));
        
        // Touch events para mobile
        if (this.isTouchDevice) {
            this.setupTouchEvents();
        }

        // Keyboard navigation
        document.addEventListener('keydown', this.handleKeyboardNavigation.bind(this));
        
        // Focus management
        document.addEventListener('focusin', this.handleFocusIn.bind(this));
        document.addEventListener('focusout', this.handleFocusOut.bind(this));
    }

    // Aplica configurações iniciais
    applyInitialSettings() {
        // Aplica tamanho de fonte inicial
        this.setFontSize(this.currentFontSize);
        
        // Aplica contraste inicial
        this.setHighContrast(this.highContrast);
        
        // Aplica redução de movimento
        this.setReducedMotion(this.reducedMotion);
        
        // Aplica otimizações mobile
        if (this.isMobile) {
            this.applyMobileOptimizations();
        }
    }

    // Configura otimizações mobile
    setupMobileOptimizations() {
        if (!this.isMobile) return;

        // Adiciona viewport meta tag se não existir
        if (!document.querySelector('meta[name="viewport"]')) {
            const viewport = document.createElement('meta');
            viewport.name = 'viewport';
            viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
            document.head.appendChild(viewport);
        }

        // Adiciona touch-action CSS
        this.addTouchActionStyles();
        
        // Otimiza imagens para mobile
        this.optimizeImagesForMobile();
        
        // Configura lazy loading
        if (this.mobileConfig.performance.lazyLoading) {
            this.setupLazyLoading();
        }
    }

    // Aplica otimizações mobile
    applyMobileOptimizations() {
        // Adiciona classes CSS para mobile
        document.body.classList.add('mobile-device');
        
        // Otimiza navegação mobile
        this.optimizeMobileNavigation();
        
        // Configura gestos touch
        if (this.mobileConfig.touch.swipeEnabled) {
            this.setupSwipeGestures();
        }
    }

    // Configura eventos touch
    setupTouchEvents() {
        // Adiciona classe para dispositivos touch
        document.body.classList.add('touch-device');
        
        // Remove hover effects em dispositivos touch
        this.removeHoverEffects();
        
        // Adiciona tap highlight se habilitado
        if (this.mobileConfig.touch.tapHighlight) {
            this.addTapHighlight();
        }
    }

    // Configura gestos de swipe
    setupSwipeGestures() {
        let startX, startY, endX, endY;
        const minSwipeDistance = 50;

        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });

        document.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
            
            const deltaX = endX - startX;
            const deltaY = endY - startY;
            
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
                if (deltaX > 0) {
                    this.handleSwipeRight();
                } else {
                    this.handleSwipeLeft();
                }
            }
        });
    }

    // Configura funcionalidades de acessibilidade
    setupAccessibilityFeatures() {
        // Adiciona skip links
        this.addSkipLinks();
        
        // Melhora contraste de foco
        this.improveFocusContrast();
        
        // Adiciona labels ARIA
        this.addAriaLabels();
        
        // Configura navegação por teclado
        this.setupKeyboardNavigation();
    }

    // Configura suporte a leitor de tela
    setupScreenReaderSupport() {
        if (!this.config.screenReader.enabled) return;

        // Adiciona região de anúncios
        this.addAnnouncementRegion();
        
        // Configura landmarks ARIA
        this.setupAriaLandmarks();
        
        // Adiciona descrições para imagens
        this.addImageDescriptions();
    }

    // Adiciona skip links
    addSkipLinks() {
        const skipLinks = `
            <a href="#main-content" class="skip-link">Pular para o conteúdo principal</a>
            <a href="#navigation" class="skip-link">Pular para a navegação</a>
            <a href="#schedule" class="skip-link">Pular para agendamento</a>
        `;
        
        document.body.insertAdjacentHTML('afterbegin', skipLinks);
    }

    // Adiciona região de anúncios
    addAnnouncementRegion() {
        const announcementRegion = document.createElement('div');
        announcementRegion.id = 'announcements';
        announcementRegion.setAttribute('aria-live', 'polite');
        announcementRegion.setAttribute('aria-atomic', 'true');
        announcementRegion.className = 'sr-only';
        document.body.appendChild(announcementRegion);
    }

    // Anuncia mensagem para leitor de tela
    announceToScreenReader(message) {
        if (!this.config.screenReader.announcements) return;
        
        const announcementRegion = document.getElementById('announcements');
        if (announcementRegion) {
            announcementRegion.textContent = message;
            setTimeout(() => {
                announcementRegion.textContent = '';
            }, 1000);
        }
    }

    // Configura landmarks ARIA
    setupAriaLandmarks() {
        // Header
        const header = document.querySelector('header');
        if (header) {
            header.setAttribute('role', 'banner');
        }

        // Navigation
        const nav = document.querySelector('nav');
        if (nav) {
            nav.setAttribute('role', 'navigation');
            nav.setAttribute('aria-label', 'Navegação principal');
        }

        // Main content
        const main = document.querySelector('main') || document.querySelector('#home');
        if (main) {
            main.setAttribute('role', 'main');
            main.id = 'main-content';
        }

        // Footer
        const footer = document.querySelector('footer');
        if (footer) {
            footer.setAttribute('role', 'contentinfo');
        }
    }

    // Adiciona labels ARIA
    addAriaLabels() {
        // Formulário de agendamento
        const bookingForm = document.getElementById('bookingForm');
        if (bookingForm) {
            bookingForm.setAttribute('aria-label', 'Formulário de agendamento');
        }

        // Campos do formulário
        const formFields = bookingForm?.querySelectorAll('input, select, textarea');
        formFields?.forEach(field => {
            const label = document.querySelector(`label[for="${field.id}"]`);
            if (label) {
                field.setAttribute('aria-labelledby', label.id);
            }
        });

        // Botões
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (!button.getAttribute('aria-label') && !button.textContent.trim()) {
                const icon = button.querySelector('i');
                if (icon) {
                    button.setAttribute('aria-label', icon.className.split(' ').pop());
                }
            }
        });
    }

    // Adiciona descrições para imagens
    addImageDescriptions() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (!img.alt) {
                img.setAttribute('alt', 'Imagem descritiva');
            }
        });
    }

    // Configura navegação por teclado
    setupKeyboardNavigation() {
        // Navegação por tab
        const focusableElements = document.querySelectorAll(
            'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        focusableElements.forEach(element => {
            element.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    element.click();
                }
            });
        });
    }

    // Manipula navegação por teclado
    handleKeyboardNavigation(e) {
        // Escape para fechar modais/menus
        if (e.key === 'Escape') {
            this.closeAllModals();
        }

        // Ctrl + M para abrir menu de acessibilidade
        if (e.ctrlKey && e.key === 'm') {
            e.preventDefault();
            this.toggleAccessibilityMenu();
        }
    }

    // Manipula foco
    handleFocusIn(e) {
        e.target.classList.add('focus-visible');
    }

    handleFocusOut(e) {
        e.target.classList.remove('focus-visible');
    }

    // Manipula resize da janela
    handleResize() {
        const wasMobile = this.isMobile;
        this.isMobile = this.detectMobile();
        
        if (wasMobile !== this.isMobile) {
            if (this.isMobile) {
                this.applyMobileOptimizations();
            } else {
                this.removeMobileOptimizations();
            }
        }
    }

    // Configura lazy loading
    setupLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    // Otimiza imagens para mobile
    optimizeImagesForMobile() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (this.isMobile) {
                img.setAttribute('loading', 'lazy');
                img.classList.add('mobile-optimized');
            }
        });
    }

    // Adiciona estilos de touch-action
    addTouchActionStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .touch-device * {
                touch-action: manipulation;
            }
            
            .touch-device button,
            .touch-device a {
                min-height: 44px;
                min-width: 44px;
            }
            
            .mobile-device .service-card,
            .mobile-device .price-card {
                margin-bottom: 1rem;
            }
            
            .skip-link {
                position: absolute;
                top: -40px;
                left: 6px;
                background: var(--primary-color);
                color: var(--light-text);
                padding: 8px;
                text-decoration: none;
                border-radius: 4px;
                z-index: 10000;
            }
            
            .skip-link:focus {
                top: 6px;
            }
            
            .sr-only {
                position: absolute;
                width: 1px;
                height: 1px;
                padding: 0;
                margin: -1px;
                overflow: hidden;
                clip: rect(0, 0, 0, 0);
                white-space: nowrap;
                border: 0;
            }
            
            .focus-visible {
                outline: 3px solid var(--secondary-color);
                outline-offset: 2px;
            }
            
            .high-contrast {
                filter: contrast(1.5);
            }
            
            .reduced-motion * {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        `;
        document.head.appendChild(style);
    }

    // Remove efeitos hover em dispositivos touch
    removeHoverEffects() {
        const style = document.createElement('style');
        style.textContent = `
            .touch-device *:hover {
                transform: none !important;
                box-shadow: none !important;
            }
        `;
        document.head.appendChild(style);
    }

    // Adiciona highlight de tap
    addTapHighlight() {
        const style = document.createElement('style');
        style.textContent = `
            .touch-device button:active,
            .touch-device a:active {
                background-color: rgba(255, 215, 0, 0.3) !important;
            }
        `;
        document.head.appendChild(style);
    }

    // Otimiza navegação mobile
    optimizeMobileNavigation() {
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu) {
            navMenu.setAttribute('aria-expanded', 'false');
        }
    }

    // Remove otimizações mobile
    removeMobileOptimizations() {
        document.body.classList.remove('mobile-device');
    }

    // Manipula swipe para direita
    handleSwipeRight() {
        // Implementar navegação para seção anterior
        console.log('Swipe para direita detectado');
    }

    // Manipula swipe para esquerda
    handleSwipeLeft() {
        // Implementar navegação para próxima seção
        console.log('Swipe para esquerda detectado');
    }

    // Fecha todos os modais
    closeAllModals() {
        const modals = document.querySelectorAll('.modal, .lightbox');
        modals.forEach(modal => {
            if (modal.style.display !== 'none') {
                modal.style.display = 'none';
            }
        });
    }

    // Alterna menu de acessibilidade
    toggleAccessibilityMenu() {
        // Implementar menu de acessibilidade
        console.log('Menu de acessibilidade');
    }

    // Define tamanho da fonte
    setFontSize(size) {
        this.currentFontSize = size;
        const sizes = {
            small: '14px',
            medium: '16px',
            large: '18px',
            'x-large': '20px'
        };
        
        document.documentElement.style.fontSize = sizes[size];
        this.announceToScreenReader(`Tamanho da fonte alterado para ${size}`);
    }

    // Define contraste alto
    setHighContrast(enabled) {
        this.highContrast = enabled;
        document.body.classList.toggle('high-contrast', enabled);
        this.announceToScreenReader(enabled ? 'Contraste alto ativado' : 'Contraste alto desativado');
    }

    // Define redução de movimento
    setReducedMotion(enabled) {
        this.reducedMotion = enabled;
        document.body.classList.toggle('reduced-motion', enabled);
        this.announceToScreenReader(enabled ? 'Redução de movimento ativada' : 'Redução de movimento desativada');
    }

    // Obtém configurações atuais
    getCurrentSettings() {
        return {
            fontSize: this.currentFontSize,
            highContrast: this.highContrast,
            reducedMotion: this.reducedMotion,
            isMobile: this.isMobile,
            isTouchDevice: this.isTouchDevice
        };
    }
}

// Instância global do gerenciador de acessibilidade
const accessibilityManager = new AccessibilityManager();

// Exportar para uso global
window.AccessibilityManager = AccessibilityManager;
window.accessibilityManager = accessibilityManager;
