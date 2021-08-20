import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { mocked } from 'ts-jest/utils';

import API from '../../../../../../api';
import { Package, SearchResults } from '../../../../../../types';
import alertDispatcher from '../../../../../../utils/alertDispatcher';
import SubscriptionModal from './Modal';
jest.mock('../../../../../../api');
jest.mock('../../../../../../utils/alertDispatcher');
const mockOnSuccess = jest.fn();
const mockOnClose = jest.fn();

const getMockSubscriptions = (fixtureId: string): Package[] => {
  return require(`./__fixtures__/Modal/${fixtureId}.json`) as Package[];
};

const getMockSearch = (fixtureId: string): SearchResults => {
  return require(`./__fixtures__/Modal/${fixtureId}s.json`) as SearchResults;
};

const defaultProps = {
  open: true,
  onSuccess: mockOnSuccess,
  onClose: mockOnClose,
  getNotificationTitle: () => 'new releases',
};

describe('SubscriptionModal', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('creates snapshot', () => {
    const { asFragment } = render(<SubscriptionModal {...defaultProps} subscriptions={getMockSubscriptions('1')} />);
    expect(asFragment()).toMatchSnapshot();
  });

  describe('Render', () => {
    it('renders component', () => {
      render(<SubscriptionModal {...defaultProps} subscriptions={getMockSubscriptions('2')} />);

      expect(screen.getByText('Events')).toBeInTheDocument();
      expect(screen.getByText('Package')).toBeInTheDocument();

      const btn = screen.getByRole('button', { name: 'Add subscription' });
      expect(btn).toBeInTheDocument();
      expect(btn).toBeDisabled();

      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes).toHaveLength(2);
      expect(checkboxes[0]).toBeChecked();
      expect(checkboxes[1]).not.toBeChecked();
    });
  });

  describe('Renders some disabled packages', () => {
    it('first 2 disabled', async () => {
      const mockSearch = getMockSearch('3');
      mocked(API).searchPackages.mockResolvedValue(mockSearch);

      render(<SubscriptionModal {...defaultProps} subscriptions={getMockSubscriptions('3')} />);

      const input = screen.getByRole('textbox', { name: 'Search packages' });
      expect(input).toBeInTheDocument();
      expect(input).toHaveValue('');

      userEvent.type(input, 'testing');

      await waitFor(() => {
        expect(API.searchPackages).toHaveBeenCalledTimes(1);
      });

      const buttons = screen.getAllByTestId('packageItem');
      expect(buttons).toHaveLength(8);
      expect(buttons[0]).toHaveClass('disabledCell');
      expect(buttons[1]).toHaveClass('disabledCell');
      expect(buttons[2]).toHaveClass('clickableCell');
      expect(buttons[3]).toHaveClass('clickableCell');
      expect(buttons[4]).toHaveClass('clickableCell');
      expect(buttons[5]).toHaveClass('clickableCell');
      expect(buttons[6]).toHaveClass('clickableCell');
      expect(buttons[7]).toHaveClass('clickableCell');
    });

    it('all enabled', async () => {
      const mockSearch = getMockSearch('4');
      mocked(API).searchPackages.mockResolvedValue(mockSearch);

      render(<SubscriptionModal {...defaultProps} subscriptions={getMockSubscriptions('4')} />);

      const input = screen.getByRole('textbox', { name: 'Search packages' });
      expect(input).toBeInTheDocument();
      expect(input).toHaveValue('');

      userEvent.type(input, 'testing');

      await waitFor(() => {
        expect(API.searchPackages).toHaveBeenCalledTimes(1);
      });

      const buttons = screen.getAllByTestId('packageItem');
      expect(buttons[0]).toHaveClass('clickableCell');
      expect(buttons[1]).toHaveClass('clickableCell');
    });

    it('all disabled', async () => {
      const mockSearch = getMockSearch('5');
      mocked(API).searchPackages.mockResolvedValue(mockSearch);

      render(<SubscriptionModal {...defaultProps} subscriptions={getMockSubscriptions('5')} />);

      const input = screen.getByRole('textbox', { name: 'Search packages' });
      expect(input).toBeInTheDocument();
      expect(input).toHaveValue('');

      userEvent.type(input, 'testing');

      await waitFor(() => {
        expect(API.searchPackages).toHaveBeenCalledTimes(1);
      });

      const buttons = screen.getAllByTestId('packageItem');
      expect(buttons[0]).toHaveClass('disabledCell');
      expect(buttons[1]).toHaveClass('disabledCell');
    });

    it('one disabled', async () => {
      const mockSearch = getMockSearch('6');
      mocked(API).searchPackages.mockResolvedValue(mockSearch);

      render(<SubscriptionModal {...defaultProps} subscriptions={getMockSubscriptions('6')} />);

      const input = screen.getByRole('textbox', { name: 'Search packages' });
      expect(input).toBeInTheDocument();
      expect(input).toHaveValue('');

      userEvent.type(input, 'testing');

      await waitFor(() => {
        expect(API.searchPackages).toHaveBeenCalledTimes(1);
      });

      const buttons = screen.getAllByTestId('packageItem');
      expect(buttons[0]).toHaveClass('disabledCell');
      expect(buttons[1]).toHaveClass('clickableCell');
    });
  });

  describe('calls addSubscription', () => {
    it('when is successful', async () => {
      const mockSearch = getMockSearch('7');
      mocked(API).searchPackages.mockResolvedValue(mockSearch);
      mocked(API).addSubscription.mockResolvedValue('');

      render(<SubscriptionModal {...defaultProps} subscriptions={getMockSubscriptions('7')} />);

      const input = screen.getByRole('textbox', { name: 'Search packages' });
      expect(input).toBeInTheDocument();
      expect(input).toHaveValue('');

      userEvent.type(input, 'testing');

      await waitFor(() => {
        expect(API.searchPackages).toHaveBeenCalledTimes(1);
      });

      const buttons = screen.getAllByTestId('packageItem');
      userEvent.click(buttons[0]);

      const activePackage = screen.getByTestId('activePackageItem');

      expect(activePackage).toBeInTheDocument();
      expect(activePackage).toHaveTextContent(
        `${mockSearch.packages![0].name}${mockSearch.packages![0].repository.organizationDisplayName}(Repo: ${
          mockSearch.packages![0].repository.displayName
        })`
      );

      expect(screen.queryByRole('textbox', { name: 'Search packages' })).toBeNull();

      const btn = screen.getByRole('button', { name: 'Add subscription' });
      userEvent.click(btn);

      await waitFor(() => {
        expect(API.addSubscription).toHaveBeenCalledTimes(1);
        expect(API.addSubscription).toHaveBeenCalledWith(mockSearch.packages![0].packageId, 0);
      });

      await waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalledTimes(1);
        expect(mockOnClose).toHaveBeenCalledTimes(1);
      });
    });

    it('when fails', async () => {
      const mockSearch = getMockSearch('8');
      mocked(API).searchPackages.mockResolvedValue(mockSearch);
      mocked(API).addSubscription.mockRejectedValue({});

      render(<SubscriptionModal {...defaultProps} subscriptions={getMockSubscriptions('8')} />);

      const input = screen.getByRole('textbox', { name: 'Search packages' });
      expect(input).toBeInTheDocument();
      expect(input).toHaveValue('');

      userEvent.type(input, 'testing');

      await waitFor(() => {
        expect(API.searchPackages).toHaveBeenCalledTimes(1);
      });

      const buttons = screen.getAllByTestId('packageItem');
      userEvent.click(buttons[0]);

      const activePackage = screen.getByTestId('activePackageItem');

      expect(activePackage).toBeInTheDocument();
      expect(activePackage).toHaveTextContent(
        `${mockSearch.packages![0].name}${mockSearch.packages![0].repository.organizationDisplayName}(Repo: ${
          mockSearch.packages![0].repository.displayName
        })`
      );

      expect(screen.queryByRole('textbox', { name: 'Search packages' })).toBeNull();

      const btn = screen.getByRole('button', { name: 'Add subscription' });
      userEvent.click(btn);

      await waitFor(() => {
        expect(API.addSubscription).toHaveBeenCalledTimes(1);
        expect(API.addSubscription).toHaveBeenCalledWith(mockSearch.packages![0].packageId, 0);
      });

      expect(alertDispatcher.postAlert).toHaveBeenCalledTimes(1);
      expect(alertDispatcher.postAlert).toHaveBeenCalledWith({
        type: 'danger',
        message: `An error occurred subscribing to new releases notification for ${
          mockSearch.packages![0].name
        } package, please try again later.`,
      });
    });
  });
});
