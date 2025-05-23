
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
  useEffect,
  useRef
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

// Use run once
export const useRunOnce = (fn: () => any) => {
  const triggered = useRef<boolean>(false);

  useEffect(() => {
    const hasBeenTriggered = triggered.current;
    if (!hasBeenTriggered) {
      fn();
      triggered.current = true;
    }
  }, [fn]);

  return null;
};

// Use click outside
export const useClickOutside = (
  action: () => void,
  dependencyList: RefObject<HTMLElement>[]
) => {
  useEffect(() => {
    document.addEventListener('mousedown', async (event) => {
      const isOutSide = dependencyList.every(ref =>
        ref.current && !ref.current.contains(event.target as HTMLElement)
      );
      isOutSide && action();
    });
    return () => document.removeEventListener('mousedown', () => { });
  }, []);
};