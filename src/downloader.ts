import got from 'got';
import tunnel from 'tunnel';
import { createWriteStream } from 'fs';
import { workspace } from 'coc.nvim';

export async function downloadServer(): Promise<string> {
  let statusItem = workspace.createStatusBarItem(0, { progress: true });
  statusItem.text = 'Downloading lsp4xml from bintray.com';
  statusItem.show();
  let config = workspace.getConfiguration('http');
  let proxy = config.get<string>('proxy', '');
  let options: any = { encoding: null };
  if (proxy) {
    let parts = proxy.split(':', 2);
    options.agent = tunnel.httpsOverHttp({
      proxy: {
        headers: {},
        host: parts[0],
        port: Number(parts[1])
      }
    });
  }

  return new Promise<string>((resolve, reject) => {
    const _version = '0.7.0';
    const _file = `org.eclipse.lsp4xml-${_version}-uber.jar`;
    const _url = `https://dl.bintray.com/lsp4xml/releases/org/lsp4xml/org.eclipse.lsp4xml/${_version}/${_file}`;
    const _path = __dirname + '/' + _file;

    try {
      got
        .stream(_url, options)
        .on('downloadProgress', progress => {
          let p = (progress.percent * 100).toFixed(0);
          statusItem.text = `${p}% Downloading lsp4xml`;
        })
        .on('end', () => {
          statusItem.hide();
          resolve(_path);
        })
        .pipe(createWriteStream(_path));
    } catch (e) {
      reject(e);
    }
  });
}
