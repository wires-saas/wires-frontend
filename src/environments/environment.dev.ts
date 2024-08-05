export const environment = {
    production: true,
    backend: 'https://api.dev.wires.fr/v1',
    jwt: {
        allowedDomains: ['api.dev.wires.fr'],
        disallowedRoutes: ['https://api.dev.wires.fr/v1/auth/login']
    }
};
