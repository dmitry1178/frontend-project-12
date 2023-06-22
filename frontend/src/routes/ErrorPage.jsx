import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import logo from '../images/404.svg';

const NotFoundPage = () => {
  const { t } = useTranslation();
  return (
    <div className="text-center">
      <img
        src={logo}
        alt={t('notFound')}
        className="h-25 img-fluid"
      />
      <h1 className="h4 text-muted">{t('notFound')}</h1>
      <p className="text-muted">
        {t('CanGo')}
        <Link to="/login">{t('toMainPage')}</Link>
      </p>
    </div>
  );
};

export default NotFoundPage;
