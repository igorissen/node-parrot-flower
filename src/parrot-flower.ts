import { Adapter, createBluetooth } from 'node-ble';
import { FlowerPower } from './flower-power';

const { bluetooth, destroy } = createBluetooth();

export class ParrotFlower {
  private _deviceName: string;
  private _adapter: Adapter;

  constructor(deviceName = 'flower power') {
    this._deviceName = deviceName;
  }

  public async startDiscovery(): Promise<void> {
    if (!this._adapter) {
      this._adapter = await bluetooth.defaultAdapter();
    }

    if (await this._adapter.isDiscovering()) {
      return;
    }

    return await this._adapter.startDiscovery();
  }

  public async stopDiscovery(): Promise<void> {
    if (!this._adapter) {
      return;
    }

    if (!(await this._adapter.isDiscovering())) {
      return;
    }

    return this._adapter.stopDiscovery();
  }

  public close(): void {
    destroy();
  }

  public async getParrotDevices(): Promise<FlowerPower[]> {
    const uuids = await this._adapter.devices();
    let devices = await Promise.all(
      uuids.map((uuid) => {
        return this._adapter.waitDevice(uuid);
      })
    );
    return devices
      .filter(async (device) => {
        try {
          return (await device.getName()).toLowerCase().includes(this._deviceName);
        } catch (ex) {
          return false;
        }
      })
      .map((device) => new FlowerPower(device));
  }
}
