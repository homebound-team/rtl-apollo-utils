import { MockedProvider, MockedResponse, MockLink } from "@homebound/better-apollo-mocked-provider";
import React, { ReactElement } from "react";
import { DefaultOptions, FetchResult, InMemoryCache, InMemoryCacheConfig, Operation } from "@apollo/client";
import { Observable } from "@apollo/client/utilities";
import { addToWaitQueue } from "@homebound/rtl-utils";

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
  const link = new RtlMockLink(mocks, true);
  return {
    wrap: (c) => (
      <MockedProvider
        // Provide empty resolvers object so that @client directives are stripped from queries
        // https://github.com/apollographql/apollo-client/pull/4499
        resolvers={{}}
        cache={new InMemoryCache(cacheConfig)}
        mocks={mocks}
        defaultOptions={defaultOptions}
        link={link}
      >
        {c}
      </MockedProvider>
    ),
  };
}

/** Subclass the MockLink so we can hook up `request` to the `rtl-utils` wait queue. */
class RtlMockLink extends MockLink {
  public request(operation: Operation): Observable<FetchResult> {
    const observer = super.request(operation);
    let resolve: any;
    // Tell `render` to wait until this operation is done
    addToWaitQueue(operation.operationName, new Promise((_resolve) => (resolve = _resolve)));
    // Pass resolve twice b/c we want to resume on either success or error
    observer.subscribe(resolve, resolve);
    return observer;
  }
}
