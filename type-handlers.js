// type-specific handlers for different loop types
// each type has its own UI and execution logic

const typeHandlers = {
  'loops-for-loop': {
    name: 'For Loop Visualizer',
    renderUI: renderForLoopUI,
    execute: executeForLoop,
    hasCustomUI: true
  }
}

// for loop specific code
function renderForLoopUI(containerId) {
  const container = document.getElementById(containerId)
  if (!container) return

  container.innerHTML = `
    <div class="loop-form-container">
      <div class="loop-form">
        <div class="form-group">
          <label>Variable Name:</label>
          <input type="text" id="for-var-name" placeholder="i" value="i" class="form-input">
        </div>
        <div class="form-group">
          <label>Initial Value:</label>
          <input type="number" id="for-init-value" placeholder="0" value="0" class="form-input">
        </div>
        <div class="form-group">
          <label>Condition:</label>
          <input type="text" id="for-condition" placeholder="i <= 5" value="i <= 5" class="form-input">
        </div>
        <div class="form-group">
          <label>Increment/Decrement:</label>
          <input type="text" id="for-increment" placeholder="i++" value="i++" class="form-input">
        </div>
        <div class="form-group">
          <label>User Code (optional):</label>
          <div class="code-editor-wrapper user-code-wrapper">
            <div class="line-numbers" id="for-user-code-lines"></div>
            <textarea id="for-user-code" placeholder="Add your code here..." class="form-textarea"></textarea>
          </div>
        </div>
        <button onclick="executeForLoopVisualization()" class="execute-btn">Execute & Visualize</button>
      </div>
      <div class="loop-trace-output"></div>
    </div>
  `

  document.getElementById('for-user-code').addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const start = e.target.selectionStart
      const end = e.target.selectionEnd
      e.target.value = e.target.value.substring(0, start) + '\t' + e.target.value.substring(end)
      e.target.selectionStart = e.target.selectionEnd = start + 1
    }
  })

  const userCodeTextarea = document.getElementById('for-user-code')
  const lineNumbersDiv = document.getElementById('for-user-code-lines')

  function updateUserCodeLineNumbers() {
    const lines = userCodeTextarea.value.split('\n').length
    lineNumbersDiv.innerHTML = ''
    for (let i = 1; i <= Math.max(lines, 5); i++) {
      const lineDiv = document.createElement('div')
      lineDiv.textContent = i
      lineNumbersDiv.appendChild(lineDiv)
    }
  }

  userCodeTextarea.addEventListener('input', updateUserCodeLineNumbers)
  userCodeTextarea.addEventListener('scroll', () => {
    lineNumbersDiv.scrollTop = userCodeTextarea.scrollTop
  })

  updateUserCodeLineNumbers()
}

function executeForLoopVisualization() {
  const varName = document.getElementById('for-var-name').value || 'i'
  const initValue = parseInt(document.getElementById('for-init-value').value) || 0
  const condition = document.getElementById('for-condition').value || `${varName} < 10`
  const increment = document.getElementById('for-increment').value || `${varName}++`
  const userCode = document.getElementById('for-user-code').value

  const trace = executeForLoop({
    varName,
    initValue,
    condition,
    increment,
    userCode
  })

  displayLoopTrace(trace)
}

function executeForLoop(config) {
  const { varName, initValue, condition, increment, userCode } = config
  const trace = []

  try {
    // choosing increment/decrement
    const isIncrement = increment.includes('++') || increment.includes('+')
    const incrementAmount = parseInt(increment.match(/\d+/)?.[0]) || 1

    let counterValue = initValue
    let iteration = 0
    const maxIterations = 10000 // safety limit!!!!!!!!!!

    while (iteration < maxIterations) {
      let conditionResult = false
      try {
        // for safe evaluation context
        const evaluator = new Function(varName, `return ${condition}`)
        conditionResult = evaluator(counterValue)
      } catch (e) {
        trace.push({
          iteration: iteration + 1,
          counterValue: counterValue,
          condition: condition,
          conditionResult: false,
          error: `Condition error: ${e.message}`,
          userOutput: ''
        })
        break
      }

      if (!conditionResult) break

      // for executing user code if provided
      let userOutput = ''
      if (userCode) {
        try {
          const codeEvaluator = new Function(varName, `
            let output = '';
            ${userCode}
            return output;
          `)
          userOutput = codeEvaluator(counterValue)
        } catch (e) {
          userOutput = `Error: ${e.message}`
        }
      }

      trace.push({
        iteration: iteration + 1,
        counterValue: counterValue,
        condition: condition,
        conditionResult: true,
        userOutput: userOutput
      })

      // increment/decrement counter
      if (isIncrement) {
        counterValue += incrementAmount
      } else {
        counterValue -= incrementAmount
      }

      iteration++
    }

    // add final iteration when condition fails
    let finalConditionResult = false
    try {
      const evaluator = new Function(varName, `return ${condition}`)
      finalConditionResult = evaluator(counterValue)
    } catch (e) {
      finalConditionResult = false
    }

    trace.push({
      iteration: iteration + 1,
      counterValue: counterValue,
      condition: condition,
      conditionResult: finalConditionResult,
      userOutput: '(Loop ended)',
      isFinal: true
    })

    return trace
  } catch (e) {
    return [{ error: `Execution error: ${e.message}` }]
  }
}

function displayLoopTrace(trace) {
  const traceContainer = document.querySelector('.loop-trace-output')
  if (!traceContainer) {
    console.error('Trace container not found')
    return
  }

  let html = `
    <div class="trace-header">
      <h3>Execution Process</h3>
      <table class="trace-table">
        <thead>
          <tr>
            <th>Iteration</th>
            <th>Counter Value</th>
            <th>Condition</th>
            <th>Result</th>
            <th>User Code Output</th>
          </tr>
        </thead>
        <tbody>
  `

  trace.forEach(step => {
    if (step.error) {
      html += `<tr class="error-row"><td colspan="5">${step.error}</td></tr>`
    } else {
      const resultClass = step.conditionResult ? 'true' : 'false'
      const resultText = step.conditionResult ? '✓ true' : '✗ false'
      html += `
        <tr class="iteration-row ${resultClass}">
          <td>${step.iteration}</td>
          <td><code>${step.counterValue}</code></td>
          <td><code>${step.condition}</code></td>
          <td class="result-${resultClass}">${resultText}</td>
          <td><code>${step.userOutput || '-'}</code></td>
        </tr>
      `
    }
  })

  html += `
        </tbody>
      </table>
    </div>
  `

  traceContainer.innerHTML = html
}

// export for use in main script
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { typeHandlers }
}
