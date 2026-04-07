import { NextRequest, NextResponse } from 'next/server'
import vm from 'vm'

export const dynamic    = 'force-dynamic'
export const maxDuration = 10

interface TestCase { input: string; expected: string }

interface RunResult {
  index:    number
  input:    string
  expected: string
  actual:   string
  passed:   boolean
  hidden:   boolean
  error?:   string
}

// Safely serialize a value to a comparable string
function serialize(val: unknown): string {
  if (val === null)      return 'null'
  if (val === undefined) return 'undefined'
  if (typeof val === 'string') return val
  return JSON.stringify(val)
}

// Normalize for comparison — trim whitespace, lowercase booleans
function normalize(s: string): string {
  return s.trim().replace(/\s+/g, ' ')
}

function runJS(code: string, testCases: TestCase[]): RunResult[] {
  const results: RunResult[] = []

  for (let i = 0; i < testCases.length; i++) {
    const tc     = testCases[i]
    const hidden = i >= 2

    try {
      // Build a sandboxed context
      const sandbox: Record<string, unknown> = { __result: undefined, console: { log: () => {} } }
      const ctx = vm.createContext(sandbox)

      // Wrap user code + call with parsed input
      // We eval the function definition then call it with the test input
      const fullCode = `
        ${code}
        
        // Auto-detect and call the exported function
        ;(function() {
          const fns = Object.keys(this).filter(k => typeof this[k] === 'function' && k !== 'console')
          if (fns.length === 0) { __result = undefined; return; }
          const fn = this[fns[fns.length - 1]]
          try {
            const args = [${tc.input}]
            __result = fn(...args)
          } catch(e) {
            __result = '__ERROR__:' + e.message
          }
        }).call(this)
      `

      vm.runInContext(fullCode, ctx, { timeout: 3000 })

      const raw    = sandbox.__result
      const actual = serialize(raw)

      if (typeof actual === 'string' && actual.startsWith('__ERROR__:')) {
        results.push({ index: i, input: tc.input, expected: tc.expected, actual: '', passed: false, hidden, error: actual.replace('__ERROR__:', '') })
      } else {
        const passed = normalize(actual) === normalize(tc.expected)
        results.push({ index: i, input: tc.input, expected: tc.expected, actual, passed, hidden })
      }
    } catch (err: any) {
      const msg = err.message ?? 'Runtime error'
      const isTimeout = msg.includes('timed out') || msg.includes('Script execution')
      results.push({
        index: i, input: tc.input, expected: tc.expected, actual: '',
        passed: false, hidden,
        error: isTimeout ? 'Time Limit Exceeded (3s)' : msg,
      })
    }
  }

  return results
}

export async function POST(req: NextRequest) {
  try {
    const { code, language, testCases } = await req.json() as {
      code: string
      language: string
      testCases: TestCase[]
    }

    if (!code?.trim())       return NextResponse.json({ error: 'No code provided' }, { status: 400 })
    if (!testCases?.length)  return NextResponse.json({ error: 'No test cases' },    { status: 400 })

    // Only JS execution is supported server-side without a sandbox container
    // For other languages, return a "not supported" result that still shows the UI
    if (language !== 'javascript' && language !== 'typescript') {
      return NextResponse.json({
        success: true,
        results: testCases.map((tc, i) => ({
          index: i, input: tc.input, expected: tc.expected,
          actual: '', passed: false, hidden: i >= 2,
          error: `Live execution for ${language} is not supported. Submit to save your attempt.`,
        })),
        unsupported: true,
      })
    }

    const results = runJS(code, testCases)
    const passed  = results.filter(r => r.passed).length

    return NextResponse.json({ success: true, results, passed, total: results.length })
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Execution failed' }, { status: 500 })
  }
}
