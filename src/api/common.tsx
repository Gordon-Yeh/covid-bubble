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

export const CORS_HEADER = {
  'Origin': window.location.origin
};

export const API_ADDR:string = process.env.NODE_ENV === 'production' &&  process.env.REACT_APP_API_ENDPOINT ?
      process.env.REACT_APP_API_ENDPOINT : `${window.location.origin}/${process.env.NODE_ENV}`;
