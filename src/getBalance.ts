import { LCDClient } from "@initia/initia.js";
import { amountOfFirstCoin } from "./liveBalance";

export const getBalance = async (lcdClient: LCDClient, address: string) =>
  lcdClient.bank.balance(address).then(amountOfFirstCoin);
