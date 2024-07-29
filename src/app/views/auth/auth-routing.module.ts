import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AutologinGuard } from '../../guards/autologin.guard';
import { CanAcceptInviteGuard } from '../../guards/can-accept-invite.guard';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'error', loadChildren: () => import('./error/error.module').then(m => m.ErrorModule) },
        { path: 'unauthorized', loadChildren: () => import('./accessdenied/accessdenied.module').then(m => m.AccessdeniedModule) },
        { path: 'login', canActivate: [AutologinGuard], loadChildren: () => import('./login/login.module').then(m => m.LoginModule) },
        { path: 'forgotpassword', canActivate: [AutologinGuard], loadChildren: () => import('./forgotpassword/forgotpassword.module').then(m => m.ForgotPasswordModule) },
        { path: 'newpassword', canActivate: [AutologinGuard], loadChildren: () => import('./newpassword/newpassword.module').then(m => m.NewPasswordModule) },
        { path: 'accept-invite', data: { welcomeNewUser: true }, canActivate: [CanAcceptInviteGuard], loadChildren: () => import('./newpassword/newpassword.module').then(m => m.NewPasswordModule) },
        { path: 'expired-token', loadChildren: () => import('./tokens/expired-token/expired-token.module').then(m => m.ExpiredTokenModule) },
        { path: 'invalid-token', data: { title: 'Invalid Token', description: '---' }, loadChildren: () => import('./tokens/invalid-token/invalid-token.module').then(m => m.InvalidTokenModule) },
        { path: 'verification', canActivate: [AutologinGuard], loadChildren: () => import('./verification/verification.module').then(m => m.VerificationModule) },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule],
    providers: [AutologinGuard, CanAcceptInviteGuard]
})
export class AuthRoutingModule { }
