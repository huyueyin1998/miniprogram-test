const automator = require('miniprogram-automator')

describe('api', () => {
  let miniProgram
  let page

  beforeAll(async () => {
    miniProgram = await automator.launch({
      projectPath: '/Users/anna/webapp-monorepo/packages/apps/demo-colgate-brushing-miniprogram/dist'
    })
    // 直接更改全局变量
    await miniProgram.evaluate(() => {
      getApp().globalData.store.deviceStore.isBluetoothAvailable = true;
    })
    
  },30000)

  it('BLEon', async () => {
    page = await miniProgram.reLaunch('/pages/main/Home/index');
    await page.waitFor(500)
    const element = await page.$('.page container .temp');
    await element.tap();
    await page.waitFor(100)
    await miniProgram.screenshot({
      path: '/Users/anna/webapp-monorepo/packages/apps/demo-colgate-brushing-miniprogram/dist/test/snapshot/BLEon.png'
    });
    expect(await page.data('showTbModal')).toBe(true)
  })

  it('connect',async () => {
    page = await miniProgram.reLaunch('/pages/main/Home/index');
    await page.waitFor(500)
    const connect = await page.$('.page kl-dialog .tb-modal .content .confirm')
    await connect.tap()
    await page.waitFor(1000)
    await miniProgram.screenshot({
      path: '/Users/anna/webapp-monorepo/packages/apps/demo-colgate-brushing-miniprogram/dist/test/snapshot/connect.png'
    })
    expect((await miniProgram.currentPage()).path).toBe('pages/toothbrush/DeviceFinder/index')
  })
})