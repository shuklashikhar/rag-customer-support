export const preprocessText = (text: string): string => {
  return text
    .replace(/\r\n/g, '\n')           // normalize line endings
    .replace(/\t/g, ' ')              // tabs to spaces
    .replace(/\n{3,}/g, '\n\n')       // max 2 consecutive newlines
    .replace(/[ ]{2,}/g, ' ')         // multiple spaces to one
    .replace(/[^\x20-\x7E\n]/g, '')   // remove non-printable chars
    .trim()
}