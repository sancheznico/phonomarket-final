"use client";

import { ApolloProvider } from "@apollo/client";
import { client } from "../lib/apollo";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <ApolloProvider client={client}>
          {children}
        </ApolloProvider>
      </body>
    </html>
  );
}