export const environment = {
    production: true,
    backend: 'https://api.wires.fr/v1',
    jwt: {
        allowedDomains: ['api.wires.fr'],
        disallowedRoutes: ['https://api.wires.fr/v1/auth/login']
    }
};
