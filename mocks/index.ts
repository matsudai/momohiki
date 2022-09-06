import { instantiateResourceStorage, loadFile } from '../lib/persistent-storage';
import { rest, setupWorker as setupMsw } from 'msw';

const handlers = [
  rest.get('/sw/resources/:id', async (req, res, ctx) => {
    const storage = instantiateResourceStorage();
    const { id } = req.params;
    const file = await loadFile(storage, id.toString());
    if (file) {
      return res(ctx.status(200), ctx.body(new Blob([file.data], { type: file.type })));
    } else {
      return res(ctx.status(404));
    }
  })
];

interface IWindow {
  mswRegistrationStatus?: 'loading' | 'ready';
}

export const serverState = (window: any) => (window as IWindow).mswRegistrationStatus;

export const setupWorker = async (window: any) => {
  (window as IWindow).mswRegistrationStatus = 'loading';

  const worker = await setupMsw(...handlers).start({
    // Supress errors when no mocked pathes are accessed.
    onUnhandledRequest: 'bypass'
  });

  (window as IWindow).mswRegistrationStatus = 'ready';

  return worker;
};
