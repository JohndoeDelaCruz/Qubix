import { readStoredValue } from "../../storage";

export interface Identity {
  id: string;
  token: string;
  name: string;
  pin: string;
  avatar?: AvatarId;
}
export function saveIdentity(data: Identity): Identity {
  const identity = {
    id: data.id,
    token: data.token,
    name: data.name,
    pin: data.pin,
    avatar: data.avatar,
  };
  sessionStorage.setItem("qubix:player", JSON.stringify(identity));
  return identity;
}
export function storedIdentity(): Identity | null {
  try {
    return JSON.parse(readStoredValue(sessionStorage, "qubix:player") ?? "null");
  } catch {
    return null;
  }
}
import type { AvatarId } from "../../../../shared/avatars";
