# Playwright TypeScript Project

This project demonstrates how to use Playwright with TypeScript for end-to-end testing.

## Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (v14 or later)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Playwright](https://playwright.dev/docs/intro#installation) (installed globally)

## Installation

1. Clone this repository:

```bash
git clone https://github.com/skaravai/online-store.git
```

2. Navigate to the project directory:
   
```bash
cd online-store
```

3. Install dependencies:
```bash
npm install
```

## Tests running
1. Headless mode is a mode where the browser runs without a graphical user interface: 
```bash
npx playwright test addToBasketTests.spec.ts --project=chromium
```
2. For UI mode use the command:
```bash
npx playwright test --ui
```
