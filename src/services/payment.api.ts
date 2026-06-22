import { ICreatePaymentRequest, IVaultCardRequest } from '../interfaces/payment';
import { http } from './http';

export const getAdTypes = async () => await http.get('/Payment/AdvertisementType');

export const getPaymentToken = async () => await http.get('/Payment/Token');

export const createPayment = async (data: ICreatePaymentRequest) => await http.post('/Payment', data);

export const getSavedCards = async () => await http.get('/Payment/SavedCards');

export const vaultCard = async (data: IVaultCardRequest) => await http.post('/Payment/SavedCards', data);

export const deleteSavedCard = async (token: string) => await http.delete(`/Payment/SavedCards/${token}`);
