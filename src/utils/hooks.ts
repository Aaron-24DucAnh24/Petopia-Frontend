
import { IApiErrorResponse } from '../interfaces/common';
import {
  useMutation as useMutationLib,
  useQuery as useQueryLib,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
  QueryKey
} from 'react-query';
import { AxiosResponse } from 'axios';
import {
  RefObject,
  useCallback,
  useEffect,
} from 'react';

// Use mutation
export function useMutation<TData = any, TVariables = any, TContext = unknown>(
  mutationFn: any,
  options?: Omit<
    UseMutationOptions<AxiosResponse<TData>, AxiosResponse<IApiErrorResponse>, TVariables, TContext>,
    'mutationFn'
  >
): UseMutationResult<AxiosResponse<TData>, AxiosResponse<IApiErrorResponse>, TVariables, TContext> {
  return useMutationLib(mutationFn, options);
}

// Use query
export function useQuery<TData = any, TQueryFnData = any, TQueryKey extends QueryKey = QueryKey>(
  queryKey: TQueryKey,
  queryFn: any,
  options?: Omit<
    UseQueryOptions<TQueryFnData, AxiosResponse<IApiErrorResponse>, AxiosResponse<TData>, TQueryKey>,
    'queryKey' | 'queryFn'
  >
): UseQueryResult<AxiosResponse<TData>, AxiosResponse<IApiErrorResponse>> {
  return useQueryLib(queryKey, queryFn, options);
}

// Use click outside
export const useClickOutside = (
  action: () => void,
  dependencyList: RefObject<HTMLElement>[]
) => {
  const handler = useCallback((event: MouseEvent) => {
    const isOutSide = dependencyList.every(ref =>
      ref.current && !ref.current.contains(event.target as HTMLElement)
    );
    if (isOutSide) action();
  }, [action, dependencyList]);

  useEffect(() => {
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [handler]);
};