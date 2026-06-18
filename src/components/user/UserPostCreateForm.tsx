'use client';
import React, { useState } from 'react';
import { Alert } from '../ui/Alert';
import { useForm } from 'react-hook-form';
import { observer } from 'mobx-react-lite';
import { useMutation } from '@/src/utils/hooks';
import { IApiResponse, IUploadImage } from '@/src/interfaces/common';
import QueryButton from '../ui/button/QueryButton';
import { createPost } from '@/src/services/post.api';
import Dropzone from '../ui/Dropzone';
import { ICreatePost } from '@/src/interfaces/post';
import { HTMLArea } from '../ui/input/HTMLArea';
import { uploadMany } from '@/src/services/storage.api';

interface IUserPostCreateForm {
  onSuccess: () => void,
}

export const UserPostCreateForm = observer((props: IUserPostCreateForm) => {
  const { onSuccess } = props;

  const [alertShow, setAlertShow] = useState<boolean>(false);
  const [alertFail, setAlertFail] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const uploadImageForm = useForm<IUploadImage>({
    defaultValues: {
      showImages: [],
      files: [],
      images: [],
    },
  });

  const createPostForm = useForm<ICreatePost>({
    defaultValues: {
      content: '',
      images: [],
    },
  });

  const createPostMutation = useMutation<IApiResponse<boolean>, ICreatePost>(
    createPost,
    {
      onError: () => {
        setAlertFail(true);
        setAlertMessage('Tạo bài đăng thất bại');
        setAlertShow(true);
      },
      onSuccess: () => {
        setAlertFail(false);
        setAlertMessage('Tạo bài đăng thành công');
        setAlertShow(true);
      },
    });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Upload images first
    const formData = new FormData();
    uploadImageForm.getValues().files.forEach((file) => {
      formData.append('images', file);
    });
    if (uploadImageForm.getValues().files.length > 0) {
      const uploadImagesReponse = ((await uploadMany(formData)).data) as IApiResponse<string[]>;
      uploadImagesReponse.data.forEach((url: string) => {
        createPostForm.getValues().images.push(url);
      });
    }

    // Then create post
    await createPostMutation.mutateAsync(createPostForm.getValues());
    setIsLoading(false);
  };

  return (
    <div className="p-5 mx-auto w-full">
      <form
        className="w-full md:w-[600px] rounded-2xl bg-yellow-100 p-5"
        onSubmit={handleSubmit}>
        <h2 className="font-bold mb-2">Tạo bài đăng</h2>
        <div className="w-full p-5 mb-5 bg-gray-50 rounded-lg overflow-auto space-y-8" style={{ maxHeight: '600px' }}>
          <div>
            <div className="text-sm font-medium mb-2">
              Tải ảnh lên
              <span className="text-red-500 ml-1">*</span>
            </div>
            <Dropzone
              id={'postCreateDropzone'}
              setValue={uploadImageForm.setValue}
              watch={uploadImageForm.watch}
              imagesNumber={5} />
          </div>
          <div>
            <div className="text-sm font-medium mb-2">Nội dung</div>
            <HTMLArea
              id={'inputDescription'}
              value={createPostForm.watch('content')}
              setValue={(html) => {
                createPostForm.setValue('content', html);
              }} />
          </div>
        </div>
        <div className="flex justify-center">
          <QueryButton
            testId="create-post-submit"
            name={'Tạo bài đăng'}
            isLoading={createPostMutation.isLoading || isLoading}
            isDisabled={!createPostForm.watch('content') || !uploadImageForm.watch('files').length} />
        </div>
      </form>

      <Alert
        show={alertShow}
        setShow={setAlertShow}
        message={alertMessage}
        failed={alertFail}
        action={onSuccess}
        showCancel={false} />
    </div>
  );
});
