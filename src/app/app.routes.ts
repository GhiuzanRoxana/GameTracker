import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { BrowseComponent } from './pages/browse/browse';
import { GameDetailComponent } from './pages/game-detail/game-detail';
import { FavoritesComponent } from './pages/favorites/favorites';
import { LoginComponent } from './pages/login/login';
import { UserPageComponent } from './pages/user-page/user-page';
import { RegisterComponent } from './pages/register/register';
import { EditAccountsComponent } from './pages/edit-accounts/edit-accounts';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'browse', component: BrowseComponent },
  { path: 'game/:id', component: GameDetailComponent },
  { path: 'favorites', component: FavoritesComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'user', component: UserPageComponent },
  { path: 'edit-accounts', component: EditAccountsComponent},
  { path: '**', redirectTo: '' }
];
