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

  it('press "other phonenumber",navigate to select phonenumber page', async () => {
    page = await miniProgram.reLaunch('/pages/user/SelectPhoneNumber/index');
    await page.setData({
      showLoginModal: 'true'
    })
    await page.waitFor(5000)
    const element = await page.$('.other');
    await element.tap();
    await page.waitFor(1000)
    await miniProgram.screenshot({
      path: '/Users/anna//test/snapshot/otherphonenumber.png'
    });
    expect((await miniProgram.currentPage()).path).toBe('pages/user/LoginWithPhone/index')
  },10000)

  it('press wechat authorize,show wechat dialog', async () => {
    page = await miniProgram.reLaunch('/pages/user/SelectPhoneNumber/index');
    await page.waitFor(5000)
    const element = await page.$('button');
    await element.tap();
    await page.waitFor(1000)
    await miniProgram.screenshot({
      path: '/Users/anna//test/snapshot/LoginByWechat.png'
    });
    // expect(await page.data('showLoginModal')).toBe(true)
  },10000)

  it('wechat authorize--press "refuse",show login fail', async () => {
    const AccountErrorCode  = {
      PHONE_NUMBER_LINKED: 0,
      WECHAT_LINKED: 1,
      DEFAULT: 2,
      SESSION_EXPIRED: 3,
      LOGIN_FAILED: 4,
    }
    const AccountError = {
      code: AccountErrorCode.LOGIN_FAILED,
    }

    page = await miniProgram.reLaunch('/pages/user/SelectPhoneNumber/index');
    await page.waitFor(5000)
    const element = await page.$('button');
    await element.tap();
    await page.setData({
      AccountError: AccountError.code
    })
    if(AccountError.code === 4){
      await page.setData({
        showToast: {
          title: '登陆失败'
        }
      })
    } else {
        await page.setData({
          showToast: {
            title: '会话过期'
          }
        })
      }
    await page.waitFor(1000)
    await miniProgram.screenshot({
      path: '/Users/anna//test/snapshot/SelectPhoneNumberloginfailed.png'
    });
    expect(await page.data('showToast.title')).toBe('登陆失败')
  },10000)

  it('wechat authorize--press "refuse",let "AccountError.code" !== 4,then show session expired', async () => {
    const AccountErrorCode  = {
      PHONE_NUMBER_LINKED: 0,
      WECHAT_LINKED: 1,
      DEFAULT: 2,
      SESSION_EXPIRED: 3,
      LOGIN_FAILED: 4,
    }
    const AccountError = {
      code: AccountErrorCode.LOGIN_FAILED,
    }

    page = await miniProgram.reLaunch('/pages/user/SelectPhoneNumber/index');
    await page.waitFor(5000)
    const element = await page.$('button');
    await element.tap();
    await page.setData({
      AccountError: AccountError.code
    })
    if(AccountError.code !== 4){
      await page.setData({
        showToast: {
          title: '登陆失败'
        }
      })
    } else {
        await page.setData({
          showToast: {
            title: '会话过期'
          }
        })
      }
    await page.waitFor(1000)
    await miniProgram.screenshot({
      path: '/Users/anna//test/snapshot/SelectPhoneNumber-sessonexpired.png'
    });
    expect(await page.data('showToast.title')).toBe('会话过期')
  },10000)

  it('wechat authorize--press "allow",login successfully,navigate back to home page', async () => {
    page = await miniProgram.reLaunch('/pages/main/Home/index');
    await page.setData({
      showLoginModal: 'true'
    })
    await page.waitFor(5000)
    const elementb = await page.$('button');
    await elementb.tap();
    await page.waitFor(1000)
    const cpage = await miniProgram.currentPage()
    const elementa = await cpage.$('button');
    await elementa.tap();
    await miniProgram.evaluate(() => {
      getApp().globalData.store.userStore.login.loggedIn = true;
    })
    await page.setData({
      showToast: {
        title: '登陆中...'
      }
    })
    await page.waitFor(10000)
    await miniProgram.screenshot({
      path: '/Users/anna/test/snapshot/SelectPhoneNumbersuccess.png'
    });
    expect((await miniProgram.currentPage()).path).toBe('pages/main/Home/index')
  },20000)

})