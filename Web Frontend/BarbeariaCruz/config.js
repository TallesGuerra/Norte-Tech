// Configuração da API do Google Calendar
const GOOGLE_CALENDAR_CONFIG = {
    // Substitua pelo ID do calendário da barbearia
    CALENDAR_ID: 'barbeariacruz@gmail.com',
    
    // Chave da API do Google (você precisará criar no Google Cloud Console)
    API_KEY: 'SUA_API_KEY_AQUI',
    
    // Configurações dos barbeiros
    BARBERS: {
        joao: {
            name: 'João Silva',
            email: 'joao@barbeariacruz.com',
            calendarId: 'joao@barbeariacruz.com', // Calendário individual do João
            specialties: ['Cortes modernos', 'Fades', 'Degradê'],
            workingHours: {
                monday: { start: '09:00', end: '19:00' },
                tuesday: { start: '09:00', end: '19:00' },
                wednesday: { start: '09:00', end: '19:00' },
                thursday: { start: '09:00', end: '19:00' },
                friday: { start: '09:00', end: '19:00' },
                saturday: { start: '08:00', end: '18:00' },
                sunday: { start: null, end: null } // Fechado
            }
        },
        pedro: {
            name: 'Pedro Santos',
            email: 'pedro@barbeariacruz.com',
            calendarId: 'pedro@barbeariacruz.com',
            specialties: ['Barbas', 'Acabamentos', 'Tratamentos'],
            workingHours: {
                monday: { start: '09:00', end: '19:00' },
                tuesday: { start: '09:00', end: '19:00' },
                wednesday: { start: '09:00', end: '19:00' },
                thursday: { start: '09:00', end: '19:00' },
                friday: { start: '09:00', end: '19:00' },
                saturday: { start: '08:00', end: '18:00' },
                sunday: { start: null, end: null }
            }
        },
        marcos: {
            name: 'Marcos Costa',
            email: 'marcos@barbeariacruz.com',
            calendarId: 'marcos@barbeariacruz.com',
            specialties: ['Coloração', 'Tratamentos especiais', 'Consultoria'],
            workingHours: {
                monday: { start: '09:00', end: '19:00' },
                tuesday: { start: '09:00', end: '19:00' },
                wednesday: { start: '09:00', end: '19:00' },
                thursday: { start: '09:00', end: '19:00' },
                friday: { start: '09:00', end: '19:00' },
                saturday: { start: '08:00', end: '18:00' },
                sunday: { start: null, end: null }
            }
        }
    },
    
    // Configurações dos serviços
    SERVICES: {
        corte: {
            name: 'Corte Masculino',
            price: 35.00,
            duration: 45, // minutos
            description: 'Cortes modernos e tradicionais com acabamento perfeito'
        },
        barba: {
            name: 'Barba',
            price: 25.00,
            duration: 30,
            description: 'Acabamento e modelagem de barba com produtos premium'
        },
        'corte-barba': {
            name: 'Corte + Barba',
            price: 50.00,
            duration: 75,
            description: 'Corte completo + acabamento da barba'
        },
        coloracao: {
            name: 'Coloração',
            price: 40.00,
            duration: 60,
            description: 'Coloração profissional para cabelo e barba'
        }
    },
    
    // Configurações de horários
    TIME_SLOTS: {
        interval: 30, // minutos entre cada horário
        buffer: 15 // minutos de buffer entre agendamentos
    }
};

// Funções utilitárias para trabalhar com datas e horários
const DateUtils = {
    // Converte string de data para objeto Date
    parseDate(dateString) {
        return new Date(dateString + 'T00:00:00');
    },
    
    // Formata data para exibição
    formatDate(date) {
        return date.toLocaleDateString('pt-BR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },
    
    // Formata hora para exibição
    formatTime(time) {
        return time;
    },
    
    // Verifica se é dia útil
    isWorkingDay(date) {
        const day = date.getDay();
        return day >= 1 && day <= 6; // Segunda a Sábado
    },
    
    // Obtém o nome do dia da semana
    getDayName(date) {
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        return days[date.getDay()];
    },
    
    // Gera horários disponíveis baseado no dia e barbeiro
    generateTimeSlots(date, barberId) {
        const dayName = this.getDayName(date);
        const barber = GOOGLE_CALENDAR_CONFIG.BARBERS[barberId];
        
        if (!barber || !barber.workingHours[dayName] || !barber.workingHours[dayName].start) {
            return [];
        }
        
        const { start, end } = barber.workingHours[dayName];
        const slots = [];
        const interval = GOOGLE_CALENDAR_CONFIG.TIME_SLOTS.interval;
        
        let currentTime = new Date(`2000-01-01T${start}`);
        const endTime = new Date(`2000-01-01T${end}`);
        
        while (currentTime < endTime) {
            slots.push(currentTime.toTimeString().slice(0, 5));
            currentTime.setMinutes(currentTime.getMinutes() + interval);
        }
        
        return slots;
    }
};

// Configurações de acessibilidade
const ACCESSIBILITY_CONFIG = {
    // Configurações de contraste
    highContrast: false,
    
    // Configurações de fonte
    fontSize: 'medium', // small, medium, large, x-large
    
    // Configurações de animação
    reducedMotion: false,
    
    // Configurações de foco
    focusVisible: true,
    
    // Configurações de leitor de tela
    screenReader: {
        enabled: true,
        announcements: true
    }
};

// Configurações mobile
const MOBILE_CONFIG = {
    // Breakpoints
    breakpoints: {
        mobile: 768,
        tablet: 1024,
        desktop: 1200
    },
    
    // Configurações de touch
    touch: {
        enabled: true,
        swipeEnabled: true,
        tapHighlight: true
    },
    
    // Configurações de performance
    performance: {
        lazyLoading: true,
        imageOptimization: true,
        preloadCritical: true
    }
};

// Exportar configurações
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        GOOGLE_CALENDAR_CONFIG,
        DateUtils,
        ACCESSIBILITY_CONFIG,
        MOBILE_CONFIG
    };
}
