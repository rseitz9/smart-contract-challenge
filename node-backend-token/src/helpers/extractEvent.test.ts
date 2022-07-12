import { Account } from "../interfaces";
import { extractEvent } from "./extractEvent";

describe("extractEvents", () => {
  it("adds deposit event to Map", () => {
    let address = "0x926b9E47D0c8240Ba694eD83418589736f30A849";
    let amount = 100;
    let totalLocked = 200;
    let testDepositEvent = {
      logIndex: 0,
      transactionIndex: 0,
      transactionHash:
        "0xd38cdc22d699d39e961e70bfbafcdba91d90a260a409fc4d1f78ae21fca4d10d",
      blockHash:
        "0xa72b2436e6c92a3be24dfbcfa46a1cda1c68c612a9d2c4cfbec4955105f6ca33",
      blockNumber: 1,
      address: "0x7fC308C9Cf58b221d09DeC31AE51Ee4f6306ff48",
      type: "mined",
      id: "log_d2bb977d",
      returnValues: {
        "0": address,
        "1": amount,
        "2": totalLocked,
        from: address,
        amount: amount,
        totalLocked: totalLocked,
      },
      event: "Deposit",
      signature: "",
      raw: {
        data: "0x00000000000000000000000000000000000000000000000000000000000001f40000000000000000000000000000000000000000000000000000000000000abe",
        topics: [
          "0x90890809c654f11d6e72a28fa60149770a0d11ec6c92319d6ceb2bb0a4ea1a15",
          "0x000000000000000000000000926b9e47d0c8240ba694ed83418589736f30a849",
        ],
      },
    };
    let AddressAccountMapping = new Map<string, Account>();
    let testFunction = extractEvent(AddressAccountMapping);
    testFunction(null, testDepositEvent);
    expect(AddressAccountMapping.size).toEqual(1);
    let newEntry = AddressAccountMapping.get(address);
    expect(newEntry).not.toBeNull();
    expect(newEntry?.totalBalance).toEqual(200);
    expect(newEntry?.latestBlockNumber).toEqual(1);
    let event = newEntry?.events[0];
    expect(event).not.toBeNull();
    expect(event?.block).toEqual(1);
    expect(event?.change).toEqual(100);
    expect(event?.previousBalance).toEqual(100);
    expect(event?.totalBalance).toEqual(200);
    expect(event?.type).toEqual("Deposit");
  });

  it("adds withdraw event to Map", () => {
    let AddressAccountMapping = new Map<string, Account>();
    let address = "0x926b9E47D0c8240Ba694eD83418589736f30A849";
    AddressAccountMapping.set(address, {
      totalBalance: 1000,
      latestBlockNumber: 10,
      events: [
        {
          type: "Deposit",
          change: 1000,
          totalBalance: 1000,
          previousBalance: 0,
          block: 10,
        },
      ],
    });

    let amount = 100;
    let totalLocked = 900;

    let testWithdrawnEvent = {
      logIndex: 0,
      transactionIndex: 0,
      transactionHash:
        "0xd38cdc22d699d39e961e70bfbafcdba91d90a260a409fc4d1f78ae21fca4d10d",
      blockHash:
        "0xa72b2436e6c92a3be24dfbcfa46a1cda1c68c612a9d2c4cfbec4955105f6ca33",
      blockNumber: 11,
      address: "0x7fC308C9Cf58b221d09DeC31AE51Ee4f6306ff48",
      type: "mined",
      id: "log_d2bb977d",
      returnValues: {
        "0": address,
        "1": amount,
        "2": totalLocked,
        from: address,
        amount: amount,
        totalLocked: totalLocked,
      },
      event: "Withdraw",
      signature: "",
      raw: {
        data: "0x00000000000000000000000000000000000000000000000000000000000001f40000000000000000000000000000000000000000000000000000000000000abe",
        topics: [
          "0x90890809c654f11d6e72a28fa60149770a0d11ec6c92319d6ceb2bb0a4ea1a15",
          "0x000000000000000000000000926b9e47d0c8240ba694ed83418589736f30a849",
        ],
      },
    };
    let testFunction = extractEvent(AddressAccountMapping);
    testFunction(null, testWithdrawnEvent);
    expect(AddressAccountMapping.size).toEqual(1);
    let newEntry = AddressAccountMapping.get(address);
    expect(newEntry).not.toBeNull();
    expect(newEntry?.totalBalance).toEqual(900);
    expect(newEntry?.latestBlockNumber).toEqual(11);
    let event = newEntry?.events[1];
    expect(event).not.toBeNull();
    expect(event?.block).toEqual(11);
    expect(event?.change).toEqual(-100);
    expect(event?.previousBalance).toEqual(1000);
    expect(event?.totalBalance).toEqual(900);
    expect(event?.type).toEqual("Withdraw");
  });
});
