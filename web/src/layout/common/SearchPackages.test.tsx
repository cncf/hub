import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { mocked } from 'ts-jest/utils';

import API from '../../api';
import { SearchResults } from '../../types';
import alertDispatcher from '../../utils/alertDispatcher';
import SearchPackages from './SearchPackages';
jest.mock('../../api');
jest.mock('../../utils/alertDispatcher');

const getMockSearch = (fixtureId: string): SearchResults => {
  return require(`./__fixtures__/SearchPackages/${fixtureId}.json`) as SearchResults;
};

const mockOnSelection = jest.fn();

const defaultProps = {
  label: 'test',
  disabledPackages: [],
  onSelection: mockOnSelection,
};

describe('SearchPackages', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('creates snapshot', () => {
    const { asFragment } = render(<SearchPackages {...defaultProps} />);
    expect(asFragment()).toMatchSnapshot();
  });

  describe('Render', () => {
    it('renders component', async () => {
      const mockSearch = getMockSearch('1');
      mocked(API).searchPackages.mockResolvedValue(mockSearch);

      render(<SearchPackages {...defaultProps} />);

      const input = screen.getByRole('textbox', { name: 'Search packages' });
      expect(input).toBeInTheDocument();
      expect(input).toHaveValue('');

      userEvent.type(input, 'ing');

      await waitFor(() => {
        expect(API.searchPackages).toHaveBeenCalledTimes(1);
      });

      expect(screen.getAllByRole('button')).toHaveLength(2);
    });

    it('selects package', async () => {
      const mockSearch = getMockSearch('1');
      mocked(API).searchPackages.mockResolvedValue(mockSearch);

      render(<SearchPackages {...defaultProps} />);

      const input = screen.getByRole('textbox', { name: 'Search packages' });
      expect(input).toBeInTheDocument();
      expect(input).toHaveValue('');

      userEvent.type(input, 'ing');

      await waitFor(() => {
        expect(API.searchPackages).toHaveBeenCalledTimes(1);
      });

      const packages = screen.getAllByTestId('packageItem');
      userEvent.click(packages[0]);

      expect(mockOnSelection).toHaveBeenCalledTimes(1);
      expect(mockOnSelection).toHaveBeenCalledWith(mockSearch.packages![0]);
    });

    it('when searchPackage fails', async () => {
      mocked(API).searchPackages.mockRejectedValue('');

      render(<SearchPackages {...defaultProps} />);

      const input = screen.getByRole('textbox', { name: 'Search packages' });
      expect(input).toBeInTheDocument();
      expect(input).toHaveValue('');

      userEvent.type(input, 'ing');

      await waitFor(() => {
        expect(API.searchPackages).toHaveBeenCalledTimes(1);
      });

      expect(alertDispatcher.postAlert).toHaveBeenCalledTimes(1);
      expect(alertDispatcher.postAlert).toHaveBeenCalledWith({
        type: 'danger',
        message: 'An error occurred searching packages, please try again later.',
      });
    });

    it('renders disabled package', async () => {
      const mockSearch = getMockSearch('2');
      mocked(API).searchPackages.mockResolvedValue(mockSearch);

      render(<SearchPackages {...defaultProps} disabledPackages={[mockSearch.packages![0].packageId]} />);

      const input = screen.getByRole('textbox', { name: 'Search packages' });
      expect(input).toBeInTheDocument();
      expect(input).toHaveValue('');

      userEvent.type(input, 'ing');

      await waitFor(() => {
        expect(API.searchPackages).toHaveBeenCalledTimes(1);
      });

      const firstPackage = screen.getAllByTestId('packageItem')[0];
      expect(firstPackage).toHaveClass('disabledCell');
      userEvent.click(firstPackage);

      expect(mockOnSelection).toHaveBeenCalledTimes(0);
    });

    it('cleans packages list after changing filled input', async () => {
      const mockSearch = getMockSearch('3');
      mocked(API).searchPackages.mockResolvedValue(mockSearch);

      render(<SearchPackages {...defaultProps} />);

      const input = screen.getByRole('textbox', { name: 'Search packages' });
      expect(input).toBeInTheDocument();
      expect(input).toHaveValue('');

      userEvent.type(input, 'ing');

      await waitFor(() => {
        expect(API.searchPackages).toHaveBeenCalledTimes(1);
      });

      expect(screen.getAllByTestId('packageItem')).toHaveLength(2);

      userEvent.type(input, '1{enter}');

      waitFor(() => {
        expect(screen.getAllByTestId('packageItem')).toHaveLength(0);
      });
    });
  });
});
