import { commands, ExtensionContext, LanguageClient, LanguageClientOptions, RevealOutputChannelOn, services, window, workspace } from 'coc.nvim';
import fs from 'fs';
import {
  DidChangeConfigurationNotification,
  DocumentSelector,
  FoldingRange,
  ReferencesRequest,
  TextDocumentIdentifier,
  TextDocumentPositionParams,
} from 'vscode-languageserver-protocol';
import { Commands } from './commands';
import { downloadServer } from './downloader';
import { prepareExecutable } from './javaServerStarter';
import { RequirementsData, resolveRequirements } from './requirements';
import { onConfigurationChange, subscribeJDKChangeConfiguration } from './settings';

const documentSelector: DocumentSelector = ['xml', 'xslt'];

export async function activate(context: ExtensionContext): Promise<void> {
  const serverRoot = context.storagePath;
  if (!fs.existsSync(serverRoot)) {
    fs.mkdirSync(serverRoot);
  }

  let requirements: RequirementsData;
  try {
    requirements = await resolveRequirements(serverRoot);
  } catch (e) {
    const res = await window.showQuickpick(['Yes', 'No'], `${e.message}, ${e.label}?`);
    if (res == 0) {
      commands.executeCommand(Commands.OPEN_BROWSER, e.openUrl).catch(() => {});
    }
    return;
  }

  if (requirements.serverPath.length === 0 || !fs.existsSync(requirements.serverPath)) {
    window.showMessage(`LemMinX.jar not found, downloading...`);
    try {
      requirements.serverPath = await downloadServer(serverRoot);
    } catch (e) {
      window.showMessage(
        'Download LemMinX.jar failed, you can download it from https://repo.eclipse.org/content/repositories/lemminx-releases/org/eclipse/org.eclipse.lemminx/'
      );
      return;
    }
    window.showMessage(`LemMinX.jar downloaded`);
  }

  const serverOptions = prepareExecutable(requirements);
  const clientOptions: LanguageClientOptions = {
    documentSelector: documentSelector,
    synchronize: {
      configurationSection: 'xml',
    },
    revealOutputChannelOn: RevealOutputChannelOn.Never,
    initializationOptions: {
      settings: {
        xml: workspace.getConfiguration('xml'),
        extendedClientCapabilities: {
          codeLens: {
            codeLensKind: {
              valueSet: ['references'],
            },
          },
        },
      },
    },
    middleware: {
      provideFoldingRanges: async (document, context, token, next) => {
        const ranges = (await next(document, context, token)) as FoldingRange[];
        return ranges.reverse();
      },
      workspace: {
        didChangeConfiguration: () => {
          const settings = {
            xml: workspace.getConfiguration('xml'),
            extendedClientCapabilities: {
              codeLens: {
                codeLensKind: {
                  valueSet: ['references'],
                },
              },
            },
          };
          client.sendNotification(DidChangeConfigurationNotification.type.method, { settings });
          onConfigurationChange();
        },
      },
    },
  };

  const client = new LanguageClient('xml', 'XML LSP', serverOptions, clientOptions);
  context.subscriptions.push(services.registLanguageClient(client));

  context.subscriptions.push(
    subscribeJDKChangeConfiguration(),

    commands.registerCommand(Commands.SHOW_REFERENCES, async () => {
      const { document, position } = await workspace.getCurrentState();

      const param: TextDocumentPositionParams = {
        textDocument: <TextDocumentIdentifier>{ uri: document.uri },
        position,
      };
      client.sendRequest(ReferencesRequest.type.method, param).then((locations) => {
        commands.executeCommand(Commands.EDITOR_SHOW_REFERENCES, document.uri, position, locations);
      });
    }),

    commands.registerCommand(Commands.DOWNLOAD_SERVER, async () => {
      await downloadServer(serverRoot)
        .then(() => {
          window.showMessage(`Update LemMinX success`);
        })
        .catch(() => {
          window.showMessage(`Update LemMinX failed`);
        });
    })
  );

  client.onReady().then(() => {
    window.showMessage('XML Language Server Started');
  });
}
