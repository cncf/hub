import classnames from 'classnames';
import every from 'lodash/every';
import isNull from 'lodash/isNull';
import isUndefined from 'lodash/isUndefined';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { FaSignInAlt } from 'react-icons/fa';
import { IoIosArrowBack } from 'react-icons/io';
import { useHistory } from 'react-router-dom';

import API from '../../api';
import { AppCtx, refreshUserProfile, signOut } from '../../context/AppCtx';
import { ErrorKind, RefInputField, UserLogin } from '../../types';
import cleanLoginUrlParams from '../../utils/cleanLoginUrlParams';
import compoundErrorMessage from '../../utils/compoundErrorMessage';
import InputField from '../common/InputField';
import Modal from '../common/Modal';
import styles from './LogIn.module.css';
import OAuth from './OAuth';
import ResetPassword from './ResetPassword';

const usePersistedState = require('use-persisted-state-hook');

interface FormValidation {
  isValid: boolean;
  user: null | UserLogin;
}

interface Loading {
  status: boolean;
  type?: 'log' | 'google' | 'github' | 'oidc';
}

interface Props {
  openLogIn: boolean;
  setOpenLogIn: React.Dispatch<React.SetStateAction<boolean>>;
  redirect?: string;
  visibleModal?: string;
}

const LogIn = (props: Props) => {
  const { dispatch } = useContext(AppCtx);
  const history = useHistory();
  const loginForm = useRef<HTMLFormElement>(null);
  const emailInput = useRef<RefInputField>(null);
  const passwordInput = useRef<RefInputField>(null);
  const [isLoading, setIsLoading] = useState<Loading>({ status: false });
  const [isValidated, setIsValidated] = useState(false);
  const [visible2FACode, setVisible2FACode] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [visibleResetPassword, setVisibleResetPassword] = useState(false);
  const [passcode, setPasscode] = useState<string>('');
  const [isApprovingSession, setIsApprovingSession] = useState<boolean>(false);
  const [fromOauth, setFromOauth] = usePersistedState('loginFromOauth', false);

  useEffect(() => {
    if (isLoading.status && props.openLogIn && isLoading.type !== 'log') {
      setFromOauth(true);
    }
  }, [isLoading, props.openLogIn, setFromOauth]);

  if (fromOauth && isLoading.status && props.openLogIn && history.action === 'POP') {
    setFromOauth(false);
    window.location.reload();
  }

  const onPasscodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasscode(e.target.value);
  };

  // Clean API error when form is focused after validation
  const cleanApiError = () => {
    if (!isNull(apiError)) {
      setApiError(null);
    }
  };

  const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const onCloseModal = () => {
    if (!isUndefined(props.redirect) || !isUndefined(props.visibleModal)) {
      // If redirect option is defined and user closes login modal,
      // querystring with login parameters is cleaned to avoid open modal again on refresh
      history.replace({
        pathname: window.location.pathname,
        search: cleanLoginUrlParams(window.location.search),
      });
    }
    setVisibleResetPassword(false);
    props.setOpenLogIn(false);
    setFromOauth(false);
  };

  const onLoginError = (err: any) => {
    let error = compoundErrorMessage(err, 'An error occurred signing in');
    if (err.kind === ErrorKind.Unauthorized) {
      error = 'Authentication failed. Please check your credentials.';
    }
    setApiError(error);
    setIsLoading({ status: false });
    setIsApprovingSession(false);
    dispatch(signOut());
  };

  const onLoginSuccess = () => {
    setIsApprovingSession(false);
    setIsLoading({ status: false });
    dispatch(refreshUserProfile(dispatch, props.redirect));
    props.setOpenLogIn(false);
  };

  async function loginUser(user: UserLogin) {
    try {
      await API.login(user);
      onLoginSuccess();
    } catch (err) {
      if (err.kind === ErrorKind.NotApprovedSession) {
        setVisible2FACode(true);
      } else {
        onLoginError(err);
      }
    }
  }

  async function approveSession() {
    try {
      setIsApprovingSession(true);
      await API.approveSession(passcode);
      onLoginSuccess();
    } catch (err) {
      onLoginError(err);
    }
  }

  const submitForm = () => {
    cleanApiError();
    setIsLoading({ type: 'log', status: true });
    if (loginForm.current) {
      validateForm(loginForm.current).then((validation: FormValidation) => {
        if (validation.isValid && !isNull(validation.user)) {
          loginUser(validation.user);
        } else {
          setIsLoading({ status: false });
        }
      });
    }
  };

  const validateForm = (form: HTMLFormElement): Promise<FormValidation> => {
    let user: UserLogin | null = null;

    return validateAllFields().then((isValid: boolean) => {
      if (isValid) {
        const formData = new FormData(form);
        user = {
          email: formData.get('email') as string,
          password: formData.get('password') as string,
        };
      }
      setIsValidated(true);
      return { isValid, user };
    });
  };

  const validateAllFields = async (): Promise<boolean> => {
    return Promise.all([emailInput.current!.checkIsValid(), passwordInput.current!.checkIsValid()]).then(
      (res: boolean[]) => {
        return every(res, (isValid: boolean) => isValid);
      }
    );
  };

  const handleOnReturnKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Enter' && !isNull(loginForm)) {
      submitForm();
    }
  };

  return (
    <Modal
      header={<div className={`h3 m-2 flex-grow-1 ${styles.title}`}>Sign in</div>}
      modalClassName={styles.modal}
      open={props.openLogIn}
      onClose={onCloseModal}
      error={apiError}
      cleanError={cleanApiError}
    >
      {visibleResetPassword ? (
        <div className="h-100 d-flex flex-column">
          <div>
            <button
              className="btn btn-sm btn-link pl-0 mb-2 text-no-decoration"
              type="button"
              onClick={() => setVisibleResetPassword(false)}
              aria-label="Back to Sign in"
            >
              <div className="d-flex flex-row align-items-center">
                <IoIosArrowBack className="mr-2" />
                Back to Sign in
              </div>
            </button>
          </div>

          <div className="flex-grow-1 w-100 d-flex align-items-center">
            <ResetPassword visibleTitle />
          </div>
        </div>
      ) : (
        <>
          {visible2FACode ? (
            <div className="h-100 d-flex flex-column">
              <div>
                <button
                  className="btn btn-sm btn-link pl-0 mb-2 text-no-decoration"
                  type="button"
                  onClick={() => setVisible2FACode(false)}
                  aria-label="Back to Sign in"
                >
                  <div className="d-flex flex-row align-items-center">
                    <IoIosArrowBack className="mr-2" />
                    Back to Sign in
                  </div>
                </button>
              </div>

              <div className="flex-grow-1 w-100 d-flex align-items-center">
                <div className="w-100">
                  <InputField
                    type="text"
                    label="Authentication code"
                    name="passcode"
                    autoComplete="off"
                    value={passcode}
                    onChange={onPasscodeChange}
                    invalidText={{
                      default: 'This field is required',
                    }}
                    validateOnBlur
                    required
                  />

                  <button
                    onClick={approveSession}
                    className="btn btn-success btn-sm text-uppercase mt-3"
                    disabled={passcode === '' || isApprovingSession}
                    aria-label="Verify passcode"
                  >
                    {isApprovingSession ? (
                      <>
                        <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true" />
                        <span className="ml-2">Verifying...</span>
                      </>
                    ) : (
                      <>Verify</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="my-auto">
              <form
                ref={loginForm}
                data-testid="loginForm"
                className={classnames('w-100', { 'needs-validation': !isValidated }, { 'was-validated': isValidated })}
                onFocus={cleanApiError}
                autoComplete="on"
                noValidate
              >
                <InputField
                  ref={emailInput}
                  type="email"
                  label="Email"
                  name="email"
                  value=""
                  invalidText={{
                    default: 'This field is required',
                    typeMismatch: 'Please enter a valid email address',
                  }}
                  autoComplete="email"
                  onChange={onEmailChange}
                  validateOnBlur={email !== ''}
                  required
                />

                <InputField
                  ref={passwordInput}
                  type="password"
                  label="Password"
                  name="password"
                  value=""
                  invalidText={{
                    default: 'This field is required',
                  }}
                  validateOnBlur
                  onKeyDown={handleOnReturnKeyDown}
                  autoComplete="current-password"
                  required
                />

                <div className="d-flex flex-row align-items-row justify-content-between">
                  <button
                    className="btn btn-sm btn-link pl-0 text-no-decoration"
                    type="button"
                    onClick={() => setVisibleResetPassword(true)}
                    aria-label="Open reset password"
                  >
                    Forgot password?
                  </button>

                  <button
                    className="btn btn-sm btn-outline-secondary"
                    type="button"
                    disabled={isLoading.status}
                    onClick={submitForm}
                    aria-label="Sign in"
                  >
                    <div className="d-flex flex-row align-items-center text-uppercase">
                      {!isUndefined(isLoading.type) && isLoading.type === 'log' ? (
                        <>
                          <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true" />
                          <span className="ml-2">Singing in...</span>
                        </>
                      ) : (
                        <>
                          <FaSignInAlt className="mr-2" />
                          <>Sign in</>
                        </>
                      )}
                    </div>
                  </button>
                </div>
              </form>
            </div>
          )}

          {!visible2FACode && <OAuth isLoading={isLoading} setIsLoading={setIsLoading} />}
        </>
      )}
    </Modal>
  );
};

export default LogIn;
