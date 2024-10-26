"use client";

export interface UserValidationErrorModel {
  Surname?: string;
  UserName?: string;
  Patronymic?: string;
  Email?: string;
  Password?: string;
  RepeatPassword?: string;
}
