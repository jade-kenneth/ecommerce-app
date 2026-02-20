import { Inject, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { Tokens } from '../../../types/tokens';
import {
  PaymentMethod,
  PaymentMethodType,
  ShippingOption,
  ShippingType,
} from '../../__generated/graphql-types';
import {
  CheckoutMethodSettings,
  CheckoutMethodSettingsRepository,
} from './repositories/checkout-method-settings.repository';

const CHECKOUT_METHOD_SETTINGS_ID = new Types.ObjectId(
  '000000000000000000000030',
);

@Injectable()
export class CheckoutMethodSettingsService {
  constructor(
    @Inject(Tokens.CheckoutMethodSettingsToken)
    private readonly checkoutMethodSettings: CheckoutMethodSettingsRepository,
  ) {}

  private asObjectId(value: unknown): Types.ObjectId | null {
    if (value instanceof Types.ObjectId) {
      return value;
    }

    if (typeof value === 'string' && Types.ObjectId.isValid(value)) {
      return new Types.ObjectId(value);
    }

    return null;
  }

  private normalizeShippingOptions(options: unknown): ShippingOption[] {
    if (!Array.isArray(options)) {
      return [];
    }

    return options.reduce<ShippingOption[]>((acc, option) => {
      const parsed = option as Partial<ShippingOption>;
      const id = this.asObjectId(parsed?._id);
      const hasRequiredFields =
        !!id &&
        !!parsed?.type &&
        !!parsed?.label &&
        parsed?.fee !== null &&
        parsed?.fee !== undefined;

      if (!hasRequiredFields) {
        return acc;
      }

      acc.push({
        _id: id,
        type: parsed.type,
        label: parsed.label,
        description: parsed.description,
        fee: String(parsed.fee),
        estimatedDays: parsed.estimatedDays,
        isActive: parsed.isActive ?? true,
      });

      return acc;
    }, []);
  }

  private normalizePaymentMethods(methods: unknown): PaymentMethod[] {
    if (!Array.isArray(methods)) {
      return [];
    }

    return methods.reduce<PaymentMethod[]>((acc, method) => {
      const parsed = method as Partial<PaymentMethod>;
      const id = this.asObjectId(parsed?._id);
      const hasRequiredFields = !!id && !!parsed?.type && !!parsed?.label;

      if (!hasRequiredFields) {
        return acc;
      }

      acc.push({
        _id: id,
        type: parsed.type,
        label: parsed.label,
        description: parsed.description,
        isActive: parsed.isActive ?? true,
      });

      return acc;
    }, []);
  }

  private normalizeSettings(
    settings: CheckoutMethodSettings,
  ): CheckoutMethodSettings {
    return {
      _id: this.asObjectId(settings?._id) ?? CHECKOUT_METHOD_SETTINGS_ID,
      shippingOptions: this.normalizeShippingOptions(settings?.shippingOptions),
      paymentMethods: this.normalizePaymentMethods(settings?.paymentMethods),
      createdAt: settings?.createdAt ?? new Date(),
      updatedAt: settings?.updatedAt ?? new Date(),
    };
  }

  private ensureAtLeastOneActive(params: {
    values: { isActive: boolean }[];
    methodName: string;
  }) {
    if (params.values.some((value) => value.isActive)) {
      return;
    }

    throw new Error(`At least one ${params.methodName} must remain active`);
  }

  public async getSettings(): Promise<CheckoutMethodSettings> {
    const settings = await this.checkoutMethodSettings.find(
      CHECKOUT_METHOD_SETTINGS_ID,
    );

    if (!settings) {
      throw new Error('Checkout method settings not configured');
    }

    return this.normalizeSettings(settings);
  }

  public async shippingOptions(params?: {
    includeInactive?: boolean;
  }): Promise<ShippingOption[]> {
    const settings = await this.getSettings();

    if (params?.includeInactive) {
      return settings.shippingOptions;
    }

    return settings.shippingOptions.filter((option) => option.isActive);
  }

  public async paymentMethods(params?: {
    includeInactive?: boolean;
  }): Promise<PaymentMethod[]> {
    const settings = await this.getSettings();

    if (params?.includeInactive) {
      return settings.paymentMethods;
    }

    return settings.paymentMethods.filter((method) => method.isActive);
  }

  public async findShippingOption(id: Types.ObjectId) {
    const options = await this.shippingOptions({ includeInactive: true });

    return options.find((option) => option._id.equals(id));
  }

  public async findPaymentMethod(id: Types.ObjectId) {
    const methods = await this.paymentMethods({ includeInactive: true });

    return methods.find((method) => method._id.equals(id));
  }

  public async updateShippingMethodStatus(params: {
    type: ShippingType;
    isActive: boolean;
  }) {
    const settings = await this.getSettings();
    const hasType = settings.shippingOptions.some(
      (option) => option.type === params.type,
    );

    if (!hasType) {
      throw new Error('Invalid shipping option');
    }

    const shippingOptions = settings.shippingOptions.map((option) =>
      option.type === params.type
        ? {
            ...option,
            isActive: params.isActive,
          }
        : option,
    );

    this.ensureAtLeastOneActive({
      values: shippingOptions,
      methodName: 'shipping option',
    });

    await this.checkoutMethodSettings.update(settings._id, {
      shippingOptions,
      updatedAt: new Date(),
    });

    return true;
  }

  public async updatePaymentMethodStatus(params: {
    type: PaymentMethodType;
    isActive: boolean;
  }) {
    const settings = await this.getSettings();
    const hasType = settings.paymentMethods.some(
      (method) => method.type === params.type,
    );

    if (!hasType) {
      throw new Error('Invalid payment method');
    }

    const paymentMethods = settings.paymentMethods.map((method) =>
      method.type === params.type
        ? {
            ...method,
            isActive: params.isActive,
          }
        : method,
    );

    this.ensureAtLeastOneActive({
      values: paymentMethods,
      methodName: 'payment method',
    });

    await this.checkoutMethodSettings.update(settings._id, {
      paymentMethods,
      updatedAt: new Date(),
    });

    return true;
  }
}
