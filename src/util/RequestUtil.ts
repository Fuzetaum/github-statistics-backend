import axios from 'axios';

export const get = (url: string): any => {
  console.log(`[INFO] sending request: GET ${url}`);
  return axios.get(url, {
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_API_TOKEN}`,
    }
  })
    .then(response => response)
    .catch(error => {
      console.error(`[ERROR] GET request failed: ${error}`);
    });
}

export const post = (url: string, body: object): any => {
  console.log(`[INFO] sending request: POST ${url}`);
  return axios.post(url, body, {
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_API_TOKEN}`,
    }
  })
    .then(response => response)
    .catch(error => {
      console.error(`[ERROR] POST request failed: ${error}`);
    });
}