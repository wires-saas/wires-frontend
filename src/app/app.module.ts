import { DEFAULT_CURRENCY_CODE, NgModule } from '@angular/core';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppLayoutModule } from './layout/app.layout.module';
import { JwtModule } from '@auth0/angular-jwt';
import { environment } from '../environments/environment';

export function tokenGetter() {
    return localStorage.getItem('access_token');
}

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        AppRoutingModule,
        AppLayoutModule,
        JwtModule.forRoot({
            config: {
                tokenGetter: tokenGetter,
                allowedDomains: [ ...environment.jwt.allowedDomains ],
                disallowedRoutes: [ ...environment.jwt.disallowedRoutes ],
            },
        }),
    ],
    providers: [
        { provide: LocationStrategy, useClass: PathLocationStrategy },
        { provide: DEFAULT_CURRENCY_CODE, useValue: 'EUR' }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
