//@ts-ignore
import parseXml from '@rgrove/parse-xml';
import { workspace } from 'coc.nvim';
import { createWriteStream } from 'fs';
import got from 'got';
import { Agent } from 'http';
import path from 'path';
import tunnel from 'tunnel';

async function getLatestVersion(agent: Agent): Promise<string> {
  let ver = '0.7.0';
  const _url = 'https://dl.bintray.com/lsp4xml/releases/org/lsp4xml/org.eclipse.lsp4xml/maven-metadata.xml';
  try {
    const resp = await got(_url, { agent: agent });
    const doc = parseXml(resp.body);
    for (const ele of doc.children[0].children) {
      if (ele.type === 'element' && ele.name && ele.name === 'version') {
        ver = ele.children[0].text;
      }
    }
  } catch (_e) {}

  return ver;
}

export async function downloadServer(root: string): Promise<string> {
  let statusItem = workspace.createStatusBarItem(0, { progress: true });
  statusItem.text = 'Downloading lsp4xml from bintray.com';
  statusItem.show();
  let config = workspace.getConfiguration('http');
  let proxy = config.get<string>('proxy', '');
  let options: any = { encoding: null };
  if (proxy) {
    let auth = proxy.includes('@') ? proxy.split('@', 2)[0] : '';
    let parts = auth.length ? proxy.slice(auth.length + 1).split(':') : proxy.split(':');
    if (parts.length > 1) {
      options.agent = tunnel.httpsOverHttp({
        proxy: {
          headers: {},
          host: parts[0],
          port: parseInt(parts[1], 10),
          proxyAuth: auth
        }
      });
    }
  }

  const _version = await getLatestVersion(options.agent);
  const _file = `org.eclipse.lsp4xml-${_version}-uber.jar`;
  const _url = `https://dl.bintray.com/lsp4xml/releases/org/lsp4xml/org.eclipse.lsp4xml/${_version}/${_file}`;
  const _path = path.join(root, _file);
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
