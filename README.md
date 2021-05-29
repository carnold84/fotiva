# Fotiva

An online tool for creating sets of responsive images.

## Code

Written in plain javascript using modules, web components and custom events.
This means:

- No compilation step is required
- No NPM dependencies
- Targets modern browsers. No IE
- Uses ES6 imports and modules which means there can be a single entry file (main.js) that loads all other files with no compilation!

## Web components

The web components use template literals to define their CSS and HTML so each one is encapsulated in a single file, much like Vue components. Unfortunately this means there is currently no autocomplete or syntax highlighting.

## Dependencies

As this is a standalone app it has no NPM modules. However, it does have dependencies that are loaded from CDNs.

- FileSaver.js - [https://github.com/eligrey/FileSaver.js/](https://github.com/eligrey/FileSaver.js/)
- JSZip - [https://github.com/Stuk/jszip](https://github.com/Stuk/jszip)
