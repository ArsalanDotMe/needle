module.exports = function utilsService () {
  return {
    getSubDomain (hostname) {
      const subdomain = /^(.+)\.\w+\..+$/.exec(hostname)[1]
      return subdomain
    },
  }
}
