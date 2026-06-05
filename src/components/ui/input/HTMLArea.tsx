import { CKEditor, useCKEditorCloud } from '@ckeditor/ckeditor5-react';

interface IHTMLArea {
  id: string,
  value: string,
  setValue: (value: string) => void
}

export const HTMLArea = (props: IHTMLArea) => {
  const {
    id,
    value,
    setValue
  } = props;

  const cloud = useCKEditorCloud({
    version: '45.1.0',
    premium: false,
  });
  if (cloud.status === 'error') {
    return <div>Error!</div>;
  }
  if (cloud.status === 'loading') {
    return <div>Loading...</div>;
  }

  const {
    ClassicEditor,
    Essentials,
    Paragraph,
    Bold,
    Italic,
    Underline,
    FontColor,
    FontSize,
    Link,
    FontBackgroundColor
  } = cloud.CKEditor;

  return (
    <CKEditor
      editor={ClassicEditor}
      data={value}
      onChange={(_, editor) => {
        setValue(editor.getData());
      }}
      config={{
        licenseKey: process.env.NEXT_PUBLIC_CKEDITOR_LICENSE,
        plugins: [
          Essentials,
          Paragraph,
          Bold,
          Italic,
          Underline,
          FontColor,
          FontBackgroundColor,
          FontSize,
          Link
        ],
        toolbar: [
          'undo', 'redo',
          '|', 'bold', 'italic', 'underline',
          '|', 'fontSize', 'fontColor', 'fontBackgroundColor',
          '|', 'link'
        ]
      }}
    />
  );
};
