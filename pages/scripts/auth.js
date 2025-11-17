// Feito por Leonardo

import { apiPost } from './api.js';

export async function login(email, senha) {
    return apiPost(`/auth/login`, { email, senha });
}

export async function register(nome, email, senha, telefone) {
    return apiPost(`/auth/register`, { nome, email, senha, telefone });
}
