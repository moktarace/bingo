export const environment = {
  production: false,
  bingo: {
    // Seed pour le générateur de nombres aléatoires
    // Changez cette valeur pour obtenir une séquence différente de nombres
    seed: 42,
    
    // Date de commencement du jeu (format: YYYY-MM-DD)
    // Tous les utilisateurs doivent avoir la même date de départ
    startDate: '2026-01-13',
    
    // Nombre maximum de numéros (de 1 à maxNumber)
    // Par exemple: 90 pour un bingo classique, 99 pour plus de jours
    maxNumber: 90
  }
};