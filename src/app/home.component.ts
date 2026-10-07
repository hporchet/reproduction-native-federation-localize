import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <main>
      <h1 i18n="@@homeHeading">Federated lazy route</h1>
      <p i18n="@@homeDescription">This route is loaded on demand.</p>
    </main>
  `,
})
export class HomeComponent {}