import { capsule } from "../capsule.mjs";

export function login(...args) {
  return capsule.auth.login(...args)
}

export function logout() { }

export function resume(...args) {
  return capsule.auth.resumeSession(...args)
}
