import mammoth from 'mammoth'

export interface ParsedResume {
  text: string
  wordCount: number
  fileName: string
  fileType: 'pdf' | 'docx'
}

export async function parseResume(buffer: Buffer, fileName: string): Promise<ParsedResume> {
  const ext = fileName.toLowerCase().endsWith('.pdf') ? 'pdf' : 'docx'
  let text = ''

  if (ext === 'pdf') {
    // Import the internal render module directly to avoid pdf-parse's
    // test file lookup bug (ENOENT: ./test/data/05-versions-space.pdf)
    const pdfParse = require('pdf-parse/lib/pdf-parse.js')
    const result = await pdfParse(buffer)
    text = result.text
  } else {
    const result = await mammoth.extractRawText({ buffer })
    text = result.value
  }

  // Sanitize — remove null bytes, excessive whitespace
  text = text.replace(/\0/g, '').replace(/\n{3,}/g, '\n\n').trim()

  return {
    text,
    wordCount: text.split(/\s+/).filter(Boolean).length,
    fileName,
    fileType: ext,
  }
}
