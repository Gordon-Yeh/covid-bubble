import { API_ADDR, checkStatus } from './common';

interface AddNodeResponse {
  bubble: object;
}

export async function addNode(name:string, username:string) : Promise<AddNodeResponse> {
  let node = { name };
  if (username)
    node['linkedUsername'] = username;

  return fetch(`${API_ADDR}/user/connections`, {
      method: 'POST',
      body: JSON.stringify([ node ]),
      credentials: 'same-origin'
    })
    .then(checkStatus);
}