import { useSelector } from 'react-redux';
import getModal from '../../modals/index.js';
import { modalSelector } from '../../../redux/slices/modalSlice';

const Modal = () => {
  const renderModal = (modal) => {
    if (!modal.isShowing) {
      return null;
    }
  
    const Component = getModal(modal.type);
    return modal.type === 'adding' ? <Component /> : <Component id={modal.payload} />;
  };

  const modal = useSelector(modalSelector);

  return renderModal(modal);
};

export default Modal;