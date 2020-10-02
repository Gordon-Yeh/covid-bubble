const API_ADDR:string = `${window.location.origin}/${process.env.NODE_ENV}`;

export interface SignupForm {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
}

export interface SignupResponse {
  
}

export async function checkStatus(res:Response) {
  if (res.status >= 200 && res.status < 300) {
    return res.json();
  } else {
    return res
      .json()
      .then((body) => {
        console.log('res.body', body);
        throw new Error(body.message);
      });
  }
}

function saveSession(token:string) {
  // store session token in cookie
}

export async function signup(form:SignupForm) {
  return fetch(`${API_ADDR}/user/signup`, {
        method: 'POST',
        body: JSON.stringify(form),
        credentials: 'same-origin'
      })
    .then(checkStatus);
}

export async function login(email, password) {
  let body = { email, password };

  return fetch(`${API_ADDR}/user/login`, {
        method: 'POST',
        body: JSON.stringify(body),
        credentials: 'same-origin'
      })
    .then(checkStatus);
}