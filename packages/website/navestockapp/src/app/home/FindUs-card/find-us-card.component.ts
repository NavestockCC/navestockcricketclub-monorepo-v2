import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HorizontalCardComponent} from '@ncc-component-horizontalCard';
import { cardContent } from '@ncc/interface-cards';

@Component({
  selector: 'ncc-app-find-us-card',
  standalone: true,
  imports: [CommonModule, HorizontalCardComponent],
  template: `<ncc-website-horizontal-card [hcard]="cardData"></ncc-website-horizontal-card>`,
  styles: [],
})
export class FindUsCardComponent {
  cardData: cardContent = {
    headline: 'Where To Find Us',
    description: 'The Green, Navestockside, CM14 5SD',
    card_image: 'assets-img/NavestockCricketMap.png',
    learn_more_route:'details'
  }
}
