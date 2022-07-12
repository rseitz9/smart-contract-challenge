import { Account, ChangeEvent } from "../interfaces";
import { mapEvent } from "./mappers";

export const extractEvent = (AddressAccountMapping: Map<string, Account>) => {
  return (error: any, event: any) => {
    if (error) {
      console.error(error);
      return;
    }

    let { address, block, totalBalance, amount, type } = mapEvent(event);

    if (type === "Withdraw") {
      amount = -amount;
    }

    let changeEvent: ChangeEvent = {
      block,
      totalBalance,
      type,
      change: amount,
      previousBalance: totalBalance - amount,
    };

    let account = AddressAccountMapping.get(address);

    if (account === undefined) {
      if (type === "Withdraw") {
        console.error("Withdraw from undefined account");
        return;
      }
      AddressAccountMapping.set(address, {
        totalBalance: totalBalance,
        latestBlockNumber: block,
        events: [changeEvent],
      });
    } else {
      //prevent out of order events from messing up state
      if (block > account.latestBlockNumber) {
        account.totalBalance = totalBalance;
        account.latestBlockNumber = block;
      }
      account.events.push(changeEvent);
    }
  };
};
