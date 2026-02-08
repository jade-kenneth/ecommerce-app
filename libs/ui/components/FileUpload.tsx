'use client';
import { UseFileUploadProps } from '@ark-ui/react';

import Image from 'next/image';
import { useCallback, useMemo, useRef } from 'react';
import { UploadCloud } from 'lucide-react';

import { useControllableState } from '~/hooks/useControllableState';
import { uploadFile } from '~/utils/uploadFile';
import { FileUpload } from './ui/FileUpload';
interface UploadFileProps extends UseFileUploadProps {
  value?: string[];
  onChange?: (files: string[]) => void;
}
export function UploadFile(props: UploadFileProps) {
  const [value, setValue] = useControllableState({
    value: props.value,
    onChange: props.onChange,
    defaultValue: [],
  });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const preview = useMemo(() => value?.[0], [value]);
  const hasPreview = Boolean(preview);

  const handleOpenPicker = useCallback(() => {
    triggerRef.current?.click();
  }, []);

  const handleClear = useCallback(() => {
    setValue([]);
  }, [setValue]);

  const handleFileChange = useCallback(
    async (details: { acceptedFiles: File[] }) => {
      const file = details.acceptedFiles[0];
      if (!file) {
        setValue([]);
        return;
      }

      try {
        const id = await uploadFile(file);
        setValue(id ? [id] : []);
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    },
    [setValue],
  );

  return (
    <div>
      <FileUpload.Root
        accept={props.accept ?? 'image/*'}
        maxFiles={1}
        onFileChange={handleFileChange}
        className="relative"
        data-invalid={props.invalid ? '' : undefined}
      >
        <FileUpload.Trigger ref={triggerRef} className="sr-only">
          Upload image
        </FileUpload.Trigger>
        <FileUpload.Dropzone hidden={hasPreview}>
          <UploadCloud className="w-5 h-5" />
          <button
            className="text-cyan-700 font-medium text-sm"
            type="button"
            onClick={handleOpenPicker}
          >
            Click to upload image
          </button>
          <p className="text-carbon-500 text-xs">
            PNG, JPG, GIF up to 10MB. Recommended size: 800x600px
          </p>
        </FileUpload.Dropzone>

        {hasPreview && (
          <div className="relative w-full h-full  rounded-md overflow-hidden">
            <Image src={preview} alt="thumbnail" fill className="object-cover" />

            <div
              aria-label="overlay"
              className="absolute inset-0 gap-3 bg-black/50 text-white flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
            >
              <button
                type="button"
                onClick={handleOpenPicker}
                className="text-sm font-medium"
              >
                Update
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="text-sm font-medium text-red-200 hover:text-red-100"
              >
                Delete
              </button>
            </div>
          </div>
        )}

        <FileUpload.HiddenInput />
      </FileUpload.Root>
    </div>
  );
}
