import { create } from "zustand";
import { AppStateType, ClientType, ShopStateType } from "../types";

export const useAppState = create<AppStateType>((set) => ({
  firstTime: true,
  setFirstTime: (firstTime: Boolean) => set({ firstTime }),
}));

type ShopStateTypeProps = {
  shop: ShopStateType | null;
  setShop: (shop: ShopStateType | null) => void;
};
export const useShopState = create<ShopStateTypeProps>((set) => ({
  shop: null,
  setShop: (shop: ShopStateType | null) => set({ shop }),
}));

type ClientStateType = {
  clients: ClientType[];
  setClients: (client: ClientType[]) => void;
};

export const useClientsState = create<ClientStateType>((set) => ({
  clients: [],
  setClients: (client: ClientType[]) => set({ clients: [...client] }),
}));
