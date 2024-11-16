import type { IError } from '@/app/interfaces/responses';

const serverErrorHandler = (error: IError) => {
  console.error('Error: ', error);
};

export { serverErrorHandler };
