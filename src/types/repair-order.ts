export interface RepairOrder {
  _id: string;
  customer: {
    _id: string;
    name: string;
  };
  registrationNumber: string;
  kilometers: number;
  vin: string;
  dealAmount?: number;
  dateBooked: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}