import { NgModule, APP_INITIALIZER, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Landing } from './landing/landing';
import { Signup } from './signup/signup';
import { Login } from './login/login';
import { VerifyEmail } from './verify-email/verify-email';
import { Home } from './user/home/home';

import { SharedModule } from './shared/shared/shared-module';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './shared/interceptor/auth-interceptor';
import { AuthService } from './shared/shared/services/auth-service';
import { VideoPlayer } from './shared/components/video-player/video-player';
import { MyFavorites } from './user/my-favorites/my-favorites';

@NgModule({
  declarations: [
    App,
    Landing,
    Signup,
    Login,
    VerifyEmail,
    Home,
    VideoPlayer,
    MyFavorites
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: (authService: AuthService) => () => authService.initializeAuth(),
      deps: [AuthService],
      multi: true
    },
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptors([authInterceptor]))
  ],
  bootstrap: [App]
})
export class AppModule {}
