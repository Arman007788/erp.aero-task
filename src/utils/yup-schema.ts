import * as Yup from "yup";
import { emailRegex, nameRegex } from "./regex";

export const phoneNumberSchema = Yup.string()
  .matches(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format.")
  .required("Phone number is required.");

export const nameSchema = Yup.string()
  .trim()
  .matches(nameRegex, "Name must be only letter, `.` or `-`")
  .required("Name is required.");

export const emailSchema = Yup.string()
  .trim()
  .matches(emailRegex, "Please fill correct email.")
  .required("Email is required.");

export const uniqueIdSchema = Yup.string().trim().required("Id is required.");

export const numbericQueryParamSchema = Yup.string()
  .matches(/^\d+$/, "Params must be a numeric string")
  .optional();

export const idSchema = Yup.string()
  .test(
    "is-email-or-phone",
    "ID must be a valid email or phone number.",
    (value) => {
      if (!value) return false; // Required check
      return (
        emailSchema.isValidSync(value) || phoneNumberSchema.isValidSync(value)
      );
    }
  )
  .required("Email or Phone number is required.");

export const passwordSchema = Yup.string()
  .trim()
  .min(8, "Password must be at least 8 characters.")
  .test(
    "has-uppercase",
    "Password must include at least one uppercase letter.",
    (value) => !!value && /[A-Z]/.test(value)
  )
  .test(
    "has-lowercase",
    "Password must include at least one lowercase letter.",
    (value) => !!value && /[a-z]/.test(value)
  )
  .test(
    "has-digit",
    "Password must include at least one digit.",
    (value) => !!value && /[0-9]/.test(value)
  )
  .test(
    "has-special-character",
    "Password must include at least one special character.",
    (value) => !!value && /[^A-Za-z0-9]/.test(value)
  )
  .required("Password is required.");

export const confirmPasswordSchema = Yup.string()
  .oneOf([Yup.ref("password")], "Passwords must match")
  .required("Confirm password is required");

export const refreshTokenSchema = Yup.string()
  .trim()
  .required("Refresh token is required.");
