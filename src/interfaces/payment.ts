export interface IPaymentTypesResponse {
  id: string;
  price: number;
  monthDuration: number;
  description: string;
}

export interface ICreatePaymentRequest {
  blogId: string;
  advertisementId: string;
  nonce?: string;
  paymentMethodToken?: string;
}

export interface ISavedCardResponse {
  token: string;
  cardType: string;
  last4: string;
  expirationMonth: string;
  expirationYear: string;
  cardholderName: string;
  imageUrl: string;
  isDefault: boolean;
}

export interface IVaultCardRequest {
  nonce: string;
}