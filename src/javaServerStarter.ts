import os from 'os';
import * as path from 'path';
import { Executable } from 'coc.nvim';
import { RequirementsData } from './requirements';

declare var v8debug: string;
const DEBUG = typeof v8debug === 'object' || startedInDebugMode();

const isWindows = process.platform.indexOf('win') === 0;
const JAVA_FILENAME = 'java' + (isWindows ? '.exe' : '');

export function prepareExecutable(requirements: RequirementsData): Executable {
  let executable: Executable = Object.create(null);
  let options = Object.create(null);
  options.env = process.env;
  options.stdio = 'pipe';
  executable.options = options;
  executable.command = path.resolve(requirements.javaHome, 'bin', JAVA_FILENAME);
  executable.args = prepareParams(requirements);
  return executable;
}

function prepareParams(requirements: RequirementsData): string[] {
  let params: string[] = [];
  params.push('-jar');
  params.push(requirements.serverPath);

  if (DEBUG) {
    params.push('-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=1044,quiet=y');
  }

  const vmargs = requirements.vmargs;
  if (os.platform() == 'win32') {
    const watchParentProcess = '-DwatchParentProcess=';
    if (vmargs.indexOf(watchParentProcess) < 0) {
      params.push(watchParentProcess + 'false');
    }
  }
  if (params.indexOf('-noverify') < 0 && params.indexOf('-Xverify:none') < 0 && requirements.javaVersion < 13) {
    params.push('-noverify');
  }

  parseVMargs(params, vmargs);

  return params;
}

function startedInDebugMode(): boolean {
  let args = (process as any).execArgv;
  if (args) {
    return args.some((arg: string) => /^--debug=?/.test(arg) || /^--debug-brk=?/.test(arg) || /^--inspect-brk=?/.test(arg));
  }
  return false;
}

// exported for tests
export function parseVMargs(params: any[], vmargsLine: string): void {
  if (!vmargsLine) {
    return;
  }
  let vmargs = vmargsLine.match(/(?:[^\s"]+|"[^"]*")+/g);
  if (vmargs === null) {
    return;
  }
  vmargs.forEach(arg => {
    // remove all standalone double quotes
    // tslint:disable-next-line: only-arrow-functions typedef
    arg = arg.replace(/(\\)?"/g, function($0, $1) {
      return $1 ? $0 : '';
    });
    // unescape all escaped double quotes
    arg = arg.replace(/(\\)"/g, '"');
    if (params.indexOf(arg) < 0) {
      params.push(arg);
    }
  });
}
