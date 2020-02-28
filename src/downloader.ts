//@ts-ignore
import parseXml from '@rgrove/parse-xml';
import { workspace } from 'coc.nvim';
import { createWriteStream } from 'fs';
import { Agent } from 'http';
import fetch from 'node-fetch';
import path from 'path';
import tunnel from 'tunnel';

async function getLatestVersion(agent: Agent): Promise<string> {
  let ver = '0.7.0';
  const _url = 'https://dl.bintray.com/lsp4xml/releases/org/lsp4xml/org.eclipse.lsp4xml/maven-metadata.xml';
  try {
    const body = await (await fetch(_url, { agent })).text();
    const doc = parseXml(body);
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
    let auth = '';
    let parts = proxy.split('@');
    if (parts.length > 2) {
      proxy = parts[parts.length - 1];
      auth = parts.slice(0, parts.length - 1).join('@');
    } else if (parts.length === 2) {
      auth = parts[0];
      proxy = parts[1];
    }

    parts = proxy.split(':');
    const host = parts[0];
    const port = parseInt(parts[1], 10) || 80;
    options.agent = tunnel.httpsOverHttp({
      proxy: {
        headers: {},
        host,
        port,
        proxyAuth: auth
      }
    });
  }

  const _version = await getLatestVersion(options.agent);
  const _file = `org.eclipse.lsp4xml-${_version}-uber.jar`;
  const _url = `https://dl.bintray.com/lsp4xml/releases/org/lsp4xml/org.eclipse.lsp4xml/${_version}/${_file}`;
  const _path = path.join(root, _file);
  return new Promise<string>((resolve, reject) => {
    fetch(_url, options)
      .then(resp => {
        let cur = 0;
        const len = parseInt(resp.headers.get('content-length') || '', 10);
        resp.body
          .on('data', chunk => {
            if (!isNaN(len)) {
              cur += chunk.length;
              const p = ((cur / len) * 100).toFixed(2);
              statusItem.text = `${p}% Downloading lsp4xml ${_version}`;
            }
          })
          .on('end', () => {
            statusItem.hide();
            resolve(_path);
          })
          .pipe(createWriteStream(_path));
      })
      .catch(e => {
        reject(e);
      });
  });
}
