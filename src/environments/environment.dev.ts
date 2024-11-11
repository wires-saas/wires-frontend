export const environment = {
    production: true,
    backend: 'https://api.dev.wires.fr/v1',
    documentation: 'https://api.dev.wires.fr/docs',
    jwt: {
        allowedDomains: ['api.dev.wires.fr'],
        disallowedRoutes: ['https://api.dev.wires.fr/v1/auth/login'],
    },
    paymentLinks: {
        basic: 'https://buy.stripe.com/test_aEU8Ah2lVcmDekMfYY',
        extended: 'https://buy.stripe.com/test_eVa03Ld0z9ara4waEF',
        custom: 'https://buy.stripe.com/test_3cs17P4u3gCTb8A4gi',
    },
    billingPortal: 'https://billing.stripe.com/p/login/test_8wMbMJ3MKfEa2kM7ss',
};
