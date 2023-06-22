import React from 'react';
import { useDispatch } from 'react-redux';
import Button from 'react-bootstrap/Button';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthContext } from '../context/index.js';
import { setStatus } from '../redux/slices/loaderSlice.js';
import LanguageSwitcher from './LanguageSwitcher';

const Nav = ({ button }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const useAuth = useAuthContext();
  const dispatch = useDispatch();

  const logout = () => {
    localStorage.clear();
    useAuth.setUserData(null);
    dispatch(setStatus());
    navigate('/login');
  };

  return (
    <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
      <div className="container">
        <Link className="navbar-brand" to="/">{t('chat')}</Link>
        {button && (
        <Button type="button" onClick={logout}>
          {t('buttons.logout')}
          {' '}
        </Button>
        )}
      </div>
      <LanguageSwitcher />
    </nav>
  );
};

export default Nav;
