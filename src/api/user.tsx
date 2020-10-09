import { API_ADDR, checkStatus, CORS_HEADER } from './common';

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
  console.log('CORS_HEADER', CORS_HEADER);

  return fetch(`${API_ADDR}/user/signup`, {
        method: 'POST',
        headers: CORS_HEADER,
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify(form),
      })
    .then(checkStatus);
}

export async function login(email, password) : Promise<LoginResponse> {
  let body = { email, password };
  console.log('CORS_HEADER', CORS_HEADER);

  return fetch(`${API_ADDR}/user/login`, {
        method: 'POST',
        headers: CORS_HEADER,
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify(body),
      })
    .then(checkStatus);
}