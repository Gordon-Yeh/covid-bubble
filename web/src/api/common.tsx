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

export const API_ADDR:string = `${window.location.origin}/${process.env.NODE_ENV}`;
