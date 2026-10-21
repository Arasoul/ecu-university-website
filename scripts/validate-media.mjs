import { access, readFile } from 'node:fs/promises';

const manifest = JSON.parse(await readFile(new URL('../data/media/manifest.json', import.meta.url)));
const readJpegDimensions = (buffer) => {
  if (buffer[0] !== 0xff || buffer[1] !== 0xd8) throw new Error('not a JPEG');
  let offset = 2;
  while (offset < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1;
      continue;
    }
    const marker = buffer[offset + 1];
    const length = buffer.readUInt16BE(offset + 2);
    if (marker >= 0xc0 && marker <= 0xc3) {
      return { height: buffer.readUInt16BE(offset + 5), width: buffer.readUInt16BE(offset + 7) };
    }
    offset += 2 + length;
  }
  throw new Error('JPEG dimensions not found');
};

for (const asset of manifest.publishedAssets) {
  await access(new URL(`../${asset.localFile}`, import.meta.url));
  const buffer = await readFile(new URL(`../${asset.localFile}`, import.meta.url));
  const dimensions = readJpegDimensions(buffer);
  if (dimensions.width !== asset.dimensions.width || dimensions.height !== asset.dimensions.height) {
    throw new Error(`Dimensions do not match manifest: ${asset.localFile}`);
  }
  if (asset.rightsStatus !== 'authorized-for-this-replacement-site') {
    throw new Error(`Unauthorized published asset: ${asset.localFile}`);
  }
}

console.log(`Validated ${manifest.publishedAssets.length} authorized ECU photographs and their manifest dimensions.`);
