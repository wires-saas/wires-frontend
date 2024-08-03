import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AutologinGuard } from '../../guards/autologin.guard';
import { CanAcceptInviteGuard } from '../../guards/can-accept-invite.guard';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'error', loadChildren: () => import('./error/error.module').then(m => m.ErrorModule) },
        { path: 'unauthorized', loadChildren: () => import('./accessdenied/accessdenied.module').then(m => m.AccessdeniedModule) },
        { path: 'login', canActivate: [AutologinGuard], loadChildren: () => import('./login/login.module').then(m => m.LoginModule) },
        { path: 'request-password-reset', canActivate: [AutologinGuard], loadChildren: () => import('./request-password-reset/request-password-reset.module').then(m => m.RequestPasswordResetModule) },
        { path: 'reset-password', data: { welcomeNewUser: true }, canActivate: [CanAcceptInviteGuard], loadChildren: () => import('./reset-password/reset-password.module').then(m => m.ResetPasswordModule) },

        { path: 'accept-invite', data: { welcomeNewUser: true }, canActivate: [CanAcceptInviteGuard], loadChildren: () => import('./reset-password/reset-password.module').then(m => m.ResetPasswordModule) },
        {
            path: 'expired-token',
            data: { title: 'Expired Invite', message: 'It looks like this invitation reached its expiracy, please ask your administrator for a new one', button: 'Go to Log In' },
            loadChildren: () => import('./error/error.module').then(m => m.ErrorModule)
        },
        {
            path: 'invalid-token',
            data: { title: 'Invalid Invite', message: 'Please retry clicking email link, if the problem persists you shall ask your administrator for a new invite', button: 'Go to Log In' },
            loadChildren: () => import('./error/error.module').then(m => m.ErrorModule)
        },
        {
            path: 'already-used-token',
            data: { title: 'Already Accepted', message: 'Please try to login or request a password reset if you have lost it', button: 'Go to Log In' },
            loadChildren: () => import('./error/error.module').then(m => m.ErrorModule)
        },
        { path: 'verification', canActivate: [AutologinGuard], loadChildren: () => import('./verification/verification.module').then(m => m.VerificationModule) },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule],
    providers: [AutologinGuard, CanAcceptInviteGuard]
})
export class AuthRoutingModule { }
