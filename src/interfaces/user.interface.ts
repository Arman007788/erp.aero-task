export interface SignupProps {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

export interface SigninProps {
  id: string;
  password: string;
}

export interface JwtProps {
  id: number;
  iat?: number;
  exp?: number;
}
