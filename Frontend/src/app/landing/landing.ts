import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: false,
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing {

  landingForm!: FormGroup;
  year = new Date().getFullYear();

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.landingForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    })
  }

  login() {
    this.router.navigate(['/login']);
  }

  getStarted() {
    this.router.navigate(['/signup'], {
      queryParams: { email: this.landingForm.value.email }
    })
  }

  reasons = [
    {
      title: 'Enjoy on your Tv',
      text: 'Watch on Smart TVs, Playstation, Xbox, players and more.',
      icon: 'tv'
    },
    {
      title: 'Download your shows to watch offline',
      text: 'Save your favorites easily and always have something to watch.',
      icon: 'file_download'
    },
    {
      title: 'Watch anywhere',
      text: 'Stream unlimited movies and TV shows on your phone, tablet, laptop, and TV.',
      icon: 'devices'
    },
    {
      title: 'Create profiles for kids',
      text: 'Send kids on adventures with their favorite characters in a space made just for them—free with your membership.',
      icon: 'face'
    }
  ]

  faqs = [
    {
      question: 'What is StreamFLix?',
      answers: 'StreamFLix is an online streaming platform that lets you watch movies, TV shows, and web series anytime, anywhere.'
    },
    {
      question: 'Is StreamFLix free to use?',
      answers: 'StreamFLix offers both free and premium plans. Some content may require a subscription.'
    },
    {
      question: 'Do I need to create an account to watch content?',
      answers: 'Yes, creating an account helps you save your watch history, preferences, and get personalized recommendations.'
    },
    {
      question: 'Can I watch StreamFLix on multiple devices?',
      answers: 'Yes, StreamFLix supports streaming on mobiles, tablets, laptops, and smart TVs.'
    },
    {
      question: 'Does StreamFLix support HD or 4K streaming?',
      answers: 'Yes, StreamFLix supports HD streaming, and selected content is available in 4K depending on your plan and internet speed.'
    },
    {
      question: 'Can I download movies or shows for offline viewing?',
      answers: 'Yes, StreamFLix allows offline downloads on supported devices.'
    },
    {
      question: 'How often is new content added?',
      answers: 'New movies and shows are added regularly to keep the content fresh and updated.'
    },
    {
      question: 'Is StreamFLix safe and secure?',
      answers: 'Yes, StreamFLix uses secure authentication and encrypted connections to protect user data.'
    },
    {
      question: 'Can I cancel my subscription anytime?',
      answers: 'Yes, you can cancel your subscription anytime from your account settings.'
    },
    {
      question: 'Why am I seeing different content recommendations?',
      answers: 'StreamFLix uses smart algorithms to recommend content based on your viewing history.'
    }
  ]
}
