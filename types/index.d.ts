export type AppStateType = {
  firstTime: Boolean;
  setFirstTime: (firstTime: Boolean) => void;
};

export type ShopStateType = {
  id: string;
  name: string;
  //   address: string;
  usd: number;
  fcd: number;
  pointUsd: number;
  pointFcd: number;
};

export type ClientType = {
  number: string;
  points: number;
  createdAt: number;
};

export type TransactionType = {
  number: string;
  amount: number;
  points: number;
  currency: "USD" | "FCD";
  createdAt: number;
};
