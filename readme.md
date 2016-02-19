# React Promise Component

A component which enables its function body to be invoked only once a provided promise resolves.

```jsx
let promise = fetchUserFromStoreOrServer();

<PromiseComponent promise={promise}>
  {
    (error, userData) => {
      if(error) return <p className="error">{error.message}</p>;

      return (
        <UserProfile {...userData} />
      );
    }
  }
</PromiseComponent>
```
