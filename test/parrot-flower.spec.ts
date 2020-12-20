import { ParrotFlower } from '../src/parrot-flower';

beforeEach(async () => {
  await ParrotFlower.startDiscovery();
});

afterEach(async () => {
  await ParrotFlower.stopDiscovery();
  ParrotFlower.close();
});

test('Find discoverable bluetooth devices', async () => {
  const devices = await ParrotFlower.findDevices();
  expect(devices.length).toBeGreaterThanOrEqual(1);
});
