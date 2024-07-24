export const environment = {
    production: false,
    backend: 'http://localhost:3000/v1',
    jwt: {
        allowedDomains: ['localhost:3000'],
        disallowedRoutes: ['localhost:3000/v1/auth/login']
    }
};
