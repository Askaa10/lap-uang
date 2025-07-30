interface jwtPayload {
  id: string;
  username: string;
  email: string;
  role: "ADMIN" | "USER" | "STAFF" |"VIEWER"
}
