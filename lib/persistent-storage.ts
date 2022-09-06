import * as localforage from 'localforage';
import { useMemo } from 'react';
import { digestSHA512 } from './digest';

const defaultConfig = {
  driver: localforage.INDEXEDDB,
  name: 'momohiki',
  version: 1.0,
  description: 'Markdown editor'
};

export const instantiateResourceStorage = () => localforage.createInstance({ ...defaultConfig, storeName: 'resources' });
export const useResourcesStorage = () => useMemo(instantiateResourceStorage, []);

interface IFileData {
  name: string;
  type: string;
  data: ArrayBuffer;
  dataUrl: string;
  hash: string;
}

export const saveFile = async (storage: LocalForage, { name, type, data }: Omit<IFileData, 'hash'>) => {
  const hash = await digestSHA512(data);
  await storage.setItem(hash, { name, type, data, hash });
  return hash;
};

export const loadFile = async (storage: LocalForage, name: string) => (await storage.getItem(name)) as IFileData | undefined;
