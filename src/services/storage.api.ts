import { http } from './http';

export const uploadMany = async (data: FormData) => await http.post(
  '/Storage/UploadMany',
  data,
  {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
