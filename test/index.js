/* eslint-env node, mocha */
const mocha = require('mocha');
const assert = require('assert');
const path = require('path');
const { Application } = require('spectron');

// construct paths for tests to reference
const baseDirectory = path.resolve(__dirname, '..');
const electronBinary = path.resolve(
  baseDirectory,
  'node_modules',
  '.bin',
  'electron'
);

describe('Application launch', function () {
  // Give the app a few seconds to launch
  this.timeout(10000);

  const app = new Application({
    path: electronBinary,
    args: [baseDirectory],
  });

  before(() => app.start());
  after(() => app.stop());

  it('Displays window on app start', async () => {
    await app.client.waitUntilWindowLoaded();
    const windowCount = await app.client.getWindowCount();
    assert.equal(windowCount, 1);
  });

  it('Does not open dev tools', async () => {
    const devToolsAreOpen = await app.client
      .waitUntilWindowLoaded()
      .browserWindow.isDevToolsOpened();
    return assert.equal(devToolsAreOpen, false);
  });

  it('Displays the proper title', async () => {
    const title = await app.client.getTitle();
    assert.equal(title, 'Plush');
  });
});

describe('Basic functionality', function () {
  // Give the app a few seconds to launch
  this.timeout(10000);

  const app = new Application({
    path: electronBinary,
    args: [baseDirectory],
  });

  before(() => app.start());
  after(() => app.stop());

  it('Displays codemirror component when URI is submitted', async () => {
    await app.client.click('#submit-uri');
    const codemirrorExists = await app.client.waitForExist(
      '.react-codemirror2'
    );
    assert.equal(codemirrorExists, true);
  });
});
