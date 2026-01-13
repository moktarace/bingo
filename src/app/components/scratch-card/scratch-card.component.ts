import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-scratch-card',
  templateUrl: './scratch-card.component.html',
  styleUrls: ['./scratch-card.component.scss']
})
export class ScratchCardComponent implements OnInit, AfterViewInit {
  @ViewChild('scratchCanvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @Input() number: number = 0;
  @Input() alreadyScratched: boolean = false;
  @Output() scratched = new EventEmitter<void>();

  private ctx!: CanvasRenderingContext2D;
  private isDrawing = false;
  private scratchedPercentage = 0;

  constructor() { }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    if (!this.alreadyScratched) {
      this.initCanvas();
    }
  }

  private initCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    
    // Définir la taille du canvas
    canvas.width = 350;
    canvas.height = 250;

    // Créer un effet de ticket à gratter réaliste
    // Fond argenté avec texture
    const gradient = this.ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#c0c0c0');
    gradient.addColorStop(0.5, '#e8e8e8');
    gradient.addColorStop(1, '#a8a8a8');
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Ajouter une texture granuleuse
    for (let i = 0; i < 3000; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const opacity = Math.random() * 0.3;
      this.ctx.fillStyle = `rgba(${Math.random() > 0.5 ? 255 : 0}, ${Math.random() > 0.5 ? 255 : 0}, ${Math.random() > 0.5 ? 255 : 0}, ${opacity})`;
      this.ctx.fillRect(x, y, 1, 1);
    }

    // Texte principal
    this.ctx.fillStyle = '#888888';
    this.ctx.font = 'bold 28px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText('GRATTEZ ICI', canvas.width / 2, canvas.height / 2);

    // Sous-texte
    this.ctx.font = '16px Arial';
    this.ctx.fillStyle = '#999999';
    this.ctx.fillText('Pour révéler le numéro', canvas.width / 2, canvas.height / 2 + 35);

    // Configurer le mode de dessin pour effacer
    this.ctx.globalCompositeOperation = 'destination-out';
  }

  onMouseDown(event: MouseEvent): void {
    if (this.alreadyScratched) return;
    this.isDrawing = true;
    this.scratch(event.offsetX, event.offsetY);
  }

  onMouseMove(event: MouseEvent): void {
    if (this.alreadyScratched || !this.isDrawing) return;
    this.scratch(event.offsetX, event.offsetY);
  }

  onMouseUp(): void {
    this.isDrawing = false;
    this.checkScratchPercentage();
  }

  onTouchStart(event: TouchEvent): void {
    if (this.alreadyScratched) return;
    event.preventDefault();
    this.isDrawing = true;
    const touch = event.touches[0];
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    this.scratch(touch.clientX - rect.left, touch.clientY - rect.top);
  }

  onTouchMove(event: TouchEvent): void {
    if (this.alreadyScratched || !this.isDrawing) return;
    event.preventDefault();
    const touch = event.touches[0];
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    this.scratch(touch.clientX - rect.left, touch.clientY - rect.top);
  }

  onTouchEnd(event: TouchEvent): void {
    event.preventDefault();
    this.isDrawing = false;
    this.checkScratchPercentage();
  }

  private scratch(x: number, y: number): void {
    this.ctx.beginPath();
    this.ctx.arc(x, y, 25, 0, 2 * Math.PI);
    this.ctx.fill();
  }

  private checkScratchPercentage(): void {
    const canvas = this.canvasRef.nativeElement;
    const imageData = this.ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    
    let transparent = 0;
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) {
        transparent++;
      }
    }
    
    this.scratchedPercentage = (transparent / (pixels.length / 4)) * 100;
    
    // Si plus de 50% est gratté, considérer comme terminé
    if (this.scratchedPercentage > 50) {
      this.scratched.emit();
    }
  }
}
