'use client';
import { FileUpload } from '@ark-ui/react';
import { FileChangeDetails } from '@ark-ui/react/dist/components/file-upload/file-upload';

import { LuUpload } from 'react-icons/lu';
import { useControllableState } from '../utils';

interface UploadFileProps {
  value?: File[];
  onChange?: (files: File[]) => void;
}
export function UploadFile(props: UploadFileProps) {
  const [value, setValue] = useControllableState({
    value: props.value,
    onChange: props.onChange,
  });

  return (
    <FileUpload.Root
      maxFiles={1}
      className="h-full w-full bg-[blue] border-[1px_solid_#F2F2F2] rounded-[8px]"
      onFileChange={(details: FileChangeDetails) =>
        setValue(details.acceptedFiles)
      }
    >
      <FileUpload.Dropzone
        hidden={(value?.length || 0) > 0}
        className="w-full h-[126px] bg-[green] border-[1px_solid_#F2F2F2] rounded-[8px] flex items-center justify-center"
      >
        Drag your file(s) here
      </FileUpload.Dropzone>
      <FileUpload.Trigger>Choose file(s)</FileUpload.Trigger>
      <FileUpload.ItemGroup>
        <FileUpload.Context>
          {({ acceptedFiles }) =>
            acceptedFiles.map((file) => (
              <FileUpload.Item key={file.name} file={file}>
                <FileUpload.ItemPreview type="image/*">
                  <FileUpload.ItemPreviewImage />
                </FileUpload.ItemPreview>
                <FileUpload.ItemPreview type=".*">
                  <LuUpload />
                </FileUpload.ItemPreview>
                <FileUpload.ItemName />
                <FileUpload.ItemSizeText />
                <FileUpload.ItemDeleteTrigger>X</FileUpload.ItemDeleteTrigger>
              </FileUpload.Item>
            ))
          }
        </FileUpload.Context>
      </FileUpload.ItemGroup>
      <FileUpload.HiddenInput />
    </FileUpload.Root>
  );
}
