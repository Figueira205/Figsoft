import { Component, inject } from '@angular/core';
import { NavbarComponent } from './components/navbar.component';
import { ChatbotComponent } from './components/chatbot.component';
import { LanguageService } from './services/language.service';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, NavbarComponent, ChatbotComponent, ReactiveFormsModule, NgOptimizedImage],
  template: `
    <app-navbar />
    
    <main class="bg-gray-900 min-h-screen text-gray-100 font-sans selection:bg-emerald-400 selection:text-gray-900">
      
      <!-- Hero Section -->
      <section id="hero" class="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <!-- Background elements -->
        <div class="absolute inset-0 z-0 pointer-events-none">
          <div class="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
          <div class="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full grid md:grid-cols-2 gap-12 items-center">
          <div class="space-y-8">
             <div class="inline-block px-4 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm font-semibold mb-4">
               🚀 Innovation First
             </div>
             <h1 class="text-5xl md:text-7xl font-bold leading-tight">
               <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                 {{ lang.translations().hero.title }}
               </span>
             </h1>
             <p class="text-xl text-gray-400 max-w-lg">
               {{ lang.translations().hero.subtitle }}
             </p>
             <button (click)="scrollToContact()" class="group relative px-8 py-4 bg-emerald-500 text-gray-900 font-bold rounded-full overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(0,229,153,0.4)]">
               <span class="relative z-10">{{ lang.translations().hero.cta }}</span>
               <div class="absolute inset-0 h-full w-full bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
             </button>
          </div>
          
          <div class="hidden md:block relative">
            <img ngSrc="https://picsum.photos/600/600" width="600" height="600" alt="Hero Illustration" class="rounded-3xl shadow-2xl border border-white/10 relative z-10 opacity-80 mix-blend-lighten" priority>
          </div>
        </div>
      </section>

      <!-- Services -->
      <section id="services" class="py-24 relative">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16">
            <h2 class="text-3xl md:text-4xl font-bold mb-4">{{ lang.translations().services.title }}</h2>
            <div class="h-1 w-20 bg-gradient-to-r from-blue-500 to-emerald-500 mx-auto rounded-full"></div>
          </div>
          
          <div class="grid md:grid-cols-3 gap-8">
            <!-- Service 1 -->
            <div class="p-8 rounded-2xl bg-white/5 border border-white/5 hover:border-emerald-500/30 transition-all duration-300 hover:-translate-y-2 group backdrop-blur-sm">
              <div class="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-500/30 transition-colors">
                <svg class="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h3 class="text-xl font-bold mb-3">{{ lang.translations().services.s1_title }}</h3>
              <p class="text-gray-400">{{ lang.translations().services.s1_desc }}</p>
            </div>
            
            <!-- Service 2 -->
            <div class="p-8 rounded-2xl bg-white/5 border border-white/5 hover:border-emerald-500/30 transition-all duration-300 hover:-translate-y-2 group backdrop-blur-sm">
              <div class="w-14 h-14 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-500/30 transition-colors">
                 <svg class="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <h3 class="text-xl font-bold mb-3">{{ lang.translations().services.s2_title }}</h3>
              <p class="text-gray-400">{{ lang.translations().services.s2_desc }}</p>
            </div>

            <!-- Service 3 -->
            <div class="p-8 rounded-2xl bg-white/5 border border-white/5 hover:border-emerald-500/30 transition-all duration-300 hover:-translate-y-2 group backdrop-blur-sm">
              <div class="w-14 h-14 bg-purple-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-500/30 transition-colors">
                <svg class="w-8 h-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
              </div>
              <h3 class="text-xl font-bold mb-3">{{ lang.translations().services.s3_title }}</h3>
              <p class="text-gray-400">{{ lang.translations().services.s3_desc }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Projects -->
      <section id="projects" class="py-24 bg-black/20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div class="mb-16">
            <h2 class="text-3xl md:text-4xl font-bold mb-4">{{ lang.translations().projects.title }}</h2>
            <p class="text-gray-400">{{ lang.translations().projects.subtitle }}</p>
          </div>

          <div class="space-y-6">
            <!-- P1 -->
            <div class="group relative overflow-hidden rounded-2xl bg-white/5 border border-white/5 hover:border-emerald-500/50 transition-all">
              <div class="p-8 md:flex items-center gap-8">
                <div class="flex-1">
                   <h3 class="text-2xl font-bold text-white mb-2">{{ lang.translations().projects.p1 }}</h3>
                   <p class="text-gray-400">{{ lang.translations().projects.p1_d }}</p>
                </div>
                <div class="mt-4 md:mt-0">
                  <span class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/5 group-hover:bg-emerald-500 group-hover:text-gray-900 transition-all">
                    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </span>
                </div>
              </div>
            </div>
            
            <!-- P2 -->
            <div class="group relative overflow-hidden rounded-2xl bg-white/5 border border-white/5 hover:border-emerald-500/50 transition-all">
              <div class="p-8 md:flex items-center gap-8">
                <div class="flex-1">
                   <h3 class="text-2xl font-bold text-white mb-2">{{ lang.translations().projects.p2 }}</h3>
                   <p class="text-gray-400">{{ lang.translations().projects.p2_d }}</p>
                </div>
                <div class="mt-4 md:mt-0">
                  <span class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/5 group-hover:bg-emerald-500 group-hover:text-gray-900 transition-all">
                    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </span>
                </div>
              </div>
            </div>
            
             <!-- P3 -->
            <div class="group relative overflow-hidden rounded-2xl bg-white/5 border border-white/5 hover:border-emerald-500/50 transition-all">
              <div class="p-8 md:flex items-center gap-8">
                <div class="flex-1">
                   <h3 class="text-2xl font-bold text-white mb-2">{{ lang.translations().projects.p3 }}</h3>
                   <p class="text-gray-400">{{ lang.translations().projects.p3_d }}</p>
                </div>
                 <div class="mt-4 md:mt-0">
                  <span class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/5 group-hover:bg-emerald-500 group-hover:text-gray-900 transition-all">
                    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </span>
                </div>
              </div>
            </div>

            <!-- P4 -->
            <div class="group relative overflow-hidden rounded-2xl bg-white/5 border border-white/5 hover:border-emerald-500/50 transition-all">
              <div class="p-8 md:flex items-center gap-8">
                <div class="flex-1">
                   <h3 class="text-2xl font-bold text-white mb-2">{{ lang.translations().projects.p4 }}</h3>
                   <p class="text-gray-400">{{ lang.translations().projects.p4_d }}</p>
                </div>
                 <div class="mt-4 md:mt-0">
                   <span class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/5 group-hover:bg-emerald-500 group-hover:text-gray-900 transition-all">
                    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </span>
                </div>
              </div>
            </div>

            <!-- P5 -->
            <div class="group relative overflow-hidden rounded-2xl bg-white/5 border border-white/5 hover:border-emerald-500/50 transition-all">
              <div class="p-8 md:flex items-center gap-8">
                <div class="flex-1">
                   <h3 class="text-2xl font-bold text-white mb-2">{{ lang.translations().projects.p5 }}</h3>
                   <p class="text-gray-400">{{ lang.translations().projects.p5_d }}</p>
                </div>
                 <div class="mt-4 md:mt-0">
                  <span class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/5 group-hover:bg-emerald-500 group-hover:text-gray-900 transition-all">
                    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Clients / Sectors -->
      <section class="py-16 border-y border-white/5 bg-black/40">
        <div class="max-w-7xl mx-auto px-4 text-center">
           <h3 class="text-lg font-semibold text-gray-500 mb-8 uppercase tracking-widest">{{ lang.translations().clients.title }}</h3>
           <div class="flex flex-wrap justify-center gap-4">
             @for (client of clients; track client) {
               <span class="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 hover:bg-white/10 transition-colors">
                 {{ client }}
               </span>
             }
           </div>
        </div>
      </section>

      <!-- News -->
      <section id="news" class="py-24">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div class="flex justify-between items-end mb-12">
             <h2 class="text-3xl md:text-4xl font-bold">{{ lang.translations().news.title }}</h2>
             <a href="#" class="text-emerald-400 hover:underline hidden sm:block">{{ lang.translations().news.readMore }} -></a>
           </div>
           
           <div class="grid md:grid-cols-3 gap-8">
             @for (item of newsItems; track item.title) {
               <article class="group cursor-pointer">
                 <div class="relative overflow-hidden rounded-xl mb-4 aspect-video bg-gray-800">
                   <img [ngSrc]="item.img" fill class="object-cover transition-transform duration-500 group-hover:scale-110" [alt]="item.title">
                 </div>
                 <span class="text-xs text-emerald-400 font-semibold">{{ item.date }}</span>
                 <h3 class="text-lg font-bold mt-2 group-hover:text-emerald-400 transition-colors">{{ item.title }}</h3>
               </article>
             }
           </div>
        </div>
      </section>
      
      <!-- Contact -->
      <section id="contact" class="py-24 relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-t from-blue-900/10 to-transparent pointer-events-none"></div>
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div class="bg-white/5 rounded-3xl p-8 md:p-12 border border-white/10 shadow-2xl backdrop-blur-md">
            <div class="text-center mb-10">
              <h2 class="text-3xl md:text-4xl font-bold mb-4">{{ lang.translations().contact.title }}</h2>
              <p class="text-gray-400">{{ lang.translations().contact.desc }}</p>
            </div>
            
            @if (formStatus === 'success') {
               <div class="bg-emerald-500/20 border border-emerald-500 text-emerald-400 p-4 rounded-xl text-center mb-8">
                 {{ lang.translations().contact.success }}
               </div>
            }

            <form [formGroup]="contactForm" (ngSubmit)="submitContact()" class="space-y-6">
              <div class="grid md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-400 mb-2">{{ lang.translations().contact.name }}</label>
                  <input formControlName="name" type="text" class="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all">
                </div>
                 <div>
                  <label class="block text-sm font-medium text-gray-400 mb-2">{{ lang.translations().contact.email }}</label>
                  <input formControlName="email" type="email" class="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all">
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-400 mb-2">{{ lang.translations().contact.message }}</label>
                <textarea formControlName="message" rows="4" class="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"></textarea>
              </div>
              <button type="submit" [disabled]="contactForm.invalid" class="w-full bg-emerald-500 hover:bg-emerald-400 text-gray-900 font-bold py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95">
                {{ lang.translations().contact.send }}
              </button>
            </form>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="py-8 border-t border-white/5 text-center text-gray-500 text-sm">
        <p>&copy; 2024 Figsoft. All rights reserved.</p>
      </footer>

    </main>

    <app-chatbot />
  `
})
export class AppComponent {
  lang = inject(LanguageService);
  private fb: FormBuilder = inject(FormBuilder);

  contactForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    message: ['', Validators.required]
  });

  formStatus = '';

  newsItems = [
    {
      title: 'Sin empatía, no hay liderazgo',
      img: 'https://picsum.photos/400/250?random=1',
      date: 'Oct 2023'
    },
    {
      title: 'La selección con IA ya está aquí',
      img: 'https://picsum.photos/400/250?random=2',
      date: 'Nov 2023'
    },
    {
      title: 'Autoexigencia: el nuevo enemigo silencioso',
      img: 'https://picsum.photos/400/250?random=3',
      date: 'Dec 2023'
    },
    {
      title: 'El futuro empieza hoy: mentalidad proactiva',
      img: 'https://picsum.photos/400/250?random=4',
      date: 'Jan 2024'
    },
    {
      title: 'Ventajas de migrar a microservicios',
      img: 'https://picsum.photos/400/250?random=5',
      date: 'Feb 2024'
    },
    {
      title: 'Implantar IA agéntica con éxito',
      img: 'https://picsum.photos/400/250?random=6',
      date: 'Mar 2024'
    }
  ];

  clients = [
    'Administración Pública', 'Banca y Finanzas', 'Construcción', 'Consultoría', 'e-Commerce',
    'Educación', 'Farma y Salud', 'Industria', 'Joyería', 'Retail', 'Seguros', 
    'Servicios', 'Software', 'Tecnología', 'Textil', 'Transporte y Logística'
  ];

  submitContact() {
    if (this.contactForm.valid) {
      console.log('Sending email to figueira205@proton.me', this.contactForm.value);
      this.formStatus = 'success';
      this.contactForm.reset();
      setTimeout(() => this.formStatus = '', 5000);
    }
  }

  scrollToContact() {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  }
}