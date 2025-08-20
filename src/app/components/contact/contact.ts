import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  imports: [],
  templateUrl: './contact.html',
  styleUrl: './contact.scss'
})
export class ContactComponent {
  getCurrentYear(): number {
    return new Date().getFullYear();
  }
}
