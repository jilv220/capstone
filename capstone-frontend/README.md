# Capstone Frontend

### VS Code Plugins to install
* ESLint
* Prettier
  * Remember to set prettier as the default formatter for `.ts` and `.tsx` files
* Tailwind CSS IntelliSense

### How to install
run `npm i`

### How to develop
run `npm dev`

## Where do I learn?
[Typescript Tutorials](https://www.youtube.com/watch?v=LKVHFHJsiO0&list=PLNqp92_EXZBJYFrpEzdO2EapvU0GOJ09n)

[HTML/CSS, Javascript Documentations](https://developer.mozilla.org/en-US/)

[Tailwind CSS](https://tailwindcss.com/docs/installation)

### Packages to learn
[Tanstack query](https://tanstack.com/query/latest)

[Tanstack router](https://tanstack.com/router/latest)

[shadcn/ui](https://ui.shadcn.com/docs)

## How do I?

### Call API => use fetch()
```typescript
// example
const response = await fetch('https://example.com', {
	method: 'POST',
	body: JSON.stringify({foo: true}),
	headers: {
		'content-type': 'application/json'
	}
});
```
### Add a UI component
`npx shadcn-ui@latest add <component-name>`

for example 

`npx shadcn-ui@latest add button`
