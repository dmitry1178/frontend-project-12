import React, { useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { useFormik } from 'formik';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useRollbar } from '@rollbar/react';
import { ToastContainer } from 'react-toastify';
import { toastError } from '../toasts/index.js';
import { useAuthContext } from '../../context/index.js';
import Nav from '../Nav';
import routes from '../../routes.js';

const Login = () => {
  const rollbar = useRollbar();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const inputUserName = useRef(null);
  const useAuth = useAuthContext();
  const { logIn } = useAuthContext();

  const {
    values, handleChange, handleSubmit, errors, isValid, isSubmitting,
  } = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    onSubmit: async ({ username, password }, actions) => {
      try {
        const { data } = await axios.post(routes.loginPath(), {
          username,
          password,
        });

        if (data.token) {
          logIn(data)
          navigate(routes.rootPagePath());
        }
      } catch (error) {
        rollbar.error('Login error', error);

        if (error.code === 'ERR_NETWORK') {
          toastError(t('errors.network'));
        }

        if (error.response.status === 401) {
          actions.setFieldError('authentication', 'auth');
        }
      }
    },
  });

  useEffect(() => {
    inputUserName.current.focus();
  }, [errors.authentication, useAuth.data, navigate]);

  return (
    <>
      <Nav />
      <div className="container-fluid h-100">
        <div className="row justify-content-center align-content-center h-100">
          <div className="col-12 col-md-8 col-xxl-6">
            <div className="card shadow-sm">
              <div className="card-body row p-5">
                <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                  <img
                    src="./images/enter.jpg"
                    className="rounded-circle"
                    alt={t('logon')}
                  />
                </div>

                <Form className="col-12 col-md-6 mt-3 mt-mb-0" onSubmit={handleSubmit}>
                  <h1 className="text-center mb-4">{t('signIn')}</h1>
                  <Form.Group className="form-floating mb-3" controlId="username">
                    <Form.Control
                      className={errors.authentication && 'is-invalid'}
                      type="text"
                      value={values.username}
                      onChange={handleChange}
                      placeholder={t('user.nickname')}
                      required
                      autoComplete="off"
                      autoFocus
                      ref={inputUserName}
                    />
                    <Form.Label>{t('user.nickname')}</Form.Label>
                  </Form.Group>

                  <Form.Group className="form-floating mb-3" controlId="password">
                    <OverlayTrigger
                      placement="bottom-start"
                      overlay={<Tooltip className="custom-tooltip tooltip">{errors.authentication && t(`errors.${errors.authentication}`)}</Tooltip>}
                      show={errors.authentication}
                      trigger="focus"
                    >
                      <Form.Control
                        className={errors.authentication && 'is-invalid'}
                        type="password"
                        placeholder={t('user.password')}
                        value={values.password}
                        onChange={handleChange}
                        required
                        autoComplete="off"
                      />
                    </OverlayTrigger>
                    <Form.Label>{t('user.password')}</Form.Label>
                  </Form.Group>

                  <Button
                    className="w-100"
                    variant="outline-primary"
                    type="submit"
                    disabled={!isValid || isSubmitting}
                  >
                    {t('buttons.logon')}
                  </Button>
                </Form>
              </div>
              <div className="card-footer p-4">
                <div className="text-center">
                  <span>
                    {t('questions.noAccount')}
                    {' '}
                  </span>
                  <Link to={routes.singUpPagePath()}>{t('registration')}</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        progress={undefined}
        theme="light"
      />
    </>
  );
};

export default Login;