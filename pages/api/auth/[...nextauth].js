import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const adminUser = [
  { user: "2315", password: "1234" },
  { user: "2769", password: "1234" },
  { user: "2317", password: "1234" },
];

export const authOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {},
      authorize: (credentials, req) => {
        const { user, password } = credentials;
        if (
          !adminUser.some(
            (admin) => admin.user === user && admin.password === password
          )
        ) {
          throw new Error("Invalid Credentials");
        }
        return {
          id: "1234",
          name: "Leonardo Moreno",
          email: "leomoreno@gmail.com.ar",
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
    singOut: "/auth/signout",
  },
};

export default NextAuth(authOptions);
