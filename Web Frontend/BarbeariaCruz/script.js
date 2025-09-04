// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const bookingForm = document.getElementById('bookingForm');
const dateInput = document.getElementById('date');
const timeSelect = document.getElementById('time');
const calendarGrid = document.getElementById('calendarGrid');
const calendarTitle = document.getElementById('calendarTitle');
const prevMonthBtn = document.getElementById('prevMonthBtn');
const nextMonthBtn = document.getElementById('nextMonthBtn');
const customerInfo = document.getElementById('customerInfo');
const confirmationPanel = document.getElementById('confirmationPanel');
const confBarber = document.getElementById('confBarber');
const confService = document.getElementById('confService');
const confDate = document.getElementById('confDate');
const confTime = document.getElementById('confTime');
const confName = document.getElementById('confName');
const confPhone = document.getElementById('confPhone');
const barberPreference = document.getElementById('barberPreference');
const barberCards = document.querySelectorAll('.barber-card');

// Estado global
let selectedBarber = null; // null => nenhum card; 'any' => sem preferência; 'joao'|'pedro'|'marcos' => específico
let googleCalendarInitialized = false;
let calendarState = { currentYear: null, currentMonth: null };

// Mobile Navigation
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = targetSection.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Header background on scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(0, 0, 0, 0.98)';
    } else {
        header.style.background = 'rgba(0, 0, 0, 0.95)';
    }
});

// Barber selection
barberCards.forEach(card => {
    card.addEventListener('click', () => {
        // Remove previous selection
        barberCards.forEach(c => c.classList.remove('selected'));
        
        // Add selection to clicked card
        card.classList.add('selected');
        selectedBarber = card.getAttribute('data-barber');
        if (barberPreference) barberPreference.value = selectedBarber;
        
        // Update available times based on selected barber
        updateAvailableTimes();
        updateCalendar();
        
        // Anunciar seleção para leitor de tela
        const barberName = card.querySelector('h4').textContent;
        accessibilityManager.announceToScreenReader(`Barbeiro selecionado: ${barberName}`);

        // Scroll para agenda
        const scheduleSection = document.getElementById('schedule');
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = scheduleSection.offsetTop - headerHeight;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    });
});

// Mudança via select de preferência de barbeiro
if (barberPreference) {
    barberPreference.addEventListener('change', () => {
        const value = barberPreference.value;
        selectedBarber = value === 'any' ? 'any' : value;
        // Sync visual cards
        barberCards.forEach(c => c.classList.remove('selected'));
        if (selectedBarber !== 'any') {
            const card = document.querySelector(`.barber-card[data-barber="${selectedBarber}"]`);
            if (card) card.classList.add('selected');
        }
        updateAvailableTimes();
        updateCalendar();
        updateConfirmationPanel();
    });
}

// Set minimum date to today
const today = new Date().toISOString().split('T')[0];
dateInput.setAttribute('min', today);

// Available time slots
const availableTimes = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30'
];

// Update available times based on selected date and barber
async function updateAvailableTimes() {
    const selectedDate = dateInput.value;
    const selectedDay = new Date(selectedDate).getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Clear current options
    timeSelect.innerHTML = '<option value="">Selecione um horário</option>';
    
    // Check if it's Sunday (closed)
    if (selectedDay === 0) {
        timeSelect.innerHTML = '<option value="">Fechado aos domingos</option>';
        return;
    }
    
    // Se o Google Calendar estiver disponível, buscar horários reais
    if (googleCalendarInitialized && selectedBarber && selectedBarber !== 'any') {
        try {
            timeSelect.innerHTML = '<option value="">Carregando horários...</option>';
            
            const availableSlots = await googleCalendarService.getAvailableSlots(selectedBarber, selectedDate);
            
            // Clear loading message
            timeSelect.innerHTML = '<option value="">Selecione um horário</option>';
            
            if (availableSlots.length === 0) {
                timeSelect.innerHTML = '<option value="">Nenhum horário disponível</option>';
                return;
            }
            
            // Add available times to select
            availableSlots.forEach(time => {
                const option = document.createElement('option');
                option.value = time;
                option.textContent = time;
                timeSelect.appendChild(option);
            });
            
            return;
        } catch (error) {
            console.error('Erro ao buscar horários do Google Calendar:', error);
            // Fallback para horários estáticos
        }
    }
    
    // Fallback: Filter times based on day (método anterior)
    let filteredTimes = availableTimes;
    
    // Saturday has different hours
    if (selectedDay === 6) { // Saturday
        filteredTimes = availableTimes.filter(time => {
            const hour = parseInt(time.split(':')[0]);
            return hour >= 8 && hour <= 17;
        });
    } else { // Monday to Friday
        filteredTimes = availableTimes.filter(time => {
            const hour = parseInt(time.split(':')[0]);
            return hour >= 9 && hour <= 18;
        });
    }
    
    // Add filtered times to select
    filteredTimes.forEach(time => {
        const option = document.createElement('option');
        option.value = time;
        option.textContent = time;
        timeSelect.appendChild(option);
    });
}

// Update times when date changes
dateInput.addEventListener('change', updateAvailableTimes);

// Mostrar dados do cliente somente após escolher horário
timeSelect.addEventListener('change', () => {
    if (timeSelect.value) {
        customerInfo.classList.remove('hidden');
        updateConfirmationPanel();
    } else {
        customerInfo.classList.add('hidden');
        confirmationPanel.classList.add('hidden');
    }
});

// Atualizar painel de confirmação
function updateConfirmationPanel() {
    const serviceKey = serviceSelect.value;
    const service = GOOGLE_CALENDAR_CONFIG.SERVICES[serviceKey];
    let barberName = '-';
    if (selectedBarber === 'any') {
        barberName = 'Sem preferência';
    } else if (selectedBarber && GOOGLE_CALENDAR_CONFIG.BARBERS[selectedBarber]) {
        barberName = GOOGLE_CALENDAR_CONFIG.BARBERS[selectedBarber].name;
    }
    confBarber.textContent = barberName;
    confService.textContent = service ? service.name : '-';
    confDate.textContent = dateInput.value || '-';
    confTime.textContent = timeSelect.value || '-';
    confName.textContent = document.getElementById('name')?.value || '-';
    confPhone.textContent = document.getElementById('phone')?.value || '-';
    confirmationPanel.classList.remove('hidden');
}

['change','input'].forEach(evt => {
    bookingForm.addEventListener(evt, () => {
        if (!confirmationPanel.classList.contains('hidden')) {
            updateConfirmationPanel();
        }
    });
});

// Calendar generation
function initCalendar() {
    const now = new Date();
    calendarState.currentYear = now.getFullYear();
    calendarState.currentMonth = now.getMonth();
    prevMonthBtn.addEventListener('click', () => changeMonth(-1));
    nextMonthBtn.addEventListener('click', () => changeMonth(1));
    updateCalendar();
}

function changeMonth(delta) {
    calendarState.currentMonth += delta;
    if (calendarState.currentMonth < 0) {
        calendarState.currentMonth = 11;
        calendarState.currentYear--;
    } else if (calendarState.currentMonth > 11) {
        calendarState.currentMonth = 0;
        calendarState.currentYear++;
    }
    updateCalendar();
}

function updateCalendar() {
    if (!calendarGrid || !calendarTitle) return;
    const year = calendarState.currentYear;
    const month = calendarState.currentMonth;
    const firstDay = new Date(year, month, 1);
    const monthName = firstDay.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    calendarTitle.textContent = monthName.charAt(0).toUpperCase() + monthName.slice(1);

    calendarGrid.innerHTML = '';
    const startWeekday = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Weekday headers (DOM, SEG, ...)
    const weekdays = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
    weekdays.forEach(wd => {
        const el = document.createElement('div');
        el.className = 'calendar-weekday';
        el.textContent = wd;
        calendarGrid.appendChild(el);
    });

    // Empty cells before 1st
    for (let i = 0; i < startWeekday; i++) {
        const empty = document.createElement('div');
        empty.className = 'calendar-day disabled';
        calendarGrid.appendChild(empty);
    }

    const todayObj = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
        const cellDate = new Date(year, month, day);
        const dateStr = cellDate.toISOString().split('T')[0];
        const isPast = cellDate < new Date(todayObj.getFullYear(), todayObj.getMonth(), todayObj.getDate());
        const isSunday = cellDate.getDay() === 0;

        const dayEl = document.createElement('div');
        dayEl.className = 'calendar-day';
        if (dateStr === new Date().toISOString().split('T')[0]) dayEl.classList.add('today');

        // Disponibilidade: domingo indisponível, passado indisponível, demais verde
        const available = !isPast && !isSunday;
        dayEl.classList.add(available ? 'available' : 'unavailable');
        if (!available) dayEl.classList.add('disabled');

        dayEl.innerHTML = `<span>${day}</span>`;
        if (available) {
            dayEl.addEventListener('click', async () => {
                // Seleciona data
                dateInput.value = dateStr;
                await updateAvailableTimes();
                updateConfirmationPanel();
                // Foca no seletor de horário
                timeSelect.focus();
            });
        }
        calendarGrid.appendChild(dayEl);
    }
}

// Form validation and submission
bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(bookingForm);
    const bookingData = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        service: formData.get('service'),
        date: formData.get('date'),
        time: formData.get('time'),
        barber: selectedBarber
    };
    
    // Validate form
    if (!validateBookingForm(bookingData)) {
        return;
    }
    
    // Show loading state
    const submitBtn = bookingForm.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Agendando...';
    submitBtn.disabled = true;
    
    try {
        let result;
        
        // Se o Google Calendar estiver disponível, criar agendamento real
        if (googleCalendarInitialized) {
            result = await googleCalendarService.createBooking(bookingData);
            
            if (result.success) {
                showMessage('Agendamento realizado com sucesso! Você receberá uma confirmação por email.', 'success');
                accessibilityManager.announceToScreenReader('Agendamento realizado com sucesso');
            } else {
                showMessage(`Erro ao criar agendamento: ${result.error}`, 'error');
                accessibilityManager.announceToScreenReader('Erro ao criar agendamento');
            }
        } else {
            // Simulate API call (fallback)
            await new Promise(resolve => setTimeout(resolve, 2000));
            showMessage('Agendamento realizado com sucesso! Entraremos em contato para confirmar.', 'success');
            accessibilityManager.announceToScreenReader('Agendamento realizado com sucesso');
        }
        
        // Reset form
        bookingForm.reset();
        barberCards.forEach(card => card.classList.remove('selected'));
        selectedBarber = null;
        
    } catch (error) {
        console.error('Erro no agendamento:', error);
        showMessage('Erro ao processar agendamento. Tente novamente.', 'error');
        accessibilityManager.announceToScreenReader('Erro ao processar agendamento');
    } finally {
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Clear any existing messages after 5 seconds
        setTimeout(() => {
            clearMessages();
        }, 5000);
    }
});

// Form validation function
function validateBookingForm(data) {
    clearMessages();
    
    if (!data.name || data.name.trim().length < 3) {
        showMessage('Por favor, insira um nome válido (mínimo 3 caracteres).', 'error');
        return false;
    }
    
    if (!data.phone || data.phone.trim().length < 10) {
        showMessage('Por favor, insira um telefone válido.', 'error');
        return false;
    }
    
    if (!data.service) {
        showMessage('Por favor, selecione um serviço.', 'error');
        return false;
    }
    
    if (!data.date) {
        showMessage('Por favor, selecione uma data.', 'error');
        return false;
    }
    
    if (!data.time) {
        showMessage('Por favor, selecione um horário.', 'error');
        return false;
    }
    
    if (!data.barber) {
        showMessage('Por favor, selecione um barbeiro.', 'error');
        return false;
    }
    
    // Check if selected date is not in the past
    const selectedDate = new Date(data.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
        showMessage('Por favor, selecione uma data futura.', 'error');
        return false;
    }
    
    return true;
}

// Show message function
function showMessage(message, type) {
    // Remove any existing messages
    clearMessages();
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    // Insert message before the form
    const formContainer = bookingForm.parentElement;
    formContainer.insertBefore(messageDiv, bookingForm);
}

// Clear messages function
function clearMessages() {
    const messages = document.querySelectorAll('.message');
    messages.forEach(message => message.remove());
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.service-card, .price-card, .gallery-item, .barber-card');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Gallery lightbox functionality
const galleryItems = document.querySelectorAll('.gallery-item img');

galleryItems.forEach(img => {
    img.addEventListener('click', () => {
        createLightbox(img.src, img.alt);
    });
});

function createLightbox(src, alt) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <span class="close-lightbox">&times;</span>
            <img src="${src}" alt="${alt}">
        </div>
    `;
    
    // Add styles
    lightbox.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    const content = lightbox.querySelector('.lightbox-content');
    content.style.cssText = `
        position: relative;
        max-width: 90%;
        max-height: 90%;
    `;
    
    const img = lightbox.querySelector('img');
    img.style.cssText = `
        width: 100%;
        height: auto;
        border-radius: 10px;
    `;
    
    const closeBtn = lightbox.querySelector('.close-lightbox');
    closeBtn.style.cssText = `
        position: absolute;
        top: -40px;
        right: 0;
        color: white;
        font-size: 30px;
        cursor: pointer;
        background: none;
        border: none;
    `;
    
    document.body.appendChild(lightbox);
    
    // Fade in
    setTimeout(() => {
        lightbox.style.opacity = '1';
    }, 10);
    
    // Close functionality
    const closeLightbox = () => {
        lightbox.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(lightbox);
        }, 300);
    };
    
    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeLightbox();
        }
    });
}

// Service price calculator
const serviceSelect = document.getElementById('service');
const servicePrices = {
    'corte': 35.00,
    'barba': 25.00,
    'corte-barba': 50.00,
    'coloracao': 40.00
};

// Add price display functionality (optional enhancement)
function updatePriceDisplay() {
    const selectedService = serviceSelect.value;
    if (selectedService && servicePrices[selectedService]) {
        // You could add a price display element here
        console.log(`Preço selecionado: R$ ${servicePrices[selectedService].toFixed(2)}`);
    }
}

serviceSelect.addEventListener('change', updatePriceDisplay);

// Auto-scroll to top button
const scrollToTopBtn = document.createElement('button');
scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
scrollToTopBtn.className = 'scroll-to-top';
scrollToTopBtn.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    background: var(--secondary-color);
    color: var(--primary-color);
    border: none;
    border-radius: 50%;
    cursor: pointer;
    font-size: 20px;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 1000;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

document.body.appendChild(scrollToTopBtn);

// Show/hide scroll to top button
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollToTopBtn.style.opacity = '1';
        scrollToTopBtn.style.visibility = 'visible';
    } else {
        scrollToTopBtn.style.opacity = '0';
        scrollToTopBtn.style.visibility = 'hidden';
    }
});

// Scroll to top functionality
scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Initialize the page
document.addEventListener('DOMContentLoaded', async () => {
    // Set current date as minimum
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
    
    // Initialize available times
    updateAvailableTimes();

    // Init calendar
    initCalendar();
    
    // Initialize Google Calendar service
    try {
        googleCalendarInitialized = await initializeGoogleCalendarService();
        if (googleCalendarInitialized) {
            console.log('Google Calendar API inicializada com sucesso');
        } else {
            console.log('Google Calendar API não disponível, usando modo offline');
        }
    } catch (error) {
        console.error('Erro ao inicializar Google Calendar:', error);
    }
    
    console.log('Barbearia Cruz - Site carregado com sucesso!');
});

// WhatsApp integration (optional)
function openWhatsApp() {
    const phone = '5511999999999'; // Replace with actual phone number
    const message = 'Olá! Gostaria de agendar um horário na Barbearia Cruz.';
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

// Add WhatsApp button to contact section (optional enhancement)
const contactSection = document.querySelector('.contact');
if (contactSection) {
    const whatsappBtn = document.createElement('button');
    whatsappBtn.innerHTML = '<i class="fab fa-whatsapp"></i> Agendar via WhatsApp';
    whatsappBtn.className = 'whatsapp-btn';
    
    whatsappBtn.addEventListener('click', openWhatsApp);
    contactSection.appendChild(whatsappBtn);
}
