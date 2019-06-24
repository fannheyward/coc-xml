import got from 'got';
import tunnel from 'tunnel';
import { createWriteStream } from 'fs';
import { workspace } from 'coc.nvim';
//@ts-ignore
import parseXml from '@rgrove/parse-xml';

async function getLatestVersion(): Promise<string> {
  let ver = '0.7.0';
  const _url = 'https://dl.bintray.com/lsp4xml/releases/org/lsp4xml/org.eclipse.lsp4xml/maven-metadata.xml';
  try {
    got(_url).then(resp => {
      const doc = parseXml(resp.body);
      for (const ele of doc.children[0].children) {
        if (ele.type === 'element' && ele.name && ele.name === 'version') {
          ver = ele.children[0].text;
        }
      }
    });
  } catch (_e) {}

  return ver;
}

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

  const _version = await getLatestVersion();
  const _file = `org.eclipse.lsp4xml-${_version}-uber.jar`;
  const _url = `https://dl.bintray.com/lsp4xml/releases/org/lsp4xml/org.eclipse.lsp4xml/${_version}/${_file}`;
  const _path = __dirname + '/' + _file;
  return new Promise<string>((resolve, reject) => {
    try {
      got
        .stream(_url, options)
        .on('downloadProgress', progress => {
          let p = (progress.percent * 100).toFixed(0);
          statusItem.text = `${p}% Downloading lsp4xml ${_version}`;
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
