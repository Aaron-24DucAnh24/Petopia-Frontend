import Image from 'next/image';
import { IApiResponse } from '@/src/interfaces/common';
import { updateAvatar } from '@/src/services/user.api';
import { STATIC_URLS } from '@/src/utils/constants';
import { useMutation } from '@/src/utils/hooks';
import { ChangeEvent, useRef, useState } from 'react';
import { Alert } from '../common/general/Alert';
import { useStores } from '@/src/stores';

interface IAvatarBlock {
  image: string;
  setImage: (image: string) => void;
}

export const AvatarBlock = (props: IAvatarBlock) => {
  const { image, setImage } = props;
  const inputRef = useRef<HTMLInputElement>(null);
  const { userStore } = useStores();

  // STATES
  const [isEditAvatar, setIsEditAvatar] = useState<boolean>(false);
  const [isUploadAvatar, setIsUpdloadAvatar] = useState<boolean>(false);
  const [processingImage, setProcessingImage] = useState<string>('');
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [alertShow, setAlertShow] = useState<boolean>(false);
  const [alertFail, setAlertFail] = useState<boolean>(false);

  // HANDLERS
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setProcessingImage(url);
      setIsEditAvatar(false);
      setIsUpdloadAvatar(true);
    }
  };

  const handleUploadImage = (isConfirmed: boolean) => {
    const file = inputRef.current?.files?.[0];

    if (isConfirmed && file) {
      const formData = new FormData();
      formData.append('image', file);
      updateAvatarMutation.mutate(formData);
    }

    setIsUpdloadAvatar(false);
    setProcessingImage('');

    // Clear input after processing
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  // QUERIES
  const updateAvatarMutation = useMutation<IApiResponse<string>, FormData>(
    updateAvatar,
    {
      onSuccess: async (res) => {
        setImage(res.data.data);
        setProcessingImage('');
        setAlertFail(false);
        setAlertShow(true);
        setAlertMessage('Tải ảnh lên thành công.');
        await userStore.fetchUserContext();
      },
      onError: () => {
        setProcessingImage('');
        setAlertFail(true);
        setAlertShow(true);
        setAlertMessage('Đã có lỗi xảy ra.');
      },
    });

  return (
    <div
      className="relative h-32 w-32 md:h-52 md:w-52 md:bottom-20"
      onMouseEnter={() => !isUploadAvatar && setIsEditAvatar(true)}
      onMouseLeave={() => !isUploadAvatar && setIsEditAvatar(false)}>
      <Image
        src={processingImage || image || STATIC_URLS.NO_AVATAR}
        alt="Picture of the author"
        fill
        objectFit="cover"
        className="rounded-full"
        quality={50} />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        {isEditAvatar && (
          <div className="flex items-center justify-center w-32 bg-gray-50 rounded-lg">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col w-full bg-gray-50 items-center justify-center h-8 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-100">
              <span className="font-semibold text-sm text-gray-500">Chọn</span>
            </label>
          </div>
        )}
        {isUploadAvatar && (
          <div className="flex items-center justify-center w-32 bg-gray-50 rounded-lg">
            <div
              className="flex flex-col w-full items-center justify-center h-8 border-2 bg-yellow-300 border-dashed rounded-lg cursor-pointer"
              onClick={() => handleUploadImage(true)}>
              <span className="font-semibold text-sm text-gray-500">Tải lên</span>
            </div>
            <div className="flex flex-col w-full items-center justify-center h-8 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-100"
              onClick={() => handleUploadImage(false)}>
              <span className="font-semibold text-sm text-gray-500">Huỷ</span>
            </div>
          </div>
        )}
        <input
          id="dropzone-file"
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleImageChange(e)} />
      </div>
      <Alert
        message={alertMessage}
        show={alertShow}
        setShow={setAlertShow}
        failed={alertFail} />
    </div>
  );
};
