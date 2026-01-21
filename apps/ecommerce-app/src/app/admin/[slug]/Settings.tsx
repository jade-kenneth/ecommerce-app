import { zodResolver } from '@hookform/resolvers/zod';
import { Field } from '~/components/ui';
import {
  useConfigQuery,
  useCreateConfigMutation,
  useUpdateConfigMutation,
} from '~/graphql/generated';

import { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '~/components/Button';
import { CarouselFileUpload } from '~/components/CarouselFileUpload';
import { FieldInput } from '~/components/FieldInput';
import { toaster } from '~/components/ToastContainer';

const Definition = z.object({
  highPointsThreshold: z.string().min(0).default('0'),
  topSoldThreshold: z.string().min(0).default('0'),
  carouselItems: z.array(z.string()).default([]),
});

export function Settings() {
  const { data } = useConfigQuery();
  const config = data?.config;

  const form = useForm({
    resolver: zodResolver(Definition),
  });

  const [update] = useUpdateConfigMutation();
  const [create] = useCreateConfigMutation();

  useMemo(
    () =>
      form.reset({
        highPointsThreshold: config?.highPointsThreshold?.toString() || '0',
        topSoldThreshold: config?.topSoldThreshold?.toString() || '0',
        carouselItems: config?.carouselItems ?? [],
      }),
    [data]
  );

  return (
    <form
      className="p-7"
      onSubmit={form.handleSubmit(async (data) => {
        if (!config?._id) {
          await create({
            variables: {
              input: {
                _id: 'FIXME',
                highPointsThreshold: parseInt(data.highPointsThreshold, 10),
                topSoldThreshold: parseInt(data.topSoldThreshold, 10),
                carouselItems: data.carouselItems || [],
              },
            },
          });

          return;
        }

        await update({
          variables: {
            input: {
              _id: config?._id || '',
              highPointsThreshold: parseInt(data.highPointsThreshold, 10),
              topSoldThreshold: parseInt(data.topSoldThreshold, 10),
              carouselItems: data.carouselItems || [],
            },
          },
        });
        toaster.success({ description: 'Configuration saved!' });
      })}
    >
      <h1 className="text-2xl font-bold mb-1">Settings</h1>
      <p className="text-xl">Manage your application settings here.</p>

      <Controller
        name={'highPointsThreshold'}
        control={form.control}
        render={({ field }) => {
          return (
            <FieldInput
              value={field.value?.toString() || '0'}
              onChange={field.onChange}
              className="mt-8 w-[300px]"
              required
              label="High points threshold"
            />
          );
        }}
      />
      <Controller
        control={form.control}
        name="topSoldThreshold"
        render={({ field }) => {
          return (
            <FieldInput
              value={field.value?.toString() || '0'}
              onChange={field.onChange}
              className="mt-8 w-[300px]"
              required
              label="Top sold threshold"
            />
          );
        }}
      />

      <Controller
        control={form.control}
        name="carouselItems"
        render={({ field }) => {
          return (
            <Field.Root className="mt-8">
              <Field.Label>Homepage Carousel</Field.Label>
              <CarouselFileUpload
                maxFiles={5}
                value={field.value}
                onChange={field.onChange}
              />
            </Field.Root>
          );
        }}
      />

      <Button type="submit" className="mt-4">
        Save Changes
      </Button>
    </form>
  );
}
