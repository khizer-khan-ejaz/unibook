import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id ?? token.sub; // Google does not return `id`, so use `sub`
      }
      if (account) {
        token.accessToken = account.access_token; // ✅ Get `accessToken` from `account`
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as any).accessToken = token.accessToken; // ✅ Store `accessToken` safely
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
