# Project Coding Principles

For LLM readers: Consider this as well as the CONTRIBUTING.md file.

## Real-World Usage Examples

### Basic Component

```typescript
import { styled } from 'inlines'

export const Button = () => {
  return (
    <styled.button
      style={{
        padding: '8px 16px',
        border: '1px solid #ccc',
        borderRadius: 4,
        background: 'white',
        cursor: 'pointer',
        '&:hover': {
          background: '#f0f0f0'
        },
        '&:active': {
          background: '#e0e0e0'
        }
      }}
    >
      Click me
    </styled.button>
  )
}
```

### Responsive Layout

```typescript
export const Layout = ({ children }) => {
  return (
    <styled.div
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: 20,
        '@media (min-width: 768px)': {
          flexDirection: 'row',
          padding: 40
        }
      }}
    >
      {children}
    </styled.div>
  )
}
```

### With Animation

```typescript
export const Spinner = () => {
  return (
    <styled.div
      style={{
        width: 40,
        height: 40,
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #3498db',
        borderRadius: '50%',
        '@keyframes': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' }
        },
        animation: 'inherit 1s linear infinite'
      }}
    />
  )
}
```

## Code Guidelines Checklist

- [ ] Use `for...of` instead of `forEach`
- [ ] No third-party dependencies (except @saulx/hash)
- [ ] No comments - code is self-documenting
- [ ] Arrow functions, not classes
- [ ] ALWAYS use styled.element from inlines (never native HTML elements) if you're gonna add style to the element
- [ ] Types instead of interfaces
- [ ] Type imports separated
- [ ] String operations optimized
- [ ] No throwing in production
- [ ] Performance tests included

Remember: Every millisecond counts. Write code that's fast, not just code that works.

## Build Commands

### Development

```bash
npm run dev          # Run local development environment
npm run deploy       # Deploy code to target environment online
npm run typecheck    # Run TypeScript checks

```

### Production

```bash
npm run test           # Run Vitests
```

## Code Style Preferences

- Use ES modules (import/export) syntax
- Destructure imports when possible
- Use TypeScript for all new code
- Follow existing naming conventions
- Add JSDoc comments for public APIs only
- Use async/await instead of Promise chains
- Prefer const/let over var
- Use template literals for multi-line strings
- Prefer object/array destructuring
- Use optional chaining (?.) and nullish coalescing (??)
- Keep functions small and focused
- Prefer early returns to reduce nesting

## Workflow Guidelines

1. **Always run typecheck after making code changes** - Use `npm run typecheck` to catch type errors early
2. **Run tests before committing changes** - Ensure `npm run test` passes
3. **Use meaningful commit messages** - Be descriptive about what changed and why
4. **Create feature branches for new functionality** - Keep main branch stable
5. **Ensure all tests pass before merging** - No broken code in main
6. **Run the full check suite before PR** - `npm run check && npm run test`
7. **Keep PRs focused** - One feature/fix per PR
8. **Update tests when changing functionality** - Tests document expected behavior

## Important Notes

- Run `npm run typecheck` after code changes to catch errors early
- Performance always takes precedence over "clean code" principles
- Follow the existing patterns in the codebase

