export default interface ChangeEvent {
  block: number;
  totalBalance: number;
  change: number;
  type: string;
  previousBalance: number;
}
