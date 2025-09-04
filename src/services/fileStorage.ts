import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import http from 'node:http';
import https from 'node:https';
import { pipeline } from 'node:stream/promises';

export class FileStorage {
  constructor(
    private uploadsDir = path.resolve('uploads'),
    private maxBytes = 50 * 1024 * 1024 
  ) {}

  private async ensureDir() {
    await fsp.mkdir(this.uploadsDir, { recursive: true });
  }

  async saveUploaded(tempFilePath: string, ext = '.mp3'): Promise<{ relPath: string; absPath: string }> {
    await this.ensureDir();
    const targetAbs = path.join(this.uploadsDir, `${randomUUID()}${ext}`);
 
    await fsp.rename(tempFilePath, targetAbs); 
    const relPath = `/uploads/${path.basename(targetAbs)}`;
    return { relPath, absPath: targetAbs };
  }

  async saveFromUrl(url: string): Promise<{ relPath: string; absPath: string }> {
    await this.ensureDir();
    const targetAbs = path.join(this.uploadsDir, `${randomUUID()}.mp3`);
    const client = url.startsWith('https') ? https : http;

    await new Promise<void>((resolve, reject) => {
      let redirected = false;

      const handle = (res: http.IncomingMessage) => {
        if (!redirected && res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          redirected = true;
          const nextClient = res.headers.location.startsWith('https') ? https : http;
          return nextClient.get(res.headers.location, handle).on('error', reject);
        }

        const type = String(res.headers['content-type'] || '');
        const len = Number(res.headers['content-length'] || '0');

        if (!type.includes('audio')) {
          res.resume();
          return reject(new Error('Remote URL does not serve audio content'));
        }

        if (len && len > this.maxBytes) {
          res.resume();
          return reject(new Error('Remote file too large'));
        }

        const out = fs.createWriteStream(targetAbs, { flags: 'wx' });
        let downloaded = 0;

        res.on('data', (chunk) => {
          downloaded += chunk.length;
          if (downloaded > this.maxBytes) {
            res.destroy(new Error('Remote file exceeds size limit'));
          }
        });

        pipeline(res, out).then(() => resolve()).catch(reject);
      };

      client.get(url, handle).on('error', reject);
    });

    const relPath = `/uploads/${path.basename(targetAbs)}`;
    return { relPath, absPath: targetAbs };
  }
}
