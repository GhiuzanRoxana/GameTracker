import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { GameService } from '../../services/game.service';
import { GameCardComponent } from '../../components/game-card/game-card';
import { Game } from '../../models/game.model';

@Component({
  selector: 'app-browse',
  standalone: true,
  imports: [CommonModule, FormsModule, GameCardComponent],
  templateUrl: './browse.html',
  styleUrl: './browse.css'
})
export class BrowseComponent implements OnInit {
  allGames: Game[] = [];
  games: Game[] = [];

  loading = true;
  loadingMore = false;
  errorMessage: string | null = null;

  currentPage = 1;
  pageSize = 20;

  searchTerm = '';
  selectedPlatform = 'all';
  selectedYear = 'all';

  platformOptions = [
    { value: 'all', label: 'All platforms' },
    { value: 'PC', label: 'PC' },
    { value: 'PlayStation', label: 'PlayStation' },
    { value: 'Xbox', label: 'Xbox' },
    { value: 'Nintendo', label: 'Nintendo' }
  ];

  yearOptions: string[] = [];

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.buildYearOptions();
    this.loadGames();
  }

  buildYearOptions(): void {
    const currentYear = new Date().getFullYear();
    const years: string[] = ['all'];

    for (let year = currentYear; year >= currentYear - 15; year--) {
      years.push(year.toString());
    }

    this.yearOptions = years;
  }

  loadGames(): void {
    this.loading = true;
    this.errorMessage = null;

    this.gameService.getGames(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.allGames = response.results;
        this.applyFilters(false);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading games:', error);
        this.errorMessage = 'Could not load games right now.';
        this.loading = false;
      }
    });
  }

  loadMore(): void {
    this.loadingMore = true;
    this.currentPage++;

    const hasSearch = this.searchTerm.trim().length > 0;
    const term = this.searchTerm.trim();

    const request$ = hasSearch
      ? this.gameService.searchGames(term, this.currentPage, this.pageSize)
      : this.gameService.getGames(this.currentPage, this.pageSize);

    request$.subscribe({
      next: (response) => {
        this.allGames = [...this.allGames, ...response.results];
        this.applyFilters(hasSearch);
        this.loadingMore = false;
      },
      error: (error) => {
        console.error('Error loading more games:', error);
        this.loadingMore = false;
      }
    });
  }

  applyFilters(skipNameFilter: boolean): void {
    let filtered = [...this.allGames];

    if (!skipNameFilter && this.searchTerm && this.searchTerm.trim().length > 0) {
      const term = this.searchTerm.trim().toLowerCase();
      filtered = filtered.filter((game) =>
        game.name.toLowerCase().includes(term)
      );
    }

    if (this.selectedPlatform !== 'all') {
      const platformTerm = this.selectedPlatform.toLowerCase();
      filtered = filtered.filter((game) =>
        game.parent_platforms?.some((p) =>
          p.platform.name.toLowerCase().includes(platformTerm)
        )
      );
    }

    if (this.selectedYear !== 'all') {
      filtered = filtered.filter(
        (game) =>
          game.released &&
          game.released.length >= 4 &&
          game.released.substring(0, 4) === this.selectedYear
      );
    }

    this.games = filtered;
  }

  onFiltersSubmit(): void {
    const term = this.searchTerm.trim();
    const hasSearch = term.length > 0;

    if (hasSearch) {
      this.loading = true;
      this.errorMessage = null;
      this.currentPage = 1;

      this.gameService.searchGames(term, this.currentPage, this.pageSize).subscribe({
        next: (response) => {
          this.allGames = response.results;
          this.applyFilters(true);
          this.loading = false;
        },
        error: (error) => {
          console.error('Error searching games:', error);
          this.errorMessage = 'Could not search games right now.';
          this.loading = false;
        }
      });
    } else {
      this.applyFilters(false);
    }
  }

  onResetFilters(): void {
    this.searchTerm = '';
    this.selectedPlatform = 'all';
    this.selectedYear = 'all';
    this.currentPage = 1;
    this.loadGames();
  }
}
