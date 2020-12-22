import { FlowerPower } from '../src/flower-power';
import { ParrotFlower } from '../src/parrot-flower';

let parrotFlower: ParrotFlower;
let devices: FlowerPower[];

beforeAll(async () => {
  parrotFlower = new ParrotFlower();
  await parrotFlower.startDiscovery();
  devices = await parrotFlower.getParrotDevices();
});

afterAll(async () => {
  await parrotFlower.stopDiscovery();
  parrotFlower.close();
});

test('Find discoverable Parrot bluetooth devices', async () => {
  expect(devices.length).toBeGreaterThanOrEqual(1);
});

test('Get parrot device friendly name', async () => {
  const device = devices[0];
  await device.connect();
  const name = await device.friendlyName();
  expect(name.length).toBeGreaterThanOrEqual(1);
});
