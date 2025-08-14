// Dados das cotas de investimento
const cotasData = [
    { valor: 5000, rendimentoMin: 240, rendimentoMax: 340 },
    { valor: 10000, rendimentoMin: 480, rendimentoMax: 680 },
    { valor: 15000, rendimentoMin: 720, rendimentoMax: 1020 },
    { valor: 25000, rendimentoMin: 1200, rendimentoMax: 1700 },
    { valor: 35000, rendimentoMin: 1680, rendimentoMax: 2380 }
];

// Função para formatar valores em moeda brasileira
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
}

// Função para calcular rendimento baseado no valor investido
function calcularRendimento(valorInvestimento) {
    // Encontrar a cota mais próxima ou interpolar
    let rendimentoMin, rendimentoMax;
    
    // Se o valor for menor que a menor cota
    if (valorInvestimento <= cotasData[0].valor) {
        const ratio = valorInvestimento / cotasData[0].valor;
        rendimentoMin = cotasData[0].rendimentoMin * ratio;
        rendimentoMax = cotasData[0].rendimentoMax * ratio;
    }
    // Se o valor for maior que a maior cota
    else if (valorInvestimento >= cotasData[cotasData.length - 1].valor) {
        const ratio = valorInvestimento / cotasData[cotasData.length - 1].valor;
        rendimentoMin = cotasData[cotasData.length - 1].rendimentoMin * ratio;
        rendimentoMax = cotasData[cotasData.length - 1].rendimentoMax * ratio;
    }
    // Interpolar entre duas cotas
    else {
        for (let i = 0; i < cotasData.length - 1; i++) {
            if (valorInvestimento >= cotasData[i].valor && valorInvestimento <= cotasData[i + 1].valor) {
                const ratio = (valorInvestimento - cotasData[i].valor) / (cotasData[i + 1].valor - cotasData[i].valor);
                rendimentoMin = cotasData[i].rendimentoMin + (cotasData[i + 1].rendimentoMin - cotasData[i].rendimentoMin) * ratio;
                rendimentoMax = cotasData[i].rendimentoMax + (cotasData[i + 1].rendimentoMax - cotasData[i].rendimentoMax) * ratio;
                break;
            }
        }
    }
    
    return { min: Math.round(rendimentoMin), max: Math.round(rendimentoMax) };
}

// Função da calculadora de rendimentos
function calcularInvestimento() {
    const valorInput = document.getElementById('valor-investimento');
    const prazoInput = document.getElementById('prazo');
    const rendimentoMensalEl = document.getElementById('rendimento-mensal');
    const totalAcumuladoEl = document.getElementById('total-acumulado');
    const retornoTotalEl = document.getElementById('retorno-total');
    
    // Remover formatação e converter para número
    const valorInvestimento = parseFloat(valorInput.value.replace(/\./g, '').replace(',', '.'));
    const prazo = parseInt(prazoInput.value);
    
    // Validações
    if (!valorInvestimento || valorInvestimento < 1000) {
        alert('Por favor, insira um valor de investimento válido (mínimo R$ 1.000)');
        return;
    }
    
    if (!prazo || prazo < 1) {
        alert('Por favor, insira um prazo válido (mínimo 1 mês)');
        return;
    }
    
    // Calcular rendimentos
    const rendimento = calcularRendimento(valorInvestimento);
    const rendimentoMensalMin = rendimento.min;
    const rendimentoMensalMax = rendimento.max;
    
    // Calcular totais
    const totalRendimentosMin = rendimentoMensalMin * prazo;
    const totalRendimentosMax = rendimentoMensalMax * prazo;
    const totalAcumuladoMin = valorInvestimento + totalRendimentosMin;
    const totalAcumuladoMax = valorInvestimento + totalRendimentosMax;
    
    // Atualizar interface
    rendimentoMensalEl.textContent = `${formatCurrency(rendimentoMensalMin)} - ${formatCurrency(rendimentoMensalMax)}`;
    totalAcumuladoEl.textContent = `${formatCurrency(totalAcumuladoMin)} - ${formatCurrency(totalAcumuladoMax)}`;
    retornoTotalEl.textContent = `${formatCurrency(totalRendimentosMin)} - ${formatCurrency(totalRendimentosMax)}`;
    
    // Mostrar resultados com animação
    const resultsEl = document.getElementById('results');
    resultsEl.style.opacity = '0';
    resultsEl.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        resultsEl.style.transition = 'all 0.5s ease';
        resultsEl.style.opacity = '1';
        resultsEl.style.transform = 'translateY(0)';
    }, 100);
}

// Função para navegação suave
function smoothScroll(target) {
    const element = document.querySelector(target);
    if (element) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = element.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Função para toggle do menu mobile
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const hamburger = document.querySelector('.hamburger');
    
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
}

// Função para atualizar header no scroll
function updateHeaderOnScroll() {
    const header = document.querySelector('.header');
    const scrollY = window.scrollY;
    
    if (scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = 'none';
    }
}

// Função para animação de elementos ao entrar na viewport
function animateOnScroll() {
    const elements = document.querySelectorAll('.cota-card, .comparison-card, .vantagem-item');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

// Função para validação em tempo real dos inputs
function setupInputValidation() {
    const valorInput = document.getElementById('valor-investimento');
    const prazoInput = document.getElementById('prazo');
    
    valorInput.addEventListener('input', function() {
        let value = this.value.replace(/\D/g, '');
        if (value) {
            // Formatar com pontos para milhares
            value = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            this.value = value;
        }
        
        // Calcular automaticamente se ambos os campos estão preenchidos
        if (this.value && prazoInput.value) {
            calcularInvestimento();
        }
    });
    
    prazoInput.addEventListener('input', function() {
        // Calcular automaticamente se ambos os campos estão preenchidos
        if (this.value && valorInput.value) {
            calcularInvestimento();
        }
    });
}

// Função para configurar tooltips informativos
function setupTooltips() {
    const cotaCards = document.querySelectorAll('.cota-card');
    
    cotaCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Função para configurar os botões de CTA
function setupCTAButtons() {
    const solicitarSimulacao = document.getElementById('solicitar-simulacao');
    const falarConsultor = document.getElementById('falar-consultor');
    
    solicitarSimulacao.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Rolar para a calculadora
        smoothScroll('#calculadora');
        
        // Focar no campo de valor após um pequeno delay
        setTimeout(() => {
            document.getElementById('valor-investimento').focus();
        }, 1000);
    });
    
    falarConsultor.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Simular abertura do WhatsApp (você pode substituir pelo número real)
        const message = encodeURIComponent('Olá! Gostaria de saber mais sobre as cotas de investimento da ZYON.');
        const whatsappUrl = `https://wa.me/5511999999999?text=${message}`;
        window.open(whatsappUrl, '_blank');
    });
}

// Função para configurar preenchimento automático de exemplos
function setupExamples() {
    const examples = [
        { valor: 15000, prazo: 36 },
        { valor: 25000, prazo: 24 },
        { valor: 10000, prazo: 48 }
    ];
    
    let currentExample = 0;
    
    // Criar botões de exemplo
    const calculatorForm = document.querySelector('.calculator-form');
    const exampleButtons = document.createElement('div');
    exampleButtons.className = 'example-buttons';
    exampleButtons.innerHTML = `
        <p style="margin-bottom: 1rem; color: var(--text-secondary); font-size: 0.875rem;">
            Exemplos rápidos:
        </p>
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            <button type="button" class="btn-example" data-valor="15000" data-prazo="36">R$ 15k - 36m</button>
            <button type="button" class="btn-example" data-valor="25000" data-prazo="24">R$ 25k - 24m</button>
            <button type="button" class="btn-example" data-valor="10000" data-prazo="48">R$ 10k - 48m</button>
        </div>
    `;
    
    // Adicionar CSS para os botões de exemplo
    const style = document.createElement('style');
    style.textContent = `
        .btn-example {
            padding: 0.5rem 1rem;
            border: 1px solid var(--border-color);
            background: white;
            border-radius: 0.375rem;
            font-size: 0.875rem;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .btn-example:hover {
            background: var(--primary-color);
            color: white;
            border-color: var(--primary-color);
        }
    `;
    document.head.appendChild(style);
    
    calculatorForm.appendChild(exampleButtons);
    
    // Configurar eventos dos botões de exemplo
    document.querySelectorAll('.btn-example').forEach(btn => {
        btn.addEventListener('click', function() {
            const valor = this.dataset.valor;
            const prazo = this.dataset.prazo;
            
            document.getElementById('valor-investimento').value = parseInt(valor).toLocaleString('pt-BR');
            document.getElementById('prazo').value = prazo;
            
            calcularInvestimento();
        });
    });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Configurar calculadora
    const calcularBtn = document.getElementById('calcular');
    if (calcularBtn) {
        calcularBtn.addEventListener('click', calcularInvestimento);
    }
    
    // Configurar navegação suave
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href');
            smoothScroll(target);
        });
    });
    
    // Configurar menu mobile
    const hamburger = document.querySelector('.hamburger');
    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }
    
    // Configurar scroll events
    window.addEventListener('scroll', function() {
        updateHeaderOnScroll();
        animateOnScroll();
    });
    
    // Configurar validação de inputs
    setupInputValidation();
    
    // Configurar tooltips
    setupTooltips();
    
    // Configurar botões CTA
    setupCTAButtons();
    
    // Configurar exemplos
    setupExamples();
    
    // Calcular exemplo inicial
    document.getElementById('valor-investimento').value = '15.000';
    document.getElementById('prazo').value = '36';
    calcularInvestimento();
    
    // Animação inicial
    setTimeout(() => {
        animateOnScroll();
    }, 500);
});

// Configurar responsividade do menu
window.addEventListener('resize', function() {
    const navMenu = document.querySelector('.nav-menu');
    const hamburger = document.querySelector('.hamburger');
    
    if (window.innerWidth > 768) {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    }
});

// Adicionar CSS para menu mobile responsivo
const mobileMenuStyle = document.createElement('style');
mobileMenuStyle.textContent = `
    @media (max-width: 768px) {
        .nav-menu {
            position: fixed;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            flex-direction: column;
            padding: 2rem;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            transform: translateY(-100%);
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }
        
        .nav-menu.active {
            transform: translateY(0);
            opacity: 1;
            visibility: visible;
        }
        
        .hamburger.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .hamburger.active span:nth-child(2) {
            opacity: 0;
        }
        
        .hamburger.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
    }
`;
document.head.appendChild(mobileMenuStyle);

