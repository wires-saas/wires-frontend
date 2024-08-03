import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AutologinGuard } from '../../guards/autologin.guard';
import { CanAcceptInviteGuard } from '../../guards/can-accept-invite.guard';
import { CanResetPasswordGuard } from '../../guards/can-reset-password.guard';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'error', loadChildren: () => import('./error/error.module').then(m => m.ErrorModule) },
        { path: 'unauthorized', loadChildren: () => import('./accessdenied/accessdenied.module').then(m => m.AccessdeniedModule) },
        { path: 'login', canActivate: [AutologinGuard], loadChildren: () => import('./login/login.module').then(m => m.LoginModule) },

        // PASSWORD RESET

        { path: 'request-password-reset', canActivate: [AutologinGuard], loadChildren: () => import('./request-password-reset/request-password-reset.module').then(m => m.RequestPasswordResetModule) },

        {
            path: 'reset-password/expired-token',
            data: { title: 'Expired', message: 'Token allowing password reset is expired, please request a new one', button: 'Go to Log In' },
            loadChildren: () => import('./error/error.module').then(m => m.ErrorModule)
        },
        {
            path: 'reset-password/invalid-token',
            data: { title: 'Invalid Token', message: 'This token has already been used or never existed', button: 'Go to Log In' },
            loadChildren: () => import('./error/error.module').then(m => m.ErrorModule)
        },

        { path: 'reset-password', data: { welcomeNewUser: false }, canActivate: [CanResetPasswordGuard], loadChildren: () => import('./reset-password/reset-password.module').then(m => m.ResetPasswordModule) },



        // INVITATION

        {
            path: 'accept-invite/expired-token',
            data: { title: 'Expired Invite', message: 'It looks like this invitation expired, please ask your administrator for a new one', button: 'Go to Log In' },
            loadChildren: () => import('./error/error.module').then(m => m.ErrorModule)
        },
        {
            path: 'accept-invite/invalid-token',
            data: { title: 'Invalid Invite', message: 'Please retry clicking email link, if the problem persists you shall ask your administrator for a new invite', button: 'Go to Log In' },
            loadChildren: () => import('./error/error.module').then(m => m.ErrorModule)
        },
        {
            path: 'accept-invite/already-used-token',
            data: { title: 'Already Accepted', message: 'Your invite has already been accepted. Try requesting a password reset ?', button: 'Go to Log In' },
            loadChildren: () => import('./error/error.module').then(m => m.ErrorModule)
        },

        { path: 'accept-invite', data: { welcomeNewUser: true }, canActivate: [CanAcceptInviteGuard], loadChildren: () => import('./reset-password/reset-password.module').then(m => m.ResetPasswordModule) },




        // 2FA - not implemented yet

        { path: 'verification', canActivate: [AutologinGuard], loadChildren: () => import('./verification/verification.module').then(m => m.VerificationModule) },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule],
    providers: [AutologinGuard, CanAcceptInviteGuard, CanResetPasswordGuard]
})
export class AuthRoutingModule { }
