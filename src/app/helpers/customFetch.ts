const server = process.env['SERVER'] || 'http://localhost:5000/api/v1';
const router = useRouter();
let isRefresh: boolean = false;
let previousRequestData;

const customFetch = async (
  url: string,
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
  body?: unknown
) => {
  try {
    const request = await fetch(server + url, {
      method,
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    // обычный запрос, прошёл успешно
    if (request.ok && !isRefresh) {
      return await request.json();
    }
    // это был запрос на обновление access-token (удачный), повтор предыдущего запроса
    if (request.ok && isRefresh) {
      isRefresh = false;
      return await customFetch(...previousRequestData);
    }
    // неверные креды или истёк refresh-token
    if (request.status === 401) {
      await router.push('/signIn');
      return;
    }
    // истёк access-token
    if (request.status === 403) {
      isRefresh = true;
      previousRequestData = [
        url,
        {
          method,
          body
        }
      ];
      return await customFetch('/refreshAccessToken', 'GET');
    }
    if (request.status === 500) {
      // TODO обработка ошибки, редирект на страницу ещё не реализованной pages/Error500.vue
      return;
    }
  } catch (e) {
    throw new Error(e);
  }
};

export default customFetch;
