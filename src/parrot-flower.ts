import { Adapter, createBluetooth, Device } from 'node-ble';

const { bluetooth, destroy } = createBluetooth();
let adapter: Adapter | undefined;

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

  public static findDevices(uids: string[] = [], retry = 5, timeout = 1000): Promise<Device[]> {
    return new Promise((resolve) => {
      let counter = 0;
      let timer: number | undefined;

      // @ts-ignore
      timer = setInterval(async () => {
        counter++;

        if (!(counter < retry)) {
          clearInterval(timer);
          timer = undefined;
        }

        let devicesDiscovered: string[] = await (adapter as Adapter).devices();

        if (uids.length) {
          devicesDiscovered = devicesDiscovered.filter((deviceUid) => {
            return uids.some((uid) => uid === deviceUid);
          });
        }

        const devices: Device[] = await Promise.all(
          devicesDiscovered.map((deviceUid) => {
            return (adapter as Adapter).waitDevice(deviceUid);
          })
        );

        resolve(devices);
      }, timeout);
    });
  }

  public static close(): void {
    destroy();
    adapter = undefined;
  }
}
