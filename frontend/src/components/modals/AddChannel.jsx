import { useFormik } from 'formik';
import React, { useEffect, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Stack from 'react-bootstrap/Stack';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { useChatApi } from '../../contexts/index.jsx';
import { actions as channelsActions } from '../../slices/channelSlices.js';
import { hideModal } from '../../slices/modalSlices.js';

const Add = () => {
  const selectChannel = (state) => state.channels.channels;
  const channels = useSelector(selectChannel);
  const { t } = useTranslation();
  const chatApi = useChatApi();
  const dispatch = useDispatch();
  const getValidationSchema = (channelNames) => Yup.object().shape({
    channelName: Yup.string().trim()
      .min(3, t('login.symbolCount'))
      .max(20, t('login.symbolCount'))
      .required(t('login.requiredField'))
      .notOneOf(channelNames, t('login.unique')),
  });

  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const channelNames = channels.map(({ name }) => name);
  const formik = useFormik({
    initialValues: { channelName: '' },
    validationSchema: getValidationSchema(channelNames),
    onSubmit: async (values) => {
      try {
        const responce = await chatApi.newChannel({ name: values.channelName });
        toast.success(t('channels.created'));
        dispatch(channelsActions.setCurrentChannelId(responce.data.id));
        console.log(channels);
        dispatch(hideModal());
      } catch (err) {
        toast.error(t('connectionError'));
      }
    },
  });

  return (
    <Modal show centered keyboard>
      <Modal.Header closeButton onHide={() => dispatch(hideModal())}>
        <Modal.Title>{t('channels.add')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <fieldset disabled={formik.isSubmitting}>
            <Stack gap={2}>
              <Form.Group className="position-relative">
                <Form.Label htmlFor="channelName" visuallyHidden>{t('channels.name')}</Form.Label>
                <Form.Control
                  ref={inputRef}
                  onChange={formik.handleChange}
                  value={formik.values.channelName}
                  data-testid="input-channelName"
                  name="channelName"
                  isInvalid={formik.touched.channelName && formik.errors.channelName}
                  placeholder={t('channels.name')}
                  id="channelName"
                />
                <Form.Control.Feedback type="invalid" tooltip className="position-absolute">
                  {formik.errors.channelName}
                </Form.Control.Feedback>
              </Form.Group>
              <div className="d-flex justify-content-end">
                <Button onClick={() => dispatch(hideModal())} variant="secondary" className="me-2">
                  {t('cancel')}
                </Button>
                <Button type="submit" variant="primary">
                  {t('messages.send')}
                </Button>
              </div>
            </Stack>
          </fieldset>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default Add;
