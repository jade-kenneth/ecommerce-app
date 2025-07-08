'use client';
import { UseFileUploadProps } from '@ark-ui/react';

import { UploadFileMutationResult } from '@graphql/products';
import { IoCloudUploadOutline } from 'react-icons/io5';
import { useControllableState } from '../utils';
import { FileUpload } from './ui/FileUpload';
interface UploadFileProps extends UseFileUploadProps {
  value?: string;
  onChange?: (files: string) => void;
}
export function UploadFile(props: UploadFileProps) {
  const [value, setValue] = useControllableState({
    value: props.value,
    onChange: props.onChange,
  });

  return (
    <FileUpload.Root
      accept={'image/*'}
      onFileChange={async (details) => {
        if (details.acceptedFiles.length > 0) {
          try {
            const id = await uploadFile(details.acceptedFiles[0]);
            setValue(id || '');
          } catch (error) {
            console.log('Error uploading file:', error);
          }
          return;
        }
        setValue('');
      }}
      data-invalid={props.invalid ? '' : undefined}
    >
      <FileUpload.Dropzone hidden={!!value}>
        <IoCloudUploadOutline />
        <FileUpload.Trigger>
          <p className="text-primary-700-value font-medium text-sm">
            Click to upload image
          </p>
        </FileUpload.Trigger>
        <p className="text-carbon-500 text-xs">
          PNG, JPG, GIF up to 10MB. Recommended size: 800x600px
        </p>
      </FileUpload.Dropzone>

      <FileUpload.Context>
        {({ acceptedFiles }) =>
          acceptedFiles.map((file) => (
            <FileUpload.Item key={file.name} file={file}>
              <FileUpload.ItemPreview type="image/*">
                <FileUpload.ItemPreviewImage />
              </FileUpload.ItemPreview>
              <FileUpload.ItemDeleteTrigger onClick={() => setValue('')}>
                X
              </FileUpload.ItemDeleteTrigger>
            </FileUpload.Item>
          ))
        }
      </FileUpload.Context>

      <FileUpload.HiddenInput />
    </FileUpload.Root>
  );
}
export async function uploadFile(file: File): Promise<string | undefined> {
  const operations = JSON.stringify({
    query: `
      mutation ($file: Upload!) {
        uploadFile(file: $file)
      }
    `,
    variables: { file: null },
  });

  const map = JSON.stringify({ '0': ['variables.file'] });

  const formData = new FormData();
  formData.append('operations', operations);
  formData.append('map', map);
  formData.append('0', file);

  const res = await fetch(process.env.NEXT_PUBLIC_PORTAL_API || '', {
    method: 'POST',
    body: formData,
    headers: {
      'x-apollo-operation-name': 'uploadFile',
    },
  });

  const data = (await res.json()) as UploadFileMutationResult;
  return data.data?.uploadFile ?? undefined;
}
