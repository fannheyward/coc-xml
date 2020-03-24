# coc-xml

> fork of [vscode-xml](https://github.com/redhat-developer/vscode-xml), provides support for creating and editing XML documents, based on the [LemMinX XML Language Server](https://github.com/eclipse/lemminx), running with Java.

<img width="594" alt="Screen Shot 2019-07-26 at 23 26 04" src="https://user-images.githubusercontent.com/345274/61962925-3e667700-affd-11e9-8831-ecf78ef2bfbf.png">

## Install

`:CocInstall coc-xml`

## Requirements

- Java JDK (or JRE) 8 or more recent
- Ensure Java path is set in either:
  - `xml.java.home` or `java.home` in `coc-settings.json`
  - Environment variable `JAVA_HOME` or `JDK_HOME`

## Supported settings

The following settings are supported:

- `xml.java.home`: Set the Java path required to run the XML Language Server. If not set, falls back to either the `java.home` preference or the `JAVA_HOME` or `JDK_HOME` environment variables.
- `xml.trace.server`: Trace the communication between coc and the XML Language Server in the Output view.
- `xml.catalogs`: Register XML catalog files.
- `xml.codeLens.enabled`: Enable/disable XML CodeLens. Defaults to `true`.
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
- `xml.validation.disallowDocTypeDecl`: Enable/disable if a fatal error is thrown if the incoming document contains a DOCTYPE declaration. Default is `false`.
- `xml.validation.resolveExternalEntities`: Enable/disable resolve of external entities. Default is `false`.
- `xml.server.workDir`: Set an absolute path for all cached schemas to be stored. Defaults to `~/.lemminx`.
- `xml.symbols.enabled`: Enable/disable document symbols (Outline). Default to `true`.
- `xml.symbols.excluded`: Disable document symbols (Outline) for the given file name patterns. Defaults to `[]`.

More detailed info in the [vscode-xml Wiki](https://github.com/redhat-developer/vscode-xml/wiki/Preferences).

## Available commands

- `xml.updateLanguageServer`: download latest version of LemMinX from repo.eclipse.org
- `xml.show.references`: Show XML references

## License

MIT
