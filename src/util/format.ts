export const createBalanceFormatter = ({
                                         ...options
                                       }: Omit< Parameters<typeof Intl.NumberFormat>[1],
  'style' | 'currency'
> = {}) => {
  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 6,
    ...options,
    style: 'currency',
    currency: 'USD'
  })

  return (
    value: string | number,
    { includeCommaSeparation = false, applyNumberConversion = true } = {}
  ) => {
    const formattedValue = formatter.format(value as number).replace(/\$/g, '')

    if (includeCommaSeparation) {
      return formattedValue
    }

    const rawValue = formattedValue.replace(/\,/g, '')
    if (applyNumberConversion) {
      return Number(rawValue)
    }

    return rawValue
  }
}

export const formatTokenBalance = createBalanceFormatter()
