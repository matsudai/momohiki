import { rest, setupWorker as setupMsw } from 'msw';

const handlers = [
  rest.get('/mocks/xxx', (req, res, ctx) => {
    return res(ctx.status(200), ctx.body('API response.'));
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
