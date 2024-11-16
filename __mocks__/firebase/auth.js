export const signInWithEmailAndPassword = jest.fn((auth, email, password) => {
    if (email === "valid@test.com" && password === "password123") {
        return Promise.resolve({
            user: {
                email,
                uid: 'test-uid-123',
                emailVerified: true,
                displayName: 'Test User',
                metadata: {
                    creationTime: '2024-01-01T00:00:00Z',
                    lastSignInTime: '2024-01-01T00:00:00Z'
                },
                // Métodos comuns que você pode precisar nos testes
                getIdToken: jest.fn().mockResolvedValue('mock-token-123'),
                reload: jest.fn().mockResolvedValue(null)
            },
            operationType: 'signIn',
            providerId: 'password'
        });
    } else {
        // Simula os códigos de erro reais do Firebase
        const error = new Error('auth/invalid-credentials');
        error.code = 'auth/invalid-credentials';
        error.message = 'Email ou senha inválidos.';
        return Promise.reject(error);
    }
});

// Outros mocks úteis que você pode precisar
export const signOut = jest.fn(() => Promise.resolve());

export const onAuthStateChanged = jest.fn((auth, callback) => {
    // Simula o callback inicial com usuário nulo
    callback(null);

    // Retorna uma função de cleanup
    return jest.fn();
});

export const getAuth = jest.fn(() => ({
    currentUser: null,
    // Outros métodos e propriedades que você precisar
}));