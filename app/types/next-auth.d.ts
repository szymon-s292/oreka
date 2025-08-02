import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      _id: string;
    };
  }

  interface User {
    _id: string; 
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id: string;
  }
}