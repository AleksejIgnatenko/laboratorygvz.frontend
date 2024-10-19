"use client";

export interface RegistrationUserModelRequest {
  surname: string;
  userName: string;
  patronymic: string;
  email: string;
  password: string;
  repeatPassword: string;
}
