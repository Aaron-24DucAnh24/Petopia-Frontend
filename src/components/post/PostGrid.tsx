'use client';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { IGetPostResponse } from '@/src/interfaces/post';
import { IApiResponse, IPaginationModel } from '@/src/interfaces/common';
import { deletePost, getUserPosts } from '@/src/services/post.api';
import { useQuery, useMutation } from '@/src/utils/hooks';
import { QUERY_KEYS } from '@/src/utils/constants';
import { Alert } from '../ui/Alert';
import { PostCard } from './PostCard';
import { PostDetailModal } from './PostDetailModal';
import { AddButton } from '../ui/button/AddButton';
import { QueryProvider } from '../providers/QueryProvider';
import Pagination from '../ui/Pagination';
import { UserPostCreateForm } from '../user/UserPostCreateForm';
import { ConfirmCloseModal } from '../ui/ConfirmCloseModal';
import { useStores } from '@/src/stores';

const PAGE_SIZE = 6;

interface IPostGridProps {
  userId: string;
  canCreate?: boolean;
}

export const PostGrid = QueryProvider(({ userId, canCreate }: IPostGridProps) => {
  const { userStore } = useStores();
  const [posts, setPosts] = useState<IGetPostResponse[]>([]);
  const [selectedPost, setSelectedPost] = useState<IGetPostResponse | null>(null);
  const [alertShow, setAlertShow] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState('');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const paginationForm = useForm<IPaginationModel>({
    defaultValues: { pageIndex: 1, pageNumber: 1 },
  });

  // Use the callback form of watch — the only reliable way in RHF v7 to
  // subscribe a component to setValue calls made by a child (Pagination).
  useEffect(() => {
    const { unsubscribe } = paginationForm.watch((values) => {
      if (values.pageIndex !== undefined) {
        setCurrentPage(values.pageIndex);
      }
    });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getPostsQuery = useQuery<IApiResponse<IGetPostResponse[]>>(
    [QUERY_KEYS.GET_USER_POSTS, currentPage],
    () => getUserPosts({ pageIndex: currentPage, pageSize: PAGE_SIZE, filter: { userId } }),
    {
      enabled: !!userId,
      onSuccess: (res) => {
        setPosts(res.data.data ?? []);
        if (res.data.pageNumber !== undefined) {
          paginationForm.setValue('pageNumber', res.data.pageNumber);
        }
      },
      refetchOnWindowFocus: false,
    }
  );

  const deletePostMutation = useMutation<IApiResponse<boolean>, string>(deletePost, {
    onSuccess: () => {
      setSelectedPost(null);
      const page = paginationForm.getValues('pageIndex');
      if (posts.length === 1 && page > 1) {
        paginationForm.setValue('pageIndex', page - 1);
        setCurrentPage(page - 1);
      } else {
        getPostsQuery.refetch();
      }
    },
  });

  const handleDeleteRequest = (postId: string) => {
    setPendingDeleteId(postId);
    setAlertShow(true);
  };

  const handleCreateSuccess = () => {
    setShowCreatePost(false);
    if (currentPage === 1) {
      getPostsQuery.refetch();
    } else {
      paginationForm.setValue('pageIndex', 1);
      setCurrentPage(1);
    }
  };

  return (
    <>
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-base font-semibold text-gray-700 uppercase tracking-widest">Bài đăng</h2>
        <div className="flex-1 h-px bg-gray-200" />
        {canCreate && <AddButton onClick={() => setShowCreatePost(true)} title="Tạo bài đăng" />}
      </div>

      <div>
        <div>
          <div className="grid grid-cols-3 gap-2">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onClick={() => setSelectedPost(post)}
                onDelete={
                  userStore.userContext?.id === post.userId
                    ? () => handleDeleteRequest(post.id)
                    : undefined
                }
              />
            ))}
          </div>
        </div>
      </div>

      <Pagination
        paginationForm={paginationForm}
        disable={getPostsQuery.isFetching}
        show={paginationForm.getValues('pageNumber') > 1}
      />


      {selectedPost && (
        <PostDetailModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          onDelete={() => handleDeleteRequest(selectedPost.id)}
        />
      )}

      <Alert
        show={alertShow}
        setShow={setAlertShow}
        message="Bạn có chắc muốn xoá bài đăng này không?"
        failed={false}
        action={() => deletePostMutation.mutate(pendingDeleteId)}
      />

      <ConfirmCloseModal open={showCreatePost} onClose={() => setShowCreatePost(false)}>
        <UserPostCreateForm onSuccess={handleCreateSuccess} />
      </ConfirmCloseModal>
    </>
  );
});
