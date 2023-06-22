import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useChatApi } from '../../contexts/index.jsx';
import { hideModal } from '../../slices/modalSlices.js';

const Remove = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const channelId = useSelector((state) => state.channels.currentChannelId);
  const chatApi = useChatApi();
  const [isSubmitting, setSubmitting] = useState(false);
  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await chatApi.removeChannel({ id: channelId });
      dispatch(hideModal());
      toast.success(t('channels.remove'));
    } catch (err) {
      toast.error(t('connectionError'));
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <Modal show centered onHide={() => dispatch(hideModal())} keyboard>
      <Modal.Header closeButton>
        <Modal.Title>{t('channels.deleteChannel')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p className="lead">{t('channels.AUS')}</p>
        <Form onSubmit={onSubmit}>
          <fieldset disabled={isSubmitting}>
            <div className="d-flex justify-content-end">
              <Button onClick={() => dispatch(hideModal())} variant="secondary" className="me-2">
                {t('cancel')}
              </Button>
              <Button type="submit" variant="danger">
                {t('channels.delete')}
              </Button>
            </div>
          </fieldset>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default Remove;
