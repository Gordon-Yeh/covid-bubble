import { API_ADDR, checkStatus, CORS_HEADER } from './common';

interface AddNodeResponse {
  bubble: object;
}

export async function addNode(name:string, username:string) : Promise<AddNodeResponse> {
  let node = { name };
  if (username)
    node['linkedUsername'] = username;

  return fetch(`${API_ADDR}/user/connections`, {
      method: 'POST',
      headers: CORS_HEADER,
      mode: 'cors',
      credentials: 'include',
      body: JSON.stringify([ node ]),
    })
    .then(checkStatus);
}