import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

export interface BingoDay {
  date: Date;
  number: number;
  scratched: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class BingoService {
  // Date de départ du jeu (fixe pour tous les utilisateurs)
  private readonly START_DATE = new Date(environment.bingo.startDate + 'T00:00:00');
  
  // Seed fixe pour garantir la même séquence pour tous
  private readonly SEED = environment.bingo.seed;

  // Nombre maximum de numéros
  private readonly MAX_NUMBER = environment.bingo.maxNumber;

  // Liste mélangée des nombres (générée une seule fois)
  private shuffledNumbers: number[] = [];

  constructor() {
    this.initializeNumbers();
  }

  /**
   * Initialise et mélange les nombres de 1 à MAX_NUMBER de manière déterministe
   */
  private initializeNumbers(): void {
    // Créer la liste de 1 à MAX_NUMBER
    this.shuffledNumbers = Array.from({ length: this.MAX_NUMBER }, (_, i) => i + 1);
    
    // Mélanger avec l'algorithme Fisher-Yates déterministe
    for (let i = this.shuffledNumbers.length - 1; i > 0; i--) {
      // Utiliser la seed + index pour générer un nombre déterministe
      const randomValue = this.seededRandom(this.SEED + i);
      const j = Math.floor(randomValue * (i + 1));
      
      // Échanger les éléments
      [this.shuffledNumbers[i], this.shuffledNumbers[j]] = 
        [this.shuffledNumbers[j], this.shuffledNumbers[i]];
    }
  }

  /**
   * Générateur de nombres pseudo-aléatoires déterministe (LCG - Linear Congruential Generator)
   */
  private seededRandom(seed: number): number {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  /**
   * Génère un nombre entre 1 et MAX_NUMBER pour un jour donné
   * Chaque nombre n'apparaît qu'une seule fois
   * Retourne null si avant le début ou après la fin
   */
  getNumberForDay(dayIndex: number): number | null {
    // Pas encore commencé
    if (dayIndex < 0) {
      return null;
    }
    // Arrêter après MAX_NUMBER jours
    if (dayIndex >= this.MAX_NUMBER) {
      return null;
    }
    return this.shuffledNumbers[dayIndex];
  }

  /**
   * Calcule l'index du jour depuis le début du jeu
   * Retourne un nombre négatif si on est avant la date de début
   */
  getDayIndex(date: Date = new Date()): number {
    const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const start = new Date(this.START_DATE.getFullYear(), this.START_DATE.getMonth(), this.START_DATE.getDate());
    const diffTime = today.getTime() - start.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  /**
   * Retourne le nombre du jour (null si le jeu est terminé)
   */
  getTodayNumber(): number | null {
    const dayIndex = this.getDayIndex();
    return this.getNumberForDay(dayIndex);
  }

  /**
   * Retourne l'historique des jours précédents (tous les jours passés)
   */
  getHistory(maxDays: number = 30): BingoDay[] {
    const today = this.getDayIndex();
    const history: BingoDay[] = [];
    
    // Calculer le dernier jour valide (soit aujourd'hui-1, soit le dernier jour du jeu)
    const lastValidDay = Math.min(today - 1, this.MAX_NUMBER - 1);
    
    // Afficher TOUS les jours passés depuis le début
    for (let i = lastValidDay; i >= 0; i--) {
      const date = new Date(this.START_DATE);
      date.setDate(date.getDate() + i);
      const number = this.getNumberForDay(i);
      
      if (number !== null) {
        history.push({
          date: date,
          number: number,
          scratched: true // L'historique est toujours visible
        });
      }
    }
    
    return history;
  }

  /**
   * Vérifie si l'utilisateur a déjà gratté aujourd'hui
   */
  hasScratched(): boolean {
    const today = this.getDayIndex();
    const lastScratched = localStorage.getItem('lastScratched');
    return lastScratched === today.toString();
  }

  /**
   * Marque le jour comme gratté
   */
  markAsScratched(): void {
    const today = this.getDayIndex();
    localStorage.setItem('lastScratched', today.toString());
  }

  /**
   * Retourne la date de début du jeu
   */
  getStartDate(): Date {
    return this.START_DATE;
  }
}
