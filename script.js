// main page display
const options = [
  { id: 'algorithms', label: 'Basic Algorithms' },
  { id: 'datastructures', label: 'Data Structures' },
  { id: 'recursion', label: 'Recursion' },
  { id: 'loops', label: 'Loops' },
]

// subpages
const optionNames = {
  algorithms: 'Basic Algorithms',
  datastructures: 'Data Structures',
  recursion: 'Recursion',
  loops: 'Loops',
}

function init() {
  renderMainPage()
}

function renderMainPage() {
  const app = document.getElementById('app')
  app.innerHTML = `
    <div class="main-page">
      <div class="main-title">
        <h1>▲ CS FUNDAMENTALS ▲</h1>
        <p>in java</p>
      </div>
      <div class="options-container" id="options-container"></div>
    </div>
  `

  const optionsContainer = document.getElementById('options-container')
  options.forEach(option => {
    const button = document.createElement('button')
    button.className = 'option-button'
    button.textContent = `→ ${option.label}`
    button.onclick = () => renderSubPage(option.id)
    optionsContainer.appendChild(button)
  })
}

function renderSubPage(optionId) {
  const app = document.getElementById('app')
  app.innerHTML = `
    <div class="sub-page">
      <div class="container-glass">
        <button class="back-button" onclick="renderMainPage()">← Back</button>
        <h2 style="margin-bottom: 20px; font-size: 1.5rem; color: #c89b7b;">
          ${optionNames[optionId] || 'Code Editor'}
        </h2>
        <div class="code-editor-wrapper">
          <div class="line-numbers" id="line-numbers"></div>
          <textarea class="code-input" id="code-input" placeholder="// Write your code here..." spellcheck="false"></textarea>
        </div>
      </div>
    </div>
  `

  const codeInput = document.getElementById('code-input')
  const lineNumbers = document.getElementById('line-numbers')

  function updateLineNumbers() {
    const lines = codeInput.value.split('\n').length
    lineNumbers.innerHTML = ''
    for (let i = 1; i <= Math.max(lines, 20); i++) {
      const lineDiv = document.createElement('div')
      lineDiv.textContent = i
      lineNumbers.appendChild(lineDiv)
    }
  }

  // scrolling and content sync
  codeInput.addEventListener('input', updateLineNumbers)
  codeInput.addEventListener('scroll', () => {
    lineNumbers.scrollTop = codeInput.scrollTop
  })
e
  updateLineNumbers()
}

document.addEventListener('DOMContentLoaded', init)
