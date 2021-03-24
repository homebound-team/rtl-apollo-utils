# rtl-apollo-utils

Returns an Apollo provider that will respond with the `mocks` responses.

```typescript
import { render, withApollo } from "@homebound/rtl-apollo-utils";

...

const apollo = withApollo([
  newEstimateResponse(),
  newTestSaveLeadResponse({ data: { errorMessage: "error happened" } }),
]);
const c = await render(<GraphQLPage {...props} />, apollo);
```



