import { redirectSignIn } from '@/app/router';

const server = process.env['SERVER_BUFFER'] || 'http://localhost:5001/api/v1';
let isRefresh: boolean = false;
let previousResponseData: [string, 'GET' | 'POST' | 'PATCH' | 'DELETE', Buffer];

const customFetchBuffer = async (
  url: string,
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
  body?: Buffer
) => {
  console.log('url: ', url);
  console.log('method: ', method);
  console.log('body: ', body);
  const response = await fetch(server + url, {
    method,
    body,
    credentials: 'include',
    headers: {
      'Content-Type': 'image/jpeg'
    }
  });
  // simple successful request
  if (response.ok && !isRefresh) {
    return;
  }
  // the last request was to update the access-token (successful), repeat the previous request
  if (response.ok && isRefresh) {
    isRefresh = false;
    return await customFetchBuffer(...previousResponseData);
  }
  // invalid credentials or the refresh-token expired
  if (response.status === 401) {
    await redirectSignIn();
    throw response;
  }
  // access-token expired
  if (response.status === 403) {
    isRefresh = true;
    previousResponseData = [url, method, body];
    return await customFetchBuffer('/refreshAccessToken', 'GET');
  }
  if (response.status === 500) {
    throw response;
  }
};

export default customFetchBuffer;
