import { CategoryType, StatusType } from '@graphql/generated';
import * as z from 'zod';
export const SchemaDefinition = z
  .object({
    name: z.string().trim().min(1, 'Name is required'),
    category: z
      .array(z.nativeEnum(CategoryType))
      .min(1, 'At least one category is required'),
    price: z
      .string()
      .trim()
      .min(1, 'Price is required')
      .superRefine((val, ctx) => {
        if (!/^\d+(\.\d{1,2})?$/.test(val)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              'Price must be a valid number with up to two decimal places',
          });
        }
      }),
    points: z
      .string()
      .trim()
      .min(1, 'Points is required')
      .superRefine((val, ctx) => {
        if (!/^\d+$/.test(val)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Points must be a valid integer',
          });
        }
      }),
    stock: z
      .number()
      .int('Must be a whole number')
      .min(1, 'Stock cannot be negative'),
    status: z.nativeEnum(StatusType),
    discountPercentage: z
      .number()
      .int('Must be a whole number')
      .min(0)
      .max(100)
      .optional(),

    thumbnail: z.string().trim().min(1, 'Thumbnail is required'),
    discountToggle: z.boolean().default(false).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.discountToggle && !data.discountPercentage) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please provide a discount percentage',
        path: ['discountPercentage'],
      });
    }
  });
