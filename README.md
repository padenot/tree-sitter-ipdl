# tree-sitter-ipdl

Tree-sitter parser for Mozilla's IPDL (Inter-process Protocol Definition
Language), with `highlight.scm` query file.

Documentation for the language: https://firefox-source-docs.mozilla.org/ipc/ipdl.html

## Installation

```bash
npm install
```

## Build

```bash
tree-sitter generate
```

## Test

Run parser on a single file:
```bash
tree-sitter parse testcases/PBrowser.ipdl
```

Attempt to parse all test cases (all `.ipdl` file at
https://github.com/mozilla-firefox/firefox/commit/78ed03590fc759dfce44e8c856a43a6fc37be542):
```bash


./stress.sh
```

There should be a small amount of failures, that I think are `.`ipdl` files that
are intentionally invalid, for regression testing.

## License

MPL-2.0
