import { LCDClient, MnemonicKey, MsgSend, Wallet } from "@initia/initia.js";
import { describe, test, expect, vi, onTestFinished } from "vitest";
import { liveBalance } from "./liveBalance";
import bip39 from "bip39";

const lcd = new LCDClient("http://localhost:1317", {
  gasPrices: "0.15umin",
  gasAdjustment: "1.5",
});
const key = new MnemonicKey({ mnemonic: process.env.VITE_MNEMONIC });
const wallet = new Wallet(lcd, key);

describe("Live user balance", () => {
  test("The balance updates when funds are received", async () => {
    const randomKey = new MnemonicKey({ mnemonic: bip39.generateMnemonic() });
    const randomWallet = new Wallet(lcd, randomKey);
    const balance = await liveBalance({
      websocketUrl: "ws://127.0.0.1:26657/websocket",
      lcdUrl: "http://localhost:1317",
    })(randomWallet.key.accAddress);
    onTestFinished(balance.destroy);

    expect(balance.getBalance()).toBe(0);

    await Promise.all([
      sendFunds(randomWallet.key.accAddress, 1000),
      vi.waitFor(() => expect(balance.getBalance()).toBe(1000), {
        timeout: 5000,
      }),
    ]);
  }, 6000);
});

const sendFunds = async (recipient: string, amount: number) =>
  wallet
    .createAndSignTx({
      msgs: [new MsgSend(wallet.key.accAddress, recipient, `${amount}umin`)],
    })
    .then(lcd.tx.broadcast.bind(lcd.tx));
