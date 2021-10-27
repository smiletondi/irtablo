import "tailwindcss/tailwind.css";

import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";
import { toast } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "react-query";

import { defaultQueryFn } from "@utils/network";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultQueryFn,
      refetchOnWindowFocus: "always",
      onError: (data) => toast.error(`Erreur ${JSON.stringify(data)}`),
    },
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <div className="bg-kabul">
        <Component {...pageProps} />
      </div>
    </QueryClientProvider>
  );
}
export default MyApp;
