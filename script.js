const defaultConfig = {
    store_name: "Ótica Elegante",
    tagline: "Estilo e qualidade para sua visão",
    hero_title: "Encontre o Óculos Perfeito",
    hero_subtitle: "Modelos exclusivos com design moderno e qualidade superior",
    section_title: "Nossa Coleção",
    whatsapp_number: "5511999999999",
    contact_button_text: "Comprar via WhatsApp",
    background_color: "#f8fafc",
    surface_color: "#ffffff",
    text_color: "#1e293b",
    primary_action_color: "#1a73e8",
    secondary_action_color: "#e3f2fd",
    font_family: "Inter",
    font_size: 16
  };
  
  const products = [
    {
      id: 1,
      name: "Classic Round",
      description: "Armação redonda clássica em acetato premium",
      price: "R$ 299,00",
      emoji: "🕶️"
    },
    {
      id: 2,
      name: "Modern Square",
      description: "Design quadrado moderno com lentes polarizadas",
      price: "R$ 349,00",
      emoji: "👓"
    },
    {
      id: 3,
      name: "Aviator Style",
      description: "Estilo aviador atemporal em metal dourado",
      price: "R$ 399,00",
      emoji: "🕶️"
    },
    {
      id: 4,
      name: "Cat Eye Chic",
      description: "Armação cat eye sofisticada e elegante",
      price: "R$ 329,00",
      emoji: "👓"
    },
    {
      id: 5,
      name: "Sport Active",
      description: "Óculos esportivo com proteção UV400",
      price: "R$ 279,00",
      emoji: "🕶️"
    },
    {
      id: 6,
      name: "Vintage Retro",
      description: "Estilo vintage com toque contemporâneo",
      price: "R$ 319,00",
      emoji: "👓"
    }
  ];
  
  function renderProducts(config) {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = '';
  
    products.forEach(product => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <div class="product-image">${product.emoji}</div>
        <div class="product-info">
          <h3 class="product-name">${product.name}</h3>
          <p class="product-description">${product.description}</p>
          <p class="product-price">${product.price}</p>
          <button class="contact-btn" onclick="contactWhatsApp('${product.name}')">
            <span class="whatsapp-icon">💬</span>
            <span>${config.contact_button_text || defaultConfig.contact_button_text}</span>
          </button>
        </div>
      `;
      grid.appendChild(card);
    });
  }
  
  function contactWhatsApp(productName) {
    const config = window.elementSdk ? window.elementSdk.config : defaultConfig;
    const whatsappNumber = config.whatsapp_number || defaultConfig.whatsapp_number;
    const message = encodeURIComponent(`Olá! Tenho interesse no modelo: ${productName}`);
    const url = `https://wa.me/${whatsappNumber}?text=${message}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }
  
  async function onConfigChange(config) {
    const customFont = config.font_family || defaultConfig.font_family;
    const baseFontStack = '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    const baseSize = config.font_size || defaultConfig.font_size;
  
    document.body.style.fontFamily = `${customFont}, ${baseFontStack}`;
    document.body.style.fontSize = `${baseSize}px`;
    document.body.style.background = config.background_color || defaultConfig.background_color;
    document.body.style.color = config.text_color || defaultConfig.text_color;
  
    const header = document.querySelector('.header');
    header.style.background = config.surface_color || defaultConfig.surface_color;
  
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
      card.style.background = config.surface_color || defaultConfig.surface_color;
    });
  
    const footer = document.querySelector('.footer');
    footer.style.background = config.surface_color || defaultConfig.surface_color;
  
    const contactBtns = document.querySelectorAll('.contact-btn');
    contactBtns.forEach(btn => {
      btn.style.background = config.primary_action_color || defaultConfig.primary_action_color;
    });
  
    const hero = document.querySelector('.hero');
    hero.style.background = `linear-gradient(135deg, ${config.secondary_action_color || defaultConfig.secondary_action_color} 0%, ${config.surface_color || defaultConfig.surface_color} 100%)`;
  
    document.getElementById('store-name').textContent = config.store_name || defaultConfig.store_name;
    document.getElementById('tagline').textContent = config.tagline || defaultConfig.tagline;
    document.getElementById('hero-title').textContent = config.hero_title || defaultConfig.hero_title;
    document.getElementById('hero-subtitle').textContent = config.hero_subtitle || defaultConfig.hero_subtitle;
    document.getElementById('section-title').textContent = config.section_title || defaultConfig.section_title;
  
    document.querySelector('.hero h2').style.fontSize = `${baseSize * 1.875}px`;
    document.querySelector('.hero p').style.fontSize = `${baseSize * 1.25}px`;
    document.querySelector('.section-title').style.fontSize = `${baseSize * 1.5625}px`;
    document.querySelector('.logo-text h1').style.fontSize = `${baseSize * 1.5}px`;
  
    renderProducts(config);
  }
  
  if (window.elementSdk) {
    window.elementSdk.init({
      defaultConfig,
      onConfigChange,
      mapToCapabilities: (config) => ({
        recolorables: [
          {
            get: () => config.background_color || defaultConfig.background_color,
            set: (value) => {
              config.background_color = value;
              window.elementSdk.setConfig({ background_color: value });
            }
          },
          {
            get: () => config.surface_color || defaultConfig.surface_color,
            set: (value) => {
              config.surface_color = value;
              window.elementSdk.setConfig({ surface_color: value });
            }
          },
          {
            get: () => config.text_color || defaultConfig.text_color,
            set: (value) => {
              config.text_color = value;
              window.elementSdk.setConfig({ text_color: value });
            }
          },
          {
            get: () => config.primary_action_color || defaultConfig.primary_action_color,
            set: (value) => {
              config.primary_action_color = value;
              window.elementSdk.setConfig({ primary_action_color: value });
            }
          },
          {
            get: () => config.secondary_action_color || defaultConfig.secondary_action_color,
            set: (value) => {
              config.secondary_action_color = value;
              window.elementSdk.setConfig({ secondary_action_color: value });
            }
          }
        ],
        borderables: [],
        fontEditable: {
          get: () => config.font_family || defaultConfig.font_family,
          set: (value) => {
            config.font_family = value;
            window.elementSdk.setConfig({ font_family: value });
          }
        },
        fontSizeable: {
          get: () => config.font_size || defaultConfig.font_size,
          set: (value) => {
            config.font_size = value;
            window.elementSdk.setConfig({ font_size: value });
          }
        }
      }),
      mapToEditPanelValues: (config) => new Map([
        ["store_name", config.store_name || defaultConfig.store_name],
        ["tagline", config.tagline || defaultConfig.tagline],
        ["hero_title", config.hero_title || defaultConfig.hero_title],
        ["hero_subtitle", config.hero_subtitle || defaultConfig.hero_subtitle],
        ["section_title", config.section_title || defaultConfig.section_title],
        ["whatsapp_number", config.whatsapp_number || defaultConfig.whatsapp_number],
        ["contact_button_text", config.contact_button_text || defaultConfig.contact_button_text]
      ])
    });
  } else {
    renderProducts(defaultConfig);
  }