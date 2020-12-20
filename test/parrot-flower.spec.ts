import { ParrotFlower } from '../src/parrot-flower';

beforeEach(async () => {
  ParrotFlower.setParrotDeviceName('flower power');
  await ParrotFlower.startDiscovery();
});

afterEach(async () => {
  await ParrotFlower.stopDiscovery();
  ParrotFlower.close();
});

test('Find discoverable Parrot bluetooth devices', async () => {
  const devices = await ParrotFlower.getParrotDevices();
  expect(devices.length).toBeGreaterThanOrEqual(1);
});
