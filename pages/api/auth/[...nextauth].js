import { mongooseConnect } from "@/lib/mongoose";
import { AdminModel } from "@/models/Admin";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {},
      authorize: async (credentials, req) => {
        const { user, password } = credentials;

        try {
          await mongooseConnect();

          const admin = await AdminModel.findOne({ user });

          if (!user) {
            throw new Error("Invalid Credentials");
          }

          const passwordMatch = await AdminModel.comparePassword(
            password,
            admin.password
          );

          if (!passwordMatch) {
            throw new Error("Invalid Credentials");
          }

          return { name: admin.fullName };
        } catch (error) {
          console.error("Error: ", error);
        }
      },
    }),
  ],
  callbacks: {
    session: async (session) => {
      if (!session) return;

      await mongooseConnect();

      const userData = await AdminModel.findOne({
        fullName: session.session.user.name,
      });

      return {
        user: {
          id: userData.id,
          name: userData.fullName,
        },
      };
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
    singOut: "/auth/signout",
  },
};

export default NextAuth(authOptions);
