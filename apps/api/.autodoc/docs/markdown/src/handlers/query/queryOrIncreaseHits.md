[View code on GitHub](https://github.com/gaerongsalon/blog/src/handlers/query/queryOrIncreaseHits.ts)

The `queryOrIncreaseHits` function is responsible for querying or increasing the number of hits for a given resource and ID. It uses Redis to store and retrieve the hit count. The function takes three arguments: `resource`, `id`, and `isBot`. `resource` and `id` are used to build a Redis key for the hit count, while `isBot` is a boolean flag indicating whether the hit was made by a bot or not.

The function first defines two inner functions: `query` and `increase`. `query` retrieves the current hit count for the given resource and ID, while `increase` increments the hit count by 1. These functions both take a Redis connection as an argument and return a promise that resolves to the hit count.

The `queryOrIncreaseHits` function then uses the `withRedisConnection` helper function to execute either `query` or `increase` depending on the value of `isBot`. `withRedisConnection` takes a Redis configuration object and a callback function that takes a Redis connection as an argument. It establishes a Redis connection, executes the callback function with the connection, and then closes the connection. The callback function passed to `withRedisConnection` is either `query` or `increase`, depending on the value of `isBot`.

Finally, the function logs the result of the query or increase operation using the `slack-logger` package and returns the hit count. If an error occurs, the function logs the error and returns 0.

This function can be used to track the number of hits for different resources in a blog or website. It can be called whenever a resource is accessed, and the hit count can be displayed on the resource page. The `isBot` flag can be used to filter out hits made by bots from the total hit count. The Redis key used to store the hit count includes the name of the blog or website, which allows multiple blogs or websites to share the same Redis instance without colliding on key names.
## Questions: 
 1. What does this code do?
- This code exports a function called `queryOrIncreaseHits` that takes in a resource, id, and a boolean flag indicating whether the request is from a bot or not. It then either queries or increases the number of hits for the given resource and id in Redis, depending on the value of the isBot flag.

2. What Redis library is being used in this code?
- This code is using the "@yingyeothon/naive-redis" library to interact with Redis.

3. Where is the Redis connection information coming from?
- The Redis connection information is being imported from a file located at "@blog/config/lib/secrets".