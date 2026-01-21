'use client';
import { UseFileUploadProps } from '@ark-ui/react';

import Image from 'next/image';
import { useRef } from 'react';
import { IoCloudUploadOutline } from 'react-icons/io5';

import { useControllableState } from '~/hooks/useControllableState';
import { uploadFile } from '../utils/uploadFile';
import { FileUpload } from './ui/FileUpload';
interface CarouselFileUploadProps extends UseFileUploadProps {
  value?: string[];
  onChange?: (files: string[]) => void;
}
export function CarouselFileUpload({
  maxFiles = 1,
  ...props
}: CarouselFileUploadProps) {
  const [value, setValue] = useControllableState({
    value: props.value,
    onChange: props.onChange,
    defaultValue: [],
  });
  const ref = useRef<HTMLButtonElement>(null);

  return (
    <div>
      <FileUpload.Root
        accept={props.accept ?? 'image/*'}
        onFileChange={async (details) => {
          if (details.acceptedFiles.length > 0) {
            try {
              const id = await uploadFile(details.acceptedFiles[0]);
              if (id) {
                setValue((prev) => [...(prev ?? []), id]);
              }
            } catch (error) {
              console.log('Error uploading file:', error);
            }
            return;
          }
          setValue([]); // Clear value if no files are accepted
        }}
        maxFiles={maxFiles ?? 1}
        className="relative"
        data-invalid={props.invalid ? '' : undefined}
      >
        <FileUpload.Dropzone>
          <IoCloudUploadOutline />
          <FileUpload.Trigger ref={ref}>
            <p className="text-primary-700-value font-medium text-sm">
              Click to upload image
            </p>
          </FileUpload.Trigger>
          <p className="text-carbon-500 text-xs">
            PNG, JPG, GIF up to 10MB. Recommended size: 1280x900
          </p>
        </FileUpload.Dropzone>

        <FileUpload.HiddenInput />
      </FileUpload.Root>
      {maxFiles > 1 && value.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {value.map((file, index) => {
            return (
              <div
                key={file}
                className="relative rounded-md w-[200px] h-[200px] overflow-hidden"
              >
                <Image
                  src={file}
                  alt="thumbnail"
                  fill
                  className="object-cover  aspect-[1/1] "
                />

                <div
                  aria-label="overlay"
                  className="absolute inset-0 gap-2 bg-black/50 text-white cursor-pointer  flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                >
                  {/* <p onClick={() => ref.current?.click()}>Update</p> */}
                  <p onClick={() => setValue([])}>Delete</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
