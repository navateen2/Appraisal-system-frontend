import { jwtDecode } from "jwt-decode";

interface TokenPayload {
    id: string;
    type: string;
    role: string;
    exp: number;
  }

export default function getUserIdFromToken(token:string) {
    try {
        const user = jwtDecode<TokenPayload>(token)
        return user.id
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  }