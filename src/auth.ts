import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const allowedEmail = process.env.ALLOWED_EMAIL;

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      if (!allowedEmail) return false;
      const email = profile?.email;
      return email === allowedEmail;
    },
    async session({ session, token }) {
      if (session.user) session.user.email = token.email;
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
});
