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
