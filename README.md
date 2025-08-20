# Tallerlei Homepage

This is a developer portfolio page built with Angular - the base from where all the fun and engaging projects can be accessed.

## About

A modern, responsive developer portfolio showcasing projects and skills. Built with Angular 20 and designed to be both visually appealing and informative.

## Tech Stack

- **Angular 20.2.0** - Latest stable version
- **TypeScript** - For type-safe development
- **SCSS** - For modern styling
- **Angular Router** - For navigation

## Development

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.2.0.

### Getting Started

1. **Install dependencies:**
```bash
npm install
```

2. **Start development server:**
```bash
ng serve
```
Navigate to `http://localhost:4200/`. The app will automatically reload when you change any source files.

### Available Commands

- **Development server:** `ng serve`
- **Build:** `ng build` (outputs to `dist/`)
- **Unit tests:** `ng test`
- **Linting:** `ng lint`
- **Generate components:** `ng generate component component-name`

### Project Structure

```
src/
├── app/
│   ├── components/     # Reusable components
│   ├── services/       # Services and business logic
│   └── app.*          # Main app files
├── assets/            # Static assets
└── styles.scss        # Global styles
```

## Building for Production

```bash
ng build --configuration production
```

The build artifacts will be stored in the `dist/` directory, optimized for performance.

## Deployment

See [ci-cd-setup.md](./ci-cd-setup.md) for continuous integration and deployment setup instructions.

## Additional Resources

- [Angular CLI Documentation](https://angular.dev/tools/cli)
- [Angular Documentation](https://angular.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
