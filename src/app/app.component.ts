import { Component, OnInit } from '@angular/core';
import { BingoService, BingoDay } from './services/bingo.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Bingo des Copaings';
  todayNumber: number | null = 0;
  alreadyScratched: boolean = false;
  history: BingoDay[] = [];
  isGameFinished: boolean = false;
  isGameNotStarted: boolean = false;
  showConfetti: boolean = false;

  constructor(private bingoService: BingoService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    const dayIndex = this.bingoService.getDayIndex();
    this.todayNumber = this.bingoService.getTodayNumber();
    this.isGameNotStarted = dayIndex < 0;
    this.isGameFinished = this.todayNumber === null && dayIndex >= 0;
    this.alreadyScratched = this.bingoService.hasScratched();
    this.history = this.bingoService.getHistory();
  }

  onScratched(): void {
    this.bingoService.markAsScratched();
    this.alreadyScratched = true;
    this.showConfetti = true;
    
    // Arrêter les confettis après 4 secondes
    setTimeout(() => {
      this.showConfetti = false;
    }, 4000);
  }
}
