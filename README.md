# useInfiniteScroll Hook

[![npm version](https://img.shields.io/npm/v/use-component-infinite-scroll)](https://www.npmjs.com/package/use-component-infinite-scroll)
[![npm downloads](https://img.shields.io/npm/dm/use-component-infinite-scroll)](https://www.npmjs.com/package/use-component-infinite-scroll)
[![license](https://img.shields.io/npm/l/use-component-infinite-scroll)](https://github.com/Ahmad-Amin/simple-infinite-scroll/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-supported-blue)](https://www.typescriptlang.org/)
[![Zero dependencies](https://img.shields.io/badge/dependencies-0-brightgreen)](https://www.npmjs.com/package/use-component-infinite-scroll)
`useInfiniteScroll` is a custom React hook that simplifies the implementation of infinite scrolling functionality in React applications. It has **zero external dependencies** — it uses the native `fetch` API and a built-in debounce. It supports authenticated and unauthenticated requests, custom headers, search queries, and automatic pagination.

## Features
- **Infinite Scrolling**: Automatically loads new data as the user scrolls, improving user experience in content-heavy applications
- **Debounced Requests**: Built-in debounce controls the rate of API requests, reducing server calls under rapid scroll conditions and supporting search functionality
- **Zero External Dependencies**: Uses native `fetch` — no axios or lodash required
- **Flexible API Request Configuration**: Handles custom headers and authentication tokens, accommodating both public and secured APIs
- **Pagination and Error Handling**: Manages pagination seamlessly and provides built-in error handling with automatic reset on search/dependency changes

## Installation
```bash
npm install use-component-infinite-scroll
```

## Usage
Basic example showing how to use `useInfiniteScroll` in a React component:

```tsx
import React from 'react'
import { useInfiniteScroll } from 'use-component-infinite-scroll';

const App = () => {
  const fetchUrl = "https://api.example.com/data"

  const { listRef, data, loading, error, handleScroll, fetchData } = useInfiniteScroll({
    url: fetchUrl,
    limit: 10,
    dependency: "id", // re-fetches when this value changes (optional)
    authToken: "your_auth_token", // optional
    headers: { "Custom-Header": "value" }, // optional
  });

  // Trigger a search — debounced by default (500 ms)
  const handleSearch = (value: string) => {
    fetchData(value, fetchUrl);
  };

  return (
    <div ref={listRef} onScroll={handleScroll} style={{ overflowY: "auto", height: "500px" }}>
      {data.map((item: any, index) => (
        <div key={index}>{item.title}</div>
      ))}
      {loading && <p>Loading more items...</p>}
      {error && <p>{error}</p>}
    </div>
  );
}
```

> **Note:** The scrollable container must have a fixed height and `overflow-y: auto` (or `scroll`) for `handleScroll` to work correctly.

## Hook Props
The `useInfiniteScroll` hook accepts the following properties:

| Property      | Type   | Required | Description                                                | Default |
|---------------|--------|----------|------------------------------------------------------------|---------|
| url           | string | Yes      | The URL of the API endpoint.                               |         |
| limit         | number | No       | Number of items to fetch per page.                         | 10      |
| initialData   | array  | No       | Initial data to populate the list.                         | []      |
| dependency    | any    | No       | When this value changes, data resets and re-fetches.       |         |
| searchQuery   | string | No       | Default search query passed with API requests.             | ""      |
| debounceDelay | number | No       | Debounce delay in milliseconds.                            | 500     |
| authToken     | string | No       | Bearer token for authenticated requests.                   |         |
| headers       | object | No       | Additional headers to send with every request.             | {}      |

## Return Values
The hook returns an object containing the following:

| Name          | Type                                  | Description                                                   |
|---------------|---------------------------------------|---------------------------------------------------------------|
| `listRef`     | `React.RefObject<HTMLDivElement>`     | Attach to the scrollable container element.                   |
| `data`        | `T[]`                                 | The data fetched from the API.                                |
| `loading`     | `boolean`                             | `true` while a request is in-flight.                          |
| `error`       | `string \| null`                      | Error message if the last request failed, otherwise `null`.   |
| `handleScroll`| `() => void`                          | Attach to the container's `onScroll` event.                   |
| `fetchData`   | `(query?: string, url?: string) => void` | Manually trigger a fetch (e.g., on search input change).   |

## API Response Format
Your API must return the following shape for pagination to work:

```json
{
  "results": [...],
  "pagination": {
    "totalPages": 5
  }
}
```

## Contributing
Contributions are warmly welcomed! Please feel free to submit pull requests or create issues for any bugs and feature requests.

## License

This project is licensed under the MIT License
