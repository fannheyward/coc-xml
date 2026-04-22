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

- `xml.catalogs`: Register XML catalog files.
- `xml.codeLens.enabled`: Enable/disable XML CodeLens. Default is `false`.
- `xml.colors`: Allows colors for the given file name patterns.
- `xml.completion.autoCloseRemovesContent`: Enable/disable the content of an element being removed when the element start tag is turned into a self-closing tag. The default setting is to remove the content.
- `xml.completion.autoCloseTags`: Enable/disable autoclosing of XML tags. Default is `true`.
- `xml.downloadExternalResources.enabled`: Download external resources like referenced DTD, XSD. Default is `true`.
- `xml.fileAssociations`: Allows XML schemas/ DTD to be associated to file name patterns.
- `xml.filePathSupport.mappings`: Allows file path for the given file name patterns.
- `xml.foldings.includeClosingTagInFold`: Minimize the closing tag after folding. Default is `false`.
- `xml.format.closingBracketNewLine`: The option to put a closing bracket on a newline when `#xml.format.splitAttributes#` is `true`. Default value is `false`.
- `xml.format.emptyElements`: Expand/collapse empty elements. Default is `ignore`.
- `xml.format.enabled`: Enable/disable ability to format document. Default is `true`.
- `xml.format.enforceQuoteStyle`: Enforce `preferred` quote style (set by `#xml.preferences.quoteStyle#`) or `ignore` quote style when formatting. Default is `ignore`.
- `xml.format.grammarAwareFormatting`: Use Schema/DTD grammar information while formatting. Default is `true`. Not supported by legacy formatter.
- `xml.format.joinCDATALines`: Set to `true` to join lines in CDATA content during formatting. Default is `false`.
- `xml.format.joinCommentLines`: Join comment content on format. Default is `false`.
- `xml.format.joinContentLines`: Normalize the whitespace of content inside an element. Newlines and excess whitespace are removed. Default is `false`.
- `xml.format.legacy`: Enable/disable legacy formatter. Default is `false`.
- `xml.format.maxLineWidth`: Max line width. Set to `0` to disable this setting. Default is `100`. Not supported by legacy formatter.
- `xml.format.preserveAttributeLineBreaks`: Preserve line breaks that appear before and after attributes. This setting is overridden if `#xml.format.splitAttributes#` is set to `splitNewLine` or `alignWithFirstAttr`. Default is `true`.
- `xml.format.preserveEmptyContent`: Preserve empty content/whitespace in a tag. Default is `false`. Supported only with legacy formatter.
- `xml.format.preserveSpace`: Element names for which spaces will be preserved. Not supported by legacy formatter.
- `xml.format.preservedNewlines`: Preserve new lines that separate tags. The value represents the maximum number of new lines per section. A value of 0 removes all new lines. Default is `2`.
- `xml.format.spaceBeforeEmptyCloseTag`: Insert space before end of self closing tag.
- `xml.format.splitAttributes`: Split multiple attributes each onto a new line or align attributes to the first. Default is `preserve`. Indicate level of indentation with `#xml.format.splitAttributesIndentSize#`.
- `xml.format.splitAttributesIndentSize`: How many levels to indent the attributes by when `#xml.format.splitAttributes#` is `true`. Default value is `2`.
- `xml.format.xsiSchemaLocationSplit`: Split `xsi:schemaLocation` content. Default is `onPair`.
- `xml.java.home`: Specifies the folder path to the JDK (11 or more recent) used to launch the XML Language Server if the Java server is being run.
- `xml.logs.client`: Enable/disable logging to the Output view. Default is `true`.
- `xml.preferences.quoteStyle`: Preferred quote style to use for completion: `single` quotes, `double` quotes. Default is `double`.
- `xml.preferences.showSchemaDocumentationType`: Specifies the source of the XML schema documentation displayed on hover and completion. Default is `all`.
- `xml.references`: Allows references for the given file name patterns.
- `xml.server.vmargs`: Specifies extra VM arguments used to launch the XML Language Server. Eg. use `-Xmx1G  -XX:+UseG1GC -XX:+UseStringDeduplication` to increase the heap size to 1GB and enable String deduplication with the G1 Garbage collector.
- `xml.server.workDir`: Set a custom folder path for cached XML Schemas. An absolute path is expected, although the `~` prefix (for the user home directory) is supported. Default is `~/.lemminx`.
- `xml.symbols.enabled`: Enable/disable document symbols (Outline). Default is `true`. No symbols are given if `"xml.symbols.enabled": false`.
- `xml.symbols.excluded`: Disable document symbols (Outline) for the given file name patterns. Updating file name patterns does not automatically reload the Outline view for the relevant file(s). Each file must either be reopened or changed, in order to trigger an Outline view reload.

More detailed info in the [vscode-xml Wiki](https://github.com/redhat-developer/vscode-xml/wiki/Preferences).

## Available commands

- `xml.updateLanguageServer`: download latest version of LemMinX from repo.eclipse.org
- `xml.show.references`: Show XML references

## License

MIT
