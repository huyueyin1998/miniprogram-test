const automator = require('miniprogram-automator')

describe('testyourangles', () => {
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

  it('TestYourAngles Welcome', async () => {
    page = await miniProgram.reLaunch('/pages/main/Home/index');
    await page.setData({
      isTbConnected: 'true'
    })
    await page.waitFor(1000)
    // const element = await page.$("[url$='/pages/activity/TestYourAnglesWelcome/index']");
    const activities = await page.$$('.page container .panel-wrapper .activities-container .item')
    const activity = await activities[2]
    await activity.tap();
    await page.waitFor(1000)
    await miniProgram.screenshot({
      path: '/Users/anna//test/snapshot/TestYourAngles.png'
    });
    expect((await miniProgram.currentPage()).path).toBe('pages/activity/TestYourAnglesWelcome/index')
  },10000)

  it('TestYourAngles Start',async () => {
    page = await miniProgram.reLaunch('/pages/activity/TestYourAnglesWelcome/index');
    await page.setData({
      isTbConnected: 'true'
    })
    await page.waitFor(1000)
    const buttons = await page.$$('kl-button')
    expect(buttons.length).toBe(2)
    const startActivity = await buttons[0]
    // const start = await page.$('kl-button');
    // console.log(start.tagName, '===');
    await startActivity.tap();
    await page.waitFor(1000)
    expect((await miniProgram.currentPage()).path).toBe('pages/activity/TestYourAngles/index')
  },10000)

  it('TestYourAngles cancel',async () => {
    page = await miniProgram.reLaunch('/pages/activity/TestYourAnglesWelcome/index');
    await page.setData({
      isTbConnected: 'true'
    })
    await page.waitFor(1000)
    const buttons = await page.$$('kl-button')
    expect(buttons.length).toBe(2)
    const startActivity = await buttons[1]
    // const start = await page.$('kl-button');
    // console.log(start.tagName, '===');
    await startActivity.tap();
    await page.waitFor(1000)
    expect((await miniProgram.currentPage()).path).toBe('pages/main/Home/index')
  },10000)

})