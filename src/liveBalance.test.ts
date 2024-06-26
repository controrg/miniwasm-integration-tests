import { LCDClient, MnemonicKey, MsgSend, Wallet } from "@initia/initia.js";
import { describe, test, expect, vi, onTestFinished } from "vitest";
import { liveBalance } from "./liveBalance";
import bip39 from "bip39";

describe("Live user balance", () => {
  test("The balance updates when funds are received", async () => {
    // arrange
    const randomWallet = createRandomWallet();
    const balance = await liveBalance({
      websocketUrl: "ws://localhost:26657/websocket",
      lcdUrl: "http://localhost:1317",
    })(randomWallet.key.accAddress);

    onTestFinished(balance.destroy);

    // assert
    expect(balance.getBalance()).toBe(0);

    await waitForBoth([
      // act
      sendFunds(randomWallet.key.accAddress, 1000),
      // assert
      vi.waitFor(() => expect(balance.getBalance()).toBe(1000)),
    ]);
  });
});


const localLCDClient = new LCDClient("http://localhost:1317", {
  gasPrices: "0.15umin",
  gasAdjustment: "1.5",
});
const key = new MnemonicKey({ mnemonic: process.env.VITE_MNEMONIC });
const wallet = new Wallet(localLCDClient, key);


const sendFunds = async (recipient: string, amount: number) =>
  wallet
    .createAndSignTx({
      msgs: [new MsgSend(wallet.key.accAddress, recipient, `${amount}umin`)],
    })
    .then(localLCDClient.tx.broadcast.bind(localLCDClient.tx));

const createRandomWallet = () => 
 new Wallet(localLCDClient, new MnemonicKey({ mnemonic: bip39.generateMnemonic() }));


const waitForBoth = Promise.all.bind(Promise);
