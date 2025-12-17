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
  allPokemon: PokemonListItem[] = [];
  selected?: PokemonDetail | null;
  compare: PokemonDetail[] = [];
  loadingList = false;
  loadingDetail = false;
  nextUrl: string | null = null;
  prevUrl: string | null = null;

  private allLoaded = false;
  private loadingAll = false;

  favorites: PokemonListItem[] = []; // <- musí existovat

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
    if (!q) {
      this.filtered = this.pokemon;
      return;
    }

    if (this.allLoaded) {
      this.filtered = this.allPokemon.filter((p) =>
        p.name.toLowerCase().includes(q)
      );
      return;
    }

    if (this.loadingAll) {
      this.filtered = this.pokemon.filter((p) =>
        p.name.toLowerCase().includes(q)
      );
      return;
    }

    this.loadingAll = true;
    this.loadingList = true;
    this.http
      .get<any>(`${this.apiUrl}?limit=2000&offset=0`)
      .subscribe({
        next: (res) => {
          this.allPokemon = res.results.map((p: any) => {
            const id = this.extractId(p.url);
            return {
              ...p,
              id,
              image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
            } as PokemonListItem;
          });
          this.allLoaded = true;
          this.filtered = this.allPokemon.filter((p) =>
            p.name.toLowerCase().includes(q)
          );
          this.loadingAll = false;
          this.loadingList = false;
        },
        error: () => {
          this.loadingAll = false;
          this.loadingList = false;
        },
      });
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

  isFavorite(p: { id?: number | null } | null | undefined): boolean {
    if (!p || !p.id) return false;
    return this.favorites.some((f) => f.id === p.id);
  }

  toggleFavoriteFromDetail() {
    if (!this.selected) return;
    const id = this.selected.id;
    const already = this.isFavorite(this.selected);

    if (already) {
      this.favorites = this.favorites.filter((f) => f.id !== id);
      return;
    }

    const fromList = this.pokemon.find((p) => p.id === id);
    this.favorites.push({
      name: this.selected.name,
      url: fromList?.url || `${this.apiUrl}/${id}/`,
      id,
      image:
        fromList?.image ||
        this.selected.sprites.front_default ||
        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
    });
  }

  removeFavorite(p: { id?: number | null } | null | undefined) {
    if (!p || !p.id) return;
    this.favorites = this.favorites.filter((f) => f.id !== p.id);
  }

  addSelectedToCompare() {
    if (!this.selected) return;
    const id = this.selected.id;
    const exists = this.compare.some((c) => c.id === id);
    if (exists) return;

    if (this.compare.length < 2) {
      this.compare = [...this.compare, this.selected];
    } else {
      // pokud jsou už dva, nahradíme prvního novým
      this.compare = [this.compare[1], this.selected];
    }
  }

  removeFromCompare(p: { id?: number | null } | null | undefined) {
    if (!p || !p.id) return;
    this.compare = this.compare.filter((c) => c.id !== p.id);
  }

  isInCompare(p: { id?: number | null } | null | undefined): boolean {
    if (!p || !p.id) return false;
    return this.compare.some((c) => c.id === p.id);
  }
}

export interface UserPhoto {
  filepath: string;
  webviewPath?: string;
}