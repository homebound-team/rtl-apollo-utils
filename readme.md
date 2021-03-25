# rtl-apollo-utils

Returns an Apollo provider that will respond with the `mocks` responses.

```tsx
import { render } from "@homebound/rtl-utils";
import { withApollo } from "@homebound/rtl-apollo-utils";

describe("SomeGraphQLPage", () => {
  it("works", async () => {
    const queryResponse = newEstimateResponse();
    const saveResponse = newTestSaveLeadResponse(
      { data: { errorMessage: "error happened" } }
    );
    
    const c = await render(
      <SomeGraphQLPage />,
      withApollo(queryResponse, saveResponse));
    
    // do some clicks
    
    expect(saveResponse.)
  })
})
```



