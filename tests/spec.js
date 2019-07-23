import { Application } from 'spectron';
import electronPath from 'electron';
import path from 'path';

describe('Application launch', () => {
    let app;
    jest.setTimeout(60000);

    beforeEach(async () => {
        app = new Application({
            path: electronPath,
            args: [path.join(__dirname, '..')],
            startTimeout: 10000,
            waitTimeout: 10000,
            env: {
                ELECTRON_IS_DEV: '0'
            }
        });
        return await app.start();
    });

    afterEach(async () => {
        if (app && app.isRunning()) {
            return await app.stop();
        }
    });

    test('shows an initial window without devtools', async () => {
        expect(await app.client.getWindowCount()).toBe(1);
    });

    test('shows correct application title', async () => {
        expect(await app.client.getTitle()).toBe('Budget Buddy');
    });
});
