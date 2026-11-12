// Carrinho Global Unificado com localStorage e EmailJS para NEXUS

let carrinho = JSON.parse(localStorage.getItem('nexus_carrinho')) || [];
let descontoPercentual = parseFloat(localStorage.getItem('nexus_desconto')) || 0;

function salvarEstado() {
    localStorage.setItem('nexus_carrinho', JSON.stringify(carrinho));
    localStorage.setItem('nexus_desconto', descontoPercentual);
}

function adicionarItem(nome, preco) {
    const itemExistente = carrinho.find(item => item.name === nome);
    
    if (itemExistente) {
        itemExistente.quantidade += 1;
    } else {
        carrinho.push({ name: nome, price: preco, quantidade: 1 });
    }
    
    salvarEstado();
    atualizarCarrinho();
    
    const offcanvasEl = document.getElementById('offcanvasOrcamento');
    if (offcanvasEl) {
        const bsOffcanvas = bootstrap.Offcanvas.getOrCreateInstance(offcanvasEl);
        bsOffcanvas.show();
    }
}

function alterarQtd(nome, delta) {
    const item = carrinho.find(i => i.name === nome);
    if (item) {
        item.quantidade += delta;
        if (item.quantidade <= 0) {
            carrinho = carrinho.filter(i => i.name !== nome);
        }
    }
    salvarEstado();
    atualizarCarrinho();
}

function removerItem(nome) {
    carrinho = carrinho.filter(i => i.name !== nome);
    salvarEstado();
    atualizarCarrinho();
}

function limparCarrinho() {
    carrinho = [];
    descontoPercentual = 0;
    salvarEstado();
    atualizarCarrinho();
    const spanFrete = document.getElementById('valor-frete');
    const spanDescFrete = document.getElementById('desconto-frete');
    if (spanFrete) spanFrete.innerText = 'R$ 0,00';
    if (spanDescFrete) spanDescFrete.innerText = '- R$ 300,00';
}

function calcularFretePorCEP(cep) {
    cep = cep.replace(/\D/g, '');
    if (cep.length !== 8) {
        return null;
    }
    
    // Base de cálculo de frete por região
    let freteBruto = 45.00;
    if (cep.startsWith('44') || cep.startsWith('40') || cep.startsWith('41') || cep.startsWith('42') || cep.startsWith('43')) {
        freteBruto = 35.00; // Bahia local
    } else if (cep.startsWith('0') || cep.startsWith('1') || cep.startsWith('2') || cep.startsWith('3')) {
        freteBruto = 120.00; // Sudeste
    } else if (cep.startsWith('8') || cep.startsWith('9')) {
        freteBruto = 160.00; // Sul
    } else if (cep.startsWith('7')) {
        freteBruto = 140.00; // Centro-Oeste
    } else {
        freteBruto = 180.00; // Norte / Nordeste geral
    }
    
    // Desconto promocional de R$ 300,00 no frete conforme anúncio da página inicial
    let descontoFrete = 300.00;
    let freteFinal = freteBruto - descontoFrete;
    if (freteFinal < 0) freteFinal = 0; // Frete grátis garantido pela promoção
    
    return {
        bruto: freteBruto,
        desconto: descontoFrete > freteBruto ? freteBruto : descontoFrete,
        final: freteFinal
    };
}

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar o EmailJS
    if (typeof emailjs !== 'undefined') {
        emailjs.init("PygCcggUwI5rzURV2");
    }

    // Suporte ao preenchimento automático (Autofill) do Chrome
    const inputCep = document.getElementById('envio-cep');
    if (inputCep) {
        ['input', 'change', 'blur', 'keyup'].forEach(eventType => {
            inputCep.addEventListener(eventType, () => {
                let cepVal = inputCep.value.trim();
                if (cepVal.length >= 8) {
                    atualizarCarrinho();
                }
            });
        });
    }

    const inputsAutofill = document.querySelectorAll('input, textarea');
    inputsAutofill.forEach(input => {
        ['input', 'change', 'blur', 'animationstart'].forEach(eventType => {
            input.addEventListener(eventType, () => {
                if (input.value && !input.getAttribute('value')) {
                    input.setAttribute('value', input.value);
                }
            });
        });
    });

    const btnDesconto = document.getElementById('btn-desconto');
    if (btnDesconto) {
        btnDesconto.addEventListener('click', () => {
            const inputCupom = document.getElementById('input-cupom');
            if (inputCupom) {
                const cupom = inputCupom.value.trim().toUpperCase();
                if (cupom === 'NEXUS10') {
                    descontoPercentual = 0.10;
                    alert('Cupom NEXUS10 aplicado com sucesso! 10% de desconto.');
                } else if (cupom === 'NEXUS20') {
                    descontoPercentual = 0.20;
                    alert('Cupom NEXUS20 aplicado com sucesso! 20% de desconto.');
                } else {
                    descontoPercentual = 0;
                    alert('Cupom inválido ou expirado.');
                }
                salvarEstado();
                atualizarCarrinho();
            }
        });
    }
    
    atualizarCarrinho();
});

function atualizarCarrinho() {
    const listaCarrinho = document.getElementById('lista-carrinho');
    const totalCarrinho = document.getElementById('total-carrinho');
    const badgeGlobal = document.getElementById('badge-qtd-global');
    const spanFrete = document.getElementById('valor-frete');
    const spanDescFrete = document.getElementById('desconto-frete');
    
    let qtdTotalItens = carrinho.reduce((acc, item) => acc + item.quantidade, 0);
    if (badgeGlobal) {
        badgeGlobal.innerText = qtdTotalItens;
        badgeGlobal.style.display = qtdTotalItens > 0 ? 'inline-block' : 'none';
    }
    
    if (!listaCarrinho || !totalCarrinho) return;
    
    listaCarrinho.innerHTML = '';
    
    if (carrinho.length === 0) {
        listaCarrinho.innerHTML = '<li class="list-group-item bg-transparent text-secondary text-center small py-3">O seu carrinho está vazio.</li>';
        totalCarrinho.innerText = 'R$ 0,00';
        totalCarrinho.setAttribute('data-total', '0');
        if (spanFrete) spanFrete.innerText = 'R$ 0,00';
        if (spanDescFrete) spanDescFrete.innerText = '- R$ 300,00';
        return;
    }
    
    let subtotal = 0;
    
    carrinho.forEach(item => {
        const totalItem = item.price * item.quantidade;
        subtotal += totalItem;
        
        const li = document.createElement('li');
        li.className = 'list-group-item bg-transparent text-light d-flex justify-content-between align-items-center px-0 border-secondary';
        li.innerHTML = `
            <div class="me-2" style="font-size: 0.85rem;">
                <strong>${item.name}</strong><br>
                <span class="text-secondary">R$ ${item.price.toLocaleString('pt-BR', {minimumFractionDigits: 2})} x ${item.quantidade}</span>
            </div>
            <div class="d-flex align-items-center gap-1">
                <button class="btn btn-sm btn-outline-secondary py-0 px-1" onclick="alterarQtd('${item.name}', -1)">-</button>
                <span class="small mx-1">${item.quantidade}</span>
                <button class="btn btn-sm btn-outline-secondary py-0 px-1" onclick="alterarQtd('${item.name}', 1)">+</button>
                <button class="btn btn-sm text-danger ms-1 py-0 px-1" onclick="removerItem('${item.name}')" title="Remover">&times;</button>
            </div>
        `;
        listaCarrinho.appendChild(li);
    });
    
    let totalProdutos = subtotal * (1 - descontoPercentual);
    
    let cepInput = document.getElementById('envio-cep');
    let valorFreteFinal = 0;
    
    if (cepInput && cepInput.value.trim().length >= 8) {
        let resultadoFrete = calcularFretePorCEP(cepInput.value.trim());
        if (resultadoFrete) {
            valorFreteFinal = resultadoFrete.final;
            if (spanFrete) spanFrete.innerText = `R$ ${resultadoFrete.bruto.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
            if (spanDescFrete) spanDescFrete.innerText = `- R$ ${resultadoFrete.desconto.toLocaleString('pt-BR', {minimumFractionDigits: 2})} (Promoção R$ 300)`;
        } else {
            if (spanFrete) spanFrete.innerText = 'R$ 0,00 (Digite o CEP)';
            if (spanDescFrete) spanDescFrete.innerText = '- R$ 300,00';
        }
    } else {
        if (spanFrete) spanFrete.innerText = 'R$ 0,00';
        if (spanDescFrete) spanDescFrete.innerText = '- R$ 300,00 (Aplicado)';
    }
    
    let totalGeral = totalProdutos + valorFreteFinal;
    totalCarrinho.innerText = `R$ ${totalGeral.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
    totalCarrinho.setAttribute('data-total', totalGeral);
}

function finalizarPedidoComEnvio() {
    if (carrinho.length === 0) {
        alert('O seu carrinho está vazio! Adicione produtos antes de finalizar.');
        return;
    }
    
    const emailInput = document.getElementById('envio-email');
    const cepInput = document.getElementById('envio-cep');
    const ruaInput = document.getElementById('envio-rua');
    const numInput = document.getElementById('envio-numero');
    const bairroInput = document.getElementById('envio-bairro');
    
    if (!emailInput || !cepInput || !ruaInput || !numInput || !bairroInput) return;
    
    const emailCliente = emailInput.value.trim() || emailInput.getAttribute('value') || '';
    const cep = cepInput.value.trim() || cepInput.getAttribute('value') || '';
    const rua = ruaInput.value.trim() || ruaInput.getAttribute('value') || '';
    const numero = numInput.value.trim() || numInput.getAttribute('value') || '';
    const bairro = bairroInput.value.trim() || bairroInput.getAttribute('value') || '';
    const total = document.getElementById('total-carrinho').innerText;
    
    if (!emailCliente || !cep || !rua || !numero || !bairro) {
        alert('Por favor, preencha todos os campos, incluindo o E-mail e o Endereço de Envio!');
        return;
    }

    let resultadoFrete = calcularFretePorCEP(cep);
    let valorFreteStr = resultadoFrete ? `R$ ${resultadoFrete.final.toLocaleString('pt-BR', {minimumFractionDigits: 2})} (Frete com R$ 300,00 de Desconto Promocional)` : 'Grátis';

    let resumoProdutos = carrinho.map(i => `- ${i.name} (Qtd: ${i.quantidade}) - R$ ${(i.price * i.quantidade).toLocaleString('pt-BR', {minimumFractionDigits: 2})}`).join('\n');

    const templateParams = {
        to_email: emailCliente,
        message: `Olá! O seu pedido na NEXUS foi confirmado com sucesso.\n\nResumo da Compra:\n${resumoProdutos}\n\nFrete: ${valorFreteStr}\nValor Total (com Frete): ${total}\nEndereço de Entrega:\n${rua}, nº ${numero} - Bairro: ${bairro} (CEP: ${cep})\n\nAgradecemos a sua preferência!`
    };

    if (typeof emailjs !== 'undefined') {
        emailjs.send('service_nexusstore', 'template_ndw925j', templateParams)
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
            }, function(error) {
                console.log('FAILED...', error);
            });
    }

    alert(`🎉 Pedido finalizado com sucesso!\n\nUm e-mail de confirmação foi enviado para: ${emailCliente}\nTotal Geral: ${total}\nEndereço de Entrega:\n${rua}, nº ${numero} - ${bairro} (CEP: ${cep})`);
    
    limparCarrinho();
    
    emailInput.value = '';
    cepInput.value = '';
    ruaInput.value = '';
    numInput.value = '';
    bairroInput.value = '';
    
    const spanFrete = document.getElementById('valor-frete');
    const spanDescFrete = document.getElementById('desconto-frete');
    if (spanFrete) spanFrete.innerText = 'R$ 0,00';
    if (spanDescFrete) spanDescFrete.innerText = '- R$ 300,00';
    
    const offcanvasEl = document.getElementById('offcanvasOrcamento');
    if (offcanvasEl) {
        const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
        if (bsOffcanvas) bsOffcanvas.hide();
    }
}

function enviarContato(event) {
    event.preventDefault();
    
    const nomeInput = document.getElementById('nome');
    const emailInput = document.getElementById('email');
    const mensagemInput = document.getElementById('mensagem');
    
    if (!nomeInput || !emailInput || !mensagemInput) return;
    
    const nome = nomeInput.value.trim() || nomeInput.getAttribute('value') || '';
    const email = emailInput.value.trim() || emailInput.getAttribute('value') || '';
    const mensagem = mensagemInput.value.trim() || mensagemInput.getAttribute('value') || '';
    
    if (!nome || !email || !mensagem) {
        alert('Por favor, preencha todos os campos do formulário de contato.');
        return;
    }

    const templateParamsContato = {
        to_email: 'nexus.storefsa@gmail.com',
        message: `Nova mensagem de Contato / Fale Conosco:\n\nNome: ${nome}\nE-mail do Cliente: ${email}\nMensagem:\n${mensagem}`
    };

    if (typeof emailjs !== 'undefined') {
        emailjs.send('service_nexusstore', 'template_ndw925j', templateParamsContato)
            .then(function(response) {
                alert('Mensagem enviada com sucesso para a NEXUS! Entraremos em contato em breve.');
                nomeInput.value = '';
                emailInput.value = '';
                mensagemInput.value = '';
            }, function(error) {
                alert('Erro ao enviar mensagem. Tente novamente mais tarde.');
                console.log('FAILED...', error);
            });
    }
}
