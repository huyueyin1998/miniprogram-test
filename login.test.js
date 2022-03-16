const automator = require('miniprogram-automator')

describe('login', () => {
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

  it('no registered,BLE on,press "connect" to show LoginModal', async () => {
    page = await miniProgram.reLaunch('/pages/main/Home/index');
    await page.waitFor(5000)
    const element = await page.$('.page container .panel-wrapper .activities-container .item');
    await element.tap();
    await page.waitFor(1000)
    await miniProgram.screenshot({
      path: '/Users/anna//test/snapshot/LoginDialog.png'
    });
    expect(await page.data('showLoginModal')).toBe(true)
  },10000)

  it('show login modal,then press "confirm" navigate to select phonenumber', async () => {
    page = await miniProgram.reLaunch('/pages/main/Home/index');
    await page.setData({
      showLoginModal: 'true'
    })
    await page.waitFor(5000)
    const element = await page.$('button');
    await element.tap();
    await page.waitFor(1000)
    await miniProgram.screenshot({
      path: '/Users/anna//test/snapshot/SelectPhoneNumber.png'
    });
    expect((await miniProgram.currentPage()).path).toBe('pages/user/SelectPhoneNumber/index')
  },10000)


  it('show login modal,then press "cancel" back to home page,nothing changed', async () => {
    page = await miniProgram.reLaunch('/pages/main/Home/index');
    await page.setData({
      showLoginModal: 'true'
    })
    await page.waitFor(5000)
    const element = await page.$('kl-dialog view view view');
    // console.log(await element.tagName)
    await element.tap();
    await page.waitFor(1000)
    await miniProgram.screenshot({
      path: '/Users/anna//test/snapshot/LoginCancel.png'
    });
    expect(await page.data('showLoginModal')).toBe(false)
  },10000)

})