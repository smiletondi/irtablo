import type { NextPage } from "next";

import CTA from "@components/CTA";
import Layout from "@components/Layout";
import RecentGames from "@components/RecentGames";

const Home: NextPage = () => {
  return (
    <Layout>
      <CTA />
      <RecentGames />
    </Layout>
  );
};

export default Home;
