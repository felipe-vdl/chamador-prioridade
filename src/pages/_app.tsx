import { type AppType } from "next/app";

import { api } from "@/utils/api";

import "@/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <main className="flex min-h-screen flex-col bg-blue-200 text-stone-700">
      <Component {...pageProps} />
    </main>
  );
};

export default api.withTRPC(MyApp);
