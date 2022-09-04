import * as localforage from 'localforage';

export const configure = () =>
  localforage.config({
    driver: localforage.INDEXEDDB,
    name: 'momohiki',
    version: 1.0,
    storeName: 'sample',
    description: 'Markdown editor'
  });

interface IFileData {
  name: string;
  type: string;
  data: ArrayBuffer;
  hash: string;
}

export const saveFile = async ({ name, type, data }: Omit<IFileData, 'hash'>) => {
  const hashBytes = new Uint8Array(await crypto.subtle.digest('SHA-512', data));
  let hash = '';
  for (let i = 0; i < hashBytes.length; ++i) {
    hash += hashBytes[i].toString(16).padStart(2, '0');
  }
  await localforage.setItem('f', { name, type, data, hash });
  return hash;
};

export const loadFile = async () => (await localforage.getItem('f')) as IFileData | undefined;
