'use client';
import { QUERY_KEYS } from '@/src/utils/constants';
import BlogPage from '@/src/components/blog/BlogPage';
import { useState } from 'react';
import { IApiResponse } from '@/src/interfaces/common';
import { IBlogResponse } from '@/src/interfaces/blog';
import { getBlogDetail } from '@/src/services/blog.api';
import { useQuery } from '@/src/utils/hooks';
import { observer } from 'mobx-react-lite';
import { QueryProvider } from '@/src/components/common/provider/QueryProvider';
import BlogDetailSkeleton from '@/src/components/blog/BlogDetailSkeleton';
import AdvertisementCarousel from '@/src/components/blog/AdvertisementCarousel';
import { NoResultBackground } from '@/src/components/common/general/NoResultBackground';

const page = observer(QueryProvider(({ params }: { params: { id: string } }) => {
  // States
  const [blogContent, setBlogContent] = useState<IBlogResponse>();
  const [error, setError] = useState<boolean>(false);

  // Queries
  const getBlogQuery = useQuery<IApiResponse<IBlogResponse>>(
    [QUERY_KEYS.GET_BLOG_DETAIL, { id: params.id }],
    () => getBlogDetail(params.id),
    {
      onSuccess: (res) => {
        setBlogContent(res.data.data);
      },
      onError: () => {
        setError(true);
      },
      refetchOnWindowFocus: false,
    }
  );

  return (
    <div>
      <div className="container mx-auto my-10">
        <div className="flex items-center justify-center mt-5">
          <AdvertisementCarousel />
        </div>
        {
          getBlogQuery.isLoading && <BlogDetailSkeleton />
        }
        {
          !getBlogQuery.isLoading && blogContent && (
            <BlogPage
              blogId={blogContent.id}
              userName={blogContent.userName}
              blogTitle={blogContent.title}
              htmlContent={blogContent.content}
              createdAt={blogContent.isCreatedAt}
              view={blogContent.view}
              userImage={blogContent.userImage} />
          )}
        {
          error && <NoResultBackground className="h-fit-screen w-full items-center" />
        }
      </div>
    </div>
  );
}));

export default page;