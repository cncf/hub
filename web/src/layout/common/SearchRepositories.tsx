import classnames from 'classnames';
import { isUndefined } from 'lodash';
import isNull from 'lodash/isNull';
import React, { useEffect, useRef, useState } from 'react';
import { FaUser } from 'react-icons/fa';
import { FiSearch } from 'react-icons/fi';
import { MdBusiness } from 'react-icons/md';
import regexifyString from 'regexify-string';

import API from '../../api';
import useOutsideClick from '../../hooks/useOutsideClick';
import { ErrorKind, Repository, SearchQuery } from '../../types';
import alertDispatcher from '../../utils/alertDispatcher';
import { OCI_PREFIX } from '../../utils/data';
import RepositoryIcon from './RepositoryIcon';
import styles from './SearchRepositories.module.css';

interface ObjProps {
  [key: string]: string[];
}

interface DisabledRepos {
  ids?: string[];
  users?: string[];
  organizations?: string[];
}

interface Props {
  label: string;
  visibleUrl: boolean;
  extraQueryParams?: ObjProps;
  disabledRepositories?: DisabledRepos;
  onSelection: (repo: Repository) => void;
  onAuthError: () => void;
}

const DEFAULT_LIMIT = 20;
const SEARCH_DELAY = 3 * 100; // 300ms
const MIN_CHARACTERS_SEARCH = 3;

const SearchRepositories = (props: Props) => {
  const inputEl = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef(null);
  const [isSearching, setIsSearching] = useState(false);
  const [repositories, setRepositories] = useState<Repository[] | null>(null);
  const [searchName, setSearchName] = useState<string>('');
  const [dropdownTimeout, setDropdownTimeout] = useState<NodeJS.Timeout | null>(null);
  const [highlightedItem, setHighlightedItem] = useState<number | null>(null);

  useOutsideClick([dropdownRef], !isNull(repositories), () => cleanSearch());

  async function searchRepositories() {
    try {
      setIsSearching(true);
      let query: SearchQuery = {
        name: searchName,
        limit: DEFAULT_LIMIT,
        offset: 0,
      };
      if (props.extraQueryParams) {
        query = { ...query, filters: props.extraQueryParams };
      }
      const data = await API.searchRepositories(query);
      setRepositories(data.items);
      setIsSearching(false);
    } catch (err) {
      if (err.kind !== ErrorKind.Unauthorized) {
        alertDispatcher.postAlert({
          type: 'danger',
          message: 'An error occurred searching repositories, please try again later.',
        });
      } else {
        props.onAuthError();
      }
      setRepositories(null);
      setIsSearching(false);
    }
  }

  const saveSelectedRepository = (item: Repository): void => {
    setRepositories(null);
    setSearchName('');
    inputEl.current!.value = '';
    props.onSelection(item);
    setHighlightedItem(null);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchName(e.target.value);
    setHighlightedItem(null);
  };

  const checkIfRepoIsDisabled = (item: Repository): boolean => {
    let isDisabled = false;
    // Claim ownership feature is not supported for OCI repos
    if (props.label === 'claim-repo-ownership' && item.url.startsWith(OCI_PREFIX)) {
      isDisabled = true;
    } else if (!isUndefined(props.disabledRepositories)) {
      isDisabled =
        (!isUndefined(props.disabledRepositories.ids) && props.disabledRepositories.ids.includes(item.repositoryId!)) ||
        (!isUndefined(props.disabledRepositories.users) &&
          !isNull(item.userAlias) &&
          !isUndefined(item.userAlias) &&
          props.disabledRepositories.users.includes(item.userAlias)) ||
        (!isUndefined(props.disabledRepositories.organizations) &&
          !isNull(item.organizationName) &&
          !isUndefined(item.organizationName) &&
          props.disabledRepositories.organizations.includes(item.organizationName));
    }
    return isDisabled;
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    switch (e.key) {
      case 'Escape':
        cleanSearch();
        return;
      case 'ArrowDown':
        updateHighlightedItem('down');
        return;
      case 'ArrowUp':
        updateHighlightedItem('up');
        return;
      case 'Enter':
        e.preventDefault();
        if (!isNull(repositories) && !isNull(highlightedItem)) {
          const selectedRepo = repositories[highlightedItem];
          if (selectedRepo && !checkIfRepoIsDisabled(selectedRepo)) {
            saveSelectedRepository(selectedRepo);
          }
        }
        return;
      default:
        return;
    }
  };

  const updateHighlightedItem = (arrow: 'up' | 'down') => {
    if (!isNull(repositories) && repositories.length > 0) {
      if (!isNull(highlightedItem)) {
        let newIndex: number = arrow === 'up' ? highlightedItem - 1 : highlightedItem + 1;
        if (newIndex > repositories.length - 1) {
          newIndex = 0;
        }
        if (newIndex < 0) {
          newIndex = repositories.length - 1;
        }
        setHighlightedItem(newIndex);
      } else {
        const newIndex = arrow === 'up' ? repositories.length - 1 : 0;
        setHighlightedItem(newIndex);
      }
    }
  };

  const forceFocus = (): void => {
    if (!isNull(inputEl) && !isNull(inputEl.current)) {
      inputEl.current.focus();
    }
  };

  const cleanTimeout = () => {
    if (!isNull(dropdownTimeout)) {
      clearTimeout(dropdownTimeout);
      setDropdownTimeout(null);
    }
  };

  const cleanSearch = () => {
    setRepositories(null);
    setSearchName('');
    setHighlightedItem(null);
  };

  useEffect(() => {
    const isInputFocused = inputEl.current === document.activeElement;
    if (searchName.length >= MIN_CHARACTERS_SEARCH && isInputFocused) {
      cleanTimeout();
      setDropdownTimeout(
        setTimeout(() => {
          searchRepositories();
        }, SEARCH_DELAY)
      );
    } else {
      cleanSearch();
    }

    return () => {
      if (!isNull(dropdownTimeout)) {
        clearTimeout(dropdownTimeout);
      }
    };
  }, [searchName]); /* eslint-disable-line react-hooks/exhaustive-deps */

  return (
    <div className="position-relative">
      <div className="d-flex flex-row">
        <div
          className={`flex-grow-1 d-flex align-items-strecht overflow-hidden position-relative ${styles.inputWrapper}`}
        >
          <div
            data-testid="searchBarIcon"
            className={`d-none d-sm-flex align-items-center ${styles.iconWrapper}`}
            onClick={forceFocus}
          >
            <FiSearch />
          </div>

          <input
            ref={inputEl}
            type="text"
            className={`flex-grow-1 pr-4 pl-2 pl-md-0 ${styles.input}`}
            name="searchRepositoriesInput"
            aria-label="Search repositories"
            autoComplete="new-input"
            onChange={onChange}
            onKeyDown={onKeyDown}
            spellCheck="false"
          />

          {isSearching && (
            <div className={`position-absolute text-secondary ${styles.loading}`}>
              <span data-testid="searchBarSpinning" className="spinner-border spinner-border-sm" />
            </div>
          )}
        </div>
      </div>

      {!isNull(repositories) && (
        <div ref={dropdownRef} className={`dropdown-menu w-100 p-0 shadow-sm show overflow-hidden ${styles.dropdown}`}>
          {repositories.length === 0 ? (
            <p className="m-3 text-center">
              We can't seem to find any repositores that match your search for{' '}
              <span className="font-weight-bold">{searchName}</span>
            </p>
          ) : (
            <div className={styles.tableWrapper}>
              <table
                className={`table table-hover table-sm mb-0 ${styles.table}`}
                role="grid"
                aria-labelledby={props.label}
              >
                <thead>
                  <tr>
                    <th scope="col" className={`${styles.fitCell} ${styles.iconCell} d-none d-sm-table-cell`}></th>
                    <th scope="col" className={styles.repoCell}>
                      Repository
                    </th>
                    {props.visibleUrl && (
                      <th scope="col" className={`d-none d-md-table-cell ${styles.urlCell}`}>
                        Url
                      </th>
                    )}
                    <th scope="col">Publisher</th>
                  </tr>
                </thead>
                <tbody>
                  {repositories.map((item: Repository, index: number) => {
                    const isDisabled = checkIfRepoIsDisabled(item);

                    return (
                      <tr
                        data-testid="repoItem"
                        role="button"
                        className={classnames(
                          { [styles.clickableCell]: !isDisabled },
                          { [styles.disabledCell]: isDisabled },
                          { [styles.activeCell]: index === highlightedItem }
                        )}
                        onClick={() => {
                          if (!isDisabled) {
                            saveSelectedRepository(item);
                          }
                        }}
                        key={`repo_${item.name!}`}
                        onMouseOver={() => setHighlightedItem(index)}
                        onMouseOut={() => setHighlightedItem(null)}
                      >
                        <td className="align-middle text-center d-none d-sm-table-cell">
                          <div className="mx-2">
                            <RepositoryIcon kind={item.kind} className={styles.icon} />
                          </div>
                        </td>
                        <td className="align-middle">
                          <div className={styles.truncateWrapper}>
                            <div className="text-truncate">
                              {regexifyString({
                                pattern: new RegExp(searchName, 'gi'),
                                decorator: (match: string, index: number) => {
                                  return (
                                    <span key={`match_${item.name}_${index}`} className="font-weight-bold hightlighted">
                                      {match}
                                    </span>
                                  );
                                },
                                input: item.name,
                              })}
                            </div>
                          </div>
                        </td>
                        {props.visibleUrl && (
                          <td className="align-middle d-none d-md-table-cell">
                            <div className={styles.truncateWrapper}>
                              <div className="text-truncate">
                                <small>{item.url}</small>
                              </div>
                            </div>
                          </td>
                        )}
                        <td className="align-middle">
                          <div className="text-dark d-flex flex-row align-items-center">
                            <span className={`mr-1 ${styles.tinyIcon}`}>
                              {item.userAlias ? <FaUser /> : <MdBusiness />}
                            </span>
                            {item.userAlias || item.organizationDisplayName || item.organizationName}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchRepositories;
