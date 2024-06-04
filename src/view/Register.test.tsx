import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter } from 'react-router-dom';
import RegistrationForm from './Register';
import axiosInstance from '../utils/fetcher';

jest.mock('../utils/fetcher', () => ({
  post: jest.fn(),
}));

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

describe('RegistrationForm', () => {
  const setError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Mockear localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
      },
      writable: true,
    });
  });

  it('should render the registration form', () => {
    render(
      <MemoryRouter>
        <RegistrationForm setError={setError} />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', { name: /Register/i }),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter your name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Register/i }),
    ).toBeInTheDocument();
  });

  it('should call handleRegister on button click', async () => {
    const { getByPlaceholderText, getByRole } = render(
      <MemoryRouter>
        <RegistrationForm setError={setError} />
      </MemoryRouter>,
    );

    fireEvent.change(getByPlaceholderText(/Enter your name/i), {
      target: { value: 'Test User' },
    });
    fireEvent.change(getByPlaceholderText(/Enter email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(getByPlaceholderText(/Password/i), {
      target: { value: 'password' },
    });

    (axiosInstance.post as jest.Mock).mockResolvedValueOnce({
      data: { accessToken: 'fakeToken' },
    });

    await act(async () => {
      fireEvent.click(getByRole('button', { name: /Register/i }));
    });

    await waitFor(() => {
      expect(axiosInstance.post).toHaveBeenCalledWith('auth/signup', {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password',
      });
      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        'token',
        'fakeToken',
      );
      expect(mockedNavigate).toHaveBeenCalledWith('/home');
    });
  });

  it('should handle errors correctly', async () => {
    const { getByPlaceholderText, getByRole } = render(
      <MemoryRouter>
        <RegistrationForm setError={setError} />
      </MemoryRouter>,
    );

    fireEvent.change(getByPlaceholderText(/Enter your name/i), {
      target: { value: 'Test User' },
    });
    fireEvent.change(getByPlaceholderText(/Enter email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(getByPlaceholderText(/Password/i), {
      target: { value: 'password' },
    });

    const errorResponse = {
      response: {
        status: 403,
        data: { message: 'Forbidden' },
      },
    };
    (axiosInstance.post as jest.Mock).mockRejectedValueOnce(errorResponse);

    await act(async () => {
      fireEvent.click(getByRole('button', { name: /Register/i }));
    });

    await waitFor(() => {
      expect(axiosInstance.post).toHaveBeenCalledWith('auth/signup', {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password',
      });
      expect(setError).toHaveBeenCalledWith({
        message: 'Forbidden',
        status: 403,
      });
      expect(mockedNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('should disable register button if email or password is missing', () => {
    render(
      <MemoryRouter>
        <RegistrationForm setError={setError} />
      </MemoryRouter>,
    );

    expect(screen.getByRole('button', { name: /Register/i })).toBeDisabled();

    fireEvent.change(screen.getByPlaceholderText(/Enter your name/i), {
      target: { value: 'Test User' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter email/i), {
      target: { value: 'test@example.com' },
    });
    expect(screen.getByRole('button', { name: /Register/i })).toBeDisabled();

    fireEvent.change(screen.getByPlaceholderText(/Password/i), {
      target: { value: 'password' },
    });
    expect(screen.getByRole('button', { name: /Register/i })).toBeEnabled();
  });
});
