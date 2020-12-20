import { Adapter, createBluetooth, Device } from 'node-ble';

const { bluetooth, destroy } = createBluetooth();
let adapter: Adapter;

export class ParrotFlower {
  public static async startDiscovery(): Promise<void> {
    if (!adapter) {
      adapter = await bluetooth.defaultAdapter();
    }

    if (await adapter.isDiscovering()) {
      return;
    }

    return await adapter.startDiscovery();
  }

  public static async stopDiscovery(): Promise<void> {
    if (!adapter) {
      return;
    }

    if (!(await adapter.isDiscovering())) {
      return;
    }

    return adapter.stopDiscovery();
  }

  public static devices(uids: string[] = [], retry = 5, timeout = 1000) {
    let counter = 0;
    let timer;

    timer = setInterval(async () => {
      counter++;

      if (!(counter < retry)) {
        clearInterval(timer);
        timer = null;
      }

      let devices: string[] = await adapter.devices();

      if (uids.length) {
        devices = devices.filter((deviceUid) => {
          return uids.some((uid) => uid === deviceUid);
        });
      }

      const d: Device[] = await Promise.all(
        devices.map((device) => {
          return adapter.waitDevice(device);
        })
      );
    }, timeout);
  }
}
