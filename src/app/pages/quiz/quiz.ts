import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { GameService } from '../../services/game.service';
import { Game } from '../../models/game.model';

interface QuizAnswers {
    platforms: string[];
    includeGenres: string[];
    excludeGenres: string[];
    minMetacritic: number;
    minYear: number;
    maxYear: number;
    minHours: number;
    maxHours: number;
}

interface ScoredGame {
    game: Game;
    score: number;
    reasons: string[];
    playtime?: number;
}

@Component({
    selector: 'app-quiz',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: './quiz.html',
    styleUrls: ['./quiz.css']
})
export class QuizComponent implements OnInit {
    step = 0;
    loading = false;

    currentYear = new Date().getFullYear();
    totalSteps = 6;     // 6 întrebări
    resultsStep = 6;    // step index pentru rezultate

    platformOptions = ['PC', 'PlayStation', 'Xbox', 'Nintendo', 'Linux', 'macOS'];

    answers: QuizAnswers = {
        platforms: [],
        includeGenres: [],
        excludeGenres: [],
        minMetacritic: 0,
        minYear: 2000,
        maxYear: this.currentYear,
        minHours: 1,
        maxHours: 40
    };

    games: Game[] = [];
    allGenres: string[] = [];
    results: ScoredGame[] = [];

    constructor(private gameService: GameService) { }

    ngOnInit(): void {
        this.loading = true;
        this.gameService.getGames(1, 80).subscribe({
            next: res => {
                this.games = res.results ?? [];
                this.allGenres = [...new Set(this.games.flatMap(g => g.genres?.map(x => x.name) ?? []))].sort();
                this.loading = false;
            },
            error: () => (this.loading = false)
        });
    }

    // ---------- UI helpers ----------
    toggle(arr: string[], value: string) {
        const i = arr.indexOf(value);
        i >= 0 ? arr.splice(i, 1) : arr.push(value);
    }

    next() { this.step++; }
    back() { this.step--; }

    restart() {
        this.step = 0;
        this.results = [];
        this.answers = {
            platforms: [],
            includeGenres: [],
            excludeGenres: [],
            minMetacritic: 0,
            minYear: 2000,
            maxYear: this.currentYear,
            minHours: 1,
            maxHours: 40
        };
    }

    fixYearRange() {
        if (this.answers.minYear > this.answers.maxYear) {
            const t = this.answers.minYear;
            this.answers.minYear = this.answers.maxYear;
            this.answers.maxYear = t;
        }
    }

    fixHoursRange() {
        if (this.answers.minHours > this.answers.maxHours) {
            const t = this.answers.minHours;
            this.answers.minHours = this.answers.maxHours;
            this.answers.maxHours = t;
        }
    }

    // ---------- core ----------
    runQuiz() {
        this.fixYearRange();
        this.fixHoursRange();

        // pre-filter ca să nu facem request-uri inutil
        const preFiltered = this.games.filter(g => {
            // metacritic filter (strict)
            if (this.answers.minMetacritic > 0) {
                if (typeof g.metacritic !== 'number') return false;
                if (g.metacritic < this.answers.minMetacritic) return false;
            }

            // year filter
            if (g.released) {
                const y = +g.released.slice(0, 4);
                if (y < this.answers.minYear || y > this.answers.maxYear) return false;
            } else {
                // dacă nu știm anul, îl scoatem (ca să fie consistent)
                return false;
            }

            // exclude genres strict
            const genres = (g.genres ?? []).map(x => x.name);
            if (this.answers.excludeGenres.length > 0) {
                const bad = this.answers.excludeGenres.some(ex => genres.includes(ex));
                if (bad) return false;
            }

            return true;
        });

        // scorăm și luăm top N
        const scoredTop = preFiltered
            .map(g => this.scoreGame(g))
            .filter(x => x.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 25);

        this.loading = true;

        // luăm playtime doar pentru top, apoi filtrăm pe min/max hours
        Promise.all(
            scoredTop.map(s =>
                this.gameService.getGameDetails(s.game.id).toPromise()
                    .then(d => ({ ...s, playtime: d?.playtime ?? 0 }))
            )
        ).then(list => {
            this.results = list
                .filter(x => (x.playtime ?? 0) >= this.answers.minHours && (x.playtime ?? 0) <= this.answers.maxHours)
                .slice(0, 12);

            this.loading = false;
            this.step = this.resultsStep;
        });
    }

    surpriseMe() {
        if (!this.results.length) return;
        const r = this.results[Math.floor(Math.random() * this.results.length)];
        window.location.href = `/game/${r.game.id}`;
    }

    private scoreGame(g: Game): ScoredGame {
        let score = 0;
        const reasons: string[] = [];

        // platform match
        if (this.answers.platforms.length > 0) {
            const platforms = (g.parent_platforms ?? []).map(p => p.platform.name);
            const pm = this.answers.platforms.filter(p => platforms.includes(p));
            if (pm.length) {
                score += 6;
                reasons.push(`Platform: ${pm.join(', ')}`);
            } else {
                score -= 4;
            }
        }

        // include genres (bonus)
        if (this.answers.includeGenres.length > 0) {
            const genres = (g.genres ?? []).map(x => x.name);
            const gm = this.answers.includeGenres.filter(x => genres.includes(x));
            if (gm.length) {
                score += gm.length * 5;
                reasons.push(`Genres: ${gm.join(', ')}`);
            } else {
                score -= 2;
            }
        }

        // metacritic reason
        if (this.answers.minMetacritic > 0) {
            reasons.push(`Metacritic ≥ ${this.answers.minMetacritic}`);
            score += 2;
        }

        // year reason
        if (g.released) {
            const y = +g.released.slice(0, 4);
            reasons.push(`Year: ${y}`);
            score += 1;
        }

        return { game: g, score, reasons };
    }
}
