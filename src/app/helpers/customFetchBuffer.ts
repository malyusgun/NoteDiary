const server = process.env['SERVER_BUFFER'] || 'http://localhost:5001/api/v1';
let isRefresh: boolean = false;
let previousResponseData: [string, 'GET' | 'POST' | 'PATCH' | 'DELETE', Buffer];

const customFetchBuffer = async (
  url: string,
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
  body?: Buffer
) => {
  const router = useRouter();

  try {
    const response = await fetch(server + url, {
      method,
      body,
      headers: {
        'Content-Type': 'image/jpeg'
      }
    });
    // обычный запрос, прошёл успешно
    if (response.ok && !isRefresh) {
      return;
    }
    // это был запрос на обновление access-token (удачный), повтор предыдущего запроса
    if (response.ok && isRefresh) {
      isRefresh = false;
      return await customFetchBuffer(...previousResponseData);
    }
    // неверные креды или истёк refresh-token
    if (response.status === 401) {
      await router.push('/signIn');
      return;
    }
    // истёк access-token
    if (response.status === 403) {
      isRefresh = true;
      previousresponseData = [url, method, body];
      return await customFetchBuffer('/refreshAccessToken', 'GET');
    }
    if (response.status === 500) {
      // TODO обработка ошибки, редирект на страницу ещё не реализованной pages/Error500.vue
      //  или просто показ уведомления с предложением перезагрузить страницу
      return;
    }
  } catch (e) {
    throw new Error(e);
  }
};

export default customFetchBuffer;
