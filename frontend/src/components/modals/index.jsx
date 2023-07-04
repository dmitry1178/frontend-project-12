import Add from './AddChannel.jsx';
import Remove from './RemoveChannel.jsx';
import Rename from './RenameChannel.jsx';

const modals = {
  newChannel: Add,
  removeChannel: Remove,
  renameChannel: Rename,
};

export default (modalName) => modals[modalName];
