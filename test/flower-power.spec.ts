import { FlowerPower } from '../src/flower-power';
import { ParrotFlower } from '../src/parrot-flower';

let device: FlowerPower;

beforeEach(async () => {
  ParrotFlower.setParrotDeviceName('flower power');
  await ParrotFlower.startDiscovery();
});

afterEach(async () => {
  await device.disconnect();
  await ParrotFlower.stopDiscovery();
  ParrotFlower.close();
});

test('Get parrot device friendly name', async () => {
  const devices = await ParrotFlower.getParrotDevices();
  device = devices[0];
  await device.connect();
  const name = await device.friendlyName();
  expect(name.length).toBeGreaterThanOrEqual(1);
});
