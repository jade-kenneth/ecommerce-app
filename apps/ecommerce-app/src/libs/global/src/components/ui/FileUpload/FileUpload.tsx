import { FileUpload } from '@ark-ui/react';

import { createRecipeContext } from '../../../utils';
import { fileUploadRecipe } from './FileUpload.recipe';

const { withContext, withProvider, withRootProvider } =
  createRecipeContext(fileUploadRecipe);

/**
 * @example
 * ```tsx
 * <FileUpload.Root
 *   maxFiles={1}
 *   accept={['image/png', 'image/svg+xml', 'image/gif', 'image/jpeg']}
 *   maxFileSize={10 * 1024 * 1024}
 *   onFileReject={() => {}}
 *   onFileAccept={() => {}}
 *   onFileChange={() => {}}
 * >
 *   <FileUpload.Context>
 *     {({ acceptedFiles }) => (
 *       <>
 *         <FileUpload.Label>File Upload</FileUpload.Label>
 *         <FileUpload.Dropzone
 *           className={twMerge(
 *             'relative',
 *             'rounded-xl',
 *             'border',
 *             'border-[#26272B]',
 *             'bg-[#0A1117]',
 *             'px-3xl',
 *             'py-xl',
 *             'text-center',
 *             'text-sm',
 *             'text-[#94969C]',
 *           )}
 *         >
 *           {!acceptedFiles.length && (
 *             <>
 *               <div
 *                 className={twMerge(
 *                   'mx-auto',
 *                   'mb-lg',
 *                   'flex',
 *                   'size-10',
 *                   'items-center',
 *                   'justify-center',
 *                   'rounded-md',
 *                   'border',
 *                   'border-[#26272B]',
 *                 )}
 *               >
 *                 <UploadCloud02Icon className="size-5 text-[#CECFD2]" />
 *               </div>
 *               <span>
 *                 <span className="font-semibold text-[#CECFD2]">
 *                   Click to upload
 *                 </span>{' '}
 *                 or drag and drop <br /> SVG, PNG, JPG or GIF (max.
 *                 800x400px)
 *               </span>
 *             </>
 *           )}
 *
 *           {acceptedFiles.length > 0 && (
 *             <FileUpload.ItemGroup>
 *               <FileUpload.Item file={acceptedFiles[0]}>
 *                 <FileUpload.ItemPreview type="image/*">
 *                   <FileUpload.ItemPreviewImage
 *                     className="mx-auto max-h-[264px] max-w-full"
 *                     draggable={false}
 *                   />
 *                 </FileUpload.ItemPreview>
 *               </FileUpload.Item>
 *             </FileUpload.ItemGroup>
 *           )}
 *         </FileUpload.Dropzone>
 *         <FileUpload.HiddenInput accept="image/*" />
 *       </>
 *     )}
 *   </FileUpload.Context>
 * </FileUpload.Root>
 * ```
 */
export const Root = withProvider(FileUpload.Root, 'root');
export const RootProvider = withRootProvider(FileUpload.RootProvider);
export const ClearTrigger = withContext(
  FileUpload.ClearTrigger,
  'clearTrigger'
);
export const Dropzone = withContext(FileUpload.Dropzone, 'dropzone');
export const HiddenInput = FileUpload.HiddenInput;
export const Item = withContext(FileUpload.Item, 'item');
export const ItemDeleteTrigger = withContext(
  FileUpload.ItemDeleteTrigger,
  'itemDeleteTrigger'
);
export const ItemGroup = withContext(FileUpload.ItemGroup, 'itemGroup');
export const ItemName = withContext(FileUpload.ItemName, 'itemName');
export const ItemPreview = withContext(FileUpload.ItemPreview, 'itemPreview');
export const ItemPreviewImage = withContext(
  FileUpload.ItemPreviewImage,
  'itemPreviewImage'
);
export const ItemSizeText = withContext(
  FileUpload.ItemSizeText,
  'itemSizeText'
);
export const Label = withContext(FileUpload.Label, 'label');
export const Trigger = withContext(FileUpload.Trigger, 'trigger');
export const Context = FileUpload.Context;
