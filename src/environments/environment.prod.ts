export const environment = {
    production: true,
    backend: 'https://api.wires.fr/v1',
    documentation: 'https://api.wires.fr/docs',
    jwt: {
        allowedDomains: ['api.wires.fr'],
        disallowedRoutes: ['https://api.wires.fr/v1/auth/login'],
    },
    paymentLinks: {
        basic: '',
        extended: '',
        custom: '',
    },
    billingPortal: '',
};
