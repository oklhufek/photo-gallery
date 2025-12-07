import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSearchbar,
  IonList,
  IonItem,
  IonLabel,
  IonAvatar,
  IonImg,
  IonButton,
  IonButtons,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonChip,
  IonGrid,
  IonRow,
  IonCol,
  IonSpinner,
} from '@ionic/angular/standalone';
import { PokemonService } from '../services/photo';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonSearchbar,
    IonList,
    IonItem,
    IonLabel,
    IonAvatar,
    IonImg,
    IonButton,
    IonButtons,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonChip,
    IonGrid,
    IonRow,
    IonCol,
    IonSpinner,
  ],
})
export class Tab2Page {
  constructor(public pokemonService: PokemonService) {}

  ngOnInit() {
    this.pokemonService.initFirstPage();
  }

  searchChanged(ev: any) {
    this.pokemonService.search(ev.detail.value || '');
  }

  openDetail(p: any) {
    this.pokemonService.openDetail(p);
  }

  clearDetail() {
    this.pokemonService.clearDetail();
  }

  nextPage() {
    this.pokemonService.nextPage();
  }

  prevPage() {
    this.pokemonService.prevPage();
  }
}
