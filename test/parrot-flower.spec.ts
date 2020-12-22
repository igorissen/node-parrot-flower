import { ParrotFlower } from '../src/parrot-flower';

let parrotFlower: ParrotFlower;

beforeAll(() => {
  parrotFlower = new ParrotFlower();
});

beforeEach(async () => {
  await parrotFlower.startDiscovery();
});

afterEach(async () => {
  await parrotFlower.stopDiscovery();
});

afterAll(() => {
  parrotFlower.close();
});

test('Find discoverable Parrot bluetooth devices', async () => {
  const devices = await parrotFlower.getParrotDevices();
  expect(devices.length).toBeGreaterThanOrEqual(1);
});

test('Get parrot device friendly name', async () => {
  const devices = await parrotFlower.getParrotDevices();
  const device = devices[0];
  await device.connect();
  const name = await device.friendlyName();
  expect(name.length).toBeGreaterThanOrEqual(1);
});
