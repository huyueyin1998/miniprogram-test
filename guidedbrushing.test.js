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

  it('guidedbrushing in', async () => {
    page = await miniProgram.reLaunch('/pages/main/Home/index');
    await page.setData({
      isTbConnected: 'true'
    })
    await page.waitFor(5000)
    const element = await page.$('.page container .panel-wrapper .activities-container .item');
    await element.tap();
    await page.waitFor(1000)
    await miniProgram.screenshot({
      path: '/Users/anna//test/snapshot/guidedbrushing.png'
    });
    expect((await miniProgram.currentPage()).path).toBe('pages/activity/GuidedBrushing/index')
  },10000)
})