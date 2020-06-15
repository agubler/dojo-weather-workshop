# weather-workshop widget library

-   [Usage](#usage)

## Usage

To use the `weather-workshop` package in your project, you will need to install the package:

```bash
npm install weather-workshop
```

This package contains _all_ of the widgets in this repo.

To use a widget in your application, you will need to import each widget individually:

```ts
import Button from 'weather-workshop/button';
```

Each widget module has a default export of the widget itself, as well as named exports for things such as properties specific to the widget:

```ts
import Button, { ButtonProperties } from 'weather-workshop/button';
```
