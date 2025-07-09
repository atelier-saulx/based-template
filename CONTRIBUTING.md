## Welcome

Here you can find information about our code guidelines etc

## TypeScript Code Principles

### Simplicity first

Try to make your code simple to understand, low amount of deps - simple to run, simple to follow

### When in Doubt Measure Performance

When in doubt measure performance e.g. on `jsperf.app`
Don't use what is cool / ergonomic especially if written on medium.com

### For Loops

```typescript
// when possible use
for (const x of arr) {}

// if you need more control
for (let i = 0; i < 1000; i++) {}

// if you have a map
for (const value of map.values()) {}

// if you need both key & value
for (const [key, value] of map.entries()) {}
```

### Functions

Keep functions small and concise except when it violates principle #1

```typescript
// Always use arrow functions
const myFunc = () => {}
```

### Classes

Only use classes for top level libraries e.g. BasedDb

An exception for classes is to extend really basic functionality especially in Node.js e.g. extending `Workers`

If you need a shared state pass context objects - this avoids the pitfall of over abstraction which usually happens with classes

```typescript
// Prefer passing ctx objects over classes
const ctx = {
  cnt: 0,
}

const a = (ctx) => {
  ctx.cnt += 1
}
```

### Code Organization

For front end code (React especially) aim for 250 lines max of code for files - except if it makes things more difficult (principle #1)