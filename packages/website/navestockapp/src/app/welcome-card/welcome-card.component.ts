import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerticalCardComponent } from '@ncc-component-verticalCard';
import { cardContent } from '@ncc/interface-cards';

@Component({
  selector: 'ncc-app-welcome-card',
  standalone: true,
  imports: [CommonModule, VerticalCardComponent],
  template: `<ncc-website-vertical-card [vcard] = "cardData"></ncc-website-vertical-card>`,
  styles: [],
})
export class WelcomeCardComponent {
 

  cardData: cardContent = {
    headline: 'Welcome to Navestock Cricket Club',
    byline: 'Established in 1768',
    description: 'A quintessential village cricket club in the heart of the Essex countryside, with 250 years of history.',
    card_image: '/libs/ui/img/src/lib/assets/img/NCCPlay.png',
    learn_more_route:'details'
  }

}
