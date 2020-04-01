import { fireEvent, render, screen, wait, waitForElement, waitForElementToBeRemoved } from '@testing-library/react';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { mocked } from 'ts-jest/utils';

import { API } from '../../../api';
import { AppCtx } from '../../../context/AppCtx';
import { User } from '../../../types';
import MembersSection from './index';
jest.mock('../../../api');

const getMembers = (fixtureId: string): User[] => {
  return require(`./__fixtures__/index/${fixtureId}.json`) as User[];
};

const defaultProps = {
  onAuthError: jest.fn(),
};

const mockCtx = {
  user: { alias: 'test', email: 'test@test.com' },
  org: { name: 'orgTest' },
  requestSignIn: false,
};

describe('Members section index', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('creates snapshot', async () => {
    const mockMembers = getMembers('1');
    mocked(API).getOrganizationMembers.mockResolvedValue(mockMembers);

    const result = render(
      <AppCtx.Provider value={{ ctx: mockCtx, dispatch: jest.fn() }}>
        <Router>
          <MembersSection {...defaultProps} />
        </Router>
      </AppCtx.Provider>
    );

    expect(result.asFragment()).toMatchSnapshot();
    await wait();
  });

  describe('Render', () => {
    it('renders component', async () => {
      const mockMembers = getMembers('2');
      mocked(API).getOrganizationMembers.mockResolvedValue(mockMembers);

      render(
        <AppCtx.Provider value={{ ctx: mockCtx, dispatch: jest.fn() }}>
          <Router>
            <MembersSection {...defaultProps} />
          </Router>
        </AppCtx.Provider>
      );
      expect(API.getOrganizationMembers).toHaveBeenCalledTimes(1);
      await wait();
    });

    it('removes loading spinner after getting members', async () => {
      const mockMembers = getMembers('3');
      mocked(API).getOrganizationMembers.mockResolvedValue(mockMembers);

      render(
        <AppCtx.Provider value={{ ctx: mockCtx, dispatch: jest.fn() }}>
          <Router>
            <MembersSection {...defaultProps} />
          </Router>
        </AppCtx.Provider>
      );

      const spinner = await waitForElementToBeRemoved(() => screen.getByRole('status'));

      expect(spinner).toBeTruthy();
      await wait();
    });

    it('displays no data component when no members', async () => {
      const mockMembers = getMembers('4');
      mocked(API).getOrganizationMembers.mockResolvedValue(mockMembers);

      render(
        <AppCtx.Provider value={{ ctx: mockCtx, dispatch: jest.fn() }}>
          <Router>
            <MembersSection {...defaultProps} />
          </Router>
        </AppCtx.Provider>
      );

      const noData = await waitForElement(() => screen.getByTestId('noData'));

      expect(noData).toBeInTheDocument();
      expect(screen.getByText('Do you want to add a member?')).toBeInTheDocument();
      expect(screen.getByTestId('addFirstMemberBtn')).toBeInTheDocument();

      await wait();
    });

    it('renders 2 members card', async () => {
      const mockMembers = getMembers('5');
      mocked(API).getOrganizationMembers.mockResolvedValue(mockMembers);

      render(
        <AppCtx.Provider value={{ ctx: mockCtx, dispatch: jest.fn() }}>
          <Router>
            <MembersSection {...defaultProps} />
          </Router>
        </AppCtx.Provider>
      );

      const cards = await waitForElement(() => screen.getAllByTestId('memberCard'));
      expect(cards).toHaveLength(2);

      await wait();
    });

    it('renders organization form when add org button is clicked', async () => {
      const mockMembers = getMembers('6');
      mocked(API).getOrganizationMembers.mockResolvedValue(mockMembers);

      render(
        <AppCtx.Provider value={{ ctx: mockCtx, dispatch: jest.fn() }}>
          <Router>
            <MembersSection {...defaultProps} />
          </Router>
        </AppCtx.Provider>
      );

      const addBtn = await waitForElement(() => screen.getByTestId('addMemberBtn'));
      expect(addBtn).toBeInTheDocument();

      expect(screen.queryByText('Username')).not.toBeInTheDocument();

      fireEvent.click(addBtn);
      expect(screen.queryByText('Username')).toBeInTheDocument();

      await wait();
    });

    it('renders organization form when add org button is clicked', async () => {
      const mockMembers = getMembers('7');
      mocked(API).getOrganizationMembers.mockResolvedValue(mockMembers);

      render(
        <AppCtx.Provider value={{ ctx: mockCtx, dispatch: jest.fn() }}>
          <Router>
            <MembersSection {...defaultProps} />
          </Router>
        </AppCtx.Provider>
      );

      const firstBtn = await waitForElement(() => screen.getByTestId('addFirstMemberBtn'));
      expect(screen.queryByText('Username')).not.toBeInTheDocument();
      expect(firstBtn).toBeInTheDocument();

      fireEvent.click(firstBtn);
      expect(screen.queryByText('Username')).toBeInTheDocument();

      await wait();
    });
  });
});
