import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import TrainCell from './trainCell';
import '@testing-library/jest-dom';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ success: true }),
  })
);

describe('TrainCell', () => {
  const props = {
    train: {
      train_base: {
        train_name: 'Test Train',
        train_no: '123',
        source_stn_code: 'SRC',
        dstn_stn_code: 'DST',
        notBooked: 0,
        confirmed: 0,
      },
    },
    date: '2022-01-01',
  };

  beforeEach(() => {
    fetch.mockClear();
    render(<TrainCell {...props} />);
  });

  afterEach(() => {
    fetch.mockRestore();
  });

  test('renders without crashing', () => {
    expect(screen.getByText(`${props.train.train_base.train_name} : (${props.train.train_base.train_no})`)).toBeInTheDocument();
  });

  test('displays train information', () => {
    expect(screen.getByText(`Date : ${props.date}`)).toBeInTheDocument();
    expect(screen.getByText(props.train.train_base.source_stn_code)).toBeInTheDocument();
    expect(screen.getByText(props.train.train_base.dstn_stn_code)).toBeInTheDocument();
  });

  test('renders "Unenroll" and "Chat" buttons', () => {
    expect(screen.getByText('Unenroll')).toBeInTheDocument();
    expect(screen.getByText('Chat')).toBeInTheDocument();
  });
});