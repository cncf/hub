import isNull from 'lodash/isNull';
import isUndefined from 'lodash/isUndefined';
import React, { useContext, useEffect, useRef, useState } from 'react';

import { API } from '../../../../../api';
import { AppCtx } from '../../../../../context/AppCtx';
import { Organization } from '../../../../../types';
import Loading from '../../../../common/Loading';
import NoData from '../../../../common/NoData';
import OrganizationForm from '../../../organizations/Form';
import styles from './ProfileSection.module.css';

interface Props {
  onAuthError: () => void;
}

const ProfileSection = (props: Props) => {
  const { ctx } = useContext(AppCtx);
  const form = useRef<HTMLFormElement>(null);
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [organization, setOrganization] = useState<Organization | null | undefined>(undefined);
  const selectedOrg = ctx.prefs.controlPanel.selectedOrg;
  const [apiError, setApiError] = useState<null | string>(null);

  const submitForm = () => {
    if (form.current) {
      form.current.dispatchEvent(new Event('submit', { cancelable: true }));
    }
  };

  useEffect(() => {
    async function fetchOrganization() {
      try {
        setIsLoading(true);
        setOrganization(await API.getOrganization(selectedOrg!));
        setApiError(null);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        if (err.statusText !== 'ErrLoginRedirect') {
          if (err.status === 500) {
            setApiError('An error occurred getting the organization details, please try again later');
          }
          setOrganization(null);
        } else {
          props.onAuthError();
        }
      }
    }
    if (!isUndefined(selectedOrg)) {
      fetchOrganization();
    }
  }, [props, selectedOrg]);

  return (
    <main role="main" className="container p-0">
      <div className={`h3 pb-2 border-bottom ${styles.title}`}>Profile information</div>

      <div className={`mt-4 mt-md-5 ${styles.form}`}>
        {(isUndefined(organization) || isLoading) && <Loading />}

        {!isUndefined(organization) && (
          <>
            {isNull(organization) ? (
              <NoData issuesLinkVisible={!isNull(apiError)}>
                {isNull(apiError) ? <>Sorry, the package you requested was not found.</> : <>{apiError}</>}
              </NoData>
            ) : (
              <>
                {!isLoading && (
                  <OrganizationForm
                    ref={form}
                    organization={!isLoading ? organization : undefined}
                    onAuthError={props.onAuthError}
                    setIsSending={setIsSending}
                  />
                )}

                <div className="mt-4">
                  <button
                    className="btn btn-secondary"
                    type="button"
                    disabled={isSending}
                    onClick={submitForm}
                    data-testid="updateOrgBtn"
                  >
                    {isSending ? (
                      <>
                        <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true" />
                        <span className="ml-2">Updating organization</span>
                      </>
                    ) : (
                      <>Update</>
                    )}
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </main>
  );
};

export default ProfileSection;
