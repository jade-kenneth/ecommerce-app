'use client';
import { UseFileUploadProps } from '@ark-ui/react';

import { UploadFileMutationResult } from '@graphql/products';
import { isString } from 'lodash';
import Image from 'next/image';
import { useRef } from 'react';
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
  const ref = useRef<HTMLButtonElement>(null);

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
      className="relative"
      data-invalid={props.invalid ? '' : undefined}
    >
      <FileUpload.Dropzone hidden={!!value}>
        <IoCloudUploadOutline />
        <FileUpload.Trigger ref={ref}>
          <p className="text-primary-700-value font-medium text-sm">
            Click to upload image
          </p>
        </FileUpload.Trigger>
        <p className="text-carbon-500 text-xs">
          PNG, JPG, GIF up to 10MB. Recommended size: 800x600px
        </p>
      </FileUpload.Dropzone>

      {isString(value) && value !== '' && (
        <div className="relative w-full h-full  rounded-md overflow-hidden">
          <Image src={value} alt="thumbnail" fill className="object-cover" />

          <div
            aria-label="overlay"
            className="absolute inset-0 gap-2 bg-black/50 text-white cursor-pointer  flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
          >
            <p onClick={() => ref.current?.click()}>Update</p>
            <p onClick={() => setValue('')}>Delete</p>
          </div>
        </div>
      )}

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
      'apollo-require-preflight': 'true', // ✅ this tells Apollo to allow multipart
    },
  });

  const data = (await res.json()) as UploadFileMutationResult;
  return data.data?.uploadFile ?? undefined;
}
