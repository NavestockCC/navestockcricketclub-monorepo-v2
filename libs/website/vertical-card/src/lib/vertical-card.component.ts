import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cardContent } from '@ncc/interface-cards';

@Component({
  selector: 'ncc-website-vertical-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vertical-card.component.html',
  styleUrls: ['./vertical-card.component.scss'],
})
export class VerticalCardComponent {
  @Input() vcard!: cardContent;
}
