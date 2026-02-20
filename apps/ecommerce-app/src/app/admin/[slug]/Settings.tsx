import { zodResolver } from '@hookform/resolvers/zod';

import {
  PaymentMethodType,
  ShippingType,
  useCheckoutMethodSettingsQuery,
  useConfigQuery,
  useCreateConfigMutation,
  useUpdateConfigMutation,
  useUpdatePaymentMethodStatusMutation,
  useUpdateShippingMethodStatusMutation,
} from '~/graphql/generated';

import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Button,
  CarouselFileUpload,
  Field,
  FieldInput,
  Toggle,
  toaster,
} from '~/components';

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
  const methodsQuery = useCheckoutMethodSettingsQuery({
    fetchPolicy: 'network-only',
  });
  const [updateShippingMethodStatus, shippingMethodMutation] =
    useUpdateShippingMethodStatusMutation();
  const [updatePaymentMethodStatus, paymentMethodMutation] =
    useUpdatePaymentMethodStatusMutation();

  useEffect(() => {
    form.reset({
      highPointsThreshold: config?.highPointsThreshold?.toString() || '0',
      topSoldThreshold: config?.topSoldThreshold?.toString() || '0',
      carouselItems: config?.carouselItems ?? [],
    });
  }, [config, form]);

  const isUpdatingMethod =
    shippingMethodMutation.loading || paymentMethodMutation.loading;

  const handleShippingMethodToggle = async (params: {
    type: ShippingType;
    label: string;
    isActive: boolean;
  }) => {
    try {
      await updateShippingMethodStatus({
        variables: {
          input: {
            type: params.type,
            isActive: !params.isActive,
          },
        },
      });

      toaster.success({
        description: `${params.label} shipping ${
          params.isActive ? 'disabled' : 'enabled'
        }.`,
      });
    } catch {
      toaster.error({
        description:
          'Unable to update shipping method. Keep at least one active option.',
      });
    }
  };

  const handlePaymentMethodToggle = async (params: {
    type: PaymentMethodType;
    label: string;
    isActive: boolean;
  }) => {
    try {
      await updatePaymentMethodStatus({
        variables: {
          input: {
            type: params.type,
            isActive: !params.isActive,
          },
        },
      });

      toaster.success({
        description: `${params.label} payment ${
          params.isActive ? 'disabled' : 'enabled'
        }.`,
      });
    } catch {
      toaster.error({
        description:
          'Unable to update payment method. Keep at least one active option.',
      });
    }
  };

  return (
    <form
      className="flex flex-col gap-8"
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
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500">
            Manage operational thresholds and homepage content in one place.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Threshold Settings
          </h2>
          <p className="text-sm text-gray-500">
            Control which products appear as high points and top sold.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Controller
            name={'highPointsThreshold'}
            control={form.control}
            render={({ field }) => (
              <div className="flex flex-col gap-2">
                <FieldInput
                  value={field.value?.toString() || '0'}
                  onChange={field.onChange}
                  required
                  label="High points threshold"
                />
                <p className="text-xs text-gray-500">
                  Minimum points to qualify as high points.
                </p>
              </div>
            )}
          />
          <Controller
            control={form.control}
            name="topSoldThreshold"
            render={({ field }) => (
              <div className="flex flex-col gap-2">
                <FieldInput
                  value={field.value?.toString() || '0'}
                  onChange={field.onChange}
                  required
                  label="Top sold threshold"
                />
                <p className="text-xs text-gray-500">
                  Minimum sold count to qualify as top sold.
                </p>
              </div>
            )}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Checkout Methods
          </h2>
          <p className="text-sm text-gray-500">
            Toggle which shipping and payment methods customers can use at
            checkout.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold text-gray-700">
              Shipping Methods
            </p>

            {methodsQuery.data?.shippingOptions.map((method) => (
              <div
                key={method._id}
                className="flex items-center justify-between rounded-xl border border-gray-200 p-3"
              >
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    {method.label}
                  </p>
                  <p className="text-xs text-gray-500">
                    {method.description || method.estimatedDays || 'No details'}
                  </p>
                  <p className="text-xs text-gray-500">Fee: PHP {method.fee}</p>
                </div>
                <Toggle.Root
                  aria-label={`Toggle ${method.label}`}
                  pressed={method.isActive}
                  disabled={methodsQuery.loading || isUpdatingMethod}
                  onPressedChange={() => {
                    void handleShippingMethodToggle({
                      type: method.type,
                      label: method.label,
                      isActive: method.isActive,
                    });
                  }}
                  className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors ${
                    method.isActive ? 'bg-cyan-600' : 'bg-gray-300'
                  }`}
                >
                  <Toggle.Indicator
                    className={`absolute h-5 w-5 rounded-full bg-white shadow transition-transform ${
                      method.isActive ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </Toggle.Root>
              </div>
            ))}
            {methodsQuery.loading && (
              <p className="text-xs text-gray-500">
                Loading shipping methods...
              </p>
            )}
            {!methodsQuery.loading &&
              !methodsQuery.data?.shippingOptions.length && (
                <p className="text-xs text-gray-500">
                  No shipping methods found.
                </p>
              )}
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold text-gray-700">
              Payment Methods
            </p>

            {methodsQuery.data?.paymentMethods.map((method) => (
              <div
                key={method._id}
                className="flex items-center justify-between rounded-xl border border-gray-200 p-3"
              >
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    {method.label}
                  </p>
                  <p className="text-xs text-gray-500">
                    {method.description || 'No details'}
                  </p>
                </div>
                <Toggle.Root
                  aria-label={`Toggle ${method.label}`}
                  pressed={method.isActive}
                  disabled={methodsQuery.loading || isUpdatingMethod}
                  onPressedChange={() => {
                    void handlePaymentMethodToggle({
                      type: method.type,
                      label: method.label,
                      isActive: method.isActive,
                    });
                  }}
                  className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors ${
                    method.isActive ? 'bg-cyan-600' : 'bg-gray-300'
                  }`}
                >
                  <Toggle.Indicator
                    className={`absolute h-5 w-5 rounded-full bg-white shadow transition-transform ${
                      method.isActive ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </Toggle.Root>
              </div>
            ))}
            {methodsQuery.loading && (
              <p className="text-xs text-gray-500">
                Loading payment methods...
              </p>
            )}
            {!methodsQuery.loading &&
              !methodsQuery.data?.paymentMethods.length && (
                <p className="text-xs text-gray-500">
                  No payment methods found.
                </p>
              )}
          </div>
        </div>
      </div>

      <Controller
        control={form.control}
        name="carouselItems"
        render={({ field }) => {
          return (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Homepage Carousel
                </h2>
                <p className="text-sm text-gray-500">
                  Upload up to 5 images to highlight seasonal promotions.
                </p>
              </div>
              <Field.Root>
                <Field.Label>Carousel Images</Field.Label>
                <CarouselFileUpload
                  maxFiles={5}
                  value={field.value}
                  onChange={field.onChange}
                />
              </Field.Root>
            </div>
          );
        }}
      />

      <div className="flex justify-end">
        <Button type="submit" className="px-6">
          Save Changes
        </Button>
      </div>
    </form>
  );
}
