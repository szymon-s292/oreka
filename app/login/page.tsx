import { SessionProvider } from "next-auth/react";
import LoginForm from "../ui/login-form"
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function LoginPage() {
  const session = await auth()

  if (session?.user)
    redirect('/panel')
  
  return <SessionProvider session={session}><LoginForm/></SessionProvider> 
}
