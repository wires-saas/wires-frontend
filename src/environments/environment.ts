import {PlanType} from "../app/services/organization.service";

export const environment = {
    production: false,
    backend: 'http://localhost:3000/v1',
    documentation: 'http://localhost:3000/docs',
    jwt: {
        allowedDomains: ['localhost:3000'],
        disallowedRoutes: ['localhost:3000/v1/auth/login'],
    },
    paymentLinks: {
        basic: 'https://buy.stripe.com/test_aEU8Ah2lVcmDekMfYY',
        extended: 'https://buy.stripe.com/test_eVa03Ld0z9ara4waEF',
        custom: 'https://buy.stripe.com/test_3cs17P4u3gCTb8A4gi',
    },
    billingPortal: 'https://billing.stripe.com/p/login/test_8wMbMJ3MKfEa2kM7ss',
};
