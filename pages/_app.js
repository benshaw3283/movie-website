import "../styles/globals.css";
import { Toaster } from "@/components/ui/toaster";
import Layout from "../components/Layout";
import { SessionProvider } from "next-auth/react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>
        <Layout>
          <Component {...pageProps} />
          <Toaster />
        </Layout>
      </SessionProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
