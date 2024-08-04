export const environment = {
    production: true,
    backend: 'https://api.wires.fr/v1',
    jwt: {
        allowedDomains: ['localhost:3000', 'https://api.wires.fr'],
        disallowedRoutes: ['localhost:3000/v1/auth/login', 'https://api.wires.fr/v1/auth/login']
    }
};
