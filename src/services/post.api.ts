import { ICommentPost, ICreatePost, IUpdateComment } from '../interfaces/post';
import { IPaginationRequest } from '../interfaces/common';
import { http } from './http';

export const getPetPosts = async (petId: string) =>
  await http.get(`/Post/Pet/${petId}`);

export const getUserPosts = async (data: IPaginationRequest<{ userId: string }>) =>
  await http.post('/Post/Get', data);

export const getAllPosts = async (data: IPaginationRequest<undefined>) =>
  await http.post('/Post/Get', data);

export const createPost = async (data: ICreatePost) =>
  await http.post('/Post', data);

export const likePost = async (postId: string) =>
  await http.put(`/Post/Like/${postId}`);

export const getCommentsPost = async (postId: string) =>
  await http.get(`/Comment/post/${postId}`);

export const sendCommentPost = async (data: ICommentPost) =>
  await http.post('/Comment', data);

export const deletePost = async (postId: string) =>
  await http.delete(`/Post/${postId}`);

export const deleteComment = async (commentId: string) =>
  await http.delete(`/Comment/${commentId}`);

export const updateComment = async (data: IUpdateComment) =>
  await http.put('/Comment', data);