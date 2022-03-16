const automator = require('miniprogram-automator')

describe('connectTb', () => {
  let miniProgram
  let page

  beforeAll(async () => {
    miniProgram = await automator.launch({
      projectPath: '/Users/anna/webapp-monorepo/packages/apps/demo-colgate-brushing-miniprogram/dist'
    })
    // 直接更改全局变量
    // await miniProgram.remote()      真机自动化
    await miniProgram.evaluate(() => {
      getApp().globalData.store.deviceStore.isBluetoothAvailable = true;
    })
    
  },30000)

  // it('cannot find device,show help',async () => {
  //   await miniProgram.evaluate(() => {
  //     getApp().globalData.store.deviceStore.searchInitiated = true;
  //     getApp().globalData.store.deviceStore.isDiscovering = true;
  //   })
  //   page = await miniProgram.reLaunch('/pages/toothbrush/DeviceFinder/index');
  //   await page.waitFor(30000)
  //   await miniProgram.screenshot({
  //     path: '/Users/anna/webapp-monorepo/packages/apps/demo-colgate-brushing-miniprogram/dist/test/snapshot/connectTb.png'
  //   })
  //   expect(await page.data('showHelp')).toBe(true);
  // },50000)

  it('found Tbdevice,jump to device found',async () => {
    // mock
    await miniProgram.evaluate(() => {
      const BleDataView = function(n) {
        return {
          toBuffer: () => n
        }
      };

      const BleGattCharacteristicProperties = {
        broadcast: true,
        write: true,
        writeWithoutResponse: true,
        read: true,
        notify: true,
        indicate: true,
        authenticatedSignedWrites: true,
        reliableWrite: true,
        writableAuxiliaries: true,
      }

      const BlePeripheralDevice = {
        id: "C0:4B:94:C6:66:6B",
        watchingAdvertisements: true,
      }
      const BleRemoteGattService = {
        device: BlePeripheralDevice,
        uuid: "<Undefined>",
        isPrimary: true,
      }

      const BleRemoteGattCharacteristic = {
        uuid: "<Undefined>",
        service: BleRemoteGattService,
        properties: BleGattCharacteristicProperties,
        value: BleDataView,
      };
      const deviceService = {
        uuid: "<Undefined>",
        characteristics: BleRemoteGattCharacteristic,
      };
      const deviceShadow = {
        deviceId : "C0:4B:94:C6:66:6B",
        isConnected : false,
        isActivated : true,
        services: deviceService,
        deviceModelId : "08",
        deviceName : "Luna’s G2"
      };


      // const device = {
      //   name: 'My Connect_E2',
      //   deviceId: 'C0:4B:4B:C3:D0:06',
      //   isConnected : false,
      //   isActivated : true,
      //   advertisData: new ArrayBuffer(8),
      //   RSSI: 13,
      //   deviceModelId : "08",
      //   advertisServiceUUIDs: ['abcd-e2'],
      //   services: {},
      //   localName: ''
      // };




      getApp().globalData.store.deviceStore.searchInitiated = true;
      getApp().globalData.store.deviceStore.isDiscovering = true;
      getApp().globalData.store.deviceStore.searchResults = [deviceShadow];
    });

    page = await miniProgram.reLaunch('/pages/toothbrush/DeviceFinder/index');
    await page.waitFor(1000)
    expect((await miniProgram.currentPage()).path).toBe('pages/toothbrush/DeviceFound/index')
    console.log('===============', searchResults)
  })
})