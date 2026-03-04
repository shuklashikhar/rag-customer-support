export const preprocessText = (text: string): string => {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\t/g, ' ')
    // Add line break before numbered sections like "1." "2." etc
    .replace(/(\d+\.\s+[A-Z\s]+)/g, '\n\n$1\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ ]{2,}/g, ' ')
    .trim()
}