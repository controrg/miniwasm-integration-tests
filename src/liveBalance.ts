import { LCDClient, WebSocketClient } from "@initia/initia.js";
import { getBalance } from "./getBalance";

interface Config {
  websocketUrl: string;
  lcdUrl: string;
}

export const liveBalance =
  ({ websocketUrl, lcdUrl }: Config) =>
  async (address: string) => {
    // State
    const wsClient = new WebSocketClient(websocketUrl);
    const lcdClient = new LCDClient(lcdUrl);

    // Initialize balance
    let balance = await getBalance(lcdClient, address);

    // Subscribe to changes
    wsClient.subscribe(
      "Tx",
      {
        "transfer.recipient": address,
      },
      async () => (balance = await getBalance(lcdClient, address))
    );
    wsClient.start();

    return {
      getBalance: () => balance,
      destroy: () => wsClient.destroy(),
    };
  };

export const amountOfFirstCoin = (coins: any) =>
  parseInt(coins[0].toData()?.[0]?.amount || "0");
