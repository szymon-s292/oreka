import { MongoClient, ObjectId } from 'mongodb'
import bcrypt from "bcrypt";
import NextAuth, { User } from "next-auth"
import Credentials from "next-auth/providers/credentials"

import { type DefaultSession } from "next-auth"
declare module "next-auth" {
  /*
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      _id: string
    } & DefaultSession["user"]
  }
} 

const MONGO_URI = process.env.MONGO_URI as string;
const client = new MongoClient(MONGO_URI);
const dbName = process.env.DB_NAME as string

export const { handlers, signIn, signOut, auth, auth: getSession } = NextAuth({
  session: {
    strategy: "jwt"
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: {
          type: "email",
          label: "Email",
        },
        password: {
          type: "password",
          label: "Password",
        },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials.password)
          return null;
        
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection("users");
        
        const user = await collection.findOne({ email: credentials.email });
        if (!user)
          return null;
        
        const isValid = await bcrypt.compare(credentials.password as string, user.password);
        
        if (isValid && credentials.email === user.email) {
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            _id: user._id.toString()
          };
        }
        
        return null;
      }
    })
  ],
  pages: {
    signIn: "/login",
  },
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user._id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('users');
        const user = await collection.findOne({_id: new ObjectId(token.id as string)})
  
        if (user && session.user) {
          session.user._id = user._id.toString();
          session.user.name = user.name;
          session.user.email = user.email;
        }
  
      return session;
    }
  }
})


