export const signInWithEmailAndPassword = jest.fn((auth, email, password) => {
    if (email === "valid@test.com" && password === "password123") {
        return Promise.resolve({ user: { email } });
    } else {
        return Promise.reject(new Error("Credenciais inválidas"));
    }
});
