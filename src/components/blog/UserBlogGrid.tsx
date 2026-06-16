'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { IBlogCardResponse } from '@/src/interfaces/blog';
import { IApiResponse, IPaginationModel } from '@/src/interfaces/common';
import { getBlogs } from '@/src/services/blog.api';
import { useQuery } from '@/src/utils/hooks';
import { QUERY_KEYS, USER_ROLE } from '@/src/utils/constants';
import BlogCard from './BlogCard';
import { AddButton } from '../ui/button/AddButton';
import { QueryProvider } from '../providers/QueryProvider';
import Pagination from '../ui/Pagination';
import { useStores } from '@/src/stores';

const PAGE_SIZE = 6;

interface IUserBlogGridProps {
  userId: string;
  initialData?: IApiResponse<IBlogCardResponse[]>;
}

export const UserBlogGrid = QueryProvider(({ userId, initialData }: IUserBlogGridProps) => {
  const router = useRouter();
  const { userStore } = useStores();
  const [blogs, setBlogs] = useState<IBlogCardResponse[]>(initialData?.data ?? []);
  const [currentPage, setCurrentPage] = useState(1);

  const paginationForm = useForm<IPaginationModel>({
    defaultValues: { pageIndex: 1, pageNumber: initialData?.pageNumber ?? 1 },
  });

  useEffect(() => {
    const { unsubscribe } = paginationForm.watch((values) => {
      if (values.pageIndex !== undefined) {
        setCurrentPage(values.pageIndex);
      }
    });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getBlogsQuery = useQuery<IApiResponse<IBlogCardResponse[]>>(
    [QUERY_KEYS.GET_BLOGS_USER, currentPage],
    () => getBlogs({ pageIndex: currentPage, pageSize: PAGE_SIZE, filter: { userId } }),
    {
      enabled: !!userId && (currentPage !== 1 || initialData === undefined),
      onSuccess: (res) => {
        setBlogs(res.data.data ?? []);
        if (res.data.pageNumber !== undefined) {
          paginationForm.setValue('pageNumber', res.data.pageNumber);
        }
      },
      refetchOnWindowFocus: false,
    }
  );

  const [isOwner, setIsOwner] = useState(false);
  useEffect(() => {
    setIsOwner(userStore.userContext?.id === userId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userStore.userContext?.id, userId]);

  const canCreate =
    isOwner &&
    (userStore.userContext?.role === USER_ROLE.SYSTEM_ADMIN ||
      userStore.userContext?.role === USER_ROLE.ORGANIZATION);

  return (
    <>
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-base font-semibold text-gray-700 uppercase tracking-widest">Bài viết</h2>
        <div className="flex-1 h-px bg-gray-200" />
        {canCreate && (
          <AddButton onClick={() => router.push('/blog/new')} title="Tạo bài viết" />
        )}
      </div>

      {!getBlogsQuery.isFetching && blogs.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-8">Bạn chưa có bài viết nào.</p>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {blogs.map((blog) => (
            <BlogCard
              key={blog.id}
              {...blog}
              isEditable={isOwner}
              onRefetch={() => getBlogsQuery.refetch()}
            />
          ))}
        </div>
      )}

      <Pagination
        paginationForm={paginationForm}
        disable={getBlogsQuery.isFetching}
        show={paginationForm.getValues('pageNumber') > 1}
      />
    </>
  );
});
