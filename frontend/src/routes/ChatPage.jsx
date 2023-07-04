import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowRightSquareFill, PlusSquareFill } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import {
  Button, Col, Container, Row, Dropdown, ButtonGroup,
} from 'react-bootstrap';
import axios from 'axios';
import _ from 'lodash';
import { animateScroll } from 'react-scroll';
import profanityFilter from 'leo-profanity';
import { franc } from 'franc-min';
import { useTranslation } from 'react-i18next';
import routes from '../routes.js';
import { useAuth, useChatApi } from '../contexts/index.jsx';
import { actions as channelsActions } from '../slices/channelSlices.js';
import { actions as messagesActions } from '../slices/MessageSlices.js';
import getModal from './modals/index.jsx';
import { showModal } from '../slices/modalSlices.js';

const LeftCol = ({ t }) => {
  const dispatch = useDispatch();
  const { channels, currentChannelId } = useSelector((state) => state.channels);
  return (
    <Col md={2} className="col-4 border-end pt-5 px-0 bg-light">
      <div className="d-flex justify-content-between mb-2 ps-4 pe-2">
        <span>{t('channels.channels')}</span>
        <button
          onClick={() => dispatch(showModal({ modalType: 'newChannel', channelId: null }))}
          type="button"
          className="p-0 text-primary btn btn-group-vertical"
        >
          <PlusSquareFill size={20} />
          <span className="visually-hidden">+</span>
        </button>
      </div>
      <ul className="nav flex-column nav-pills nav-fill px-2">
        {channels.map((channel) => (
          <li className="nav-item w-100" key={channel.id}>
            <Dropdown onClick={() => { dispatch(channelsActions.setCurrentChannelId(channel.id)); }} as={ButtonGroup} className="d-flex">
              <Button
                className="w-100 rounded-0 text-start text-truncate"
                variant={channel.id === currentChannelId && 'secondary'}
              >
                <span className="me-1">#</span>
                {channel.name}
              </Button>
              {channel.removable && (
                <Dropdown.Toggle
                  split
                  variant={channel.id === currentChannelId && 'secondary'}
                >
                  <span className="visually-hidden">{t('channels.action')}</span>
                </Dropdown.Toggle>
              )}
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => dispatch(showModal({ modalType: 'removeChannel', channelId: channel.id }))}>
                  {t('channels.delete')}
                </Dropdown.Item>
                <Dropdown.Item onClick={() => dispatch(showModal({ modalType: 'renameChannel', channelId: channel.id }))}>
                  {t('channels.rename')}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </li>
        ))}
      </ul>
    </Col>
  );
};
const MessagesBox = ({ currentChannelMessages }) => {
  useEffect(() => {
    animateScroll.scrollToBottom({ containerId: 'messages-box', delay: 0, duration: 0 });
  }, [currentChannelMessages.length]);
  return (
    <div id="messages-box" className="overflow-auto px-5 ">
      {currentChannelMessages.map(({ id, body, username }) => (
        <div key={id} className="text-break mb-2">
          <b>{username}</b>
          {`: ${body}`}
        </div>
      ))}
    </div>
  );
};

const SendingForm = ({ t, currentChannel, username }) => {
  const chatApi = useChatApi();
  const [isSubmitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const inputRef = useRef();
  useEffect(() => {
    inputRef.current?.focus();
  });

  const submitHandler = async (e) => {
    e.preventDefault();
    const trimmedMessage = message.trim();
    if (!trimmedMessage.length) return;
    const detectedLanguage = franc(trimmedMessage);
    if (detectedLanguage === 'rus') {
      profanityFilter.loadDictionary('ru');
    } else {
      profanityFilter.loadDictionary('en');
    }
    const cleanedMessage = profanityFilter.clean(trimmedMessage);
    setSubmitting(true);
    try {
      await chatApi.newMessage({
        body: cleanedMessage,
        channelId: currentChannel.id,
        username,
      });
      setMessage('');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-auto px-5 py-3">
      <form noValidate="" className="py-1 border rounded-2" onSubmit={submitHandler}>
        <fieldset disabled={isSubmitting}>
          <div className="input-group has-validation">
            <input
              name="body"
              aria-label="Новое сообщение"
              placeholder={t('messages.enterMessage')}
              className="border-0 p-0 ps-2 form-control"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              ref={inputRef}
            />
            <button type="submit" disabled="" className="btn btn-group-vertical">
              <ArrowRightSquareFill size={20} />
              <span className="visually-hidden">{t('messages.send')}</span>
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  );
};

const RightCol = ({
  currentChannel, currentChannelMessages, username, t,
}) => (
  <Col className="p-0 h-100">
    <div className="d-flex flex-column h-100">
      <div className="bg-light mb-4 p-3 shadow-sm small">
        <p className="m-0">
          <b>
            {`# ${currentChannel?.name}`}
          </b>
        </p>
        <span className="text-muted">{t('messages.messagesCount', { count: currentChannelMessages.length })}</span>
      </div>
      <MessagesBox
        currentChannelMessages={currentChannelMessages}
      />
      <SendingForm
        t={t}
        currentChannel={currentChannel}
        username={username}
      />
    </div>
  </Col>
);

const getAuthHeader = (userData) => (
  userData?.token ? { Authorization: `Bearer ${userData.token}` } : {}
);

const ChatPage = () => {
  const auth = useAuth();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { channels, currentChannelId } = useSelector((state) => state.channels);
  const currentChannel = _.find(channels, (({ id }) => id === currentChannelId));
  const messages = useSelector((state) => state.messages.messages);
  const currentChannelMessages = messages.filter((msg) => msg.channelId === currentChannelId);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data } = await axios
          .get(routes.httpDataPath, { headers: getAuthHeader(auth.userData) });
        dispatch(channelsActions.setChannels(data.channels));
        dispatch(messagesActions.setMessages(data.messages));
      } catch (err) {
        if (!err.isAxiosError) throw err;
        if (err.response?.status === 401) auth.logOut();
        else toast.error(t('connectionError'));
      }
    };
    fetchContent();
  }, [auth, dispatch, t]);

  const modalType = useSelector((state) => state.modal.modalType);
  const renderModal = (type) => {
    if (!type) {
      return null;
    }
    const Modal = getModal(type);
    return <Modal />;
  };

  return (
    <Container className="h-100 my-4 overflow-hidden rounded shadow">
      <Row className="h-100 bg-white flex-md-row">
        <LeftCol
          t={t}
        />
        <RightCol
          currentChannel={currentChannel}
          currentChannelMessages={currentChannelMessages}
          username={auth.userData.username}
          t={t}
        />
      </Row>
      {renderModal(modalType)}
    </Container>
  );
};

export default ChatPage;
