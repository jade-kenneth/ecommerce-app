import { useReducer } from 'react';
export type ProfileTab = 'personal' | 'addresses' | 'security' | 'preferences';

export type LoginMethodKey = 'password' | 'google' | 'apple' | 'facebook';

export interface ProfileState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatarUrl: string;
  createdAt: string;
}

export interface PreferencesState {
  language: string;
  currency: string;
  marketingOptIn: boolean;
}

export interface AddressItem {
  id: string;
  label: string;
  recipient: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  isDefaultShipping: boolean;
  isDefaultBilling: boolean;
  lockedForActiveOrder: boolean;
}

export interface AddressFormState {
  label: string;
  recipient: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
}

export interface LoginMethodState {
  key: LoginMethodKey;
  label: string;
  linked: boolean;
  future?: boolean;
}
interface PasswordFormState {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface DialogState {
  address: boolean;
  deleteAddress: boolean;
  unlinkProvider: boolean;
  changePassword: boolean;
}

interface ProfilePageState {
  activeTab: ProfileTab;
  profile: ProfileState;
  personalForm: ProfileState;
  preferences: PreferencesState;
  addresses: AddressItem[];
  loginMethods: LoginMethodState[];
  addressForm: AddressFormState;
  editingAddressId: string | null;
  deleteAddressId: string | null;
  unlinkProviderKey: LoginMethodKey | null;
  passwordForm: PasswordFormState;
  dialogs: DialogState;
}

type ProfilePageAction =
  | { type: 'set_active_tab'; tab: ProfileTab }
  | { type: 'patch_personal_form'; patch: Partial<ProfileState> }
  | { type: 'save_personal_form' }
  | { type: 'reset_personal_form' }
  | { type: 'set_avatar'; avatarUrl: string }
  | { type: 'patch_preferences'; patch: Partial<PreferencesState> }
  | { type: 'open_add_address_dialog' }
  | { type: 'open_edit_address_dialog'; address: AddressItem }
  | { type: 'set_address_dialog_open'; open: boolean }
  | { type: 'patch_address_form'; patch: Partial<AddressFormState> }
  | { type: 'save_address'; newId: string }
  | { type: 'open_delete_address_dialog'; addressId: string }
  | { type: 'set_delete_address_dialog_open'; open: boolean }
  | { type: 'confirm_delete_address' }
  | {
      type: 'set_default_address';
      addressId: string;
      defaultType: 'shipping' | 'billing';
    }
  | { type: 'link_provider'; providerKey: LoginMethodKey }
  | {
      type: 'set_provider_linked';
      providerKey: LoginMethodKey;
      linked: boolean;
    }
  | { type: 'open_unlink_provider_dialog'; providerKey: LoginMethodKey }
  | { type: 'set_unlink_provider_dialog_open'; open: boolean }
  | { type: 'confirm_unlink_provider' }
  | { type: 'open_change_password_dialog' }
  | { type: 'set_change_password_dialog_open'; open: boolean }
  | { type: 'patch_password_form'; patch: Partial<PasswordFormState> };

const EMPTY_ADDRESS_FORM: AddressFormState = {
  label: '',
  recipient: '',
  phone: '',
  line1: '',
  line2: '',
  city: '',
  province: '',
  postalCode: '',
  country: 'Philippines',
};

const INITIAL_PROFILE: ProfileState = {
  firstName: 'Amy',
  lastName: 'Shopper',
  email: 'amy.shopper@email.com',
  phone: '+63 917 000 1122',
  avatarUrl: '/Logo.png',
  createdAt: 'June 6, 2025',
};

const INITIAL_ADDRESSES: AddressItem[] = [
  {
    id: 'address-1',
    label: 'Home',
    recipient: 'Amy Shopper',
    phone: '+63 917 000 1122',
    line1: 'Unit 702, Pacific Tower, 123 Emerald Ave',
    line2: 'Brgy. San Antonio',
    city: 'Pasig',
    province: 'Metro Manila',
    postalCode: '1605',
    country: 'Philippines',
    isDefaultShipping: true,
    isDefaultBilling: false,
    lockedForActiveOrder: true,
  },
  {
    id: 'address-2',
    label: 'Office',
    recipient: 'Amy Shopper',
    phone: '+63 917 000 1122',
    line1: '12F Vertex One, 14 Jupiter Street',
    line2: 'Bel-Air',
    city: 'Makati',
    province: 'Metro Manila',
    postalCode: '1209',
    country: 'Philippines',
    isDefaultShipping: false,
    isDefaultBilling: true,
    lockedForActiveOrder: false,
  },
];

const INITIAL_LOGIN_METHODS: LoginMethodState[] = [
  { key: 'password', label: 'Password', linked: true, future: true },
  { key: 'google', label: 'Google', linked: false, future: false },
  { key: 'apple', label: 'Apple', linked: false, future: true },
  { key: 'facebook', label: 'Facebook', linked: false, future: true },
];

const INITIAL_PREFERENCES: PreferencesState = {
  language: 'en',
  currency: 'PHP',
  marketingOptIn: true,
};

const INITIAL_PASSWORD_FORM: PasswordFormState = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

const INITIAL_STATE: ProfilePageState = {
  activeTab: 'security',
  profile: INITIAL_PROFILE,
  personalForm: INITIAL_PROFILE,
  preferences: INITIAL_PREFERENCES,
  addresses: INITIAL_ADDRESSES,
  loginMethods: INITIAL_LOGIN_METHODS.filter((method) => !method.future),
  addressForm: EMPTY_ADDRESS_FORM,
  editingAddressId: null,
  deleteAddressId: null,
  unlinkProviderKey: null,
  passwordForm: INITIAL_PASSWORD_FORM,
  dialogs: {
    address: false,
    deleteAddress: false,
    unlinkProvider: false,
    changePassword: false,
  },
};

export const useProfile = () => {
  const [state, dispatch] = useReducer(
    (state: ProfilePageState, action: ProfilePageAction): ProfilePageState => {
      switch (action.type) {
        case 'set_active_tab':
          return { ...state, activeTab: action.tab };
        case 'patch_personal_form':
          return {
            ...state,
            personalForm: {
              ...state.personalForm,
              ...action.patch,
            },
          };
        case 'save_personal_form':
          return {
            ...state,
            profile: state.personalForm,
          };
        case 'reset_personal_form':
          return {
            ...state,
            personalForm: state.profile,
          };
        case 'set_avatar': {
          const nextProfile = { ...state.profile, avatarUrl: action.avatarUrl };
          return {
            ...state,
            profile: nextProfile,
            personalForm: nextProfile,
          };
        }
        case 'patch_preferences':
          return {
            ...state,
            preferences: {
              ...state.preferences,
              ...action.patch,
            },
          };
        case 'open_add_address_dialog':
          return {
            ...state,
            editingAddressId: null,
            addressForm: EMPTY_ADDRESS_FORM,
            dialogs: { ...state.dialogs, address: true },
          };
        case 'open_edit_address_dialog':
          return {
            ...state,
            editingAddressId: action.address.id,
            addressForm: {
              label: action.address.label,
              recipient: action.address.recipient,
              phone: action.address.phone,
              line1: action.address.line1,
              line2: action.address.line2,
              city: action.address.city,
              province: action.address.province,
              postalCode: action.address.postalCode,
              country: action.address.country,
            },
            dialogs: { ...state.dialogs, address: true },
          };
        case 'set_address_dialog_open':
          return {
            ...state,
            dialogs: { ...state.dialogs, address: action.open },
          };
        case 'patch_address_form':
          return {
            ...state,
            addressForm: {
              ...state.addressForm,
              ...action.patch,
            },
          };
        case 'save_address': {
          const updatedAddresses = state.editingAddressId
            ? state.addresses.map((address) =>
                address.id === state.editingAddressId
                  ? {
                      ...address,
                      ...state.addressForm,
                    }
                  : address,
              )
            : [
                ...state.addresses,
                {
                  id: action.newId,
                  ...state.addressForm,
                  isDefaultShipping: state.addresses.length === 0,
                  isDefaultBilling: state.addresses.length === 0,
                  lockedForActiveOrder: false,
                },
              ];

          return {
            ...state,
            addresses: updatedAddresses,
            editingAddressId: null,
            addressForm: EMPTY_ADDRESS_FORM,
            dialogs: { ...state.dialogs, address: false },
          };
        }
        case 'open_delete_address_dialog':
          return {
            ...state,
            deleteAddressId: action.addressId,
            dialogs: { ...state.dialogs, deleteAddress: true },
          };
        case 'set_delete_address_dialog_open':
          return {
            ...state,
            deleteAddressId: action.open ? state.deleteAddressId : null,
            dialogs: { ...state.dialogs, deleteAddress: action.open },
          };
        case 'confirm_delete_address':
          if (!state.deleteAddressId) return state;
          return {
            ...state,
            addresses: state.addresses.filter((address) => address.id !== state.deleteAddressId),
            deleteAddressId: null,
            dialogs: { ...state.dialogs, deleteAddress: false },
          };
        case 'set_default_address':
          return {
            ...state,
            addresses: state.addresses.map((address) => {
              if (action.defaultType === 'shipping') {
                return {
                  ...address,
                  isDefaultShipping: address.id === action.addressId,
                };
              }

              return {
                ...address,
                isDefaultBilling: address.id === action.addressId,
              };
            }),
          };
        case 'link_provider':
          return {
            ...state,
            loginMethods: state.loginMethods.map((method) =>
              method.key === action.providerKey ? { ...method, linked: true } : method,
            ),
          };
        case 'set_provider_linked':
          return {
            ...state,
            loginMethods: state.loginMethods.map((method) =>
              method.key === action.providerKey ? { ...method, linked: action.linked } : method,
            ),
          };
        case 'open_unlink_provider_dialog':
          return {
            ...state,
            unlinkProviderKey: action.providerKey,
            dialogs: { ...state.dialogs, unlinkProvider: true },
          };
        case 'set_unlink_provider_dialog_open':
          return {
            ...state,
            unlinkProviderKey: action.open ? state.unlinkProviderKey : null,
            dialogs: { ...state.dialogs, unlinkProvider: action.open },
          };
        case 'confirm_unlink_provider':
          if (!state.unlinkProviderKey) return state;
          return {
            ...state,
            loginMethods: state.loginMethods.map((method) =>
              method.key === state.unlinkProviderKey ? { ...method, linked: false } : method,
            ),
            unlinkProviderKey: null,
            dialogs: { ...state.dialogs, unlinkProvider: false },
          };
        case 'open_change_password_dialog':
          return {
            ...state,
            passwordForm: INITIAL_PASSWORD_FORM,
            dialogs: { ...state.dialogs, changePassword: true },
          };
        case 'set_change_password_dialog_open':
          return {
            ...state,
            dialogs: { ...state.dialogs, changePassword: action.open },
          };
        case 'patch_password_form':
          return {
            ...state,
            passwordForm: {
              ...state.passwordForm,
              ...action.patch,
            },
          };
        default:
          return state;
      }
    },
    INITIAL_STATE,
  );

  return {
    state,
    dispatch,
  };
};
