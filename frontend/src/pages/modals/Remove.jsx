import React from 'react';
import { useFormik } from 'formik';
import { useSelector, useDispatch } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useTranslation } from 'react-i18next';
import { useSocketContext } from '../../context/index.js';
import { toastWarning } from '../toasts/index.js';
import { modalSelector, closeModal } from '../../redux/slices/modalSlice.js';

const Remove = () => {
  const { t } = useTranslation();
  const { removeChannel } = useSocketContext();
  const { isShowing, payload } = useSelector(modalSelector);
  const dispatch = useDispatch();

  const deleteChannel = () => {

    const resolve = () => {
      toastWarning(t('toasts.delete'));
      dispatch(closeModal());
    };

    removeChannel({ id: payload }, resolve);
  };

  const close = () => {
    dispatch(closeModal());
  };

  const formik = useFormik({});

  return (
    <Modal show={isShowing} onHide={close} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('channels.delete')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{t('questions.areYouSure')}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={close} disabled={formik.isSubmitting}>
          {t('buttons.cancel')}
        </Button>
        <Button variant="danger" onClick={deleteChannel} disabled={formik.isSubmitting}>
          {t('buttons.delete')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Remove;