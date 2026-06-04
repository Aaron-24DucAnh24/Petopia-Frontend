import { IApiResponse } from '../interfaces/common';
import { http } from './http';

export const uploadMany = async (data: FormData) =>
  await http.post<FormData, IApiResponse<string[]>>(
    '/Storage/UploadMany',
    data,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
