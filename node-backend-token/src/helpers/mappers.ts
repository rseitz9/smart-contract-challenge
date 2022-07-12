import { MappedEvent } from "../interfaces";

export const mapEvent = (event: any): MappedEvent => {
  let address = event.returnValues.from
    ? event.returnValues.from
    : event.returnValues.to;
  return {
    block: event.blockNumber,
    amount: parseInt(event.returnValues.amount),
    totalBalance: parseInt(event.returnValues.totalLocked),
    address: address,
    type: event.event,
  };
};
