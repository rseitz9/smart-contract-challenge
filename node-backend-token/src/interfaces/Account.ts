import ChangeEvent from "./ChangeEvent";

export default interface Account {
  totalBalance: number;
  events: Array<ChangeEvent>;
  latestBlockNumber: number;
}
