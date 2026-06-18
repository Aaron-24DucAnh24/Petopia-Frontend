import { IBlog, IBlogUpdate } from '../interfaces/blog';
import { IPaginationRequest } from '../interfaces/common';
import { BLOG_CATEGORIES } from '../utils/constants';
import { http } from './http';

export interface IBlogFilterModel {
  category?: BLOG_CATEGORIES[];
  userId?: string;
}

export const postBlog = async (data: IBlog) => await http.post('/Blog', data);

export const getBlogs = async (data: IPaginationRequest<IBlogFilterModel>) =>
  await http.post('/Blog/Get', data);

export const deleteBlog = async (id: string) =>
  await http.delete(`/Blog/${id}`);

export const updateBlog = async (data: IBlogUpdate) => await http.put('/Blog', data);

export const getBlogAd = async () => await http.get('/Blog/Advertisement');
