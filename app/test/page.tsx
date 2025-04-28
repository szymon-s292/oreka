import { auth } from "@/auth";

export default async function test() {
    const session = await auth()
    return session?.user ? session.user : "not logged in"
}