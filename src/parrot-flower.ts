import { Adapter, createBluetooth } from 'node-ble';
import { FlowerPower } from './flower-power';

const { bluetooth, destroy } = createBluetooth();
let adapter: Adapter | undefined;
let parrotDeviceName: string | undefined;

export class ParrotFlower {
  /**
   *
   */
  public static setParrotDeviceName(): void {
    parrotDeviceName = 'flower power';
  }

  /**
   *
   */
  public static async startDiscovery(): Promise<void> {
    if (!adapter) {
      adapter = await bluetooth.defaultAdapter();
    }

    if (await adapter.isDiscovering()) {
      return;
    }

    return await adapter.startDiscovery();
  }

  /**
   *
   */
  public static async stopDiscovery(): Promise<void> {
    if (!adapter) {
      return;
    }

    if (!(await adapter.isDiscovering())) {
      return;
    }

    return adapter.stopDiscovery();
  }

  /**
   *
   */
  public static close(): void {
    destroy();
    adapter = undefined;
    parrotDeviceName = undefined;
  }

  /**
   *
   */
  public static async getParrotDevices(): Promise<FlowerPower[]> {
    const uuids = await (adapter as Adapter).devices();
    let devices = await Promise.all(
      uuids.map((uuid) => {
        return (adapter as Adapter).waitDevice(uuid);
      })
    );
    return devices
      .filter(async (device) => {
        try {
          return (await device.getName()).toLowerCase().includes(parrotDeviceName as string);
        } catch (ex) {
          return false;
        }
      })
      .map((device) => new FlowerPower(device));
  }
}
