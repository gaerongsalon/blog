[View code on GitHub](https://github.com/gaerongsalon/blog/src/handlers/authorization/readAuthorization.ts)

The code in this file defines a function called `readAuthorization` that takes in an `AuthorizerEvent` object as its parameter and returns an `Authorization` object or null. 

The `AuthorizerEvent` object is likely passed in from another part of the project and contains information about the authorization status of the request. The function then extracts the `Authorization` object from the `requestContext.authorizer` property of the `AuthorizerEvent` object and returns it. If the `Authorization` object is not found, the function returns null.

This function is likely used in the larger project to handle authorization for requests made to the blog API. By extracting the `Authorization` object from the `AuthorizerEvent` object, the function can determine whether the request is authorized or not. This information can then be used to determine whether to allow or deny access to certain resources or functionality within the API.

Here is an example of how this function might be used in the larger project:

```
import readAuthorization from "./readAuthorization";

function handleRequest(event) {
  const authorization = readAuthorization(event);

  if (!authorization) {
    // request is not authorized, return error response
    return {
      statusCode: 401,
      body: "Unauthorized"
    };
  }

  // request is authorized, continue processing
  // ...
}
```

In this example, the `handleRequest` function calls `readAuthorization` to extract the `Authorization` object from the `event` parameter. If the function returns null, indicating that the request is not authorized, the `handleRequest` function returns an error response. Otherwise, the function continues processing the request.
## Questions: 
 1. What is the purpose of the `Authorization` model and how is it used in this code?
- The `Authorization` model is imported from "../models/Authorization" and is used to cast the `authorizer` property of the `requestContext` object in the `event` parameter to the `Authorization` type.

2. What is the `AuthorizerEvent` type and where is it defined?
- The `AuthorizerEvent` type is used as the type of the `event` parameter in the `readAuthorization` function and is defined in the `./AuthorizerEvent` file.

3. What is the purpose of the `??` operator in the return statement?
- The `??` operator is the nullish coalescing operator and returns the left-hand side if it is not null or undefined, otherwise it returns the right-hand side. In this code, it returns the `Authorization` object if it exists in the `authorizer` property, otherwise it returns `null`.