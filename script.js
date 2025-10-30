// JavaScript for Ótica Elegante (Baseado no RupertCases)

// ===== SISTEMA DE ANIMAÇÕES AVANÇADO =====
class AnimationManager {
    constructor() {
        this.observer = null;
        this.animatedElements = new Set();
        this.init();
    }

    init() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        this.setupIntersectionObserver();
        this.handleInitialLoad();
    }

    setupIntersectionObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                    this.animateElement(entry.target);
                    this.animatedElements.add(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });

        document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in').forEach(el => {
            this.observer.observe(el);
        });
    }

    animateElement(element) {
        const children = element.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in');
        children.forEach((child, index) => {
            setTimeout(() => {
                child.classList.add('visible');
            }, index * 100);
        });
        element.classList.add('visible');
    }

    handleInitialLoad() {
        setTimeout(() => {
            document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in').forEach(el => {
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    this.animateElement(el);
                    this.animatedElements.add(el);
                }
            });
        }, 100);
    }
}

// ===== NAVEGAÇÃO E SCROLL SUAVE =====
class NavigationManager {
    constructor() { this.init(); }
    init() {
        this.setupMobileMenu();
        this.setupSmoothScrolling();
        this.setupActiveNavigation();
    }

    setupMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
                const icon = mobileMenuBtn.querySelector('svg');
                if (mobileMenu.classList.contains('hidden')) {
                    icon.style.transform = 'rotate(0deg)';
                } else {
                    icon.style.transform = 'rotate(90deg)';
                }
            });

            mobileMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    mobileMenu.classList.add('hidden');
                    const icon = mobileMenuBtn.querySelector('svg');
                    icon.style.transform = 'rotate(0deg)';
                });
            });
        }
    }

    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const targetId = anchor.getAttribute('href');
                const target = document.querySelector(targetId);
                
                if (target) {
                    e.preventDefault();
                    anchor.style.opacity = '0.7';
                    setTimeout(() => { anchor.style.opacity = '1'; }, 200);
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

    setupActiveNavigation() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (window.pageYOffset >= (sectionTop - 200)) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }
}

// ===== GERENCIADOR DE FORMULÁRIOS =====
class FormManager {
    constructor() { this.init(); }
    init() {
        this.setupContactForm();
    }

    setupContactForm() {
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                
                submitBtn.textContent = 'Enviando...';
                submitBtn.style.opacity = '0.7';
                submitBtn.disabled = true;

                setTimeout(() => {
                    this.showSuccessMessage();
                    contactForm.reset();
                    submitBtn.textContent = originalText;
                    submitBtn.style.opacity = '1';
                    submitBtn.disabled = false;
                }, 2000);
            });
        }
    }

    showSuccessMessage() {
        const message = document.createElement('div');
        message.className = 'fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded shadow-lg z-50 transform translate-x-full transition-transform duration-300';
        message.textContent = 'Mensagem enviada com sucesso! Entraremos em contato em breve.';
        document.body.appendChild(message);
        
        setTimeout(() => { message.style.transform = 'translateX(0)'; }, 100);
        
        setTimeout(() => {
            message.style.transform = 'translateX(100%)';
            setTimeout(() => { document.body.removeChild(message); }, 300);
        }, 3000);
    }
}

// ===== ANIMAÇÕES ESPECIAIS =====
class SpecialAnimations {
    constructor() { this.init(); }
    init() { this.setupHeroAnimation(); }
    setupHeroAnimation() {
        const heroText = document.querySelector('#home .fade-in');
        if (heroText) { heroText.classList.add('hero-text'); }
    }
}

// ===== FUNÇÕES GLOBAIS =====
function scrollToSection(sectionId) {
    const el = document.getElementById(sectionId);
    if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
}

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', () => {
    if ('IntersectionObserver' in window) {
        new AnimationManager();
    } else {
        // Fallback
        function handleScrollAnimations() {
            document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in').forEach(element => {
                const elementTop = element.getBoundingClientRect().top;
                if (elementTop < window.innerHeight - 150) {
                    element.classList.add('visible');
                }
            });
        }
        window.addEventListener('scroll', handleScrollAnimations);
        window.addEventListener('load', handleScrollAnimations);
    }
    new NavigationManager();
    new FormManager();
    new SpecialAnimations();
});

// ===== SISTEMA DE MODAL DE PRODUTOS =====
class ProductModalManager {
    constructor() {
        this.modal = null;
        this.products = {};
        this.selectedColor = null;
        this.selectedPrice = null;
        this.init();
    }

    init() {
        this.modal = document.getElementById('productModal');
        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) this.closeModal();
            });
        }
    }

    setProducts(productsArray) {
        this.products = {};
        productsArray.forEach(p => { this.products[p.id] = p; });
    }

    openModal(productId) {
        const product = this.products[productId];
        if (!product || !this.modal) return;
        this.product = product;
        this.selectedColor = null;
        this.selectedPrice = null;

        document.getElementById('modalProductName').textContent = product.name;
        document.getElementById('modalProductDescription').textContent = product.description;
        document.getElementById('modalProductImage').src = product.image;
        document.getElementById('modalProductImage').alt = product.name;

        this.populatePrices(product.prices);
        this.populateColors(product.colors);
        this.populateSpecs(product.specs);

        const firstColorEl = document.querySelector('#modalProductColors .color-option');
        if (firstColorEl) this.selectColor(0, firstColorEl);
        
        const firstPriceEl = document.querySelector('#modalProductPrices .price-option');
        if (firstPriceEl) this.selectPrice(0, firstPriceEl);

        this.modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        setTimeout(() => {
            this.modal.querySelector('.bg-white').classList.add('modal-animate-in');
        }, 10);
    }

    closeModal() {
        if (!this.modal) return;
        this.modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
        this.modal.querySelector('.bg-white').classList.remove('modal-animate-in');
    }

    populatePrices(prices) {
        const container = document.getElementById('modalProductPrices');
        container.innerHTML = '';
        prices.forEach((price, index) => {
            const priceElement = document.createElement('div');
            priceElement.className = 'price-option';
            priceElement.onclick = () => this.selectPrice(index, priceElement);
            priceElement.innerHTML = `
                <div class="flex justify-between items-center">
                    <div>
                        <h4 class="font-semibold text-lg">${price.type}</h4>
                        <p class="text-gray-600 text-sm">${price.description}</p>
                    </div>
                    <span class="text-2xl font-bold text-black">${price.price}</span>
                </div>`;
            container.appendChild(priceElement);
        });
    }

    populateColors(colors) {
        const container = document.getElementById('modalProductColors');
        container.innerHTML = '';
        colors.forEach((color, index) => {
            const el = document.createElement('div');
            el.className = 'color-option';
            el.style.backgroundColor = color.color;
            el.title = color.name;
            el.onclick = () => this.selectColor(index, el);
            container.appendChild(el);
        });
    }

    populateSpecs(specs) {
        const container = document.getElementById('modalProductSpecs');
        container.innerHTML = '';
        specs.forEach(spec => {
            const specEl = document.createElement('div');
            specEl.className = 'spec-item';
            specEl.innerHTML = `
                <span class="font-medium">${spec.label}</span>
                <span class="text-gray-600">${spec.value}</span>`;
            container.appendChild(specEl);
        });
    }

    selectPrice(index, element) {
        document.querySelectorAll('.price-option').forEach(el => el.classList.remove('selected'));
        element.classList.add('selected');
        this.selectedPrice = index;
    }

    selectColor(index, element) {
        document.querySelectorAll('.color-option').forEach(el => el.classList.remove('selected'));
        element.classList.add('selected');
        this.selectedColor = index;
        this.updateModalImageForColor();
    }

    updateModalImageForColor() {
        const imgEl = document.getElementById('modalProductImage');
        if (!imgEl || !this.product) return;
        const i = this.selectedColor;
        if (i === null) return;
        const p = this.product;

        if (Array.isArray(p.colors) && p.colors[i] && p.colors[i].image) {
            imgEl.src = p.colors[i].image;
        } else if (Array.isArray(p.gallery) && p.gallery[i]) {
            imgEl.src = p.gallery[i];
        } else {
            imgEl.src = p.image;
        }
    }

    finalizePurchase() {
        if (!this.product) return;
        const produto = {
            nome: this.product.name,
            preco: this.selectedPrice !== null ? {
                tipo: this.product.prices[this.selectedPrice].type,
                valor: this.product.prices[this.selectedPrice].price
            } : null,
            cor: this.selectedColor !== null ? {
                nome: this.product.colors[this.selectedColor].name
            } : null
        };
        comprarPeloWhatsApp(produto);
        this.closeModal();
    }
}
const productModalManager = new ProductModalManager();
function openProductModal(id) { productModalManager.openModal(id); }
function closeProductModal() { productModalManager.closeModal(); }
function finalizePurchase() { productModalManager.finalizePurchase(); }

// ===== CARREGAR PRODUTOS DO JSON =====
let ALL_PRODUCTS = [];
let renderedCount = 0;
const PAGE_SIZE = 4; // Mostra 4 por vez

function renderNextProducts() {
    const grid = document.getElementById('productGrid');
    if (!grid || !ALL_PRODUCTS.length) return;

    const slice = ALL_PRODUCTS.slice(renderedCount, renderedCount + PAGE_SIZE);
    slice.forEach(p => {
        const card = document.createElement('div');
        card.className = "product-card bg-white rounded-none shadow-lg overflow-hidden cursor-pointer scale-in";
        card.onclick = () => openProductModal(p.id);

        card.innerHTML = `
            <div class="relative">
                <img src="${p.image}" alt="${p.name}" class="product-image">
                ${(p.gallery && p.gallery.length > 1) ? `
                <button class="card-arrow card-arrow-left" aria-label="Imagem anterior">‹</button>
                <button class="card-arrow card-arrow-right" aria-label="Próxima imagem">›</button>
                ` : ''}
                <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <div class="text-center text-white">
                        <p class="text-lg font-semibold tracking-wide">Ver Detalhes</p>
                    </div>
                </div>
                <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                    <h3 class="text-xl font-semibold text-white tracking-wide">${p.name}</h3>
                </div>
            </div>`;
        grid.appendChild(card);

        const gallery = (Array.isArray(p.gallery) && p.gallery.length > 0) ? p.gallery : [p.image];
        let idx = 0;
        const imgEl = card.querySelector('img.product-image');
        const btnPrev = card.querySelector('.card-arrow-left');
        const btnNext = card.querySelector('.card-arrow-right');

        if (gallery.length > 1 && btnPrev && btnNext) {
            btnPrev.addEventListener('click', (e) => {
                e.stopPropagation();
                idx = (idx - 1 + gallery.length) % gallery.length;
                imgEl.src = gallery[idx];
            });
            btnNext.addEventListener('click', (e) => {
                e.stopPropagation();
                idx = (idx + 1) % gallery.length;
                imgEl.src = gallery[idx];
            });
        }
        requestAnimationFrame(() => card.classList.add('visible'));
    });

    renderedCount += slice.length;
    const btn = document.getElementById('showMoreBtn');
    if (btn) btn.style.display = renderedCount >= ALL_PRODUCTS.length ? 'none' : 'inline-flex';
}

async function loadProducts() {
    try {
        // O script agora busca por 'products.json'
        const response = await fetch('products.json'); 
        const products = await response.json();
        
        ALL_PRODUCTS = Array.isArray(products) ? products : [];
        productModalManager.setProducts(ALL_PRODUCTS);

        const grid = document.getElementById('productGrid');
        if (grid) grid.innerHTML = '';
        renderedCount = 0;
        renderNextProducts(); // Renderiza os 4 primeiros

        const btn = document.getElementById('showMoreBtn');
        if (btn) {
            btn.onclick = () => renderNextProducts();
            btn.style.display = ALL_PRODUCTS.length > PAGE_SIZE ? 'inline-flex' : 'none';
        }
    } catch (err) {
        console.error("Erro ao carregar produtos:", err);
    }
}

loadProducts();


// ===== REDIRECIONAR PARA WHATSAPP =====
/**
 * Envia uma mensagem para o WhatsApp
 * @param {Object} produto - Objeto com as informações do produto.
 */
function comprarPeloWhatsApp(produto) {
  // NÚMERO ATUALIZADO PARA O DA ÓTICA ELEGANTE
  const numeroVendedor = "554187882832"; 

  let mensagem = `Olá! Tenho interesse no produto *${produto.nome}*`;

  if (produto.preco) {
    mensagem += `\n• ${produto.preco.tipo}: ${produto.preco.valor}`;
  }
  if (produto.cor) {
    mensagem += `\n• Cor: ${produto.cor.nome}`;
  }

  mensagem += `\nGostaria de saber mais detalhes.`;

  const linkWhatsApp = `https://api.whatsapp.com/send?phone=${numeroVendedor}&text=${encodeURIComponent(mensagem)}`;
  window.open(linkWhatsApp, "_blank");
}