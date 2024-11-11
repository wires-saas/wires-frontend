export const environment = {
    production: true,
    backend: 'https://api.dev.wires.fr/v1',
    documentation: 'https://api.dev.wires.fr/docs',
    jwt: {
        allowedDomains: ['api.dev.wires.fr'],
        disallowedRoutes: ['https://api.dev.wires.fr/v1/auth/login'],
    },
    paymentLinks: {
        guest: {
            basic: 'https://buy.stripe.com/test_aEU8Ah2lVcmDekMfYY',
            extended: 'https://buy.stripe.com/test_eVa03Ld0z9ara4waEF',
            custom: 'https://buy.stripe.com/test_3cs17P4u3gCTb8A4gi',
        },
        user: {
            basic: 'https://buy.stripe.com/test_00g03Lf8H0DV4Kc9AD',
            extended: 'https://buy.stripe.com/test_eVa4k1bWvgCT6SkdQU',
            custom: 'https://buy.stripe.com/test_9AQ2bT3pZ2M3foQbIN',
        },
    },
    billingPortal: 'https://billing.stripe.com/p/login/test_8wMbMJ3MKfEa2kM7ss',
};
