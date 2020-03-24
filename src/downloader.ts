//@ts-ignore
import parseXml from '@rgrove/parse-xml';
import { workspace } from 'coc.nvim';
import { createWriteStream } from 'fs';
import { Agent } from 'http';
import fetch from 'node-fetch';
import path from 'path';
import tunnel from 'tunnel';

async function getLatestVersion(agent: Agent): Promise<string> {
  let ver = '0.11.0';
  const _url = 'https://repo.eclipse.org/content/repositories/lemminx-releases/org/eclipse/org.eclipse.lemminx/maven-metadata.xml';
  try {
    const body = await (await fetch(_url, { agent })).text();
    const doc = parseXml(body);
    for (const ele of doc.children[0].children) {
      if (ele.type === 'element' && ele.name === 'versioning') {
        for (const item of ele.children) {
          if (item.type === 'element' && ele.name === 'release') {
            ver = ele.children[0].text;
          }
        }
      }
    }
  } catch (_e) {}

  return ver;
}

export async function downloadServer(root: string): Promise<string> {
  let statusItem = workspace.createStatusBarItem(0, { progress: true });
  statusItem.text = 'Downloading LemMinX from repo.eclipse.org';
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
  const _file = `org.eclipse.lemminx-${_version}-uber.jar`;
  const _url = `https://repo.eclipse.org/content/repositories/lemminx-releases/org/eclipse/org.eclipse.lemminx/${_version}/${_file}`;
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
              statusItem.text = `${p}% Downloading LemMinX ${_version}`;
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
