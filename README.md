# Express-template

My Express-template for quick development

## Installation

Use the package manager [npm](https://www.npmjs.com/) to install Express-template.

```bash
yarn install
```

## Concept

- [x] Router

  1. Schema

  ```JSON
      {
          id: String,
          text: String,
          createdAt: Date,
          name: String,
          username: String,
          url: String [optional]
      }
  ```

  2. API

  - GET /messages
    ```JSON
      {
          [msg, msg ,,,,]
      }
    ```
  - GET /messages?username=:username
    ```JSON
      {
          [msg, msg ,,,,]
      }
    ```
  - GET /messages/:id
    ```JSON
      {
          text
      }
    ```
  - POST /messages
    ```JSON
      {
          text,
          name,
          username,
          url
      }
    ```
  - PUT /messages/:id
    ```JSON
      {
          text
      }
    ```
  - DELETE /messages/:id

    ```JSON
      {
          text
      }
    ```

  - POST /auth/signup
    ```JSON
      {
          token,
          username
      }
    ```
  - POST /auth/login
    ```JSON
      {
          token,
          username
      }
    ```
  - GET /auth/me
    ```JSON
      {
          token,
          username
      }
    ```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
