# Talabak

Talabak is an Angular 21 e-commerce storefront built with standalone components, SSR, and a modern UI stack. It integrates with e-commerce API to deliver a complete shopping experience, from browsing to checkout and order history.

## Features

- Authentication flow with register, login, and password reset
- JWT-based session handling with route guards
- Product browsing with category carousel and search by name
- Product details view with ratings and pricing
- Cart management (add, update quantity, remove, clear)
- Checkout flow that redirects to a hosted payment session
- Order history with payment and delivery status badges
- English/Arabic localization with RTL/LTR switching
- Global loading spinner and toast notifications
- Server-side rendering with hydration and view transitions

## Tech Stack

- Angular 21 (standalone components + SSR)
- TypeScript, RxJS
- Bootstrap 5 + FontAwesome
- ngx-translate, ngx-toastr, ngx-spinner
- ngx-owl-carousel-o

## Getting Started

### Prerequisites

- Node.js + npm
- Angular CLI (optional, for local commands)

### Install

```bash
npm install
```

### Run the app

```bash
npm start
```

Then open `http://localhost:4200/`.

### Build

```bash
npm run build
```

### Test

```bash
npm test
```

## Configuration

- API base URL and frontend URL:
  - `src/app/Core/Environments/environment.ts`
- Translation files:
  - `public/i18n/en.json`
  - `public/i18n/ar.json`

## Project Structure

```
src/
  app/
    Components/   # UI pages (home, cart, orders, auth)
    Core/         # services, guards, interceptors, pipes
    Layouts/      # auth + main layouts
  public/
    i18n/         # translation files
```

## Scripts

- `npm start` — run the development server
- `npm run build` — production build with SSR output
- `npm run watch` — development build with watch mode
- `npm test` — run unit tests
