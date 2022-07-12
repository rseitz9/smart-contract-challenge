import { REWARD_PERCENTAGE } from "../constants";
import { Account } from "../interfaces";

/*
Ideally we could store the events in a database to maintain 
consistency. I considered deleting the events based on 
what had already been paid out, which would reduce the 
complexity of having to calculate the reward in periods 
where there is no event; however, it might be useful
to keep a record of the events 
*/
const calculateReward = (
  startBlock: number,
  endBlock: number,
  account?: Account
): number => {
  const blockInterval = endBlock - startBlock;
  if (!account) {
    return 0;
  }

  //if no events, total balance wasn't modified during this period:
  //average is simple calculate
  if (account.events.length < 1) {
    return REWARD_PERCENTAGE * account.totalBalance;
  }

  let currentEvents = account.events.filter((ev) => {
    return ev.block >= startBlock && ev.block <= endBlock;
  });

  //if we are in between events
  //find last event before start block to give us our deposit over this time period
  if (currentEvents.length < 1) {
    let startingBalance = 0;
    let j = 0;
    //could replace this with a binary search to be more efficient
    while (j < account.events.length && account.events[j].block < startBlock) {
      startingBalance = account.events[j].totalBalance;
      j++;
    }
    return REWARD_PERCENTAGE * startingBalance;
  }

  //otherwise we have events in the last interval period
  let average = 0;
  let lastBlock = startBlock;
  let trailingBalance = 0;
  for (let i = 0; i < currentEvents.length; i++) {
    let currentBlock = account.events[i].block;
    let averageOverPeriod =
      (account.events[i].previousBalance * (currentBlock - lastBlock)) /
      blockInterval;
    lastBlock = currentBlock;
    average += averageOverPeriod;
    trailingBalance = account.events[i].totalBalance;
  }
  if (lastBlock != endBlock) {
    average += (trailingBalance * (endBlock - lastBlock)) / blockInterval;
  }
  return average * REWARD_PERCENTAGE;
};

export { calculateReward };
