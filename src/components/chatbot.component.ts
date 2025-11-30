import { Component, signal, ViewChild, ElementRef, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleGenAI, Chat } from "@google/genai";
import { LanguageService } from '../services/language.service';
import { FormsModule } from '@angular/forms';

interface Message {
  role: 'user' | 'model';
  text: string;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <!-- Chat Window -->
      @if (isOpen()) {
        <div class="glass-panel w-80 sm:w-96 h-[500px] rounded-2xl mb-4 flex flex-col overflow-hidden shadow-2xl animate-float">
          <!-- Header -->
          <div class="bg-fig-blue/20 p-4 border-b border-white/10 flex justify-between items-center backdrop-blur-md">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-gradient-to-br from-fig-blue to-fig-green flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 class="font-bold text-white">Figuebot</h3>
            </div>
            <button (click)="toggleChat()" class="text-gray-300 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Messages -->
          <div #scrollContainer class="flex-1 overflow-y-auto p-4 space-y-4 bg-fig-dark/80">
            @for (msg of messages(); track $index) {
              <div class="flex" [class.justify-end]="msg.role === 'user'">
                <div [class]="msg.role === 'user' 
                  ? 'bg-fig-blue text-white rounded-l-xl rounded-tr-xl p-3 max-w-[85%] text-sm' 
                  : 'bg-white/10 text-gray-200 rounded-r-xl rounded-tl-xl p-3 max-w-[85%] text-sm border border-white/5'">
                  {{ msg.text }}
                </div>
              </div>
            }
            @if (isLoading()) {
              <div class="flex justify-start">
                <div class="bg-white/10 rounded-r-xl rounded-tl-xl p-3 flex gap-1 items-center">
                  <div class="w-2 h-2 bg-fig-green rounded-full animate-bounce"></div>
                  <div class="w-2 h-2 bg-fig-green rounded-full animate-bounce delay-100"></div>
                  <div class="w-2 h-2 bg-fig-green rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            }
          </div>

          <!-- Input -->
          <div class="p-3 border-t border-white/10 bg-fig-dark/90">
            <form (submit)="sendMessage()" class="flex gap-2">
              <input 
                [(ngModel)]="userInput" 
                name="userInput"
                [placeholder]="lang.translations().chat.placeholder"
                class="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-fig-green transition-colors"
                autocomplete="off"
              >
              <button 
                type="submit" 
                [disabled]="!userInput.trim() || isLoading()"
                class="bg-fig-green text-fig-dark p-2 rounded-lg hover:bg-emerald-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      }

      <!-- Toggle Button -->
      <button 
        (click)="toggleChat()" 
        class="w-14 h-14 bg-gradient-to-br from-fig-blue to-fig-green rounded-full shadow-lg shadow-fig-green/20 flex items-center justify-center hover:scale-105 transition-transform duration-300 group">
        @if (!isOpen()) {
          <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        } @else {
          <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        }
        <span class="absolute right-0 top-0 flex h-3 w-3">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-fig-green opacity-75"></span>
          <span class="relative inline-flex rounded-full h-3 w-3 bg-fig-green"></span>
        </span>
      </button>
    </div>
  `
})
export class ChatbotComponent {
  isOpen = signal(false);
  userInput = '';
  messages = signal<Message[]>([]);
  isLoading = signal(false);
  lang = inject(LanguageService);
  
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  private chatSession: Chat | null = null;
  private ai: GoogleGenAI;

  constructor() {
    let key = '';
    try {
      key = process.env['API_KEY'] || '';
    } catch (e) {
      console.warn('API Key not found or process not defined');
    }
    this.ai = new GoogleGenAI({ apiKey: key });
    this.initializeChat();
    
    // Add welcome message
    effect(() => {
       if (this.messages().length === 0) {
         this.messages.set([{ role: 'model', text: this.lang.translations().chat.welcome }]);
       }
    }, {allowSignalWrites: true});
  }

  initializeChat() {
    const systemInstruction = `
      You are Figuebot, the specialized AI assistant for Figsoft, an IT consultancy firm.
      
      Company Details:
      - Name: Figsoft
      - CEO: Jose Figueira
      - CVO: Jose Padron
      - Specialization: Workflow automation, AI integration, process simplification, custom software.
      - Experience: 40+ projects executed.
      - Target Audience: Startups to large enterprises.
      - Sectors served: Public Administration, Banking, Construction, Logistics, Pharma, Retail, etc.
      
      Services:
      - Automation of repetitive tasks.
      - Intelligent agents and LLM integration.
      - Custom software development.
      - IT Consulting.

      Tone: Professional, innovative, helpful, empathetic, slightly futuristic but approachable.
      Language: Respond in the language the user speaks to you (Spanish or English).
      
      Goal: Help users understand Figsoft's services and encourage them to use the contact form for a quote.
    `;

    try {
      this.chatSession = this.ai.chats.create({
        model: 'gemini-2.5-flash',
        config: { systemInstruction }
      });
    } catch (e) {
      console.error("Failed to init chat", e);
    }
  }

  toggleChat() {
    this.isOpen.update(v => !v);
    setTimeout(() => this.scrollToBottom(), 100);
  }

  async sendMessage() {
    if (!this.userInput.trim() || !this.chatSession) return;

    const userText = this.userInput;
    this.userInput = '';
    this.messages.update(m => [...m, { role: 'user', text: userText }]);
    this.isLoading.set(true);
    this.scrollToBottom();

    try {
      const result = await this.chatSession.sendMessage({ message: userText });
      const responseText = result.text;
      this.messages.update(m => [...m, { role: 'model', text: responseText }]);
    } catch (error) {
      console.error('Chat error:', error);
      this.messages.update(m => [...m, { role: 'model', text: 'Lo siento, tuve un error de conexión. Intenta de nuevo.' }]);
    } finally {
      this.isLoading.set(false);
      this.scrollToBottom();
    }
  }

  scrollToBottom() {
    if (this.scrollContainer) {
      const el = this.scrollContainer.nativeElement;
      setTimeout(() => {
        el.scrollTop = el.scrollHeight;
      }, 50);
    }
  }
}
