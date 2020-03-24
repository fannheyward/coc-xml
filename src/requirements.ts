import { workspace, Uri } from 'coc.nvim';
import cp from 'child_process';
import path, { join } from 'path';
import glob from 'glob';
import pathExists from 'path-exists';
import semver from 'semver';

const isWindows = process.platform.indexOf('win') === 0;
const JAVA_FILENAME = 'java' + (isWindows ? '.exe' : '');

export interface RequirementsData {
  javaHome: string;
  javaVersion: number;
  serverPath: string;
  vmargs: string;
}

export interface ErrorData {
  message: string;
  label: string;
  openUrl: Uri;
  replaceClose: boolean;
}

/**
 * Resolves the requirements needed to run the extension.
 * Returns a promise that will resolve to a RequirementsData if
 * all requirements are resolved, it will reject with ErrorData if
 * if any of the requirements fails to resolve.
 *
 */
export async function resolveRequirements(root: string): Promise<RequirementsData> {
  const xmlConfig = workspace.getConfiguration('xml');

  let javaHome = await checkJavaRuntime();
  let javaVersion = await checkJavaVersion(javaHome);
  let serverPath = await checkServerPath(root);
  let vmargs = xmlConfig.get<string>('server.vmargs', '');
  return Promise.resolve({ javaHome, javaVersion, serverPath, vmargs });
}

function checkJavaRuntime(): Promise<string> {
  return new Promise((resolve, reject) => {
    let source: string;
    let config = workspace.getConfiguration('xml');
    let javaHome = config.get('java.home', '');
    if (javaHome) {
      source = 'The xml.java.home variable defined in settings';
    } else {
      config = workspace.getConfiguration('java');
      javaHome = config.get('home', '');
      if (javaHome) {
        source = 'The java.home variable defined in settings';
      } else {
        javaHome = process.env['JAVA_HOME'] || '';
        if (javaHome) {
          source = 'The JAVA_HOME environment variable';
        } else {
          javaHome = process.env['JDK_HOME'] || '';
          source = 'The JDK_HOME environment variable';
        }
      }
    }
    if (javaHome) {
      if (javaHome.slice(0, 2) === '~/') {
        const homedir = <string>process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME'];
        javaHome = join(homedir, javaHome);
      }
      if (!pathExists.sync(javaHome)) {
        openJDKDownload(reject, source + ' points to a missing folder');
      }
      if (!pathExists.sync(path.resolve(javaHome, 'bin', JAVA_FILENAME))) {
        openJDKDownload(reject, source + ' does not point to a JDK.');
      }
      return resolve(javaHome);
    }

    openJDKDownload(reject, 'Java runtime could not be located');
  });
}

function checkJavaVersion(java_home: string): Promise<number> {
  return new Promise((resolve, reject) => {
    cp.execFile(java_home + '/bin/' + JAVA_FILENAME, ['-version'], {}, (_error, _stdout, stderr) => {
      let javaVersion = parseMajorVersion(stderr);
      if (javaVersion < 8) {
        openJDKDownload(reject, 'Java 8 or more recent is required to run. Please download and install a recent JDK');
      } else {
        resolve(javaVersion);
      }
    });
  });
}

function checkServerPath(root: string): Promise<string> {
  return new Promise(resolve => {
    let serverPath = '';
    const launchersFound: string[] = glob.sync('org.eclipse.lemminx-*-uber.jar', { cwd: root });
    if (launchersFound.length > 0) {
      try {
        launchersFound.sort((a, b) => {
          const v1 = a.split('-')[1];
          const v2 = b.split('-')[1];

          return semver.lte(v1, v2) ? 1 : -1;
        });
      } catch (_e) {}
      serverPath = path.join(root, launchersFound[0]);
    }

    resolve(serverPath);
  });
}

function parseMajorVersion(content: string): number {
  let regexp = /version "(.*)"/g;
  let match = regexp.exec(content);
  if (!match) {
    return 0;
  }
  let version = match[1];
  // Ignore '1.' prefix for legacy Java versions
  if (version.startsWith('1.')) {
    version = version.substring(2);
  }

  // look into the interesting bits now
  regexp = /\d+/g;
  match = regexp.exec(version);
  let javaVersion = 0;
  if (match) {
    javaVersion = parseInt(match[0], 10);
  }
  return javaVersion;
}

function openJDKDownload(reject: any, cause: string): void {
  let jdkUrl = 'https://developers.redhat.com/products/openjdk/download/?sc_cid=701f2000000RWTnAAO';
  if (process.platform === 'darwin') {
    jdkUrl = 'http://www.oracle.com/technetwork/java/javase/downloads/index.html';
  }
  reject({
    message: `[coc-xml] ${cause}`,
    label: 'Get the Java Development Kit',
    openUrl: Uri.parse(jdkUrl),
    replaceClose: false
  } as ErrorData);
}
