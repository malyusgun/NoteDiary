const server = process.env['SERVER'] || 'http://localhost:5000/api/v1';
let isRefresh: boolean = false;
let previousResponseData: [string, 'GET' | 'POST' | 'PATCH' | 'DELETE', unknown];

const customFetch = async (
  url: string,
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
  body?: unknown
) => {
  const router = useRouter();

  try {
    const response = await fetch(server + url, {
      method,
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    // обычный запрос, прошёл успешно
    if (response.ok && !isRefresh) {
      return await response.json();
    }
    // это был запрос на обновление access-token (удачный), повтор предыдущего запроса
    if (response.ok && isRefresh) {
      isRefresh = false;
      return await customFetch(...previousResponseData);
    }
    // неверные креды или истёк refresh-token
    if (response.status === 401) {
      await router.push('/signIn');
      return;
    }
    // истёк access-token
    if (response.status === 403) {
      isRefresh = true;
      previousresponseData = [
        url,
        {
          method,
          body
        }
      ];
      return await customFetch('/refreshAccessToken', 'GET');
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

export default customFetch;
