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
  templateUrl: './app.component.html'
})
export class AppComponent {
  lang = inject(LanguageService);
  fb = inject(FormBuilder);

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
