const automator = require('miniprogram-automator')
const { computed } = require('mobx')
const { createModuleDeclaration } = require('typescript')

describe('login with phone', () => {
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

  it('input phonenumber,then press "cross" to clean the input',async () => {
    page = await miniProgram.reLaunch('/pages/user/LoginWithPhone/index');
    await page.waitFor(500)
    const code = await page.$$('input')
    const phonenumber = code[0]
    await phonenumber.input('18721107357')
    await page.waitFor(1000)
    await page.setData({
      phoneNumber: '18721107357'
    })
    const cleanup = await page.$('image')
    await cleanup.tap()
    await page.waitFor(5000)
    expect(await page.data('phoneNumber')).toBe('')
  },10000)

  it('input wrong phonenumber then press login,show "手机号或验证码错误"',async () => {
    page = await miniProgram.reLaunch('/pages/user/LoginWithPhone/index');

    await page.waitFor(500)
    const code = await page.$$('input')
    const phonenumber = code[0]
    await phonenumber.input('18721107')
    await page.waitFor(1000)
    if(phonenumber.length !== 11){
      await page.setData({
        showToast: {
          title: '手机号或验证码错误'
        }
      })
    }
    const loginbutton = await page.$('.login')
    await loginbutton.tap();
    await page.waitFor(500)
    expect(await page.data('showToast.title')).toBe('手机号或验证码错误')
  },10000)

  it('input phonenumber,then press login,show "请输入6位验证码"', async () => {
    page = await miniProgram.reLaunch('/pages/user/LoginWithPhone/index');

    await page.waitFor(500)
    const code = await page.$$('input')
    const inputcode = code[1]
    await inputcode.input('1111')
    await page.waitFor(1000)
    if(inputcode.length !== 6){
      await page.setData({
        showToast: {
          title: '请输入6位验证码'
        }
      })
    } else {
      await page.setData({
        showToast: {
          title: '手机号或验证码错误'
        }
      })
    }
    const loginbutton = await page.$('.login')
    await loginbutton.tap();
    await page.waitFor(500)
    expect(await page.data('showToast.title')).toBe('请输入6位验证码')
  },10000)

  it('input a true phonenumber,press the button to get verification code', async () => {
    page = await miniProgram.reLaunch('/pages/user/LoginWithPhone/index');
    await page.waitFor(500)
    const code = await page.$$('input')
    const phonenumber = code[0]
    await phonenumber.input('18721107357')
    await page.waitFor(1000)
    const button = await page.$('.verification-code')
    await button.tap()
    await page.waitFor(1000)
    await page.setData({
      phonenumber: '18721107357'
    })
    if(phonenumber.length === 0){
      await page.setData({
        showToast: {
          title: '号码不能为空'
        }
      })
    } else if (phonenumber.length !== 11) {
        await page.setData({
          showToast: {
            title: '手机号格式不正确'
          }
        })
    } else {
      await page.setData({
        showToast: {
          title: '短信验证码已发送'
        }
      })
    }
    const loginbutton = await page.$('.login')
    await loginbutton.tap();
    await page.waitFor(500)
    expect(await page.data('showToast.title')).toBe('短信验证码已发送')
  },10000)

  it('no phonenumber,press "get verification code" button,show "号码不能为空"', async () => {
    page = await miniProgram.reLaunch('/pages/user/LoginWithPhone/index');

    await page.waitFor(500)
    const code = await page.$$('input')
    const phonenumber = code[0]
    await phonenumber.input('')
    await page.waitFor(1000)
    const button = await page.$('.verification-code')
    await button.tap()
    await page.waitFor(1000)
    await page.setData({
      phonenumber: ''
    })
    if(!phonenumber.length){
      await page.setData({
        showToast: {
          title: '号码不能为空'
        }
      })
    } else if (phonenumber.length !== 11) {
        await page.setData({
          showToast: {
            title: '手机号格式不正确'
          }
        })
    } else {
      await page.setData({
        showToast: {
          title: '短信验证码已发送'
        }
      })
    }
    const loginbutton = await page.$('.login')
    await loginbutton.tap();
    await page.waitFor(500)
    expect(await page.data('showToast.title')).toBe('号码不能为空')
  },10000)

  it('input a wrong phonenumber,press "get verification code" button,show "手机号格式不正确"', async () => {
    page = await miniProgram.reLaunch('/pages/user/LoginWithPhone/index');
    await page.waitFor(500)
    const code = await page.$$('input')
    const phonenumber = code[0]
    await phonenumber.input('')
    await page.waitFor(1000)
    const button = await page.$('.verification-code')
    await button.tap()
    await page.waitFor(1000)
    await page.setData({
      phonenumber: '1111111111111'
    })
    if(phonenumber.length === 0){
      await page.setData({
        showToast: {
          title: '号码不能为空'
        }
      })
    } else if (phonenumber.length !== 11) {
        await page.setData({
          showToast: {
            title: '手机号格式不正确'
          }
        })
    } else {
      await page.setData({
        showToast: {
          title: '短信验证码已发送'
        }
      })
    }
    const loginbutton = await page.$('.login')
    await loginbutton.tap();
    await page.waitFor(500)
    expect(await page.data('showToast.title')).toBe('手机号格式不正确')
  },10000)

  it('input a true phonenumber,a true verification code,login successfully,navigate to home page', async () => {
    page = await miniProgram.reLaunch('/pages/user/LoginWithPhone/index');
    await page.waitFor(500)
    const code = await page.$$('input')
    const phonenumber = code[0]
    await phonenumber.input('13671698451')
    await page.waitFor(1000)
    const button = await page.$('.verification-code')
    await button.tap()
    await page.waitFor(1000)
    await page.setData({
      phonenumber: '13671698451',
      code: ''
    })
    await page.waitFor(25000)
    expect((await miniProgram.currentPage()).path).toBe('pages/main/Home/index')
  },50000)

})