export type AuthMode = "login" | "signup";

export interface AuthProps {
  setIsAuth: (val: boolean) => void;
}

export interface LoginFormProps {
  onSuccess: (refreshToken: string) => void;
}

export interface SignUpFormProps {
  onSuccess: (refreshToken: string) => void;
}
