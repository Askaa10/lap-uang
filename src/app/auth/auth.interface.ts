interface jwtPayload {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "USER"
}
