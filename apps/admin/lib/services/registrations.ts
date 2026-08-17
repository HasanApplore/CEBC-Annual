import { apiRequest } from "../api/client";

export interface Registration {
  _id: string;
  name: string;
  email: string;
  title: string;
  company: string;
  country: string;
  phone: string;
  paymentStatus: "pending" | "paid";
  amount: number;
  createdAt: string;
}

export const registrationService = {
  getAll: () => apiRequest<Registration[]>("/registrations"),
};
