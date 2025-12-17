import { Component } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonImg,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonChip,
  IonSpinner,
} from '@ionic/angular/standalone';
import { PokemonService } from '../services/photo';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [
    CommonModule,        // <-- kvůli *ngIf, *ngFor
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonImg,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton,
    IonChip,
    IonSpinner,
    TitleCasePipe,
  ],
})
export class Tab1Page {
  constructor(public pokemonService: PokemonService) {}

  openDetail(f: any) {
    this.pokemonService.openDetail(f);
  }

  removeFavoriteFromSelected() {
    this.pokemonService.removeFavorite(this.pokemonService.selected);
  }
}
