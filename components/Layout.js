import SignIn from "@/pages/auth/signin";
import { useSession } from "next-auth/react";
import { useState } from "react";
import Nav from "./Nav";
import Logo from "./Logo";
import Footer from "./Footer";

export default function Layout({ children }) {
  const [showNav, setShowNav] = useState(false);

  const { data: session } = useSession();

  if (!session) {
    return <SignIn />;
  }
  return (
    <div className="bg-backgroud-body min-h-screen flex flex-col justify-between">
      <div>
        <div className="block flex items-center justify-between p-4 pb-0 md:hidden ">
          <button
            onClick={() => {
              setShowNav(true);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 9h16.5m-16.5 6.75h16.5"
              />
            </svg>
          </button>
          <Logo />
        </div>
        <div className="bg-background-body flex">
          <Nav show={showNav} />
          <div className="bg-white flex-grow m-3 rounded-lg p-4 shadow-md backdrop-blur-2xl backdrop-saturate-200 z-10">
            {children}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
