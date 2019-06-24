import { services, commands, ExtensionContext, workspace, LanguageClientOptions, RevealOutputChannelOn, LanguageClient } from 'coc.nvim';

import { Commands } from './commands';
import { RequirementsData, resolveRequirements } from './requirements';
import { prepareExecutable } from './javaServerStarter';
import { downloadServer } from './downloader';

export async function activate(context: ExtensionContext): Promise<void> {
  let requirements: RequirementsData;
  try {
    requirements = await resolveRequirements();
  } catch (e) {
    let res = await workspace.showQuickpick(['Yes', 'No'], `${e.message}, ${e.label}?`);
    if (res == 0) {
      commands.executeCommand(Commands.OPEN_BROWSER, e.openUrl).catch(_e => {
        // noop
      });
    }
    return;
  }

  if (requirements.serverPath.length === 0) {
    workspace.showMessage(`lsp4xml.jar not found, downloading...`);
    try {
      requirements.serverPath = await downloadServer();
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
      await downloadServer();
    })
  );

  client.onReady().then(() => {
    workspace.showMessage('XML Language Server Started');
  });
}
