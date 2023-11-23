import { DefaultSession, NextAuthOptions, getServerSession } from "next-auth";
import { db } from "./db";
import GoogleProvider from "next-auth/providers/google";
import { users } from "./db/schema";
import { eq } from "drizzle-orm";
import { DrizzleAdapter } from "@auth/drizzle-adapter";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      credits: number;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    credits: number;
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt: async ({ token }) => {
      // const db_user = await db.query.users.findFirst({
      //   with: {
      //     email: token.email
      //   }
      const _db_user = await db
        .select()
        .from(users)
        .where(eq(users.email, token.email!));
      // });
      // where: eq(email, token.email),
      const db_user = _db_user[0]

      if (db_user) {
        (token.id = db_user.id), (token.credits = db_user.credits!);
      }
      return token;
    },
    session: ({ session, token }) => {
      if (session) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
        session.user.credits = token.credits;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET as string,
  adapter: DrizzleAdapter(db),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
};

export const getAuthSession = () => {
  return getServerSession(authOptions);
};
