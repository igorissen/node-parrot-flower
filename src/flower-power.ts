import { Device } from 'node-ble';

export class FlowerPower {
  private readonly _device: Device;

  constructor(device: Device) {
    this._device = device;
  }

  get device(): Device {
    return this._device;
  }
}
