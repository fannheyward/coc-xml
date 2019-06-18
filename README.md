# coc-xml

> fork of [vscode-xml](https://github.com/redhat-developer/vscode-xml), provides support for creating and editing XML documents, based on the [LSP4XML Language Server](https://github.com/angelozerr/lsp4xml), running with Java.

## Features

- Syntax error reporting
- General code completion
- Auto-close tags
- Automatic node indentation
- Symbol highlighting
- Document folding
- Document links
- Document symbols and outline
- Renaming support
- Document Formatting
- DTD validation
- DTD completion
- DTD formatting
- XSD validation
- XSD based hover
- XSD based code completion
- XSL support
- XML catalogs
- File associations
- Code actions
- Schema Caching

## Requirements

- Java JDK (or JRE) 8 or more recent
- Ensure Java path is set in either:
  - `xml.java.home` or `java.home` in `coc-settings.json`
  - Environment variable `JAVA_HOME` or `JDK_HOME`
  - **Note**: The path should end at the parent folder that contains the `bin` folder.
    **Example Path**: `/usr/lib/jvm/java-1.8.0` if `bin` exists at `/usr/lib/jvm/java-1.8.0/bin`.
    **macOS**: `export JAVA_HOME="$(/usr/libexec/java_home -v 1.8)"`

## Supported settings

The following settings are supported:

- `xml.java.home`: Set the Java path required to run the XML Language Server. If not set, falls back to either the `java.home` preference or the `JAVA_HOME` or `JDK_HOME` environment variables.
- `xml.trace.server` : Trace the communication between coc and the XML Language Server in the Output view.
- `xml.catalogs` : Register XML catalog files.
- `xml.logs.client` : Enable/disable logging to the Output view.
- `xml.fileAssociations` : Associate XML Schemas to XML file patterns.
- `xml.format.splitAttributes` : Set to `true` to split node attributes onto multiple lines during formatting. Defaults to `false`.
- `xml.format.joinCDATALines` : Set to `true` to join lines in CDATA content during formatting. Defaults to `false`.
- `xml.format.joinContentLines` : Set to `true` to join lines in node content during formatting. Defaults to `false`.
- `xml.format.joinCommentLines` : Set to `true` to join lines in comments during formatting. Defaults to `false`.
- `xml.format.preservedNewLines`: Set the maximum amount of newlines between elements. Defaults to `2`.
- `xml.format.preserveEmptyContent`: Set to `true` to preserve standalone whitespace content in an element. Defaults to `false`.
- `xml.format.spaceBeforeEmptyCloseTag`: Set to `true` to insert space before the end of a self closing tag. Defaults to `true`.
- `xml.format.quotations`: Set to `doubleQuotes` to format and only use `"`, or `singleQuotes` to format and only use `'`. Defaults to `doubleQuotes`.
- `xml.format.enabled` : Enable/disable formatting. Defaults to `true`.
- `xml.autoCloseTags.enabled` : Enable/disable automatic tag closing. Defaults to `true`.
- `xml.server.vmargs`: Extra VM arguments used to launch the XML Language Server. Requires coc restart.
- `xml.validation.enabled`: Set to `false` to disable all validation. Defaults to `true`.
- `xml.validation.schema`: Set to `false` to disable schema validation. Defaults to `true`.
- `xml.validation.noGrammar`: The message severity when a document has no associated grammar. Defaults to `hint`.
- `xml.server.workDir`: Set an absolute path for all cached schemas to be stored. Defaults to `~/.lsp4xml`.
- `xml.symbols.enabled`: Enable/disable document symbols (Outline). Default is `true`.

More detailed info in the [vscode-xml Wiki](https://github.com/redhat-developer/vscode-xml/wiki/Preferences).

## License

MIT
