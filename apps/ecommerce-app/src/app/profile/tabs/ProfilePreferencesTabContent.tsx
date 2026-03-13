'use client';

import { Check } from 'lucide-react';

import { Button, toaster } from '~/components';
import { Checkbox } from '~/components/Primitives/Checkbox';
import { Field } from '~/components/Primitives/Field';
import { useProfileContext } from '../ProfileContext';

export default function ProfilePreferencesTabContent() {
  const {
    state: { preferences },
    dispatch,
  } = useProfileContext();

  return (
    <>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1fr]">
        <section className="rounded-2xl border border-gray-100 bg-white p-5">
          <p className="text-base font-semibold text-gray-900">Account Preferences</p>
          <p className="mt-1 text-sm text-gray-500">
            Choose your language and currency for a personalized experience.
          </p>

          <div className="mt-5 grid grid-cols-1 gap-4">
            <Field.Root>
              <Field.Label>Preferred language</Field.Label>
              <Field.Select
                value={preferences.language}
                onChange={(event) =>
                  dispatch({
                    type: 'patch_preferences',
                    patch: { language: event.target.value },
                  })
                }
              >
                <option value="en">English</option>
                <option value="fil">Filipino</option>
              </Field.Select>
            </Field.Root>

            <Field.Root>
              <Field.Label>Preferred currency</Field.Label>
              <Field.Select
                value={preferences.currency}
                onChange={(event) =>
                  dispatch({
                    type: 'patch_preferences',
                    patch: { currency: event.target.value },
                  })
                }
              >
                <option value="PHP">PHP - Philippine Peso</option>
                <option value="USD">USD - US Dollar</option>
              </Field.Select>
            </Field.Root>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-100 bg-white p-5">
          <p className="text-base font-semibold text-gray-900">Marketing Preferences</p>
          <p className="mt-1 text-sm text-gray-500">
            Control whether you receive product updates and promos.
          </p>

          <Checkbox.Root
            className="mt-5 flex items-start gap-3 rounded-xl border border-gray-200 p-4"
            checked={preferences.marketingOptIn}
            onCheckedChange={() =>
              dispatch({
                type: 'patch_preferences',
                patch: { marketingOptIn: !preferences.marketingOptIn },
              })
            }
          >
            <Checkbox.Control>
              <Checkbox.Indicator asChild>
                <Check className="h-4 w-4" />
              </Checkbox.Indicator>
            </Checkbox.Control>
            <div className="flex-1">
              <Checkbox.Label className="text-sm font-semibold text-gray-800">
                Receive marketing emails
              </Checkbox.Label>
              <p className="text-xs text-gray-500">
                Get updates for new arrivals, discounts, and seasonal campaigns.
              </p>
            </div>
            <Checkbox.HiddenInput />
          </Checkbox.Root>
        </section>
      </div>

      <div className="mt-6">
        <Button
          className="rounded-[32px] bg-cyan-700 px-6 text-white"
          onClick={() => toaster.success({ description: 'Preferences saved.' })}
        >
          Save Preferences
        </Button>
      </div>
    </>
  );
}
