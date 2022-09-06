import { atom, useAtom } from 'jotai';
import { ReactNode, SetStateAction, useCallback } from 'react';
import { HastRoot, MdastRoot } from 'remark-rehype/lib';
import { formatter } from './markdown';

interface IFileData {
  name: string;
  type: string;
  data: ArrayBuffer;
  dataUrl: string;
  hash: string;
}

export interface IEditorState {
  text?: string;
  mdast?: MdastRoot;
  hast?: HastRoot;
  content?: ReactNode;
  resources?: IFileData[];
  resourceIndices?: { [key: string]: number };
}

export const editorState = atom<IEditorState>({});

export const editorResourcesState = atom(
  null,
  (get, set, data: IEditorState['resources'] /* SetStateAction<IEditorState['resources']> */) => {
    console.log(get(editorState));
    set(editorState, { ...get(editorState), resources: data });
    // set(editorState, () => {
    //   const { resources: _resources, ...values } = get(editorState);
    //   const resources = typeof data === 'function' ? data(_resources) : data;
    //   const resourceIndices = resources?.reduce<{ [key: string]: number }>((s, v, i) => ({ ...s, [v.hash]: i }), {});
    //   console.log({ _resources, ...values });
    //   console.log(resources);
    //   console.log(resourceIndices);

    //   return { ...values, resources, resourceIndices };
    // });
  }
);

export const editorTextState = atom<IEditorState['text'], IEditorState['text']>(
  (get) => get(editorState).text,
  async (_, set, text) => {
    const mdast = formatter.parse(text);
    const hast = await formatter.run(mdast);
    const content = formatter.stringify(hast);
    set(editorState, { text, mdast, hast, content });
  }
);

export const useEditorState = () => useAtom(editorState);
export const useEditorTextState = () => useAtom(editorTextState);
export const useEditorResourcesState = () => useAtom(editorResourcesState);
export const useBundleResources = () => {
  const [state] = useAtom(editorState);

  return useCallback(async () => {
    const mdast = formatter.parse(
      state.text?.replaceAll(/!\[\]\(.\/sw\/resources\/([0-9a-z]{128})\)/g, (_, id) => {
        const file = state.resourceIndices?.[id] ? state.resources?.[state.resourceIndices[id]] : null;
        if (file) {
          return `![](${file.dataUrl})`;
        } else {
          return '![]()';
        }
      })
    );
    const hast = await formatter.run(mdast);
    const content = formatter.stringify(hast);
    return content;
  }, [state]);
};
