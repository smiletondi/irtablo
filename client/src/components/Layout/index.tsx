import type { NextPage } from "next";
import Head from "next/head";

import Navbar from "@components/Navbar";

import { IProps } from "./types";

const Layout: NextPage<IProps> = ({ children }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 ">
      <Head>
        <title>irTablo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="w-full flex flex-col items-center space-y-11 flex-1 px-6 text-center max-w-sm">
        <Navbar />
        {children}
      </main>
      {/* <footer className="flex items-center justify-center w-full h-24 border-t">
      <a
        className="flex items-center justify-center"
        href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
        target="_blank"
        rel="noopener noreferrer"
      >
        Powered by{" "}
        <img src="/vercel.svg" alt="Vercel Logo" className="h-4 ml-2" />
      </a>
    </footer> */}
    </div>
  );
};
export default Layout;
