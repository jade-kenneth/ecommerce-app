'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Check, LoaderCircle, MapPinned, Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import z from 'zod';
import { DebounceInput } from '~/components';
import { Input } from '~/components/Input';
import { Popover } from '~/components/Popover';
import { Field } from '~/components/ui/Field';

const shippingAddressSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  emailAddress: z.string().email('Enter a valid email address'),
  addressLine1: z.string().min(1, 'Address line 1 is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  province: z.string().min(1, 'Province is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  notes: z.string().optional(),
});

type ShippingAddressFormValues = z.infer<typeof shippingAddressSchema>;

type AddressFeatureProperties = {
  address_line1?: string;
  address_line2?: string;
  city?: string;
  town?: string;
  village?: string;
  suburb?: string;
  state?: string;
  county?: string;
  postcode?: string;
  formatted?: string;
};

type GeoapifyFeature = {
  properties?: AddressFeatureProperties;
};

const defaultShippingAddressValues: ShippingAddressFormValues = {
  firstName: '',
  lastName: '',
  phoneNumber: '',
  emailAddress: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  province: '',
  postalCode: '',
  notes: '',
};

const sectionCardClassName =
  'rounded-2xl bg-white/95 p-5 shadow-[0_12px_30px_rgba(2,6,23,0.08)]';

const labelClassName = 'mb-2 block text-sm font-medium text-carbon-500';

const inputRootClassName =
  'w-full !border-0 rounded-xl bg-white shadow-[0_6px_16px_rgba(2,6,23,0.1)] transition duration-200 focus-within:shadow-[0_0_0_3px_rgba(6,182,212,0.18),0_14px_24px_rgba(2,6,23,0.14)]';

const inputTextClassName =
  'w-full bg-transparent px-4 py-3 text-sm text-carbon-25';

const searchHelpTextClassName = 'mt-2 text-xs text-carbon-500';

const sectionDescriptionClassName = 'mt-1 text-xs text-carbon-500';

const searchStateClassName =
  'flex items-center justify-center gap-2 px-4 py-4 text-center text-sm text-carbon-500';

export function ShippingAddress() {
  const form = useForm<ShippingAddressFormValues>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: defaultShippingAddressValues,
    mode: 'onBlur',
  });

  const geolocationApiKey = process.env.NEXT_PUBLIC_GEOLOCATION_API_KEY;
  const [addressSearch, setAddressSearch] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState<GeoapifyFeature[]>(
    [],
  );
  const [isSearchingAddress, setIsSearchingAddress] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchAbortRef = useRef<AbortController | null>(null);

  const { setValue } = form;

  useEffect(() => {
    if (!geolocationApiKey) return;

    const query = addressSearch.trim();

    if (query.length < 3) {
      setSearchSuggestions([]);
      setIsSearchOpen(false);
      setIsSearchingAddress(false);
      if (searchAbortRef.current) {
        searchAbortRef.current.abort();
        searchAbortRef.current = null;
      }
      return;
    }

    if (searchAbortRef.current) {
      searchAbortRef.current.abort();
    }

    const abortController = new AbortController();
    searchAbortRef.current = abortController;

    setIsSearchingAddress(true);
    setIsSearchOpen(true);

    const fetchSuggestions = async () => {
      try {
        const params = new URLSearchParams({
          text: query,
          apiKey: geolocationApiKey,
          lang: 'en',
          limit: '5',
        });

        const response = await fetch(
          `https://api.geoapify.com/v1/geocode/autocomplete?${params.toString()}`,
          { signal: abortController.signal },
        );

        if (!response.ok) {
          setSearchSuggestions([]);
          return;
        }

        const data = (await response.json()) as {
          features?: GeoapifyFeature[];
        };

        setSearchSuggestions(data.features ?? []);
      } catch (error) {
        const err = error as { name?: string };
        if (err?.name !== 'AbortError') {
          setSearchSuggestions([]);
        }
      } finally {
        setIsSearchingAddress(false);
      }
    };

    void fetchSuggestions();

    return () => abortController.abort();
  }, [addressSearch, geolocationApiKey]);

  useEffect(() => {
    return () => {
      if (searchAbortRef.current) {
        searchAbortRef.current.abort();
      }
    };
  }, []);

  const applyAddressSuggestion = (properties?: AddressFeatureProperties) => {
    if (!properties) return;

    if (properties.address_line1 || properties.formatted) {
      setValue(
        'addressLine1',
        properties.address_line1 ?? properties.formatted ?? '',
        { shouldDirty: true, shouldTouch: true, shouldValidate: true },
      );
    }

    if (properties.address_line2) {
      setValue('addressLine2', properties.address_line2, {
        shouldDirty: true,
        shouldTouch: true,
      });
    }

    const cityValue =
      properties.city ??
      properties.town ??
      properties.village ??
      properties.suburb;
    if (cityValue) {
      setValue('city', cityValue, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    }

    const provinceValue = properties.state ?? properties.county;
    if (provinceValue) {
      setValue('province', provinceValue, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    }

    if (properties.postcode) {
      setValue('postalCode', properties.postcode, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    }
  };

  const getSuggestionMeta = (properties?: AddressFeatureProperties) => {
    const parts = [
      properties?.city ??
        properties?.town ??
        properties?.village ??
        properties?.suburb,
      properties?.state ?? properties?.county,
      properties?.postcode,
    ].filter(Boolean);

    return parts.join(' • ');
  };

  return (
    <section className="mt-5 rounded-3xl bg-gradient-to-br from-white via-cyan-50/40 to-white p-6 ring-1 ring-cyan-100/60 shadow-[0_20px_45px_rgba(2,6,23,0.08)] sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-cyan-600 p-2 text-white shadow-sm">
            <MapPinned className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Shipping Address
            </h2>
            <p className="text-sm text-carbon-500">
              Enter your delivery details before placing the order.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-5">
        <div className={sectionCardClassName}>
          <h3 className="text-base font-semibold text-carbon-25">
            Contact Details
          </h3>
          <p className={sectionDescriptionClassName}>
            We use these details for order updates and delivery coordination.
          </p>

          <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field.Root invalid={!!form.formState.errors.firstName}>
              <Field.Label
                className={labelClassName}
                htmlFor="shipping-first-name"
              >
                First name
              </Field.Label>
              <Controller
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <Input
                    className={inputRootClassName}
                    value={field.value ?? ''}
                    onChange={field.onChange}
                    rightAddon={
                      form.formState.dirtyFields.firstName &&
                      !form.formState.errors.firstName ? (
                        <Check className="h-4 w-4 text-cyan-700" />
                      ) : null
                    }
                    inputProps={{
                      id: 'shipping-first-name',
                      name: field.name,
                      placeholder: 'Juan',
                      autoComplete: 'given-name',
                      onBlur: field.onBlur,
                      className: inputTextClassName,
                    }}
                  />
                )}
              />
              <Field.ErrorText>
                {form.formState.errors.firstName?.message}
              </Field.ErrorText>
            </Field.Root>

            <Field.Root invalid={!!form.formState.errors.lastName}>
              <Field.Label
                className={labelClassName}
                htmlFor="shipping-last-name"
              >
                Last name
              </Field.Label>
              <Controller
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <Input
                    className={inputRootClassName}
                    value={field.value ?? ''}
                    onChange={field.onChange}
                    rightAddon={
                      form.formState.dirtyFields.lastName &&
                      !form.formState.errors.lastName ? (
                        <Check className="h-4 w-4 text-cyan-700" />
                      ) : null
                    }
                    inputProps={{
                      id: 'shipping-last-name',
                      name: field.name,
                      placeholder: 'Dela Cruz',
                      autoComplete: 'family-name',
                      onBlur: field.onBlur,
                      className: inputTextClassName,
                    }}
                  />
                )}
              />
              <Field.ErrorText>
                {form.formState.errors.lastName?.message}
              </Field.ErrorText>
            </Field.Root>

            <Field.Root invalid={!!form.formState.errors.phoneNumber}>
              <Field.Label
                className={labelClassName}
                htmlFor="shipping-phone-number"
              >
                Phone number
              </Field.Label>
              <Controller
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <Input
                    className={inputRootClassName}
                    value={field.value ?? ''}
                    onChange={field.onChange}
                    rightAddon={
                      form.formState.dirtyFields.phoneNumber &&
                      !form.formState.errors.phoneNumber ? (
                        <Check className="h-4 w-4 text-cyan-700" />
                      ) : null
                    }
                    inputProps={{
                      id: 'shipping-phone-number',
                      name: field.name,
                      placeholder: '+63 912 345 6789',
                      autoComplete: 'tel',
                      type: 'tel',
                      onBlur: field.onBlur,
                      className: inputTextClassName,
                    }}
                  />
                )}
              />
              <Field.ErrorText>
                {form.formState.errors.phoneNumber?.message}
              </Field.ErrorText>
            </Field.Root>

            <Field.Root invalid={!!form.formState.errors.emailAddress}>
              <Field.Label
                className={labelClassName}
                htmlFor="shipping-email-address"
              >
                Email address
              </Field.Label>
              <Controller
                control={form.control}
                name="emailAddress"
                render={({ field }) => (
                  <Input
                    className={inputRootClassName}
                    value={field.value ?? ''}
                    onChange={field.onChange}
                    rightAddon={
                      form.formState.dirtyFields.emailAddress &&
                      !form.formState.errors.emailAddress ? (
                        <Check className="h-4 w-4 text-cyan-700" />
                      ) : null
                    }
                    inputProps={{
                      id: 'shipping-email-address',
                      name: field.name,
                      placeholder: 'juan@email.com',
                      autoComplete: 'email',
                      type: 'email',
                      onBlur: field.onBlur,
                      className: inputTextClassName,
                    }}
                  />
                )}
              />
              {form.formState.errors.emailAddress?.message ? (
                <Field.ErrorText>
                  {form.formState.errors.emailAddress.message}
                </Field.ErrorText>
              ) : null}
            </Field.Root>
          </div>
        </div>

        <div className={sectionCardClassName}>
          <h3 className="text-base font-semibold text-carbon-25">
            Delivery Location
          </h3>
          <p className={sectionDescriptionClassName}>
            Add your complete address to prevent delivery delays.
          </p>

          <Field.Root className="relative mb-6 mt-4">
            <Field.Label
              className={labelClassName}
              htmlFor="shipping-address-search"
            >
              Search address (optional)
            </Field.Label>

            {!geolocationApiKey ? (
              <p className="mb-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
                Address search is unavailable. Add your address manually below.
              </p>
            ) : null}

            <Popover.Root
              open={isSearchOpen}
              onOpenChange={(details) => setIsSearchOpen(details.open)}
              autoFocus={false}
              closeOnInteractOutside
              positioning={{ sameWidth: true }}
            >
              <Popover.Anchor>
                <DebounceInput
                  className={inputRootClassName}
                  placeholder="Type at least 3 characters to search..."
                  value={addressSearch}
                  onChange={(value) => {
                    setAddressSearch(value);
                  }}
                  rightAddon={
                    isSearchingAddress ? (
                      <LoaderCircle className="h-4 w-4 mr-4 animate-spin text-cyan-700" />
                    ) : (
                      <Search className="h-4 w-4 mr-4  text-carbon-400" />
                    )
                  }
                  inputProps={{
                    id: 'shipping-address-search',
                    name: 'shipping-address-search',
                    autoComplete: 'off',
                    onFocus: () => {
                      if (addressSearch.trim().length >= 3) {
                        setIsSearchOpen(true);
                      }
                    },
                    onBlur: () => {
                      setIsSearchOpen(false);
                    },
                  }}
                />
              </Popover.Anchor>

              <Popover.Positioner>
                <Popover.Content className="w-full max-h-72 overflow-y-auto rounded-xl  bg-white p-0 shadow-lg">
                  {isSearchingAddress ? (
                    <div className={searchStateClassName}>
                      <LoaderCircle className="h-4 w-4 animate-spin text-cyan-700" />
                      Searching addresses...
                    </div>
                  ) : null}

                  {!isSearchingAddress &&
                    searchSuggestions.map((feature, index) => {
                      const formatted =
                        feature.properties?.formatted ?? 'Unknown address';
                      const meta = getSuggestionMeta(feature.properties);

                      return (
                        <button
                          key={`${formatted}-${index}`}
                          type="button"
                          className="block w-full  px-4 py-3 text-left last:border-b-0 hover:bg-cyan-50"
                          onMouseDown={(event) => {
                            event.preventDefault();
                            setAddressSearch(formatted);
                            applyAddressSuggestion(feature.properties);
                            setIsSearchOpen(false);
                          }}
                        >
                          <p className="text-sm font-medium text-carbon-25">
                            {formatted}
                          </p>
                          {meta ? (
                            <p className="mt-1 text-xs text-carbon-500">
                              {meta}
                            </p>
                          ) : null}
                        </button>
                      );
                    })}

                  {!isSearchingAddress && searchSuggestions.length === 0 ? (
                    <div className={searchStateClassName}>
                      <Search className="h-4 w-4 text-carbon-400" />
                      No matching addresses found
                    </div>
                  ) : null}
                </Popover.Content>
              </Popover.Positioner>
            </Popover.Root>

            <p className={searchHelpTextClassName}>
              Selecting a suggestion can auto-fill address, city, province, and
              postal code.
            </p>
          </Field.Root>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field.Root
              invalid={!!form.formState.errors.addressLine1}
              className="md:col-span-2"
            >
              <Field.Label
                className={labelClassName}
                htmlFor="shipping-address-line-1"
              >
                Address line 1
              </Field.Label>
              <Controller
                control={form.control}
                name="addressLine1"
                render={({ field }) => (
                  <Input
                    className={inputRootClassName}
                    value={field.value ?? ''}
                    onChange={field.onChange}
                    rightAddon={
                      form.formState.dirtyFields.addressLine1 &&
                      !form.formState.errors.addressLine1 ? (
                        <Check className="h-4 w-4 text-cyan-700" />
                      ) : null
                    }
                    inputProps={{
                      id: 'shipping-address-line-1',
                      name: field.name,
                      placeholder: 'House/Unit, Street, Barangay',
                      autoComplete: 'address-line1',
                      onBlur: field.onBlur,
                      className: inputTextClassName,
                    }}
                  />
                )}
              />
              <Field.ErrorText>
                {form.formState.errors.addressLine1?.message}
              </Field.ErrorText>
            </Field.Root>

            <Field.Root className="md:col-span-2">
              <Field.Label
                className={labelClassName}
                htmlFor="shipping-address-line-2"
              >
                Address line 2 (optional)
              </Field.Label>
              <Controller
                control={form.control}
                name="addressLine2"
                render={({ field }) => (
                  <Input
                    className={inputRootClassName}
                    value={field.value ?? ''}
                    onChange={field.onChange}
                    rightAddon={
                      form.formState.dirtyFields.addressLine2 ? (
                        <Check className="h-4 w-4 text-cyan-700" />
                      ) : null
                    }
                    inputProps={{
                      id: 'shipping-address-line-2',
                      name: field.name,
                      placeholder: 'Landmark, building, floor',
                      autoComplete: 'address-line2',
                      onBlur: field.onBlur,
                      className: inputTextClassName,
                    }}
                  />
                )}
              />
            </Field.Root>

            <Field.Root invalid={!!form.formState.errors.city}>
              <Field.Label className={labelClassName} htmlFor="shipping-city">
                City
              </Field.Label>
              <Controller
                control={form.control}
                name="city"
                render={({ field }) => (
                  <Input
                    className={inputRootClassName}
                    value={field.value ?? ''}
                    onChange={field.onChange}
                    rightAddon={
                      form.formState.dirtyFields.city &&
                      !form.formState.errors.city ? (
                        <Check className="h-4 w-4 text-cyan-700" />
                      ) : null
                    }
                    inputProps={{
                      id: 'shipping-city',
                      name: field.name,
                      placeholder: 'Quezon City',
                      autoComplete: 'address-level2',
                      onBlur: field.onBlur,
                      className: inputTextClassName,
                    }}
                  />
                )}
              />
              <Field.ErrorText>
                {form.formState.errors.city?.message}
              </Field.ErrorText>
            </Field.Root>

            <Field.Root invalid={!!form.formState.errors.province}>
              <Field.Label
                className={labelClassName}
                htmlFor="shipping-province"
              >
                Province
              </Field.Label>
              <Controller
                control={form.control}
                name="province"
                render={({ field }) => (
                  <Input
                    className={inputRootClassName}
                    value={field.value ?? ''}
                    onChange={field.onChange}
                    rightAddon={
                      form.formState.dirtyFields.province &&
                      !form.formState.errors.province ? (
                        <Check className="h-4 w-4 text-cyan-700" />
                      ) : null
                    }
                    inputProps={{
                      id: 'shipping-province',
                      name: field.name,
                      placeholder: 'Metro Manila',
                      autoComplete: 'address-level1',
                      onBlur: field.onBlur,
                      className: inputTextClassName,
                    }}
                  />
                )}
              />
              <Field.ErrorText>
                {form.formState.errors.province?.message}
              </Field.ErrorText>
            </Field.Root>

            <Field.Root invalid={!!form.formState.errors.postalCode}>
              <Field.Label
                className={labelClassName}
                htmlFor="shipping-postal-code"
              >
                Postal code
              </Field.Label>
              <Controller
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <Input
                    className={inputRootClassName}
                    value={field.value ?? ''}
                    onChange={field.onChange}
                    rightAddon={
                      form.formState.dirtyFields.postalCode &&
                      !form.formState.errors.postalCode ? (
                        <Check className="h-4 w-4 text-cyan-700" />
                      ) : null
                    }
                    inputProps={{
                      id: 'shipping-postal-code',
                      name: field.name,
                      placeholder: '1100',
                      autoComplete: 'postal-code',
                      inputMode: 'numeric',
                      onBlur: field.onBlur,
                      className: inputTextClassName,
                    }}
                  />
                )}
              />
              <Field.ErrorText>
                {form.formState.errors.postalCode?.message}
              </Field.ErrorText>
            </Field.Root>

            <Field.Root className="md:col-span-2">
              <Field.Label className={labelClassName} htmlFor="shipping-notes">
                Delivery notes (optional)
              </Field.Label>
              <textarea
                id="shipping-notes"
                {...form.register('notes')}
                placeholder="Special instructions for delivery..."
                rows={3}
                className="w-full resize-none rounded-xl bg-white px-4 py-3 text-sm text-carbon-25 shadow-[0_6px_16px_rgba(2,6,23,0.1)] outline-none transition duration-200 focus:shadow-[0_0_0_3px_rgba(6,182,212,0.18),0_14px_24px_rgba(2,6,23,0.14)]"
              />
            </Field.Root>
          </div>
        </div>

        <div className="rounded-xl border border-cyan-100 bg-cyan-50/70 p-3 text-xs text-cyan-900">
          Delivery riders may call the provided phone number if they need help
          finding your location.
        </div>
      </div>
    </section>
  );
}

export default ShippingAddress;
