import { toast } from 'react-toastify';

const toastSuccess = (text) => toast.success(text);
export const toastInfo = (text) => toast.info(text);
export const toastWarning = (text) => toast.warn(text);
export const toastError = (text) => toast.error(text);

export default toastSuccess;
