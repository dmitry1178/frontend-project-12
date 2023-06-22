import React, { useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import { useSelector, useDispatch } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert';
import { useTranslation } from 'react-i18next';
import { useSocketContext } from '../../context/index.js';
import { channelSchema } from '../../schemas/index.js';
import { channelsSelector } from '../../redux/slices/channelsSlice.js';
import { modalSelector, closeModal } from '../../redux/slices/modalSlice.js';
import toastSuccess from '../toasts/index.js';

const Add = () => {
  const { t } = useTranslation();
  const channels = useSelector(channelsSelector);
  const { isShowing } = useSelector(modalSelector);
  const { addNewChannel } = useSocketContext();
  const dispatch = useDispatch();
  const input = useRef();

  const formik = useFormik({
    initialValues: {
      channelName: '',
    },
    validationSchema: channelSchema,
    onSubmit: ({ channelName }, actions) => {
      const resolve = () => {
        formik.resetForm();
        toastSuccess(t('toasts.add'));
        dispatch(closeModal());
      };

      if (channels.find((channel) => channel.name === channelName)) {
        actions.setFieldError('channelName', 'uniq');
        return;
      }

      addNewChannel({ name: channelName }, resolve);
    },
  });

  const close = () => {
    formik.resetForm();
    dispatch(closeModal());
  };

  useEffect(() => {
    input.current.focus();
  }, []);

  return (
    <Modal show={isShowing} onHide={close} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('channels.addChannel')}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={formik.handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Control
              ref={input}
              className={formik.errors.channelName && 'form-control is-invalid'}
              id="channelName"
              type="text"
              value={formik.values.channelName}
              placeholder={t('channels.typeChannelName')}
              autoComplete="off"
              onChange={formik.handleChange}
            />
            <Form.Label className="visually-hidden" htmlFor="channelName">Имя канала</Form.Label>
          </Form.Group>
          <Alert show={!!formik.errors.channelName} variant="danger">{formik.errors.channelName && t(`errors.${formik.errors.channelName}`)}</Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button type="button" variant="secondary" disabled={formik.isSubmitting} onClick={close}>
            {t('buttons.cancel')}
          </Button>
          <Button type="submit" variant="primary" disabled={!formik.isValid}>
            {t('buttons.send')}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default Add;