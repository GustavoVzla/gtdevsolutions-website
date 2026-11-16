export const SITE = {
  name: "GT Dev Solutions",
  tagline: "Desde España, automatizamos procesos, desarrollamos aplicaciones web y apps, y creamos chatbots inteligentes para empresas de todo el mundo.",
  description: "Soluciones tecnológicas avanzadas: automatización con n8n e IA, desarrollo web y apps, chatbots inteligentes y blockchain.",
  email: "soluciones@gtdevsolutions.com",
  phone: "+34 600 000 000",
  whatsapp: "https://wa.me/34600000000",
  address: "Madrid, España",
  hours: "Lunes a Viernes",
  github: "https://github.com/GustavoVzla",
  linkedin: "https://www.linkedin.com/in/gustavotejera",
  mapEmbedUrl: "https://www.google.com/maps?q=Madrid,+Espa%C3%B1a&output=embed",
};

export const NAV_LINKS = [
  { label: "Inicio", href: "/#inicio" },
  { label: "Servicios", href: "/#servicios" },
  { label: "Proyectos", href: "/#proyectos" },
  { label: "Sobre Mí", href: "/#sobre-mi" },
  { label: "Contacto", href: "/#contacto" },
  { label: "Catálogo", href: "/catalogo" },
];

export const SERVICES = [
  {
    title: "Automatización con n8n + IA",
    description: "Conectamos tus aplicaciones y automatizamos flujos de trabajo con n8n e inteligencia artificial. Desde respuestas automáticas hasta agentes virtuales que trabajan por ti 24/7.",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&h=400",
  },
  {
    title: "Desarrollo Web & Apps",
    description: "Creamos interfaces modernas, rápidas y responsivas con React y Next.js. Desde landing pages hasta aplicaciones web complejas con backend robusto.",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=600&h=400",
  },
  {
    title: "Chatbots & Asistentes IA",
    description: "Implementamos chatbots inteligentes para web, WhatsApp y otras plataformas. Atención al cliente 24/7, clasificación de leads y respuestas personalizadas con IA.",
    image: "https://images.unsplash.com/photo-1589254065909-b7086229d08c?auto=format&fit=crop&w=600&h=400",
  },
  {
    title: "Software a Medida",
    description: "Desarrollamos CRMs, dashboards, sistemas de gestión y herramientas internas adaptadas a las necesidades específicas de tu negocio.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&h=400",
  },
  {
    title: "Web3 & Blockchain",
    description: "Contratos inteligentes, tokens empresariales, integración de billeteras y soluciones descentralizadas para quienes buscan transparencia y seguridad blockchain.",
    image: "https://images.unsplash.com/photo-1672911640830-ecc95c70166c?auto=format&fit=crop&w=600&h=400",
  },
  {
    title: "Consultoría Tecnológica",
    description: "Te asesoramos en la elección de herramientas, arquitectura de sistemas y estrategia digital. Decisiones técnicas fundamentadas para tu negocio.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&h=400",
  },
];

export const PROJECTS = [
  {
    title: "Catálogo Interactivo GT Dev",
    description: "Catálogo de 24 prototipos interactivos organizados en 6 categorías: webs, apps, software, automatizaciones, chatbots y retainers. Cada prototipo es una demo funcional del producto final.",
    image: "https://images.unsplash.com/photo-1578450671530-5b6a7c9f32a8?auto=format&fit=crop&w=600&h=400",
    link: "/catalogo",
  },
  {
    title: "CRM Automation Suite",
    description: "Sistema de automatización CRM con n8n que optimiza la gestión de clientes, integra datos de múltiples fuentes y automatiza notificaciones, liberando tiempo valioso para tu equipo.",
    image: "https://images.unsplash.com/photo-1750969185331-e03829f72c7d?auto=format&fit=crop&w=600&h=400",
    link: "https://github.com/GustavoVzla",
  },
  {
    title: "App Gimnasio - Prototipo",
    description: "Prototipo interactivo de app para gimnasios con 12 pantallas: control de acceso QR, reserva de clases, seguimiento de progreso, nutrición y programa de rewards.",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&h=400",
    link: "/catalogo",
  },
];

export const SOCIAL_LINKS = [
  { name: "Facebook", url: "https://www.facebook.com/profile.php?id=61577622042084", icon: "facebook" },
  { name: "Instagram", url: "https://www.instagram.com/gtdevsolutions", icon: "instagram" },
  { name: "TikTok", url: "https://www.tiktok.com/@gtdevsolutions", icon: "tiktok" },
  { name: "X", url: "https://x.com/gtdevsolutions", icon: "twitter" },
  { name: "LinkedIn", url: "https://www.linkedin.com/in/gustavotejera", icon: "linkedin" },
  { name: "GitHub", url: "https://github.com/GustavoVzla", icon: "github" },
  { name: "YouTube", url: "https://www.youtube.com/@tejeragustavo", icon: "youtube" },
];

export const CATALOG_CATEGORIES = [
  {
    name: "Web Development",
    icon: "Globe",
    color: "emerald",
    count: 5,
    products: [
      { number: "01", title: "Landing Page", desc: "Página única diseñada para convertir visitantes en clientes. Ideal para promocionar un servicio, evento o producto específico con un mensaje claro y llamada a la acción directa.", demo: "Restaurante con reservas online", tier: "Starter", href: "/prototipos/01_web/01_landing_page_simple.html", thumb: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=200&fit=crop&q=80" },
      { number: "02", title: "Web Corporativa", desc: "Sitio web profesional de varias secciones para presentar tu empresa, servicios, equipo y contacto. Perfecto para negocios que necesitan presencia online seria y confiable.", demo: "Consultora con 5 secciones", tier: "Starter", href: "/prototipos/01_web/02_website_corporativo.html", thumb: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=200&fit=crop&q=80" },
      { number: "03", title: "Plataforma Web (SaaS)", desc: "Aplicación web completa con login de usuarios, panel de control y funcionalidades avanzadas. Para empresas que ofrecen un servicio digital o necesitan un portal interno.", demo: "Dashboard con login y modo oscuro", tier: "Pro", href: "/prototipos/01_web/03_website_react_nextjs.html", thumb: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop&q=80" },
      { number: "04", title: "Tienda Online Básica", desc: "E-commerce con catálogo de productos, filtros de búsqueda y carrito de compras. Ideal para negocios que quieren empezar a vender online sin complicaciones.", demo: "Tienda de moda con 8 productos", tier: "Pro", href: "/prototipos/01_web/04_ecommerce_basico.html", thumb: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=200&fit=crop&q=80" },
      { number: "05", title: "Tienda Online Completa", desc: "E-commerce avanzado con lista de deseos, panel de administración, programa de fidelidad y gestión completa de pedidos. Para negocios con alto volumen de ventas.", demo: "Electrónica con 10 productos y admin", tier: "Premium", href: "/prototipos/01_web/05_ecommerce_completo.html", thumb: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=200&fit=crop&q=80" },
    ],
  },
  {
    name: "Mobile Apps",
    icon: "Smartphone",
    color: "blue",
    count: 4,
    products: [
      { number: "06", title: "App Sencilla", desc: "Aplicación móvil con las funciones esenciales de tu negocio: información, citas, contacto. Perfecta para clínicas, consultorios o negocios de servicios.", demo: "Clínica dental con citas online", tier: "Pro", href: "/prototipos/02_apps/06_app_movil_simple.html", thumb: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=400&h=200&fit=crop&q=80" },
      { number: "07", title: "App Intermedia", desc: "App con múltiples pantallas: carta/menú, reservas, programa de puntos y notificaciones. Ideal para restaurantes, cafeterías o negocios de hostelería.", demo: "Restaurante con carta y fidelización", tier: "Pro", href: "/prototipos/02_apps/07_app_movil_media.html", thumb: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=200&fit=crop&q=80" },
      { number: "08", title: "App Compleja", desc: "Aplicación completa con reservas, calendario, comunidad de usuarios y múltiples servicios integrados. Para coworkings, gimnasios o centros con servicios variados.", demo: "Coworking con reservas y comunidad", tier: "Premium", href: "/prototipos/02_apps/08_app_movil_compleja.html", thumb: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=400&h=200&fit=crop&q=80" },
      { number: "09", title: "App iOS + Android", desc: "Aplicación nativa para ambos sistemas operativos con la misma experiencia. Maximiza tu alcance llegando a todos los usuarios móviles sin importar su dispositivo.", demo: "App fitness sincronizada en ambas plataformas", tier: "Premium", href: "/prototipos/02_apps/09_app_ios_android.html", thumb: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=200&fit=crop&q=80" },
    ],
  },
  {
    name: "Custom Software",
    icon: "Monitor",
    color: "violet",
    count: 4,
    products: [
      { number: "10", title: "CRM", desc: "Sistema para gestionar tus clientes, oportunidades de venta y seguimiento comercial. Visualiza tu embudo de ventas y no pierdas ningún contacto importante.", demo: "Pipeline de ventas con tablero Kanban", tier: "Pro", href: "/prototipos/03_software/10_crm_simple.html", thumb: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=200&fit=crop&q=80" },
      { number: "11", title: "Panel de Analíticas", desc: "Dashboard con gráficos y métricas en tiempo real para tomar decisiones basadas en datos. Visualiza ingresos, usuarios, conversiones y tendencias de tu negocio.", demo: "Métricas con gráficos interactivos", tier: "Pro", href: "/prototipos/03_software/11_dashboard_analytics.html", thumb: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop&q=80" },
      { number: "12", title: "Sistema de Gestión", desc: "Software para controlar inventario, proveedores, pedidos y operaciones diarias. Ideal para almacenes, tiendas o negocios con logística compleja.", demo: "Almacén con alertas de stock", tier: "Premium", href: "/prototipos/03_software/12_sistema_gestion.html", thumb: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&h=200&fit=crop&q=80" },
      { number: "13", title: "Software a Medida", desc: "Solución 100% personalizada para necesidades únicas de tu negocio. Cuando ningún software existente se adapta, lo construimos desde cero para ti.", demo: "Gestión inmobiliaria con tickets", tier: "Enterprise", href: "/prototipos/03_software/13_software_a_medida.html", thumb: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=200&fit=crop&q=80" },
    ],
  },
  {
    name: "n8n Automations",
    icon: "Zap",
    color: "amber",
    count: 4,
    products: [
      { number: "14", title: "Automatización Simple", desc: "Conecta dos o tres herramientas para eliminar tareas manuales repetitivas. Por ejemplo: recibir un email y crear automáticamente una tarea o notificación.", demo: "Email → procesamiento → respuesta", tier: "Starter", href: "/prototipos/04_automatizaciones/14_workflow_simple.html", thumb: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=400&h=200&fit=crop&q=80" },
      { number: "15", title: "Automatización Media", desc: "Flujos con lógica condicional que toman decisiones automáticas según reglas. Sincroniza datos entre CRM, email, inventario y otras herramientas.", demo: "E-commerce con 8 nodos y condiciones", tier: "Pro", href: "/prototipos/04_automatizaciones/15_workflow_medio.html", thumb: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=200&fit=crop&q=80" },
      { number: "16", title: "Agente IA / Chatbot", desc: "Asistente inteligente que entiende lo que escriben tus clientes y responde automáticamente. Atiende consultas, clasifica leads y deriva casos complejos.", demo: "Chat con detección de intención", tier: "Premium", href: "/prototipos/04_automatizaciones/16_ai_agent_chatbot.html", thumb: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=200&fit=crop&q=80" },
      { number: "17", title: "Paquete Multi-Workflow", desc: "Ecosistema completo de automatizaciones trabajando juntas: ventas, soporte, marketing y operaciones. Transforma todos los procesos de tu empresa de una vez.", demo: "5 flujos integrados con ROI 12.4x", tier: "Enterprise", href: "/prototipos/04_automatizaciones/17_multi_wf_package.html", thumb: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=200&fit=crop&q=80" },
    ],
  },
  {
    name: "AI & Chatbots",
    icon: "Bot",
    color: "rose",
    count: 3,
    products: [
      { number: "18", title: "Chatbot Web", desc: "Asistente virtual que aparece en tu web para resolver dudas de visitantes 24/7. Responde preguntas frecuentes, captura datos de contacto y genera leads automáticamente.", demo: "Widget flotante para aseguradora", tier: "Pro", href: "/prototipos/05_ia_chatbots/18_chatbot_web_basico.html", thumb: "https://images.unsplash.com/photo-1596524430615-b46475ddff6e?w=400&h=200&fit=crop&q=80" },
      { number: "19", title: "Chatbot WhatsApp", desc: "Bot inteligente que atiende a tus clientes directamente en WhatsApp. Gestiona citas, envía recordatorios y responde consultas sin intervención humana.", demo: "Salón de belleza con agenda automática", tier: "Premium", href: "/prototipos/05_ia_chatbots/19_chatbot_whatsapp.html", thumb: "https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=400&h=200&fit=crop&q=80" },
      { number: "20", title: "Asistente IA Avanzado", desc: "Inteligencia artificial especializada en tu sector que analiza documentos, busca información y genera respuestas expertas. Como tener un consultor disponible 24/7.", demo: "Asistente legal con búsqueda de jurisprudencia", tier: "Enterprise", href: "/prototipos/05_ia_chatbots/20_ai_advanced_assistant.html", thumb: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&h=200&fit=crop&q=80" },
    ],
  },
  {
    name: "Retainers & Support",
    icon: "Wrench",
    color: "teal",
    count: 4,
    products: [
      { number: "21", title: "Mantenimiento Básico", desc: "Monitoreo continuo de tu web o app: que esté online, segura y actualizada. Incluye copias de seguridad, certificado SSL y reporte mensual de estado.", demo: "Panel de estado con uptime y backups", tier: "Starter", href: "/prototipos/06_retainers/21_mantenimiento_basico.html", thumb: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=200&fit=crop&q=80" },
      { number: "22", title: "Mantenimiento + Mejoras", desc: "Además de mantener tu sistema funcionando, incluye actualizaciones de contenido, nuevas funcionalidades menores y optimización continua.", demo: "Dashboard con contenido y analíticas", tier: "Pro", href: "/prototipos/06_retainers/22_mantenimiento_updates.html", thumb: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=400&h=200&fit=crop&q=80" },
      { number: "23", title: "Soporte Prioritario", desc: "Atención técnica con tiempo de respuesta garantizado y equipo dedicado. Para negocios donde cada minuto de caída representa pérdida de ingresos.", demo: "SLA con matriz de escalamiento", tier: "Premium", href: "/prototipos/06_retainers/23_soporte_priority.html", thumb: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&h=200&fit=crop&q=80" },
      { number: "24", title: "Retainer de Desarrollo", desc: "Horas mensuales de desarrollo reservadas para tu proyecto. Nuevas funcionalidades, mejoras y evolución continua de tu producto con un equipo que ya conoce tu código.", demo: "Sprint board con tracker de horas", tier: "Enterprise", href: "/prototipos/06_retainers/24_retainer_desarrollo.html", thumb: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=200&fit=crop&q=80" },
    ],
  },
];

export const ABOUT = {
  name: "Gustavo Tejera",
  role: "Fundador de GT Dev Solutions",
  bio: "Soy Gustavo Tejera, fundador de GT Dev Solutions, desarrollador Full Stack especializado en automatización con n8n, inteligencia artificial, desarrollo web con React/Next.js y tecnologías blockchain. Mi experiencia abarca diversos sectores y geografías, inicialmente formado en Administración Comercial y Turismo en Venezuela.",
  mission: "Mi misión es ayudar a empresas a implementar soluciones tecnológicas avanzadas que les permitan optimizar procesos, aumentar la eficiencia y crear nuevos modelos de negocio.",
  photo: "/gustavo.webp",
};

/**
 * Data controller shown in /privacidad and in the form's first-layer notice.
 * controllerId is optional: when empty, the ID line is not rendered.
 */
export const LEGAL = {
  controllerName: "Gustavo Tejera",
  tradeName: "GT Dev Solutions",
  controllerId: "" as string,
  controllerAddress: "Madrid, España",
  privacyEmail: "soluciones@gtdevsolutions.com",
  lastUpdated: "5 de noviembre de 2026",
};
