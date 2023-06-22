import { useFormik } from 'formik';
import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Stack from 'react-bootstrap/Stack';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { hideModal } from '../../slices/modalSlices.js';
import { useChatApi } from '../../contexts/index.jsx';

const Rename = () => {
  const { t } = useTranslation();
  const channels = useSelector((state) => state.channels.channels);
  const channelId = useSelector((state) => state.channels.currentChannelId);
  const dispatch = useDispatch();
  const chatApi = useChatApi();

  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.focus();
  });
  useEffect(() => {
    inputRef.current.select();
  }, []);

  const currentChannel = channels.find((channel) => channel.id === channelId);
  const currentChannelName = currentChannel.name;
  const formik = useFormik({
    initialValues: { name: currentChannelName },
    validationSchema: Yup.object({
      name: Yup
        .string()
        .min(3, t('login.symbolCount'))
        .max(20, t('login.symbolCount'))
        .required(t('login.requiredFiel'))
        .notOneOf(channels.map((channel) => channel.name), t('login.unique')),
    }),
    onSubmit: async (values) => {
      try {
        await chatApi.renameChannel({ id: channelId, name: values.name });
        toast.success(t('channels.renamed'));
        dispatch(hideModal());
      } catch (err) {
        toast.error(t('connectionError'));
      }
    },
  });

  return (
    <Modal show centered onHide={() => dispatch(hideModal())} keyboard>
      <Modal.Header closeButton>
        <Modal.Title>{t('channels.renameChannel')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <fieldset disabled={formik.isSubmitting}>
            <Stack gap={2}>
              <Form.Group className="position-relative">
                <Form.Label visuallyHidden htmlFor="renameChannel">{t('channels.name')}</Form.Label>
                <Form.Control
                  ref={inputRef}
                  onChange={formik.handleChange}
                  value={formik.values.name}
                  data-testid="input-channelName"
                  name="name"
                  isInvalid={formik.touched.name && formik.errors.name}
                  id="renameChannel"
                />
                <Form.Control.Feedback type="invalid" tooltip className="position-absolute">
                  {formik.errors.name}
                </Form.Control.Feedback>
              </Form.Group>
              <div className="d-flex justify-content-end">
                <Button onClick={() => dispatch(hideModal())} variant="secondary" className="me-2">{t('cancel')}</Button>
                <Button type="submit" variant="primary">{t('messages.send')}</Button>
              </div>
            </Stack>
          </fieldset>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default Rename;
