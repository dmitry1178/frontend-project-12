import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Nav from './Nav';
import routes from '../routes.js';

const NotFoundPage = () => {
  const { t } = useTranslation();
  return (
    <>
      <Nav />
      <div className="text-center">
        <img
          alt={t('notFoundPage')}
          className="img-fluid w-25"
          src="https://cdn2.hexlet.io/assets/error-pages/404-4b6ef16aba4c494d8101c104236304e640683fa9abdb3dd7a46cab7ad05d46e9.svg"
        />
        <h1 className="h4 text-muted">{t('notFoundPage')}</h1>
        <p className="text-muted">
          {t('canGoTo')}
          {' '}
          <Link to={routes.rootPagePath()}>{t('linkToMain')}</Link>
        </p>
      </div>
    </>
  );
};

export default NotFoundPage;
