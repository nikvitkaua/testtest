# Project Setup and Build Instructions

## Requirements

Make sure you have **Node.js** and **npm** installed on your computer.

## Installation

After downloading or cloning the project, open a terminal in the project
folder and install the dependencies:

``` bash
npm install
```

## Development

To start the project in development mode:

``` bash
npm run dev
```

Vite will start a local development server. Open the URL shown in the
terminal in your browser.

## Production Build

To create a production build:

``` bash
npm run build
```

The production files will be generated in the `dist` folder.

## Preview the Production Build

To check the production build locally, run:

``` bash
npm run preview
```

Open the local URL shown in the terminal to preview the contents of the
`dist` folder.

> **Note:** Do not open `dist/index.html` directly from the file
> explorer. The project should be previewed using `npm run preview`,
> because opening the file directly with `file://` may cause assets and
> scripts to load incorrectly.

## Project Workflow

A typical workflow is:

``` bash
npm install
npm run dev
npm run build
npm run preview
```

If you make changes to the project, run `npm run build` again before
checking the updated production version with `npm run preview`.
