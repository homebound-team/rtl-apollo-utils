import { MockedProvider, MockedResponse } from "@homebound/better-apollo-mocked-provider";
import React, { ReactElement } from "react";
import { DefaultOptions, InMemoryCache, InMemoryCacheConfig } from "@apollo/client";

interface Wrapper {
  wrap(c: ReactElement): ReactElement;
}

let cacheConfig: InMemoryCacheConfig = {};
let defaultOptions: DefaultOptions = {
  // Prefer consistency on CRUD tables/forms. Use watchQuery b/c that's what React's hooks use.
  watchQuery: { fetchPolicy: "network-only" },
  query: { fetchPolicy: "network-only" },
};

/** Allow downstream projects to one-time configure `withApollo` for all of its tests. */
export function configureMockApollo(options: { defaultOptions?: DefaultOptions; cacheConfig?: InMemoryCacheConfig }) {
  cacheConfig = options?.cacheConfig || {};
  defaultOptions = options?.defaultOptions || {};
}

/** Returns an Apollo provider that will respond with the `mocks` responses. */
export function withApollo(...mocks: MockedResponse[]): Wrapper {
  return {
    wrap: (c) => (
      <MockedProvider
        // Provide empty resolvers object so that @client directives are stripped from queries
        // https://github.com/apollographql/apollo-client/pull/4499
        resolvers={{}}
        cache={new InMemoryCache(cacheConfig)}
        mocks={mocks}
        defaultOptions={defaultOptions}
      >
        {c}
      </MockedProvider>
    ),
  };
}
