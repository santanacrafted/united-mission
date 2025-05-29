import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header.component';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, TranslateModule, HeaderComponent, RouterLink],
  templateUrl: './about.component.html',
})
export class AboutComponent {
  logoUrl: string = '/assets/images/logo.png';
  team = [
    {
      image: 'https://d337lrhmtj9qpq.cloudfront.net/team/UMJose_edited.webp',
      name: 'Jose Santanas',
      role: 'Founder and Chief Executive Officer',
    },
    {
      image: 'https://d337lrhmtj9qpq.cloudfront.net/team/andrew.webp',
      name: 'Andrew Peret',
      role: 'Founder and Chief Operating Officer',
    },
    {
      image: 'https://d337lrhmtj9qpq.cloudfront.net/team/Yolli+UM+foto.webp',
      name: 'Yolanda Acevedo',
      role: 'Project Development Manager',
    },
    {
      image: 'https://d337lrhmtj9qpq.cloudfront.net/team/teron.webp',
      name: 'Francisco Terón',
      role: 'Field Operations Supervisor',
    },
    {
      image: 'https://d337lrhmtj9qpq.cloudfront.net/team/Oddi+Diaz_pic3.webp',
      name: 'Oddi Diaz',
      role: 'Field Operations Supervisor',
    },
    {
      image: 'https://d337lrhmtj9qpq.cloudfront.net/team/ashton.webp',
      name: 'Ashton Santana',
      role: 'Director of Operations',
    },
    {
      image:
        'https://d337lrhmtj9qpq.cloudfront.net/team/FD0C739B-06AF-4A4E-A52E-A532C5D70B85.jpeg',
      name: 'Kristina Santana',
      role: 'Director of Social Media',
    },
    {
      image: '',
      name: 'Darren Santana',
      role: 'Director of Technology',
    },
  ];
  lightboxVisible = false;
  lightboxImage: string = '';

  // Animation origin state
  originTop = 0;
  originLeft = 0;
  originWidth = 0;
  originHeight = 0;

  openLightbox(event: MouseEvent, src: string) {
    const target = event.target as HTMLElement;
    const rect = target.getBoundingClientRect();

    // Set starting dimensions
    this.originTop = rect.top;
    this.originLeft = rect.left;
    this.originWidth = rect.width;
    this.originHeight = rect.height;

    this.lightboxImage = src;
    this.lightboxVisible = true;

    // Animate to center (after a small delay)
    setTimeout(() => {
      this.originTop = window.innerHeight / 2 - window.innerHeight * 0.45;
      this.originLeft = window.innerWidth / 2 - window.innerWidth * 0.45;
      this.originWidth = window.innerWidth * 0.9;
      this.originHeight = window.innerHeight * 0.9;
    }, 10); // Slight delay so it animates from initial
  }

  closeLightbox() {
    this.lightboxVisible = false;
    this.lightboxImage = '';
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscape() {
    this.closeLightbox();
  }
}
