'use client';

import { Field } from '@ark-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Check, Star } from 'lucide-react';
import { useFieldArray, useForm } from 'react-hook-form';
import z from 'zod';
import { useGlobalStore } from '~/hooks/useGlobalStore';
import { useLicenseContext } from '~/providers/LicenseProvider/LicenseContext';
import { Button } from '../../../ui/components/Button';
import { Dialog } from '../../../ui/components/Dialog';
import { toaster } from '../../../ui/components/ToastContainer';
import { Checkbox } from '../../../ui/components/ui/Checkbox';

const IMPROVEMENT_OPTIONS = [
  'App design',
  'Mobile experience',
  'Website experience',
  'Performance and speed',
] as const;

const ratingFormSchema = z.object({
  ratings: z.number().min(1, 'Please select a rating.'),
  improvement: z.array(
    z.object({
      value: z.string().trim().min(1),
    }),
  ),
  customImprovement: z
    .string()
    .trim()
    .max(120, 'Custom improvement must be 120 characters or less.'),
  notify: z.boolean(),
});

const ratingPayloadSchema = z.object({
  ratings: z.number().min(1, 'Please select a rating.'),
  improvement: z.array(z.string().trim().min(1)),
  customImprovement: z
    .string()
    .trim()
    .max(120, 'Custom improvement must be 120 characters or less.'),
  notify: z.boolean(),
  userId: z.string().trim().min(1),
  userEmail: z.string().trim().email(),
});

type RatingFormValues = z.infer<typeof ratingFormSchema>;

const DEFAULT_FORM_VALUES: RatingFormValues = {
  ratings: 0,
  improvement: [],
  customImprovement: '',
  notify: true,
};

export const FeedbackRatingModal = () => {
  const ratingStore = useGlobalStore((state) => state.rating);
  const userId = useGlobalStore((state) => state.authenticate.userId);
  const userEmail = useGlobalStore((state) => state.authenticate.email);
  const license = useLicenseContext();

  const form = useForm<RatingFormValues>({
    resolver: zodResolver(ratingFormSchema),
    defaultValues: DEFAULT_FORM_VALUES,
  });
  const improvementFieldArray = useFieldArray({
    control: form.control,
    name: 'improvement',
  });

  const ratings = form.watch('ratings');
  const improvement = improvementFieldArray.fields;
  const customImprovement = form.watch('customImprovement') ?? '';
  const notify = form.watch('notify');
  const isSubmitting = form.formState.isSubmitting;

  const setRatingModalOpen = (open: boolean) => {
    ratingStore.setIsOpen(open);

    if (!open) {
      form.reset(DEFAULT_FORM_VALUES);
    }
  };

  const toggleImprovement = (value: string, checked: boolean) => {
    const index = improvement.findIndex((item) => item.value === value);

    if (checked) {
      if (index !== -1) return;
      improvementFieldArray.append({ value });
      return;
    }

    if (index !== -1) {
      improvementFieldArray.remove(index);
    }
  };

  const onSubmit = form.handleSubmit(async (values) => {
    const payloadResult = ratingPayloadSchema.safeParse({
      ratings: values.ratings,
      improvement: values.improvement.map((item) => item.value),
      customImprovement: values.customImprovement ?? '',
      notify: values.notify,
      userId: (userId ?? 'Anonymous').trim(),
      userEmail: (userEmail ?? 'user@anonymous.test').trim(),
    });

    if (!payloadResult.success) {
      toaster.error({
        description: 'Unable to read your contact info. Please login again.',
      });
      return;
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL_PORTAL_API?.replace(
      /\/$/,
      '',
    );

    if (!baseUrl) {
      toaster.error({ description: 'Rating endpoint is not configured.' });
      return;
    }

    try {
      await axios.post('/rating', payloadResult.data, {
        baseURL: baseUrl,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      toaster.success({
        description: 'Thanks! Your rating was submitted.',
      });
      setRatingModalOpen(false);
      license.clearLicense();
    } catch (error) {
      console.error('Failed to submit rating:', error);
      toaster.error({ description: 'Failed to submit rating. Please retry.' });
    }
  });

  return (
    <Dialog.Root
      open={ratingStore.isOpen}
      onOpenChange={(details) => setRatingModalOpen(details.open)}
      closeOnInteractOutside={false}
      closeOnEscape={!isSubmitting}
    >
      <Dialog.Backdrop />
      <Dialog.Positioner className="flex items-center justify-center p-2 sm:px-8 sm:py-12">
        <Dialog.Content className="sm:w-auto min-w-0 flex max-h-[calc(100dvh-1rem)] w-auto  flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 shadow-xl sm:max-h-[calc(100dvh-4rem)] sm:p-6">
          <div className="flex items-start justify-between gap-3 sm:gap-4">
            <div>
              <Dialog.Title className="text-base font-semibold text-gray-900 sm:text-xl">
                Rate Your Experience
              </Dialog.Title>
              <Dialog.Description className="mt-1 pr-2 text-xs text-gray-500 sm:text-sm">
                Your license expired. Tell us how we can improve.
              </Dialog.Description>
            </div>
          </div>

          <form
            className="mt-4 flex-1  space-y-4 overflow-y-auto pr-1 sm:mt-5 sm:space-y-5"
            onSubmit={onSubmit}
          >
            <Field.Root invalid={!!form.formState.errors.ratings}>
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-800">
                  1. How would you rate us?
                </p>
                <div className="flex items-center gap-1 sm:gap-2">
                  {[1, 2, 3, 4, 5].map((value) => {
                    const active = value <= ratings;

                    return (
                      <button
                        key={value}
                        type="button"
                        aria-label={`Rate ${value} star${value > 1 ? 's' : ''}`}
                        className="rounded-md p-1.5 transition hover:scale-105"
                        onClick={() =>
                          form.setValue('ratings', value, {
                            shouldValidate: true,
                            shouldDirty: true,
                          })
                        }
                        disabled={isSubmitting}
                      >
                        <Star
                          className={
                            active
                              ? 'h-6 w-6 fill-amber-400 text-amber-400 sm:h-7 sm:w-7'
                              : 'h-6 w-6 text-gray-300 sm:h-7 sm:w-7'
                          }
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
              <Field.ErrorText>
                {form.formState.errors.ratings?.message}
              </Field.ErrorText>
            </Field.Root>

            <div className="space-y-3">
              <p className="text-sm font-semibold text-gray-800">
                2. What should we improve?
              </p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {IMPROVEMENT_OPTIONS.map((item) => (
                  <Checkbox.Root
                    key={item}
                    className="items-start"
                    checked={improvement.some(
                      (selected) => selected.value === item,
                    )}
                    onCheckedChange={(details) =>
                      toggleImprovement(item, Boolean(details.checked))
                    }
                  >
                    <Checkbox.Control>
                      <Checkbox.Indicator asChild>
                        <Check className="h-4 w-4" />
                      </Checkbox.Indicator>
                    </Checkbox.Control>
                    <Checkbox.Label className="text-sm leading-5 text-gray-700">
                      {item}
                    </Checkbox.Label>
                    <Checkbox.HiddenInput />
                  </Checkbox.Root>
                ))}
              </div>
            </div>

            {improvement.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {improvement.map((item) => (
                  <span
                    key={item.id}
                    className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-medium text-cyan-800"
                  >
                    {item.value}
                  </span>
                ))}
              </div>
            )}

            <Field.Root invalid={!!form.formState.errors.customImprovement}>
              <div className="space-y-2">
                <label
                  htmlFor="customImprovement"
                  className="text-sm font-semibold text-gray-800"
                >
                  3. Any other suggestions or other inquiries?
                </label>
                <textarea
                  id="customImprovement"
                  className="min-h-[88px] w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm outline-none transition focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100 disabled:cursor-not-allowed disabled:bg-gray-100"
                  placeholder="Share details (optional)"
                  maxLength={120}
                  {...form.register('customImprovement')}
                  disabled={isSubmitting}
                />
                <p className="text-right text-xs text-gray-500">
                  {customImprovement.length}/120
                </p>
              </div>
              <Field.ErrorText>
                {form.formState.errors.customImprovement?.message}
              </Field.ErrorText>
            </Field.Root>

            <div className="space-y-3">
              <p className="text-sm font-semibold text-gray-800">
                4. Stay updated
              </p>
              <Checkbox.Root
                className="items-start"
                checked={notify}
                onCheckedChange={(details) =>
                  form.setValue('notify', Boolean(details.checked))
                }
              >
                <Checkbox.Control>
                  <Checkbox.Indicator asChild>
                    <Check className="h-4 w-4" />
                  </Checkbox.Indicator>
                </Checkbox.Control>
                <Checkbox.Label className="text-sm leading-5 text-gray-700">
                  Notify me for upcoming updates and promotions
                </Checkbox.Label>
                <Checkbox.HiddenInput />
              </Checkbox.Root>
            </div>

            <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
              <Button
                type="submit"
                className="h-10 w-full rounded-lg bg-cyan-700 px-4 text-white disabled:bg-gray-300 sm:w-auto"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit rating'}
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};
