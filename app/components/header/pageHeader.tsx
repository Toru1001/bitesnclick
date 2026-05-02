import { getAuthUser } from "@/lib/auth/get-session";
import HeaderClient from "./headerClient";

export default async function PageHeader() {
  const user = await getAuthUser();
  return <HeaderClient user={user} />;
}
