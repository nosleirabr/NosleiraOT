# Portuguese Accents in MyAAC Twig Templates

## Context
When editing `.twig` files in MyAAC, saving files as UTF-8 in PowerShell or certain text editors can cause encoding issues where the server parses them as ISO-8859-1. This causes Portuguese accents (like `á`, `ã`, `ç`) to break and render as garbage characters like `Ã£`, `Ã§`. 
Additionally, saving with `UTF-8 BOM` completely breaks the page layout structure due to the invisible BOM bytes breaking HTML/CSS parsers.

## Rule & Best Practice
When modifying strings in the website templates or any HTML/PHP file:
1. **Always prioritize correct Portuguese spelling and accents**.
2. **Never leave broken accents** (e.g. `Ã£`). Fix them immediately.
3. **Use HTML Entities** for accents to guarantee cross-encoding compatibility:
   - `ç` -> `&ccedil;`
   - `ã` -> `&atilde;`
   - `õ` -> `&otilde;`
   - `á` -> `&aacute;`
   - `é` -> `&eacute;`
   - `í` -> `&iacute;`
   - `ó` -> `&oacute;`
   - `ú` -> `&uacute;`
   - `ê` -> `&ecirc;`
   - `â` -> `&acirc;`
   - And their uppercase variants (e.g. `&Ccedil;`, `&Atilde;`).
4. **Never save with BOM.** Use `UTF8NoBOM` when manipulating files programmatically.
