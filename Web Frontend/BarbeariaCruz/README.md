# Barbearia Cruz - Site de Agendamento

Site profissional para a Barbearia Cruz com sistema de agendamento integrado ao Google Calendar e recursos de acessibilidade.

## 🚀 Funcionalidades

### ✨ Principais
- **Sistema de Agendamento**: Integração completa com Google Calendar
- **Seleção de Barbeiros**: 3 barbeiros especializados
- **Galeria de Trabalhos**: Lightbox interativo
- **Responsivo**: Otimizado para mobile e desktop
- **Acessibilidade**: Suporte completo a leitores de tela

### 📱 Mobile
- Navegação touch-friendly
- Gestos de swipe
- Otimização de performance
- Lazy loading de imagens
- Interface adaptativa

### ♿ Acessibilidade
- Navegação por teclado
- Suporte a leitores de tela
- Contraste alto
- Redução de movimento
- Skip links
- Labels ARIA

## 🛠️ Configuração

### 1. Google Calendar API

Para usar o sistema de agendamento real, você precisa configurar a API do Google Calendar:

#### Passo 1: Criar Projeto no Google Cloud Console
1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Ative a Google Calendar API

#### Passo 2: Criar Credenciais
1. Vá para "APIs & Services" > "Credentials"
2. Clique em "Create Credentials" > "API Key"
3. Copie a chave da API

#### Passo 3: Configurar Calendários
1. Crie calendários separados para cada barbeiro no Google Calendar
2. Compartilhe os calendários com as permissões adequadas
3. Anote os IDs dos calendários (email dos calendários)

#### Passo 4: Atualizar Configuração
Edite o arquivo `config.js`:

```javascript
const GOOGLE_CALENDAR_CONFIG = {
    CALENDAR_ID: 'barbeariacruz@gmail.com', // Calendário principal
    API_KEY: 'SUA_API_KEY_AQUI', // Cole sua chave da API
    
    BARBERS: {
        joao: {
            name: 'João Silva',
            email: 'joao@barbeariacruz.com',
            calendarId: 'joao@barbeariacruz.com', // ID do calendário do João
            // ... outras configurações
        },
        // ... outros barbeiros
    }
};
```

### 2. Personalização

#### Cores e Estilo
As cores são baseadas no Instagram da Barbearia Cruz:
- **Primária**: Preto (#000000)
- **Secundária**: Dourado (#FFD700)
- **Acento**: Laranja (#FFA500)

#### Informações da Barbearia
Edite no arquivo `index.html`:
- Nome e endereço
- Telefone e email
- Horários de funcionamento
- Preços dos serviços

#### Imagens
- Substitua as imagens da galeria por fotos reais dos trabalhos
- Otimize as imagens para web (recomendado: 800x600px)
- Use formato WebP para melhor performance

## 📁 Estrutura de Arquivos

```
BarbeariaCruz/
├── index.html              # Página principal
├── styles.css              # Estilos CSS
├── script.js               # JavaScript principal
├── config.js               # Configurações
├── google-calendar-service.js  # Serviço Google Calendar
├── accessibility.js        # Módulo de acessibilidade
└── README.md              # Este arquivo
```

## 🔧 Como Usar

### Modo Online (com Google Calendar)
1. Configure a API do Google Calendar
2. Atualize as configurações no `config.js`
3. Abra o site em um servidor web
4. Os agendamentos serão criados automaticamente no Google Calendar

### Modo Offline (sem Google Calendar)
1. O site funciona normalmente sem a API
2. Os agendamentos são simulados
3. Ideal para testes e demonstrações

## 📱 Recursos Mobile

### Gestos Touch
- **Swipe para esquerda**: Próxima seção
- **Swipe para direita**: Seção anterior
- **Tap**: Seleção de elementos

### Otimizações
- Lazy loading de imagens
- Touch-friendly buttons (mínimo 44px)
- Remoção de hover effects
- Performance otimizada

## ♿ Recursos de Acessibilidade

### Navegação por Teclado
- **Tab**: Navegar entre elementos
- **Enter/Space**: Ativar elementos
- **Escape**: Fechar modais
- **Ctrl + M**: Menu de acessibilidade

### Leitor de Tela
- Labels ARIA completos
- Skip links
- Anúncios automáticos
- Descrições de imagens

### Configurações Visuais
- Contraste alto
- Tamanho de fonte ajustável
- Redução de movimento

## 🚀 Deploy

### Opções de Hospedagem
1. **Netlify**: Drag & drop dos arquivos
2. **Vercel**: Conecte com GitHub
3. **GitHub Pages**: Hospedagem gratuita
4. **Servidor próprio**: Upload via FTP

### Configurações de Domínio
- Configure um domínio personalizado
- Ative HTTPS (obrigatório para Google Calendar API)
- Configure redirecionamentos se necessário

## 🔒 Segurança

### Google Calendar API
- Use restrições de domínio na chave da API
- Configure CORS adequadamente
- Monitore o uso da API

### Dados dos Clientes
- Os dados são enviados apenas para o Google Calendar
- Não há armazenamento local de dados sensíveis
- Use HTTPS em produção

## 📞 Suporte

### Problemas Comuns
1. **API não funciona**: Verifique a chave e permissões
2. **Calendário não sincroniza**: Verifique os IDs dos calendários
3. **Site não carrega**: Verifique se todos os arquivos estão presentes

### Logs de Debug
Abra o console do navegador (F12) para ver logs detalhados:
- Status da API do Google Calendar
- Erros de agendamento
- Informações de acessibilidade

## 🎨 Personalização Avançada

### Adicionar Novos Serviços
Edite `config.js`:

```javascript
SERVICES: {
    novo_servico: {
        name: 'Novo Serviço',
        price: 60.00,
        duration: 90,
        description: 'Descrição do novo serviço'
    }
}
```

### Adicionar Novos Barbeiros
```javascript
BARBERS: {
    novo_barbeiro: {
        name: 'Nome do Barbeiro',
        email: 'email@barbearia.com',
        calendarId: 'calendario@barbearia.com',
        specialties: ['Especialidade 1', 'Especialidade 2'],
        workingHours: {
            // ... horários de trabalho
        }
    }
}
```

## 📈 Analytics e Monitoramento

### Google Analytics
Adicione o código do Google Analytics no `<head>` do `index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Monitoramento de Performance
- Use o Lighthouse para testar performance
- Monitore Core Web Vitals
- Teste em diferentes dispositivos

## 🤝 Contribuição

Para contribuir com melhorias:
1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Teste todas as funcionalidades
4. Envie um pull request

## 📄 Licença

Este projeto é de uso livre para a Barbearia Cruz.

---

**Desenvolvido com ❤️ para a Barbearia Cruz**
