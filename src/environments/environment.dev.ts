export const environment = {
    production: true,
    backend: 'https://api.dev.wires.fr/v1',
    jwt: {
        allowedDomains: ['localhost:3000', 'api.dev.wires.fr'],
        disallowedRoutes: ['localhost:3000/v1/auth/login', 'https://api.dev.wires.fr/v1/auth/login']
    }
};
