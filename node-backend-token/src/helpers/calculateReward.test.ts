import { calculateReward } from "./calculateReward";
import { Account } from "../interfaces";

describe("calculateReward", () => {
  it("with no account, returns", () => {
    let reward = calculateReward(0, 5, undefined);
    expect(reward).toEqual(0);
  });

  it("with no events, should use average of total balance over all blocks", () => {
    let account: Account = {
      totalBalance: 500,
      latestBlockNumber: 5,
      events: [],
    };
    let reward = calculateReward(0, 5, account);
    expect(reward).toEqual(25);
  });

  it("should calculate correctly on Deposits", () => {
    let account: Account = {
      totalBalance: 500,
      latestBlockNumber: 5,
      events: [
        {
          block: 2,
          totalBalance: 100,
          type: "Deposit",
          change: 100,
          previousBalance: 0,
        },
        {
          block: 4,
          totalBalance: 200,
          type: "Deposit",
          change: 100,
          previousBalance: 100,
        },
      ],
    };
    let reward = calculateReward(0, 5, account);
    expect(reward).toEqual(4);
  });

  it("should calculate correctly on withdrawals and deposits", () => {
    let account: Account = {
      totalBalance: 3750,
      latestBlockNumber: 27,
      events: [
        {
          block: 15,
          totalBalance: 1000,
          type: "Deposit",
          change: 1000,
          previousBalance: 0,
        },
        {
          block: 16,
          totalBalance: 1500,
          type: "Deposit",
          change: 500,
          previousBalance: 1000,
        },
        {
          block: 17,
          totalBalance: 1250,
          type: "Withdraw",
          change: -250,
          previousBalance: 1500,
        },
        {
          block: 20,
          totalBalance: 2250,
          type: "Deposit",
          change: 1000,
          previousBalance: 1250,
        },
        {
          block: 21,
          totalBalance: 2750,
          type: "Deposit",
          change: 500,
          previousBalance: 2250,
        },
        {
          block: 22,
          totalBalance: 2500,
          type: "Withdraw",
          change: -250,
          previousBalance: 2750,
        },
        {
          block: 25,
          totalBalance: 3500,
          type: "Deposit",
          change: 1000,
          previousBalance: 2500,
        },
        {
          block: 26,
          totalBalance: 4000,
          type: "Deposit",
          change: 500,
          previousBalance: 3500,
        },
        {
          block: 27,
          totalBalance: 3750,
          type: "Withdraw",
          change: -250,
          previousBalance: 4000,
        },
      ],
    };
    let reward = calculateReward(0, 30, account);
    expect(reward).toEqual(62.5);
  });

  it("should calculate correctly with only past events", () => {
    let account: Account = {
      totalBalance: 200,
      latestBlockNumber: 5,
      events: [
        {
          block: 2,
          totalBalance: 100,
          type: "Deposit",
          change: 100,
          previousBalance: 0,
        },
        {
          block: 4,
          totalBalance: 200,
          type: "Deposit",
          change: 100,
          previousBalance: 100,
        },
      ],
    };
    let reward = calculateReward(10, 15, account);
    expect(reward).toEqual(10);
  });

  it("should calculate correctly in between events", () => {
    let account: Account = {
      totalBalance: 200,
      latestBlockNumber: 30,
      events: [
        {
          block: 10,
          totalBalance: 100,
          type: "Deposit",
          change: 100,
          previousBalance: 0,
        },
        {
          block: 20,
          totalBalance: 50,
          type: "Withdraw",
          change: -50,
          previousBalance: 100,
        },
        {
          block: 30,
          totalBalance: 150,
          type: "Deposit",
          change: 100,
          previousBalance: 50,
        },
      ],
    };
    let reward = calculateReward(22, 25, account);
    expect(reward).toEqual(2.5);
  });

  it("should calculate correctly with only future events", () => {
    let account: Account = {
      totalBalance: 200,
      latestBlockNumber: 30,
      events: [
        {
          block: 10,
          totalBalance: 100,
          type: "Deposit",
          change: 100,
          previousBalance: 0,
        },
        {
          block: 20,
          totalBalance: 50,
          type: "Withdraw",
          change: -50,
          previousBalance: 100,
        },
        {
          block: 30,
          totalBalance: 150,
          type: "Deposit",
          change: 100,
          previousBalance: 50,
        },
      ],
    };
    let reward = calculateReward(0, 5, account);
    expect(reward).toEqual(0);
  });
  it("should ignore previous blocks in the log when calculating on current blocks", () => {
    let account: Account = {
      totalBalance: 200,
      latestBlockNumber: 450,
      events: [
        {
          block: 1,
          totalBalance: 500000,
          type: "Deposit",
          change: 1,
          previousBalance: 49999,
        },
        {
          block: 440,
          totalBalance: 23750,
          type: "Deposit",
          change: 1000,
          previousBalance: 22750,
        },
        {
          block: 442,
          totalBalance: 23500,
          type: "Withdraw",
          change: -250,
          previousBalance: 23750,
        },
        {
          block: 444,
          totalBalance: 23750,
          type: "Deposit",
          change: 250,
          previousBalance: 23500,
        },
        {
          block: 446,
          totalBalance: 23500,
          type: "Withdraw",
          change: -250,
          previousBalance: 23750,
        },
        {
          block: 447,
          totalBalance: 24500,
          type: "Deposit",
          change: 1000,
          previousBalance: 23500,
        },
      ],
    };
    let reward = calculateReward(440, 450, account);
    expect(reward).toEqual(1195);
  });
});
