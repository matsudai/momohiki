import { loadFile } from '../lib/persist';
import { rest, setupWorker as setupMsw } from 'msw';

const handlers = [
  rest.get('/mocks/sample.png', async (req, res, ctx) => {
    const file = await loadFile();
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
