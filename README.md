# Employee Management System

This project is an employee management system built with LitElement and JavaScript. It provides a comprehensive interface for managing employee data with features like viewing, adding, editing, and deleting employee records.

## Components

### EmployeeList (`employee-list.js`)

The EmployeeList component provides a comprehensive interface for displaying and managing employee data. It offers two view modes:

**Features:**
- **Grid View**: Displays employees as cards with detailed information
- **Table View**: Shows employees in a tabular format with sorting capabilities
- **Pagination**: Handles large datasets with configurable items per page
- **View Mode Toggle**: Switch between grid and table views
- **Employee Actions**: Edit and delete functionality for each employee
- **Responsive Design**: Optimized for both desktop and mobile devices

**Key Properties:**
- `employees`: Array of employee objects
- `currentPage`: Current pagination page number
- `employeesPerPage`: Number of employees to display per page
- `totalPages`: Total number of pages based on employee count
- `viewMode`: Current view mode ('grid' or 'table')
- `currentLanguage`: Current language setting for localization

**Functionality:**
- Displays employee information in both grid and table formats
- Handles pagination with navigation controls
- Provides edit and delete actions for each employee
- Integrates with Redux store for state management
- Supports internationalization with multiple languages

### ManageEmployee (`manage-employee.js`)

The ManageEmployee component handles both creating new employees and editing existing ones through a comprehensive form interface.

**Features:**
- **Unified Form**: Single component for both adding and editing employees
- **Form Validation**: Real-time validation with error messages
- **Date Handling**: Proper date formatting and validation
- **Phone Number Validation**: Specialized input handling for phone numbers
- **Department/Position Selection**: Dropdown menus for standardized values
- **Navigation**: Integrated routing and navigation controls

**Key Properties:**
- `location`: Router location object
- `employee`: Employee object being edited/created
- `isNew`: Boolean indicating if creating a new employee
- `formErrors`: Object containing validation error messages
- `isFormValid`: Boolean indicating overall form validity
- `currentLanguage`: Current language setting for localization

**Form Fields:**
- First Name (required, minimum 2 characters)
- Last Name (required, minimum 2 characters)
- Date of Employment (required, date picker)
- Date of Birth (required, date picker)
- Phone Number (required, formatted input with validation)
- Email Address (required, email format validation)
- Department (required, dropdown: Analytics/Tech)
- Position (required, dropdown: Junior/Medior/Senior)

**Validation Features:**
- Real-time field validation
- Email format validation
- Phone number format validation
- Required field validation
- Form submission prevention when invalid

**Navigation:**
- Automatic navigation back to employee list after save/delete
- Cancel functionality to return to list without saving
- Integration with Vaadin Router for seamless navigation

## Technical Architecture

This project uses several key technologies and patterns:

**State Management:**
- Redux store for centralized state management
- Actions for adding, updating, and deleting employees
- Reactive updates across components

**Routing:**
- Vaadin Router for client-side navigation
- Dynamic routing for employee detail pages
- URL-based navigation between views

**Localization:**
- Multi-language support through localization manager
- Dynamic language switching
- Translated form labels and messages

**Styling:**
- CSS-in-JS using LitElement's static styles
- Responsive design with mobile-first approach
- Modern UI with hover effects and transitions

**Form Handling:**
- Real-time validation with immediate feedback
- Custom input handlers for specialized fields (phone, dates)
- Form state management with error tracking

## Setup

Install dependencies:

```bash
npm i
```

## Testing

This sample modern-web.dev's
[@web/test-runner](https://www.npmjs.com/package/@web/test-runner) for testing. See the
[modern-web.dev testing documentation](https://modern-web.dev/docs/test-runner/overview) for
more information.

Tests can be run with the `test` script, which will run your tests against Lit's development mode (with more verbose errors) as well as against Lit's production mode:

```bash
npm test
```

For local testing during development, the `test:dev:watch` command will run your tests in Lit's development mode (with verbose errors) on every change to your source files:

```bash
npm test:watch
```

Alternatively the `test:prod` and `test:prod:watch` commands will run your tests in Lit's production mode.

## Dev Server

This sample uses modern-web.dev's [@web/dev-server](https://www.npmjs.com/package/@web/dev-server) for previewing the project without additional build steps. Web Dev Server handles resolving Node-style "bare" import specifiers, which aren't supported in browsers. It also automatically transpiles JavaScript and adds polyfills to support older browsers. See [modern-web.dev's Web Dev Server documentation](https://modern-web.dev/docs/dev-server/overview/) for more information.

To run the dev server and open the project in a new browser tab:

```bash
npm run serve
```

There is a development HTML file located at `/dev/index.html` that you can view at http://localhost:8000/dev/index.html. Note that this command will serve your code using Lit's development mode (with more verbose errors). To serve your code against Lit's production mode, use `npm run serve:prod`.

## Editing

If you use VS Code, we highly recommend the [lit-plugin extension](https://marketplace.visualstudio.com/items?itemName=runem.lit-plugin), which enables some extremely useful features for lit-html templates:

- Syntax highlighting
- Type-checking
- Code completion
- Hover-over docs
- Jump to definition
- Linting
- Quick Fixes

The project is setup to recommend lit-plugin to VS Code users if they don't already have it installed.

## Linting

Linting of JavaScript files is provided by [ESLint](eslint.org). In addition, [lit-analyzer](https://www.npmjs.com/package/lit-analyzer) is used to type-check and lint lit-html templates with the same engine and rules as lit-plugin.

The rules are mostly the recommended rules from each project, but some have been turned off to make LitElement usage easier. The recommended rules are pretty strict, so you may want to relax them by editing `.eslintrc.json`.

To lint the project run:

```bash
npm run lint
```

## Formatting

[Prettier](https://prettier.io/) is used for code formatting. It has been pre-configured according to the Lit's style. You can change this in `.prettierrc.json`.

Prettier has not been configured to run when committing files, but this can be added with Husky and `pretty-quick`. See the [prettier.io](https://prettier.io/) site for instructions.

## Static Site

This project includes a simple website generated with the [eleventy](https://11ty.dev) static site generator and the templates and pages in `/docs-src`. The site is generated to `/docs` and intended to be checked in so that GitHub pages can serve the site [from `/docs` on the main branch](https://help.github.com/en/github/working-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

To enable the site go to the GitHub settings and change the GitHub Pages &quot;Source&quot; setting to &quot;main branch /docs folder&quot;.</p>

To build the site, run:

```bash
npm run docs
```

To serve the site locally, run:

```bash
npm run docs:serve
```

To watch the site files, and re-build automatically, run:

```bash
npm run docs:gen:watch
```

The site will usually be served at http://localhost:8000.

**Note**: The project uses Rollup to bundle and minify the source code for the docs site and not to publish to NPM. For bundling and minification, check the [Bundling and minification](#bundling-and-minification) section.

## Bundling and minification

As stated in the [static site generation](#static-site) section, the bundling and minification setup in the Rollup configuration in this project is there specifically for the docs generation.

We recommend publishing components as unoptimized JavaScript modules and performing build-time optimizations at the application level. This gives build tools the best chance to deduplicate code, remove dead code, and so on.

Please check the [Publishing best practices](https://lit.dev/docs/tools/publishing/#publishing-best-practices) for information on publishing reusable Web Components, and [Build for production](https://lit.dev/docs/tools/production/) for building application projects that include LitElement components, on the Lit site.

## More information

See [Get started](https://lit.dev/docs/getting-started/) on the Lit site for more information.
