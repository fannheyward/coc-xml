import { commands, ExtensionContext, LanguageClient, LanguageClientOptions, RevealOutputChannelOn, services, workspace } from 'coc.nvim';
import fs from 'fs';
import { Commands } from './commands';
import { downloadServer } from './downloader';
import { prepareExecutable } from './javaServerStarter';
import { RequirementsData, resolveRequirements } from './requirements';

export async function activate(context: ExtensionContext): Promise<void> {
  const serverRoot = context.storagePath;
  if (!fs.existsSync(serverRoot)) {
    fs.mkdirSync(serverRoot);
  }

  let requirements: RequirementsData;
  try {
    requirements = await resolveRequirements(serverRoot);
  } catch (e) {
    let res = await workspace.showQuickpick(['Yes', 'No'], `${e.message}, ${e.label}?`);
    if (res == 0) {
      commands.executeCommand(Commands.OPEN_BROWSER, e.openUrl).catch(_e => {
        // noop
      });
    }
    return;
  }

  if (requirements.serverPath.length === 0 || !fs.existsSync(requirements.serverPath)) {
    workspace.showMessage(`lsp4xml.jar not found, downloading...`);
    try {
      requirements.serverPath = await downloadServer(serverRoot);
    } catch (e) {
      workspace.showMessage('Download lsp4xml.jar failed, you can download it from https://dl.bintray.com/lsp4xml/releases/org/lsp4xml/org.eclipse.lsp4xml/');
      return;
    }
    workspace.showMessage(`lsp4xml.jar downloaded`);
  }

  let serverOptions = prepareExecutable(requirements);
  let clientOptions: LanguageClientOptions = {
    documentSelector: ['xml'],
    synchronize: {
      configurationSection: 'xml'
    },
    revealOutputChannelOn: RevealOutputChannelOn.Never,
    initializationOptions: {
      settings: { xml: workspace.getConfiguration('xml') }
    }
  };

  let client = new LanguageClient('xml', 'XML LSP', serverOptions, clientOptions);
  context.subscriptions.push(services.registLanguageClient(client));

  context.subscriptions.push(
    commands.registerCommand(Commands.DOWNLOAD_SERVER, async () => {
      await downloadServer(serverRoot)
        .then(() => {
          workspace.showMessage(`Update lsp4xml success`);
        })
        .catch(() => {
          workspace.showMessage(`Update lsp4xml failed`);
        });
    })
  );

  client.onReady().then(() => {
    workspace.showMessage('XML Language Server Started');
  });
}
