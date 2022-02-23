import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './components/fragments/footer/footer.component';
import { NavbarComponent } from './components/fragments/navbar/navbar.component';
import { WelcomePageComponent } from './components/pages/welcome-page/welcome-page.component';
import { SignupPageComponent } from './components/pages/signup-page/signup-page.component';
import { SigninPageComponent } from './components/pages/signin-page/signin-page.component';
import { VerifyEmailPageComponent } from './components/pages/verify-email-page/verify-email-page.component';
import { PasswordResetPageComponent } from './components/pages/password-reset-page/password-reset-page.component';
import { AboutPageComponent } from './components/pages/about-page/about-page.component';
import { ContactPageComponent } from './components/pages/contact-page/contact-page.component';
import { UserContainerPageComponent } from './components/pages/user-container-page/user-container-page.component';
import { UserHomePageComponent } from './components/pages/user-container-page/user-home-page/user-home-page.component';
import { UserSettingsPageComponent } from './components/pages/user-container-page/user-settings-page/user-settings-page.component';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { flatMap, take, map, catchError } from 'rxjs/operators';
import { TimeAgoPipe } from './pipes/time-ago.pipe';
import { ClientService } from './services/client.service';
import { GoogleMapsService } from './services/google-maps.service';
import { UsersService } from './services/users.service';
import { environment } from 'src/environments/environment';
import { AlertsBoxComponent } from './components/fragments/alerts-box/alerts-box.component';
import { AlertComponent } from './components/fragments/alert/alert.component';
import { UserCardComponent } from './components/fragments/user-card/user-card.component';
import { UserFullNamePipe } from './pipes/user-full-name.pipe';
import { FindUsersPageComponent } from './components/pages/find-users-page/find-users-page.component';
import { BrowseUsersPageComponent } from './components/pages/browse-users-page/browse-users-page.component';
import { UserPulsesPageComponent } from './components/pages/user-container-page/user-pulses-page/user-pulses-page.component';
import { UserTrackingsPageComponent } from './components/pages/user-container-page/user-trackings-page/user-trackings-page.component';
import { UserCheckpointsPageComponent } from './components/pages/user-container-page/user-checkpoints-page/user-checkpoints-page.component';
import { UserWatchesPageComponent } from './components/pages/user-container-page/user-watches-page/user-watches-page.component';
import { UserNotificationsPageComponent } from './components/pages/user-container-page/user-notifications-page/user-notifications-page.component';
import { UserMessagesPageComponent } from './components/pages/user-container-page/user-messages-page/user-messages-page.component';
import { UserConversationsPageComponent } from './components/pages/user-container-page/user-conversations-page/user-conversations-page.component';
import { FindPageComponent } from './components/pages/find-page/find-page.component';
import { BrowsePageComponent } from './components/pages/browse-page/browse-page.component';
import { FindConversationsPageComponent } from './components/pages/find-conversations-page/find-conversations-page.component';
import { BrowseConversationsPageComponent } from './components/pages/browse-conversations-page/browse-conversations-page.component';
import { BrowsePulsesPageComponent } from './components/pages/browse-pulses-page/browse-pulses-page.component';
import { BrowseCheckpointsPageComponent } from './components/pages/browse-checkpoints-page/browse-checkpoints-page.component';
import { FindWatchesPageComponent } from './components/pages/find-watches-page/find-watches-page.component';
import { BrowseWatchesPageComponent } from './components/pages/browse-watches-page/browse-watches-page.component';
import { UserInfoComponent } from './components/fragments/user-info/user-info.component';
import { PulseCardComponent } from './components/fragments/pulse-card/pulse-card.component';
import { WatchCardComponent } from './components/fragments/watch-card/watch-card.component';
import { CheckpointCardComponent } from './components/fragments/checkpoint-card/checkpoint-card.component';
import { ConversationCardComponent } from './components/fragments/conversation-card/conversation-card.component';



function APP_INITIALIZER_FACTORY(
  clientService: ClientService,
  usersService: UsersService,
  googleMapsService: GoogleMapsService,
) {
  function APP_INITIALIZER_FN(
    resolve: (value: unknown) => void,
    reject: (reason?: any) => any
  ) {
    clientService.getXsrfToken()
      .pipe(flatMap((token, index) => {
        // console.log('APP_INITIALIZER (xsrf token) - admit one', clientService);
        return usersService.checkUserSession().pipe(take(1));
      }))
      .pipe(flatMap((user, index) => {
        // console.log('APP_INITIALIZER (user) - admit one', { user });
        return googleMapsService.loadGoogleMaps();
      }))
      .pipe(flatMap((value, index) => {
        // console.log('APP_INITIALIZER (google maps) - admit one', googleMapsService);
        resolve(true);
        return of();
      }))
      .pipe(
        map(() => {
          console.log(`done APP_INITIALIZERS`);
        })
      )
      .pipe(
        catchError((error: any) => {
          console.log(error);
          resolve(false);
          throw error;
        })
      )
      .toPromise();
  }

  function returnFactoryFn() {
    return new Promise(APP_INITIALIZER_FN);
  }

  return returnFactoryFn;
}

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    NavbarComponent,
    WelcomePageComponent,
    SignupPageComponent,
    SigninPageComponent,
    VerifyEmailPageComponent,
    PasswordResetPageComponent,
    AboutPageComponent,
    ContactPageComponent,
    UserContainerPageComponent,
    UserHomePageComponent,
    UserSettingsPageComponent,
    TimeAgoPipe,
    UserFullNamePipe,
    AlertsBoxComponent,
    AlertComponent,
    UserCardComponent,
    FindUsersPageComponent,
    BrowseUsersPageComponent,
    UserPulsesPageComponent,
    UserTrackingsPageComponent,
    UserCheckpointsPageComponent,
    UserWatchesPageComponent,
    UserNotificationsPageComponent,
    UserMessagesPageComponent,
    UserConversationsPageComponent,
    FindPageComponent,
    BrowsePageComponent,
    FindConversationsPageComponent,
    BrowseConversationsPageComponent,
    BrowsePulsesPageComponent,
    BrowseCheckpointsPageComponent,
    FindWatchesPageComponent,
    BrowseWatchesPageComponent,
    UserInfoComponent,
    PulseCardComponent,
    WatchCardComponent,
    CheckpointCardComponent,
    ConversationCardComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    TimeAgoPipe,
    UserFullNamePipe,
    DatePipe,
    
    {
      provide: 'environment',
      useValue: environment
    },
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [
        ClientService,
        UsersService,
        GoogleMapsService,
      ],
      useFactory: APP_INITIALIZER_FACTORY
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
