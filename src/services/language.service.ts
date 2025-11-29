import { Injectable, signal, computed } from '@angular/core';

export type Lang = 'es' | 'en';

const DICTIONARY = {
  es: {
    nav: { home: 'Inicio', services: 'Servicios', projects: 'Proyectos', team: 'Equipo', news: 'Noticias', contact: 'Contacto' },
    hero: {
      title: 'Automatización Inteligente del Futuro',
      subtitle: 'Consultoría IT y automatización con IA de última generación. Optimizamos sus procesos con soluciones innovadoras.',
      cta: 'Explorar Soluciones'
    },
    services: {
      title: 'Nuestros Servicios',
      s1_title: 'Automatización de Flujos',
      s1_desc: 'Reducimos tareas repetitivas conectando tus herramientas digitales.',
      s2_title: 'Inteligencia Artificial',
      s2_desc: 'Implementación de modelos LLM y agentes para toma de decisiones.',
      s3_title: 'Consultoría IT',
      s3_desc: 'Evaluación técnica y estratégica para modernizar tu infraestructura.',
      cta: 'Solicitar Presupuesto'
    },
    projects: {
      title: 'Proyectos Destacados',
      subtitle: 'Innovación aplicada en escenarios reales.',
      p1: 'Validación Legal Automatizada',
      p1_d: 'Sistema inteligente para despachos que clasifica, lee y valida documentación legal automáticamente, reduciendo el tiempo de revisión en un 80%.',
      p2: 'CRM Logístico con IA',
      p2_d: 'Plataforma para gestión de flotas que predice mantenimientos y optimiza rutas en tiempo real usando algoritmos de aprendizaje automático.',
      p3: 'Chatbot de Atención Ciudadana',
      p3_d: 'Asistente virtual para Administración Pública capaz de gestionar citas y resolver dudas complejas sobre trámites burocráticos.',
      p4: 'Control de Stock Farmacéutico',
      p4_d: 'Sistema de visión artificial para control de inventario y caducidad en grandes almacenes farmacéuticos.',
      p5: 'Fintech Fraud Detection',
      p5_d: 'Motor de análisis transaccional en tiempo real para detectar patrones anómalos en banca digital.'
    },
    team: {
      title: 'Nuestro Equipo',
      desc: 'Somos una startup unida y apasionada por la tecnología. Con más de 40 proyectos exitosos a nuestras espaldas.',
      ceo: 'Fundador & CEO',
      cvo: 'Chief Visionary Officer'
    },
    clients: {
      title: 'Sectores que Confían en Nosotros'
    },
    news: {
      title: 'Últimas Noticias',
      readMore: 'Leer más'
    },
    contact: {
      title: 'Contáctanos',
      desc: 'Cuéntanos tu proyecto. Nos pondremos en contacto contigo para una evaluación gratuita.',
      name: 'Nombre',
      email: 'Correo Electrónico',
      message: 'Mensaje',
      send: 'Enviar Mensaje',
      success: '¡Mensaje enviado correctamente! Nos pondremos en contacto pronto.'
    },
    chat: {
      placeholder: 'Pregunta a Figuebot...',
      welcome: '¡Hola! Soy Figuebot. ¿En qué puedo ayudarte hoy sobre Figsoft?'
    }
  },
  en: {
    nav: { home: 'Home', services: 'Services', projects: 'Projects', team: 'Team', news: 'News', contact: 'Contact' },
    hero: {
      title: 'Intelligent Automation of the Future',
      subtitle: 'IT Consultancy and next-gen AI automation. Optimize your processes with innovative solutions.',
      cta: 'Explore Solutions'
    },
    services: {
      title: 'Our Services',
      s1_title: 'Workflow Automation',
      s1_desc: 'We reduce repetitive tasks by connecting your digital tools.',
      s2_title: 'Artificial Intelligence',
      s2_desc: 'Implementation of LLM models and agents for decision making.',
      s3_title: 'IT Consultancy',
      s3_desc: 'Technical and strategic evaluation to modernize your infrastructure.',
      cta: 'Request Quote'
    },
    projects: {
      title: 'Featured Projects',
      subtitle: 'Innovation applied in real scenarios.',
      p1: 'Automated Legal Validation',
      p1_d: 'Intelligent system for law firms that classifies, reads, and validates legal documentation automatically, reducing review time by 80%.',
      p2: 'Logistics CRM with AI',
      p2_d: 'Fleet management platform that predicts maintenance and optimizes routes in real-time using machine learning algorithms.',
      p3: 'Citizen Support Chatbot',
      p3_d: 'Virtual assistant for Public Administration capable of managing appointments and resolving complex queries about bureaucratic procedures.',
      p4: 'Pharma Stock Control',
      p4_d: 'Computer vision system for inventory and expiration control in large pharmaceutical warehouses.',
      p5: 'Fintech Fraud Detection',
      p5_d: 'Real-time transactional analysis engine to detect anomalous patterns in digital banking.'
    },
    team: {
      title: 'Our Team',
      desc: 'We are a united startup passionate about technology. With over 40 successful projects behind us.',
      ceo: 'Founder & CEO',
      cvo: 'Chief Visionary Officer'
    },
    clients: {
      title: 'Sectors That Trust Us'
    },
    news: {
      title: 'Latest News',
      readMore: 'Read more'
    },
    contact: {
      title: 'Contact Us',
      desc: 'Tell us about your project. We will contact you for a free evaluation.',
      name: 'Name',
      email: 'Email',
      message: 'Message',
      send: 'Send Message',
      success: 'Message sent successfully! We will be in touch soon.'
    },
    chat: {
      placeholder: 'Ask Figuebot...',
      welcome: 'Hello! I am Figuebot. How can I help you today regarding Figsoft?'
    }
  }
};

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  currentLang = signal<Lang>('es');

  translations = computed(() => DICTIONARY[this.currentLang()]);

  toggleLang() {
    this.currentLang.update(l => l === 'es' ? 'en' : 'es');
  }
}
