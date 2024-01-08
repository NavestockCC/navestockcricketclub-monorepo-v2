import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cardContent } from '@ncc/interface-cards';

@Component({
  selector: 'ncc-website-horizontal-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './horizontal-card.component.html',
  styleUrls: ['./horizontal-card.component.scss'],
})
export class HorizontalCardComponent {
  @Input() hcard!: cardContent;
}
