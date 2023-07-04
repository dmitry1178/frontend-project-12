import axios from 'axios';
import { useFormik } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import {
  Button, Card, Col, Container, FloatingLabel, Form, Image, Row, Stack,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import avatar from '../images/avatar.jpg';
import { useAuth } from '../contexts/index.jsx';
import paths from '../routes.js';

const useSubmit = (setSignupFailed, t) => {
  const navigate = useNavigate();
  const { logIn } = useAuth();
  return async (values) => {
    setSignupFailed(false);
    try {
      const res = await axios.post(paths.signup, values);
      logIn(res.data);
      navigate(paths.homePage);
    } catch (err) {
      if (!err.isAxiosError) throw err;
      console.error(err);
      if (err.response?.status === 409) setSignupFailed(true);
      else toast.error(t('ConnectionError'));
    }
  };
};

const SignupPage = () => {
  const { t } = useTranslation();

  const validationSchema = Yup.object().shape({
    username: Yup.string().trim()
      .min(3, t('login.symbolCount'))
      .max(20, t('login.symbolCount'))
      .required(t('login.requiredField')),
    password: Yup.string().trim()
      .min(6, t('login.minCountSymbols'))
      .required(t('login.requiredField')),
    passwordConfirmation: Yup.string()
      .oneOf([Yup.ref('password'), null], t('login.matchPassword'))
      .required(t('login.requiredField')),
  });
  const [signUpFailed, setSignUpFailed] = useState(false);

  const inputRef = useRef();
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  const formik = useFormik({
    initialValues: {
      username: '',
      passsword: '',
      passwordConfirmation: '',
    },
    validationSchema,
    onSubmit: useSubmit(setSignUpFailed, t),
  });

  return (
    <Container fluid className="h-100">
      <Row className="justify-content-center align-content-center h-100">
        <Col xs="12" md="8" xxl="6">
          <Card>
            <Card.Body className="p-5">
              <Row>
                <Col className="d-flex align-items-center justify-content-center">
                  <Image src={avatar} roundedCircle thumbnail />
                </Col>
                <Col>
                  <Form onSubmit={formik.handleSubmit}>
                    <h1 className="text-center mb-4">{t('login.registration')}</h1>
                    <fieldset disabled={formik.isSubmitting}>
                      <Stack gap={2}>
                        <FloatingLabel
                          controlId="floatingUsername"
                          label={t('login.username')}
                          className="position-relative"
                        >
                          <Form.Control
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.username}
                            placeholder={t('login.username')}
                            name="username"
                            autoComplete="username"
                            // eslint-disable-next-line max-len
                            isInvalid={signUpFailed || (formik.touched.username && formik.errors.username)}
                            ref={inputRef}
                          />
                          {signUpFailed && (
                          <Form.Control.Feedback type="invalid" tooltip className="position-absolute top-0 start-100">
                            {t('login.userExist')}
                          </Form.Control.Feedback>
                          )}
                          {formik.errors.username && (
                          <Form.Control.Feedback type="invalid" tooltip>
                            {t(formik.errors.username)}
                          </Form.Control.Feedback>
                          )}
                        </FloatingLabel>
                        <FloatingLabel controlId="floatingPassword" label={t('login.password')}>
                          <Form.Control
                            type="password"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.password}
                            placeholder={t('login.password')}
                            name="password"
                            autoComplete="current-password"
                            isInvalid={formik.touched.password && formik.errors.password}
                          />
                          <Form.Control.Feedback type="invalid" tooltip>
                            {formik.errors.password}
                          </Form.Control.Feedback>
                        </FloatingLabel>
                        <FloatingLabel controlId="floatingPasswordConfirmation" label="Подтвердите пароль">
                          <Form.Control
                            type="password"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.passwordConfirmation}
                            placeholder={t('login.confirmPassword')}
                            name="passwordConfirmation"
                            autoComplete="current-passwordConfirmation"
                            isInvalid={formik.touched.passwordConfirmation
                  && formik.errors.passwordConfirmation}
                          />
                          <Form.Control.Feedback type="invalid" tooltip>
                            {formik.errors.passwordConfirmation}
                          </Form.Control.Feedback>
                        </FloatingLabel>
                        <Button type="submit" variant="outline-primary">{t('login.registration')}</Button>
                      </Stack>
                    </fieldset>
                  </Form>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SignupPage;
