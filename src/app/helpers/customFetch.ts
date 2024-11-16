import cookies from '@/app/plugins/Cookie';
import { redirectSignIn } from '@/app/router';

const server = process.env['SERVER'] || 'http://localhost:5000/api/v1';
let isRefresh: boolean = false;
let previousResponseData: [string, 'GET' | 'POST' | 'PATCH' | 'DELETE', unknown];

const customFetch = async (
  url: string,
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
  body?: unknown
) => {
  const response = await fetch(server + url, {
    method,
    body: JSON.stringify(body),
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  // simple successful request
  if (response.ok && !isRefresh) {
    return await response.json();
  }
  // the last request was to update the access-token (successful), repeat the previous request
  if (response.ok && isRefresh) {
    isRefresh = false;
    return await customFetch(...previousResponseData);
  }
  // invalid credentials or the refresh-token expired
  if (response.status === 401) {
    await redirectSignIn();
    throw response;
  }
  // access-token expired
  if (response.status === 403) {
    const userUuid = cookies.get('user_uuid');
    isRefresh = true;
    previousResponseData = [url, method, body];
    return await customFetch(`/users/${userUuid}/refresh`, 'PATCH');
  }
  // server error
  if (response.status === 500) {
    throw response;
  }
};

export default customFetch;
