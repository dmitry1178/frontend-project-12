import Add from './Add';
import Rename from './Rename';
import Remove from './Remove';

const modals = {
  adding: Add,
  rename: Rename,
  remove: Remove,
};

const getModal = (modalType) => modals[modalType];

export default getModal;
