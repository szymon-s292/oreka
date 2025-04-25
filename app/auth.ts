import { AuthOptions, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import axios from "axios";
import { isObjectIdOrHexString, isValidObjectId } from 'mongoose';
import { MongoClient, ObjectId } from 'mongodb'

const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL as string;
const MONGO_URI = process.env.MONGO_URI as string;
const client = new MongoClient(MONGO_URI);
const dbName = process.env.DB_NAME as string

const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        try {
          // const response = await axios.get(`${NEXT_PUBLIC_BASE_URL}api/users?email=${credentials.email}`);
          // const user = response.data.user;
          await client.connect();
          const db = client.db(dbName);
          const collection = db.collection('users');
          const user = await collection.findOne({email: credentials.email})
          if (!user) return null;

          const isValid = await bcrypt.compare(credentials.password, user.password);

          if (isValid && credentials.email === user.email) {
            return user;
          }

          return null;
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    signOut: "/logout",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user._id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      try {
        // const res = await axios.get(`${NEXT_PUBLIC_BASE_URL}api/users/${token.id}`);
        // const user = res.data.user;
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('users');
        const user = await collection.findOne({_id: new ObjectId(token.id)})
  
        if (user && session.user) {
          session.user._id = user._id.toString();
          session.user.name = user.name;
          session.user.email = user.email;
        }
      } catch (error) {
      }
  
      return session;
    }
  }
};

const getSession = () => getServerSession(authOptions);

export { authOptions, getSession };
