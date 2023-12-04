export type EmailTemplateUrls = '/emailTemplates/sendPin.html' | '/emailTemplates/stockAlertSubscriptionEmailTemplate.html'
export async function getTemplate(url: EmailTemplateUrls) {
  const resp = await fetch(url)
  const html = await resp.text()
  let result = html.replaceAll('  ', '')
  result = result.replaceAll('\r\n', '')
  return result
}

export async function formatEmail(templateUrl: EmailTemplateUrls, replaceValues: Map<string, string>) {
  const template = await getTemplate(templateUrl)
  let result = template
  replaceValues.forEach((val, key) => {
    result = result.replace(`{${key}}`, val)
  })
  return result
}
