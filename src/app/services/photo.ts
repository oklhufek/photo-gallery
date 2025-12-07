import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface PokemonListItem {
  name: string;
  url: string;
  id?: number;
  image?: string;
}

export interface PokemonDetail {
  id: number;
  name: string;
  sprites: { front_default: string | null };
  types: { type: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
}

@Injectable({ providedIn: 'root' })
export class PokemonService {
  apiUrl = 'https://pokeapi.co/api/v2/pokemon';
  limit = 20;

  pokemon: PokemonListItem[] = [];
  filtered: PokemonListItem[] = [];
  selected?: PokemonDetail | null;
  loadingList = false;
  loadingDetail = false;
  nextUrl: string | null = null;
  prevUrl: string | null = null;

  constructor(private http: HttpClient) {}

  initFirstPage() {
    if (this.pokemon.length) return;
    this.loadPage(`${this.apiUrl}?limit=${this.limit}&offset=0`);
  }

  loadPage(url: string) {
    this.loadingList = true;
    this.selected = null;
    this.http.get<any>(url).subscribe({
      next: (res) => {
        this.nextUrl = res.next;
        this.prevUrl = res.previous;
        this.pokemon = res.results.map((p: any) => {
          const id = this.extractId(p.url);
          return {
            ...p,
            id,
            image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
          };
        });
        this.filtered = this.pokemon;
        this.loadingList = false;
      },
      error: () => (this.loadingList = false),
    });
  }

  private extractId(url: string): number {
    const parts = url.split('/').filter(Boolean);
    return +parts[parts.length - 1];
  }

  search(term: string) {
    const q = term.toLowerCase().trim();
    this.filtered = !q
      ? this.pokemon
      : this.pokemon.filter((p) => p.name.toLowerCase().includes(q));
  }

  openDetail(p: PokemonListItem) {
    if (!p.id) return;
    this.loadingDetail = true;
    this.selected = null;
    this.http.get<PokemonDetail>(`${this.apiUrl}/${p.id}`).subscribe({
      next: (res) => {
        this.selected = res;
        this.loadingDetail = false;
      },
      error: () => (this.loadingDetail = false),
    });
  }

  clearDetail() {
    this.selected = null;
  }

  nextPage() {
    if (this.nextUrl) this.loadPage(this.nextUrl);
  }

  prevPage() {
    if (this.prevUrl) this.loadPage(this.prevUrl);
  }
}

export interface UserPhoto {
  filepath: string;
  webviewPath?: string;
}