import { Device, GattServer, GattService } from 'node-ble';
import { FLOWER_POWER_CALIBRATION_SERVICE_UUID, NAME_CHARACTERISTIC_UUID } from './constants';

type ConvertOptions = {
  type: 'string';
  buffer: Buffer;
  encoding?: 'utf8';
};

export class FlowerPower {
  private readonly _device: Device;
  private _gattServer: GattServer;
  private readonly _services: Map<string, GattService> = new Map<string, GattService>();

  constructor(device: Device) {
    this._device = device;
  }

  public async connect(): Promise<void> {
    if (await this._device.isConnected()) {
      return;
    }

    await this._device.connect();
    this._gattServer = await this._device.gatt();
    return;
  }

  public async disconnect(): Promise<void> {
    if (!(await this._device.isConnected())) {
      return;
    }

    return this._device.disconnect();
  }

  public async friendlyName(): Promise<string> {
    if (!this._services.has(FLOWER_POWER_CALIBRATION_SERVICE_UUID)) {
      this._services.set(
        FLOWER_POWER_CALIBRATION_SERVICE_UUID,
        await this._gattServer.getPrimaryService(FLOWER_POWER_CALIBRATION_SERVICE_UUID)
      );
    }

    const characteristic = await (this._services.get(
      FLOWER_POWER_CALIBRATION_SERVICE_UUID
    ) as GattService).getCharacteristic(NAME_CHARACTERISTIC_UUID);

    return this._convertBufferTo({ type: 'string', encoding: 'utf8', buffer: await characteristic.readValue() });
  }

  private _convertBufferTo({ type, buffer, encoding }: ConvertOptions): string {
    switch (type) {
      case 'string':
        return buffer.toString(encoding);
    }
  }
}
