import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import RenderStatus from './RenderStatus';
import '@testing-library/jest-dom';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ status:true, loggedIn:true, userStatus: "joined" }),
})
);

describe('RenderStatus', () => {
  const info = {
    userStatus: 'joined',
    trip_name: 'Test Trip',
    destination: 'Test Destination',
  };

  beforeEach(async () => {
    fetch.mockClear();
    mockNavigate.mockClear();
    await act(async () => {
      render(<RenderStatus info={info} />);
    });
  });

  afterEach(() => {
    fetch.mockRestore();
  });

  it('makes fetch requests when userStatus is "joined"', async () => {
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(0));
  });
});