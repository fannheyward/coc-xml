import { parseXml } from '@rgrove/parse-xml';
import { window, workspace } from 'coc.nvim';
import { createWriteStream } from 'fs';
import { Agent } from 'http';
import fetch from 'node-fetch';
import path from 'path';
import tunnel from 'tunnel';
import { parse } from 'url';

async function getLatestVersion(agent: Agent): Promise<string> {
  let ver = '0.14.1';
  const _url = 'https://repo.eclipse.org/content/repositories/lemminx-releases/org/eclipse/lemminx/org.eclipse.lemminx/maven-metadata.xml';
  try {
    const body = await (await fetch(_url, { agent })).text();
    const doc = parseXml(body);
    // @ts-ignore
    for (const ele of doc.children[0].toJSON()['children']) {
      if (ele.type === 'element' && ele.name === 'versioning') {
        for (const item of ele.children) {
          if (item.type === 'element' && item.name === 'release') {
            ver = item.children[0].text;
            break;
          }
        }
      }
    }
  } catch (_e) {}

  return ver;
}

export async function downloadServer(root: string): Promise<string> {
  const statusItem = window.createStatusBarItem(0, { progress: true });
  statusItem.text = 'Downloading LemMinX from repo.eclipse.org';
  statusItem.show();
  const config = workspace.getConfiguration('http');
  const proxy = config.get<string>('proxy', '');
  const options: any = { encoding: null };
  if (proxy) {
    const proxyEndpoint = parse(proxy);
    if (proxyEndpoint.protocol && /^http/.test(proxyEndpoint.protocol)) {
      options.agent = tunnel.httpsOverHttp({
        proxy: {
          headers: {},
          host: proxyEndpoint.hostname!,
          port: Number(proxyEndpoint.port) || 80,
          proxyAuth: proxyEndpoint.auth || '',
        },
      });
    }
  }

  const _version = await getLatestVersion(options.agent);
  const _file = `org.eclipse.lemminx-${_version}-uber.jar`;
  const _url = `https://repo.eclipse.org/content/repositories/lemminx-releases/org/eclipse/lemminx/org.eclipse.lemminx/${_version}/${_file}`;
  const _path = path.join(root, _file);
  return new Promise<string>((resolve, reject) => {
    fetch(_url, options)
      .then((resp) => {
        let cur = 0;
        const len = parseInt(resp.headers.get('content-length') || '', 10);
        resp.body
          .on('data', (chunk) => {
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
      .catch((e) => {
        reject(e);
      });
  });
}
