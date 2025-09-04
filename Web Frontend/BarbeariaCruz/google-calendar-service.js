// Serviço para integração com Google Calendar API
class GoogleCalendarService {
    constructor() {
        this.apiKey = GOOGLE_CALENDAR_CONFIG.API_KEY;
        this.baseUrl = 'https://www.googleapis.com/calendar/v3';
        this.calendarId = GOOGLE_CALENDAR_CONFIG.CALENDAR_ID;
    }

    // Carrega a API do Google Calendar
    async loadGoogleCalendarAPI() {
        return new Promise((resolve, reject) => {
            if (window.gapi) {
                resolve(window.gapi);
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://apis.google.com/js/api.js';
            script.onload = () => {
                window.gapi.load('client:auth2', () => {
                    window.gapi.client.init({
                        apiKey: this.apiKey,
                        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest']
                    }).then(() => {
                        resolve(window.gapi);
                    }).catch(reject);
                });
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    // Autentica o usuário (opcional - para operações que requerem permissão)
    async authenticate() {
        try {
            const gapi = await this.loadGoogleCalendarAPI();
            const auth2 = gapi.auth2.getAuthInstance();
            
            if (!auth2.isSignedIn.get()) {
                await auth2.signIn({
                    scope: 'https://www.googleapis.com/auth/calendar.events'
                });
            }
            
            return true;
        } catch (error) {
            console.error('Erro na autenticação:', error);
            return false;
        }
    }

    // Busca eventos de um barbeiro específico em uma data
    async getBarberEvents(barberId, date) {
        try {
            const barber = GOOGLE_CALENDAR_CONFIG.BARBERS[barberId];
            if (!barber) {
                throw new Error('Barbeiro não encontrado');
            }

            const startDate = new Date(date);
            startDate.setHours(0, 0, 0, 0);
            
            const endDate = new Date(date);
            endDate.setHours(23, 59, 59, 999);

            const response = await fetch(
                `${this.baseUrl}/calendars/${encodeURIComponent(barber.calendarId)}/events?` +
                `timeMin=${startDate.toISOString()}&` +
                `timeMax=${endDate.toISOString()}&` +
                `singleEvents=true&` +
                `orderBy=startTime&` +
                `key=${this.apiKey}`
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.items || [];
        } catch (error) {
            console.error('Erro ao buscar eventos:', error);
            return [];
        }
    }

    // Verifica disponibilidade de horário
    async checkAvailability(barberId, date, time, serviceDuration = 45) {
        try {
            const events = await this.getBarberEvents(barberId, date);
            const requestedStart = new Date(`${date}T${time}`);
            const requestedEnd = new Date(requestedStart.getTime() + serviceDuration * 60000);

            // Verifica se há conflitos com eventos existentes
            for (const event of events) {
                const eventStart = new Date(event.start.dateTime || event.start.date);
                const eventEnd = new Date(event.end.dateTime || event.end.date);

                if (requestedStart < eventEnd && requestedEnd > eventStart) {
                    return false; // Conflito encontrado
                }
            }

            return true; // Horário disponível
        } catch (error) {
            console.error('Erro ao verificar disponibilidade:', error);
            return false;
        }
    }

    // Cria um novo agendamento
    async createBooking(bookingData) {
        try {
            const barber = GOOGLE_CALENDAR_CONFIG.BARBERS[bookingData.barber];
            const service = GOOGLE_CALENDAR_CONFIG.SERVICES[bookingData.service];
            
            if (!barber || !service) {
                throw new Error('Dados inválidos para agendamento');
            }

            const startTime = new Date(`${bookingData.date}T${bookingData.time}`);
            const endTime = new Date(startTime.getTime() + service.duration * 60000);

            const event = {
                summary: `${service.name} - ${bookingData.name}`,
                description: `Cliente: ${bookingData.name}\nTelefone: ${bookingData.phone}\nServiço: ${service.name}\nBarbeiro: ${barber.name}`,
                start: {
                    dateTime: startTime.toISOString(),
                    timeZone: 'America/Sao_Paulo'
                },
                end: {
                    dateTime: endTime.toISOString(),
                    timeZone: 'America/Sao_Paulo'
                },
                attendees: [
                    { email: barber.email },
                    { email: 'contato@barbeariacruz.com' }
                ],
                reminders: {
                    useDefault: false,
                    overrides: [
                        { method: 'email', minutes: 24 * 60 }, // 1 dia antes
                        { method: 'popup', minutes: 60 } // 1 hora antes
                    ]
                }
            };

            const response = await fetch(
                `${this.baseUrl}/calendars/${encodeURIComponent(barber.calendarId)}/events?key=${this.apiKey}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(event)
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return {
                success: true,
                eventId: result.id,
                event: result
            };
        } catch (error) {
            console.error('Erro ao criar agendamento:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Obtém horários disponíveis para um barbeiro em uma data
    async getAvailableSlots(barberId, date) {
        try {
            const barber = GOOGLE_CALENDAR_CONFIG.BARBERS[barberId];
            if (!barber) {
                return [];
            }

            // Gera todos os horários possíveis
            const allSlots = DateUtils.generateTimeSlots(date, barberId);
            const events = await this.getBarberEvents(barberId, date);
            const availableSlots = [];

            for (const slot of allSlots) {
                const isAvailable = await this.checkAvailability(barberId, date, slot);
                if (isAvailable) {
                    availableSlots.push(slot);
                }
            }

            return availableSlots;
        } catch (error) {
            console.error('Erro ao obter horários disponíveis:', error);
            return [];
        }
    }

    // Cancela um agendamento
    async cancelBooking(barberId, eventId) {
        try {
            const barber = GOOGLE_CALENDAR_CONFIG.BARBERS[barberId];
            if (!barber) {
                throw new Error('Barbeiro não encontrado');
            }

            const response = await fetch(
                `${this.baseUrl}/calendars/${encodeURIComponent(barber.calendarId)}/events/${eventId}?key=${this.apiKey}`,
                {
                    method: 'DELETE'
                }
            );

            return response.ok;
        } catch (error) {
            console.error('Erro ao cancelar agendamento:', error);
            return false;
        }
    }

    // Atualiza um agendamento
    async updateBooking(barberId, eventId, updatedData) {
        try {
            const barber = GOOGLE_CALENDAR_CONFIG.BARBERS[barberId];
            if (!barber) {
                throw new Error('Barbeiro não encontrado');
            }

            const response = await fetch(
                `${this.baseUrl}/calendars/${encodeURIComponent(barber.calendarId)}/events/${eventId}?key=${this.apiKey}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedData)
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao atualizar agendamento:', error);
            throw error;
        }
    }

    // Sincroniza dados locais com o Google Calendar
    async syncWithGoogleCalendar() {
        try {
            // Implementar lógica de sincronização
            console.log('Sincronizando com Google Calendar...');
            
            // Aqui você pode implementar a lógica para sincronizar
            // dados locais com o Google Calendar
            
            return true;
        } catch (error) {
            console.error('Erro na sincronização:', error);
            return false;
        }
    }
}

// Instância global do serviço
const googleCalendarService = new GoogleCalendarService();

// Função para inicializar o serviço
async function initializeGoogleCalendarService() {
    try {
        await googleCalendarService.loadGoogleCalendarAPI();
        console.log('Google Calendar API carregada com sucesso');
        return true;
    } catch (error) {
        console.error('Erro ao carregar Google Calendar API:', error);
        return false;
    }
}

// Exportar para uso global
window.GoogleCalendarService = GoogleCalendarService;
window.googleCalendarService = googleCalendarService;
window.initializeGoogleCalendarService = initializeGoogleCalendarService;
