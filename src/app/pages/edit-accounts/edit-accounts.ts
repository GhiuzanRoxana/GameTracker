import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-edit-accounts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-accounts.html',
  styleUrls: ['../login/login.css']
})
export class EditAccountsComponent {

  xbox = '';
  playstation = '';
  steam = '';

  constructor(private auth: AuthService, private router: Router) {
    const user = this.auth.getUser();
    if (user?.accounts) {
      this.xbox = user.accounts.xbox || '';
      this.playstation = user.accounts.playstation || '';
      this.steam = user.accounts.steam || '';
    }
  }

  save(): void {
    this.auth.updateAccounts({
      xbox: this.xbox,
      playstation: this.playstation,
      steam: this.steam
    });

    this.router.navigate(['/user']);
  }

  cancel(): void {
    this.router.navigate(['/user']);
  }
}
