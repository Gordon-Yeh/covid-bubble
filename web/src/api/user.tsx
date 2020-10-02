import { API_ADDR, checkStatus } from './common';

interface SignupForm {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
}

interface SignupResponse {
  user: object;
}

interface LoginResponse {
  bubble: object;
  user: object;
}

export async function signup(form:SignupForm) : Promise<SignupResponse> {
  return fetch(`${API_ADDR}/user/signup`, {
        method: 'POST',
        body: JSON.stringify(form),
        credentials: 'same-origin'
      })
    .then(checkStatus);
}

export async function login(email, password) : Promise<LoginResponse> {
  let body = { email, password };

  return fetch(`${API_ADDR}/user/login`, {
        method: 'POST',
        body: JSON.stringify(body),
        credentials: 'same-origin'
      })
    .then(checkStatus);
}