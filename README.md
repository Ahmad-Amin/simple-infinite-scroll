# useInfiniteScroll Hook
`useInfiniteScroll` is a custom React hook that simplifies the implementation of infinite scrolling functionality in React applications. This hook utilizes `Axios`	for fetching data and `Lodash`'s debounce method to efficiently manage API request frequency. It is designed to be flexible, supporting both authenticated and unauthenticated requests, which makes it suitable for a wide range of API scenarios.

## Features
- **Infinite Scrolling**: Automatically loads new data as the user scrolls, improving user experience in content-heavy applications
- **Debounced API Requests**: Uses Lodash's debounce to control the rate of API requests, which helps in reducing the number of calls made to the server under rapid scroll conditions and also have the functionality of `search` (if it is supporting by your API)
- **Flexible API Request Configuration**: Can handle custom headers and authentication tokens, accommdating both public and secured APIs
- **Pagination and Error handling**: Manages pagniation seamlessly and provides build-in error handling.

## Installation
To use `useInfiniteScroll`, make sure you have `axios` and `lodash` installed in your porject. If not, install them using npm:
```bash
npm install axios lodash
```
After installing `axios` and `lodash`. Install the package by using this command (typescript version should be **>4.0.5 & <5.0.0**
```bash
npm install use-component-infinite-scroll
```
if you have some other version of typescript. You can install the package using this command
```bash
npm install use-component-infinite-scroll --legacy-peer-deps
```

## Usage
Below is the basic example to demonstrate how to use the `useInfiniteScroll` hook in a React Component

```bash
import React, { useEffect } from 'react'
import { useInfiniteScroll } from  'use-component-infinite-scroll';

const App = () => {
  const fetchUrl = "https://api.example.com/data"

  const { listRef, data, loading, error, handleScroll } = useInfiniteScroll({
    url: fetchUrl,
    limit: 10,
    dependency: "id" // like the id  of parent record or any other dependency (optional)
    authToken: "your_auth_token", // optional
    headers: { "Custom-Header": "value" }, // optional
  });

  // IMP, this is to trigger the hook to fetch the record
  useEffect(() => {
   fetchData("", fetchUrl)
  }, [fetchUrl, fetchData])

  // This function is to handle the API search functionality and lodash (default delay time is 500 millisecond)
  const handleSearch = (value: string) => {
    fetchData(value, fetchUrl)
  };

  return (
    <div ref={listRef} onScroll={handleScroll}>
      {data.map((item, index) => (
        <div key={index}>{item.title}</div>
      ))}
      {loading && <p>Loading more items...</p>}
      {error && <p>{error}</p>}
    </div>
  );
}

```

## Hook Props
The `useInfiniteScroll` hook accepts the following properties

| Property      | Type   | Description                                                | Default |
|---------------|--------|------------------------------------------------------------|---------|
| url           | string | The URL of the API endpoint.                               |         |
| limit         | number | Number of items to fetch per page.                         |   10    |
| initialData   | array  | Initial data to populate the list.                         |   []    |
| dependency    | any    | Dependency for re-triggering the data fetch.               |         |
| searchQuery   | string | Query parameter to pass with the API request for searching |         |
| debounceDelay | number | Time in milliseconds for debounce.                         |   500   |
| authToken     | string | Authorization token for making authenticated requests.     |         |
| headers       | object | Custom headers to send with the API request.               |   {}    |


## Return Values
The hook returns an bject containing the following:


-   `listRef` (React ref): Reference to the scrolling container.
-   `data` (array): The data fetched from the API.
-   `loading` (boolean): Indicates whether the data is currently being fetched.
-   `error` (string|null): Error message if an error occurred during fetching.
-   `handleScroll` (function): Function to call on scroll to fetch more data.

## Contributing
Contributions are warmly welcomed! Please feel free to submit pull requests or create issues for any bugs and feature requests.

## License

This project is licensed under the MIT License
