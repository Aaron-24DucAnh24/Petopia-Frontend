'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { IBlog } from '@/src/interfaces/blog';
import { IApiResponse, IUploadImage } from '@/src/interfaces/common';
import { postBlog } from '@/src/services/blog.api';
import { uploadMany } from '@/src/services/storage.api';
import { useMutation } from '@/src/utils/hooks';
import { QueryProvider } from '../providers/QueryProvider';
import { Input } from '../ui/input/Input';
import { SelectInput } from '../ui/input/SelectInput';
import Dropzone from '../ui/Dropzone';
import QueryButton from '../ui/button/QueryButton';
import { Alert } from '../ui/Alert';
import { BlogHTMLArea } from '../ui/input/BlogHTMLArea';
import { ValueTextManager } from '@/src/utils/ValueTextManager';

interface IBlogForm {
  title: string;
  excerpt: string;
  category: string;
  content: string;
}

export const BlogCreateForm = QueryProvider(() => {
  const router = useRouter();

  const [alertShow, setAlertShow] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const uploadImageForm = useForm<IUploadImage>({
    defaultValues: { showImages: [], files: [], images: [] },
  });

  const blogForm = useForm<IBlogForm>({
    defaultValues: { title: '', excerpt: '', category: '', content: '' },
  });

  const createBlogMutation = useMutation<IApiResponse<string>, IBlog>(
    postBlog,
    {
      onError: (err) => {
        setAlertMessage(err?.data?.errorMessage || 'Tạo bài viết thất bại');
        setAlertShow(true);
      },
      onSuccess: (res) => {
        blogForm.reset();
        uploadImageForm.reset();
        const blogId = res?.data?.data;
        router.push(blogId ? `/blog/${blogId}` : '/blog');
      },
    }
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUploading(true);

    let imageUrl = '';
    try {
      const files = uploadImageForm.getValues('files');
      if (!files.length) throw new Error('no file selected');
      const formData = new FormData();
      formData.append('images', files[0]);
      const uploadRes = await uploadMany(formData);
      const urls = (uploadRes.data as IApiResponse<string[]>).data;
      if (!urls.length) throw new Error('empty upload response');
      imageUrl = urls[0];
    } catch {
      setAlertMessage('Tải ảnh lên thất bại');
      setAlertShow(true);
      setIsUploading(false);
      return;
    }

    setIsUploading(false);

    await createBlogMutation.mutateAsync({
      title: blogForm.getValues('title').trim(),
      excerpt: blogForm.getValues('excerpt').trim(),
      image: imageUrl,
      category: Number(blogForm.getValues('category')),
      content: blogForm.getValues('content'),
    });
  };

  const titleValue = blogForm.watch('title');
  const excerptValue = blogForm.watch('excerpt');
  const categoryValue = blogForm.watch('category');
  const contentValue = blogForm.watch('content');
  const filesValue = uploadImageForm.watch('files');

  const isSubmittable =
    !!titleValue.trim() &&
    !!excerptValue.trim() &&
    !!categoryValue &&
    !!contentValue &&
    filesValue.length > 0;

  const isLoading = createBlogMutation.isLoading || isUploading;

  return (
    <div className="container max-w-3xl mx-auto p-5 mb-10">
      <h1 className="text-2xl font-bold mb-8">Tạo bài viết mới</h1>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="blog-title" className="block text-sm font-medium mb-2">
            Tiêu đề <span className="text-red-500">*</span>
          </label>
          <Input
            id="blog-title"
            value={titleValue}
            onChange={(v) => blogForm.setValue('title', v)}
          />
        </div>

        <div>
          <label htmlFor="blog-excerpt" className="block text-sm font-medium mb-2">
            Tóm tắt <span className="text-red-500">*</span>
          </label>
          <Input
            id="blog-excerpt"
            value={excerptValue}
            onChange={(v) => blogForm.setValue('excerpt', v)}
          />
        </div>

        <div>
          <label htmlFor="blog-category" className="block text-sm font-medium mb-2">
            Danh mục <span className="text-red-500">*</span>
          </label>
          <SelectInput
            id="blog-category"
            options={ValueTextManager.BlogCategory}
            defaultValue={categoryValue}
            onChange={(v) => blogForm.setValue('category', v)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Ảnh bìa <span className="text-red-500">*</span>
          </label>
          <Dropzone
            id="blog-cover-dropzone"
            setValue={uploadImageForm.setValue}
            watch={uploadImageForm.watch}
            imagesNumber={1}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Nội dung <span className="text-red-500">*</span>
          </label>
          <BlogHTMLArea
            id="blog-content"
            value={contentValue}
            setValue={(v) => blogForm.setValue('content', v)}
          />
        </div>

        <QueryButton
          name="Tạo bài viết"
          isLoading={isLoading}
          isDisabled={!isSubmittable}
        />
      </form>

      <Alert
        show={alertShow}
        setShow={setAlertShow}
        message={alertMessage}
        failed={true}
        showCancel={false}
      />
    </div>
  );
});
