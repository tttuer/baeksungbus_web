export const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}. ${month}. ${day}.`
}

export const formatPrice = (price) => {
  if (typeof price !== 'number') {
    return ''
  }
  return price.toLocaleString('ko-KR')
}
