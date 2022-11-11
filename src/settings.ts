import { commands, window, workspace, WorkspaceConfiguration } from 'coc.nvim';

let oldXMLConfig: WorkspaceConfiguration = getXMLConfiguration();
let oldJavaConfig: WorkspaceConfiguration = getJavaConfiguration();

const restartId = 'workbench.action.reloadWindow';

export function getXMLConfiguration(): WorkspaceConfiguration {
  return workspace.getConfiguration('xml');
}

export function getJavaConfiguration(): WorkspaceConfiguration {
  return workspace.getConfiguration('java');
}

export function subscribeJDKChangeConfiguration() {
  return workspace.onDidChangeConfiguration((params) => {
    //handle "xml.java.home" change
    if (params.affectsConfiguration('xml')) {
      const newXMLConfig = getXMLConfiguration();
      if (hasPreferenceChanged(oldXMLConfig, newXMLConfig, 'java.home')) {
        // checks "xml.java.home", not "java.home"
        createReloadWindowMessage('`xml.java.home` path has changed. Please restart VS Code.');
      }
      // update to newest version of config
      oldXMLConfig = newXMLConfig;
      return;
    }

    //handle "java.home" change
    if (oldXMLConfig.get('java.home') === null) {
      // if "xml.java.home" exists, dont even look at "java.home"
      if (params.affectsConfiguration('java')) {
        const newJavaConfig = getJavaConfiguration();
        if (hasPreferenceChanged(oldJavaConfig, newJavaConfig, 'home')) {
          // checks "java.home"
          createReloadWindowMessage('`java.home` path has changed. Please restart VS Code.');
        }
        oldJavaConfig = newJavaConfig;
      }
      return;
    }
  });
}

function hasPreferenceChanged(oldConfig: WorkspaceConfiguration, newConfig: WorkspaceConfiguration, preference: string) {
  return oldConfig.get(preference) != newConfig.get(preference);
}

function createReloadWindowMessage(message: string) {
  window.showPrompt(message).then((ok) => {
    if (ok) {
      commands.executeCommand(restartId);
    }
  });
}
