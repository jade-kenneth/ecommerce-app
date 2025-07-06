'use client';
import { FileUpload } from '@ark-ui/react';

import { UploadFileMutationResult } from '@graphql/products';
import { IoCloudUploadOutline } from 'react-icons/io5';
import { useControllableState } from '../utils';
interface UploadFileProps {
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
      maxFiles={1}
      className="w-full min-h-[126px] h-auto border-[1px] border-[#F2F2F2]   rounded-[8px] flex items-center justify-center"
      onFileChange={async (details) => {
        const id = await uploadFile(details.acceptedFiles[0]);
        setValue(id || '');
      }}
    >
      <FileUpload.Dropzone
        className="flex flex-col gap-3 items-center justify-center w-[inherit] h-[inherit] cursor-pointer"
        hidden={(value?.length || 0) > 0}
      >
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
            <FileUpload.Item
              key={file.name}
              file={file}
              className="w-[inherit] h-[inherit] flex items-center justify-center relative"
            >
              <FileUpload.ItemPreview type="image/*">
                <FileUpload.ItemPreviewImage />
              </FileUpload.ItemPreview>
              <FileUpload.ItemDeleteTrigger className="absolute right-1 top-0">
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
