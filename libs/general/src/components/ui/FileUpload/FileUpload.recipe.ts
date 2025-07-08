import { fileUploadAnatomy } from '@ark-ui/react';
import { anatomyToRecipeSlots } from '@utils';
import { tv } from 'tailwind-variants';

export const fileUploadRecipe = tv({
  slots: anatomyToRecipeSlots(fileUploadAnatomy, {
    label:
      'mb-1.5 flex items-center gap-0.5 text-sm font-medium text-[#F5F5F6]',
    root: 'w-full h-[186px] border-[1px] border-[#F2F2F2] ui-invalid:border-[#D92D20] overflow-hidden  rounded-[8px] flex items-center justify-center',
    dropzone:
      'flex flex-col gap-3 items-center justify-center w-[inherit] h-[inherit] cursor-pointer ',
    item: 'w-[inherit]  h-[inherit] flex items-center justify-center relative',
    itemPreview: 'w-full h-full',
    itemPreviewImage: 'w-full h-full',
    itemDeleteTrigger: 'absolute right-1 top-0',
  }),
});
