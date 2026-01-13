import { Component, OnInit, Input } from '@angular/core';
import { BingoDay } from '../../services/bingo.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  @Input() history: BingoDay[] = [];

  constructor() { }

  ngOnInit(): void { }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('fr-FR', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short' 
    });
  }
}
