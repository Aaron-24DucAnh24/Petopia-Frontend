'use client';
import { CKEditor, useCKEditorCloud } from '@ckeditor/ckeditor5-react';
import { uploadMany } from '@/src/services/storage.api';
import { IApiResponse } from '@/src/interfaces/common';

interface IBlogHTMLArea {
  id: string;
  value: string;
  setValue: (value: string) => void;
}

function createUploadAdapterPlugin(editor: any) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => ({
    upload: async () => {
      const file = await loader.file;
      const formData = new FormData();
      formData.append('images', file);
      const res = await uploadMany(formData);
      const urls = (res.data as IApiResponse<string[]>).data;
      return { default: urls[0] };
    },
    abort: () => {},
  });
}

export const BlogHTMLArea = ({ id, value, setValue }: IBlogHTMLArea) => {
  const cloud = useCKEditorCloud({ version: '45.1.0', premium: false });

  if (cloud.status === 'error') return <div>Error!</div>;
  if (cloud.status === 'loading') return <div>Loading...</div>;

  // Cast to any because the TypeScript types may not enumerate every plugin export
  const ck = cloud.CKEditor as any;
  const {
    ClassicEditor,
    Essentials,
    Paragraph,
    Heading,
    Bold,
    Italic,
    Underline,
    List,
    BlockQuote,
    Link,
    Image,
    ImageUpload,
    ImageToolbar,
    ImageStyle,
    FontColor,
    FontBackgroundColor,
    FontSize,
  } = ck;

  return (
    <CKEditor
      id={id}
      editor={ClassicEditor}
      data={value}
      onChange={(_, editor) => setValue((editor as any).getData())}
      config={{
        licenseKey: process.env.NEXT_PUBLIC_CKEDITOR_LICENSE,
        extraPlugins: [createUploadAdapterPlugin],
        plugins: [
          Essentials,
          Paragraph,
          Heading,
          Bold,
          Italic,
          Underline,
          List,
          BlockQuote,
          Link,
          Image,
          ImageUpload,
          ImageToolbar,
          ImageStyle,
          FontColor,
          FontBackgroundColor,
          FontSize,
        ],
        toolbar: {
          items: [
            'heading', '|',
            'bold', 'italic', 'underline', '|',
            'bulletedList', 'numberedList', '|',
            'blockQuote', '|',
            'link', 'uploadImage', '|',
            'fontSize', 'fontColor', 'fontBackgroundColor', '|',
            'undo', 'redo',
          ],
        },
        image: {
          toolbar: ['imageTextAlternative', 'imageStyle:inline', 'imageStyle:block', 'imageStyle:side'],
        },
      }}
    />
  );
};
