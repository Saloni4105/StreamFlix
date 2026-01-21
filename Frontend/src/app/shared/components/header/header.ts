import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { filter, Subscription } from 'rxjs';
import { AuthService } from '../../shared/services/auth-service';
import { DialogService } from '../../shared/services/dialog-service';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() showRouterOutlet: boolean = true;

  currentuser: any = null;
  isAdminMode: boolean = false;
  isAdminUser: boolean = false;   

  private routerSubscription: Subscription | null = null;

  constructor(
    private authService: AuthService,
    private dialogService: DialogService,
    private router: Router
  ) {}

  ngOnInit(): void {
    
    this.authService.currentUser$.subscribe(user => {
      this.currentuser = user;
      this.isAdminUser = user?.role === 'ROLE_ADMIN'; 
    });

    this.updateMode();

    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateMode();
      });
  }

  private updateMode(): void {
    this.isAdminMode = this.router.url.startsWith('/admin');
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  
  isAdmin(): boolean {
    return this.isAdminUser;
  }

  switchMode(): void {
    if (!this.isAdminUser) return; 

    if (this.isAdminMode) {
      this.router.navigate(['/home']);
    } else {
      this.router.navigate(['/admin']);
    }
  }

  openChangePasswordDialog(): void {
    this.dialogService.openChangePasswordDialog();
  }

  logout(): void {
    this.dialogService
      .openConfirmation(
        'Logout?',
        'Are you sure want to logout from your account',
        'Logout',
        'Cancel',
        'warning'
      )
      .subscribe(result => {
        if (result) {
          this.authService.logout();
        }
      });
  }
}
