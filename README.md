# NEXUS — Loja de Games e Tecnologia (Versão 4)

<div align="center">
  <p><em>Plataforma web avançada de e-commerce e suporte tecnológico desenvolvida para a disciplina de Programação Front-End (TDE 2 - UNIFAN).</em></p>
</div>

---

## 🚀 Sobre o Projeto
O **NEXUS** evoluiu para a sua **Versão 4 (`v4`)**. Além da identidade visual futurista em tema escuro com efeitos *neon*, esta versão introduz uma camada completa de interatividade e lógica em JavaScript puro (*Vanilla JS*), focando na experiência de compra dinâmica, gestão de estado, tratamento de dados do navegador e integração com APIs externas.

---

## 👥 Equipa de Desenvolvimento
* **Matheus Santiago de Paiva**
* **Marcos Vinicius Silva Sampaio**
* **Levi de Oliveira Cavalcante**

---

## ✨ Novidades e Funcionalidades da Versão 4 (TDE 2)
* **Carrinho de Compras Dinâmico (CRUD completo):** Gestão de itens em tempo real, ajuste de quantidades (`+` / `-`), remoção e cálculo automático de subtotais e totais.
* **Persistência de Dados (`LocalStorage`):** O estado do carrinho e dos descontos aplicados é salvo no navegador, garantindo que os produtos não se percam ao navegar entre páginas ou recarregar a aba.
* **Cálculo de Frete por CEP & Promoção Especial:** Sistema interativo que valida o CEP inserido e aplica automaticamente uma **promoção especial de R$ 300,00 de desconto** no frete ao atingir os critérios da loja.
* **Correção de Autofill (Preenchimento Automático do Chrome):** Tratamento inteligente para detetar e sincronizar dados inseridos automaticamente pelo navegador nos campos de endereço e formulários.
* **Integração Real com EmailJS:** 
  * Envio de e-mails automatizados de confirmação de pedidos detalhados para o cliente.
  * Encaminhamento direto das mensagens do formulário "Fale Conosco" para a caixa de entrada da loja (`nexus.storefsa@gmail.com`).

---

## 🛠 Tecnologias e Ferramentas Utilizadas
* **HTML5 Semântico:** Estrutura organizada para acessibilidade e SEO.
* **CSS3 Avançado:** Variáveis globais, folha de estilos personalizada, Flexbox e animações via `@keyframes` (efeito *neon* e LED rotativo).
* **Bootstrap 5.3:** Componentes responsivos, grelhas, modais e painéis *Offcanvas*.
* **JavaScript (ES6+):** Manipulação avançada do DOM, escuta de eventos, arrays (`.find()`, `.reduce()`, `.filter()`), condicionais e manipulação de objetos JSON.
* **EmailJS API:** Comunicação assíncrona para serviços de correio eletrónico no lado do cliente.
* **Git & GitHub / Vercel:** Controlo de versões, hospedagem em nuvem e *deploy* contínuo.

---

## 📜 Histórico de Versões (Changelog)
* **`v1`**: Estrutura base estática completa do site em HTML.
* **`v2`**: Implementação da camada de estilos CSS, identidade visual, efeitos de neon/LED e otimização responsiva.
* **`v3`**: Implementação de script personalizado em JavaScript para o comportamento de *Scrollspy* e destaque de sessões na barra de navegação.
* **`v4` (Atual):** Introdução da lógica completa de e-commerce, carrinho global com `LocalStorage`, cálculo dinâmico de frete, tratamento de *autofill* e integração com o EmailJS.