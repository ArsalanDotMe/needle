const Lab = require('lab')
const Code = require('code')
const expect = Code.expect

const lab = exports.lab = Lab.script()

const utils = require('../../src/services/utils')()

lab.experiment('subdomain tests', () => {
  lab.test('gets valid subdomain', () => {
    const subdomain = '09a3d7b4'
    const domain = `${subdomain}.google.com`
    const testSD = utils.getSubDomain(domain)
    expect(testSD).to.equal(subdomain)
  })
})
