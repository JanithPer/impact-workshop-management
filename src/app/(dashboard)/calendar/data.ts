export interface Event {
  title: string;
  start: Date;
  end: Date;
  colorMode: 'success' | 'danger' | 'warning' | 'info' | 'green' | 'red' | 'brown' | 'black';
}