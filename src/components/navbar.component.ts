import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="fixed top-0 w-full z-40 transition-all duration-300" 
         [class.bg-fig-dark-90]="isScrolled()" 
         [class.backdrop-blur-md]="isScrolled()"
         [class.bg-transparent]="!isScrolled()"
         [class.border-b]="isScrolled()"
         [class.border-white-10]="isScrolled()">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-20">
          
          <!-- Logo -->
          <div class="flex-shrink-0 flex items-center gap-3 cursor-pointer" (click)="scrollTo('hero')">
            <div class="relative w-10 h-10">
              <!-- Hexagon Logo Implementation via SVG -->
              <svg viewBox="0 0 100 100" class="w-full h-full drop-shadow-[0_0_10px_rgba(0,229,153,0.5)]">
                 <path d="M50 5 L93.3 30 V70 L50 95 L6.7 70 V30 Z" fill="none" stroke="url(#grad1)" stroke-width="8"/>
                 <path d="M50 25 L75 40 V60 L50 75 L25 60 V40 Z" fill="url(#grad2)"/>
                 <defs>
                   <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                     <stop offset="0%" style="stop-color:#007BFF;stop-opacity:1" />
                     <stop offset="100%" style="stop-color:#00E599;stop-opacity:1" />
                   </linearGradient>
                   <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
                     <stop offset="0%" style="stop-color:#007BFF;stop-opacity:0.8" />
                     <stop offset="100%" style="stop-color:#00E599;stop-opacity:0.8" />
                   </linearGradient>
                 </defs>
              </svg>
            </div>
            <span class="text-2xl font-bold tracking-tight text-white">
              fig<span class="text-fig-green">soft</span>
            </span>
          </div>

          <!-- Desktop Menu -->
          <div class="hidden md:block">
            <div class="ml-10 flex items-baseline space-x-8">
              <a (click)="scrollTo('services')" class="cursor-pointer text-gray-300 hover:text-fig-green hover:neon-text px-3 py-2 rounded-md text-sm font-medium transition-all">{{ lang.translations().nav.services }}</a>
              <a (click)="scrollTo('projects')" class="cursor-pointer text-gray-300 hover:text-fig-green hover:neon-text px-3 py-2 rounded-md text-sm font-medium transition-all">{{ lang.translations().nav.projects }}</a>
              <a (click)="scrollTo('news')" class="cursor-pointer text-gray-300 hover:text-fig-green hover:neon-text px-3 py-2 rounded-md text-sm font-medium transition-all">{{ lang.translations().nav.news }}</a>
              <a (click)="scrollTo('contact')" class="cursor-pointer text-gray-300 hover:text-fig-green hover:neon-text px-3 py-2 rounded-md text-sm font-medium transition-all">{{ lang.translations().nav.contact }}</a>
            </div>
          </div>

          <!-- Language & Mobile Button -->
          <div class="flex items-center gap-4">
            <button (click)="lang.toggleLang()" class="px-3 py-1 border border-fig-green/50 rounded-full text-xs font-semibold text-fig-green hover:bg-fig-green/10 transition-colors uppercase">
              {{ lang.currentLang() }}
            </button>
            
            <div class="-mr-2 flex md:hidden">
              <button (click)="isMobileMenuOpen.set(!isMobileMenuOpen())" type="button" class="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none">
                <svg class="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile Menu -->
      @if (isMobileMenuOpen()) {
        <div class="md:hidden glass-panel border-t border-white/10">
          <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a (click)="mobileScroll('services')" class="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">{{ lang.translations().nav.services }}</a>
            <a (click)="mobileScroll('projects')" class="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">{{ lang.translations().nav.projects }}</a>
            <a (click)="mobileScroll('news')" class="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">{{ lang.translations().nav.news }}</a>
            <a (click)="mobileScroll('contact')" class="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">{{ lang.translations().nav.contact }}</a>
          </div>
        </div>
      }
    </nav>
  `
})
export class NavbarComponent {
  lang = inject(LanguageService);
  isScrolled = signal(false);
  isMobileMenuOpen = signal(false);

  constructor() {
    window.addEventListener('scroll', () => {
      this.isScrolled.set(window.scrollY > 50);
    });
  }

  scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  mobileScroll(id: string) {
    this.scrollTo(id);
    this.isMobileMenuOpen.set(false);
  }
}
