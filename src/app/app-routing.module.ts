import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutPageComponent } from './components/pages/about-page/about-page.component';
import { BrowseCheckpointsPageComponent } from './components/pages/browse-checkpoints-page/browse-checkpoints-page.component';
import { BrowseConversationsPageComponent } from './components/pages/browse-conversations-page/browse-conversations-page.component';
import { BrowsePageComponent } from './components/pages/browse-page/browse-page.component';
import { BrowsePulsesPageComponent } from './components/pages/browse-pulses-page/browse-pulses-page.component';
import { BrowseUsersPageComponent } from './components/pages/browse-users-page/browse-users-page.component';
import { BrowseWatchesPageComponent } from './components/pages/browse-watches-page/browse-watches-page.component';
import { ContactPageComponent } from './components/pages/contact-page/contact-page.component';
import { FindConversationsPageComponent } from './components/pages/find-conversations-page/find-conversations-page.component';
import { FindPageComponent } from './components/pages/find-page/find-page.component';
import { FindUsersPageComponent } from './components/pages/find-users-page/find-users-page.component';
import { FindWatchesPageComponent } from './components/pages/find-watches-page/find-watches-page.component';
import { PasswordResetPageComponent } from './components/pages/password-reset-page/password-reset-page.component';
import { SigninPageComponent } from './components/pages/signin-page/signin-page.component';
import { SignupPageComponent } from './components/pages/signup-page/signup-page.component';
import { UserCheckpointsPageComponent } from './components/pages/user-container-page/user-checkpoints-page/user-checkpoints-page.component';
import { UserContainerPageComponent } from './components/pages/user-container-page/user-container-page.component';
import { UserConversationsPageComponent } from './components/pages/user-container-page/user-conversations-page/user-conversations-page.component';
import { UserHomePageComponent } from './components/pages/user-container-page/user-home-page/user-home-page.component';
import { UserMessagesPageComponent } from './components/pages/user-container-page/user-messages-page/user-messages-page.component';
import { UserNotificationsPageComponent } from './components/pages/user-container-page/user-notifications-page/user-notifications-page.component';
import { UserPulsesPageComponent } from './components/pages/user-container-page/user-pulses-page/user-pulses-page.component';
import { UserSettingsPageComponent } from './components/pages/user-container-page/user-settings-page/user-settings-page.component';
import { UserTrackingsPageComponent } from './components/pages/user-container-page/user-trackings-page/user-trackings-page.component';
import { UserWatchesPageComponent } from './components/pages/user-container-page/user-watches-page/user-watches-page.component';
import { VerifyEmailPageComponent } from './components/pages/verify-email-page/verify-email-page.component';
import { WelcomePageComponent } from './components/pages/welcome-page/welcome-page.component';
import { UserAuthGuard } from './guards/auth.guard';
import { SignedInGuard } from './guards/signed-in.guard';
import { SignedOutGuard } from './guards/signed-out.guard';



const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: WelcomePageComponent,
    canActivate: [SignedOutGuard],
  },
  {
    path: 'about',
    pathMatch: 'full',
    component: AboutPageComponent
  },
  {
    path: 'contact',
    pathMatch: 'full',
    component: ContactPageComponent
  },
  {
    path: 'verify-email/:verify_code',
    pathMatch: 'full',
    component: VerifyEmailPageComponent,
  },
  {
    path: 'password-reset',
    pathMatch: 'full',
    component: PasswordResetPageComponent,
    canActivate: [SignedOutGuard],
    data: {
      canActivateErrorMessage: `You are already signed in. Use the reset password form.`,
    },
  },{
    path: 'signup',
    pathMatch: 'full',
    component: SignupPageComponent,
    canActivate: [SignedOutGuard],
    data: {
      canActivateErrorMessage: `You are already signed in.`,
    },
  },
  {
    path: 'signin',
    pathMatch: 'full',
    component: SigninPageComponent,
    canActivate: [SignedOutGuard],
    data: {
      canActivateErrorMessage: `You are already signed in.`,
    },
  },

  {
    path: 'users/:user_id',
    data: {
      authParamsProp: 'user_id',
      canActivateErrorMessage: `You do not have permission to access this page.`,
      canActivateErrorRedirect: ['/'],
    },
    component: UserContainerPageComponent,
    canActivateChild: [UserAuthGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: UserHomePageComponent,
        data: {
          authParamsProp: 'user_id',
          canActivateErrorMessage: `You do not have permission to access this page.`,
          canActivateErrorRedirect: ['/'],
        },
      },
      {
        path: 'settings',
        component: UserSettingsPageComponent,
        data: {
          authParamsProp: 'user_id',
          canActivateErrorMessage: `You do not have permission to access this page.`,
          canActivateErrorRedirect: ['/'],
        },
      },

      {
        path: 'messages',
        component: UserMessagesPageComponent,
        data: {
          authParamsProp: 'user_id',
          canActivateErrorMessage: `You do not have permission to access this page.`,
          canActivateErrorRedirect: ['/'],
        },
      },
      {
        path: 'conversations',
        component: UserConversationsPageComponent,
        data: {
          authParamsProp: 'user_id',
          canActivateErrorMessage: `You do not have permission to access this page.`,
          canActivateErrorRedirect: ['/'],
        },
      },
      {
        path: 'notifications',
        component: UserNotificationsPageComponent,
        data: {
          authParamsProp: 'user_id',
          canActivateErrorMessage: `You do not have permission to access this page.`,
          canActivateErrorRedirect: ['/'],
        },
      },

      {
        path: 'pulses',
        component: UserPulsesPageComponent,
        data: {
          authParamsProp: 'user_id',
          canActivateErrorMessage: `You do not have permission to access this page.`,
          canActivateErrorRedirect: ['/'],
        },
      },
      {
        path: 'watches',
        component: UserWatchesPageComponent,
        data: {
          authParamsProp: 'user_id',
          canActivateErrorMessage: `You do not have permission to access this page.`,
          canActivateErrorRedirect: ['/'],
        },
      },
      {
        path: 'trackings',
        component: UserTrackingsPageComponent,
        data: {
          authParamsProp: 'user_id',
          canActivateErrorMessage: `You do not have permission to access this page.`,
          canActivateErrorRedirect: ['/'],
        },
      },
      {
        path: 'checkpoints',
        component: UserCheckpointsPageComponent,
        data: {
          authParamsProp: 'user_id',
          canActivateErrorMessage: `You do not have permission to access this page.`,
          canActivateErrorRedirect: ['/'],
        },
      },
    ]
  },

  {
    path: 'find',
    component: FindPageComponent,
    canActivateChild: [SignedInGuard],
    children: [
      {
        path: 'users',
        pathMatch: 'full',
        component: FindUsersPageComponent,
      },
      // {
      //   path: 'conversations',
      //   pathMatch: 'full',
      //   component: FindConversationsPageComponent,
      // },
      // {
      //   path: 'watches',
      //   pathMatch: 'full',
      //   component: FindWatchesPageComponent,
      // },
    ]
  },

  {
    path: 'browse',
    component: BrowsePageComponent,
    canActivateChild: [SignedInGuard],
    children: [
      {
        path: 'users',
        pathMatch: 'full',
        component: BrowseUsersPageComponent,
      },
      // {
      //   path: 'conversations',
      //   pathMatch: 'full',
      //   component: BrowseConversationsPageComponent,
      // },
      // {
      //   path: 'watches',
      //   pathMatch: 'full',
      //   component: BrowseWatchesPageComponent,
      // },
      {
        path: 'pulses',
        pathMatch: 'full',
        component: BrowsePulsesPageComponent,
      },
      {
        path: 'checkpoints',
        pathMatch: 'full',
        component: BrowseCheckpointsPageComponent,
      },
    ]
  },




  /**
   * Unknown/Invalid Route Redirect
   */
   {
    path: '**',
    redirectTo: '',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
