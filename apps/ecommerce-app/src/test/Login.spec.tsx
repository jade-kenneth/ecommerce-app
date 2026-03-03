/** @vitest-environment jsdom */

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LoginForm } from '~/features/portal/LoginForm';
import { AccountType } from '~/graphql/generated';
import { useGlobalStore } from '~/hooks/useGlobalStore';

const { authenticateMock, toasterSuccessMock, toasterErrorMock } = vi.hoisted(
  () => ({
    authenticateMock: vi.fn(),
    toasterSuccessMock: vi.fn(),
    toasterErrorMock: vi.fn(),
  }),
);

vi.mock('~/providers/AuthProvider', () => ({
  authenticate: authenticateMock,
}));

vi.mock('~/components/ToastContainer', () => ({
  toaster: {
    success: toasterSuccessMock,
    error: toasterErrorMock,
  },
}));

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useGlobalStore.setState((state) => ({
      ...state,
      authenticate: {
        ...state.authenticate,
        isAuthenticated: false,
        isAuthDialogOpen: false,
        email: undefined,
        userId: undefined,
      },
    }));
  });

  it('authenticates and updates global auth state on successful submit', async () => {
    authenticateMock.mockResolvedValueOnce(undefined);

    render(<LoginForm />);

    fireEvent.change(screen.getByPlaceholderText('Enter your email address'), {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'secret123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(authenticateMock).toHaveBeenCalledWith({
        emailAddress: 'user@example.com',
        password: 'secret123',
        role: AccountType.Member,
      });
    });

    expect(toasterSuccessMock).toHaveBeenCalledWith({
      description: 'Successfully logged in!',
    });
    expect(useGlobalStore.getState().authenticate.isAuthenticated).toBe(true);
    expect(useGlobalStore.getState().authenticate.email).toBe(
      'user@example.com',
    );
  });

  it('shows validation errors and blocks submit for invalid input', async () => {
    render(<LoginForm />);

    fireEvent.change(screen.getByPlaceholderText('Enter your email address'), {
      target: { value: 'valid@email.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: '123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(
      await screen.findByText('Password must be at least 6 characters long'),
    ).toBeTruthy();
    expect(authenticateMock).not.toHaveBeenCalled();
  });

  it('shows an error toast when authentication fails', async () => {
    authenticateMock.mockRejectedValueOnce(new Error('Invalid credentials'));

    render(<LoginForm />);

    fireEvent.change(screen.getByPlaceholderText('Enter your email address'), {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'secret123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(toasterErrorMock).toHaveBeenCalledWith({
        description: 'Failed to log in. Please try again.',
      });
    });
    expect(useGlobalStore.getState().authenticate.isAuthenticated).toBe(false);
  });
});
