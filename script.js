// bg config
const BACKGROUND_VIDEO = './bg_video.mp4';

// bg handling
function setVideoBackground(videoPath) {
  const bgVideo = document.getElementById('background-video')
  const bgImage = document.getElementById('background-image')
  bgVideo.src = videoPath
  bgVideo.style.display = 'block'
  bgImage.style.display = 'none'
  document.body.classList.add('has-background')
}

function clearBackground() {
  const bgImage = document.getElementById('background-image')
  const bgVideo = document.getElementById('background-video')
  bgImage.src = ''
  bgVideo.src = ''
  bgImage.style.display = 'none'
  bgVideo.style.display = 'none'
  document.body.classList.remove('has-background')
}

function initializeBackground() {
  if (BACKGROUND_VIDEO) {
    setVideoBackground(BACKGROUND_VIDEO)
  }
}

// main page display
const options = [
  { id: 'loops', label: 'Loops', subcategories: ['for loop', 'while loop', 'do-while loop'] },
  { id: 'datastructures', label: 'Data Structures', subcategories: ['arrays', 'linked lists', 'stacks', 'queues'] },
  { id: 'basic', label: 'Basic Algorithms', subcategories: ['sorting', 'searching', 'string manipulation'] },
  { id: 'advanced', label: 'Advanced Algorithms', subcategories: ['dynamic programming', 'greedy algorithms', 'backtracking'] },
]

// category names for main page display
const optionNames = {
  basic: 'Basic Algorithms',
  datastructures: 'Data Structures',
  advanced: 'Advanced Algorithms',
  loops: 'Loops',
}

let subPagesInitialized = false

function init() {
  renderMainPage()
}

function renderMainPage() {
  const app = document.getElementById('app')
  app.innerHTML = `
    <div class="main-page">
      <div class="main-title">
        <h1>☽ CS FUNDAMENTALS ☽</h1>
        <p>in java(script)</p>
      </div>
      <div class="options-container" id="options-container"></div>
    </div>
    <div id="subpages-container"></div>
  `

  const optionsContainer = document.getElementById('options-container')
  options.forEach(option => {
    const group = document.createElement('div')
    group.className = 'option-group'

    const header = document.createElement('div')
    header.className = 'option-header'

    const arrow = document.createElement('span')
    arrow.className = 'expand-arrow'
    arrow.textContent = '▶'
    arrow.onclick = (e) => {
      e.stopPropagation()
      toggleSubcategories(option.id, arrow, sublist)
    }

    const button = document.createElement('button')
    button.className = 'option-button'
    button.id = `btn-${option.id}`
    button.textContent = `${option.label}`
    button.style.flex = '1'

    header.appendChild(arrow)
    header.appendChild(button)
    group.appendChild(header)

    const sublist = document.createElement('div')
    sublist.className = 'subcategories-list'
    sublist.id = `sublist-${option.id}`

    option.subcategories.forEach(subcat => {
      const subcatBtn = document.createElement('button')
      subcatBtn.className = 'subcategory-button'
      subcatBtn.textContent = subcat
      subcatBtn.onclick = () => {
        if (!subPagesInitialized) {
          renderAllSubPages()
          subPagesInitialized = true
        }
        transitionToSplitViewWithSubcat(option.id, subcat, subcatBtn)
      }
      sublist.appendChild(subcatBtn)
    })

    group.appendChild(sublist)
    optionsContainer.appendChild(group)
  })
}

function toggleSubcategories(optionId, arrow, sublist) {
  arrow.classList.toggle('expanded')
  sublist.classList.toggle('expanded')
}

function transitionToSplitView(optionId, buttonElement) {
  document.querySelector('.main-page').classList.add('split-view')
  document.getElementById('subpages-container').classList.add('active')
  
  document.querySelectorAll('.sub-page').forEach(page => page.classList.remove('active'))
  document.querySelectorAll('.option-button').forEach(btn => btn.classList.remove('active'))
  
  document.getElementById(`sub-${optionId}`).classList.add('active')
  buttonElement.classList.add('active')
}

function transitionToSplitViewWithSubcat(optionId, subcat, subcatBtn) {
  const subcatId = `${optionId}-${subcat.toLowerCase().replace(/\s+/g, '-')}`
  
  document.querySelector('.main-page').classList.add('split-view')
  document.getElementById('subpages-container').classList.add('active')
  
  document.querySelectorAll('.sub-page').forEach(page => page.classList.remove('active'))
  document.querySelectorAll('.option-button, .subcategory-button').forEach(btn => btn.classList.remove('active'))
  
  document.getElementById(`sub-${subcatId}`).classList.add('active')
  subcatBtn.classList.add('active')

  // custom ui
  const fullTypeId = `${optionId}-${subcat.toLowerCase().replace(/\s+/g, '-')}`
  if (typeHandlers[fullTypeId] && typeHandlers[fullTypeId].hasCustomUI) {
    const formContainerId = `form-container-${subcatId}`
    const container = document.getElementById(formContainerId)
    if (container && !container.hasChildNodes()) {
      typeHandlers[fullTypeId].renderUI(formContainerId)
    }
  }
}

function renderAllSubPages() {
  const container = document.getElementById('subpages-container')
  options.forEach(option => {
    option.subcategories.forEach(subcat => {
      const subcatId = `${option.id}-${subcat.toLowerCase().replace(/\s+/g, '-')}`
      const fullTypeId = `${option.id}-${subcat.toLowerCase().replace(/\s+/g, '-')}`
      const hasCustomUI = typeHandlers[fullTypeId] && typeHandlers[fullTypeId].hasCustomUI
      
      let contentHTML = ''
      if (hasCustomUI) {
        contentHTML = `<div id="form-container-${subcatId}"></div>`
      } else {
        contentHTML = `
          <div class="code-editor-wrapper">
            <div class="line-numbers" id="line-numbers-${subcatId}"></div>
            <textarea class="code-input" id="code-input-${subcatId}" placeholder="// Write your code here..." spellcheck="false"></textarea>
          </div>
        `
      }

      const subPageHTML = `
        <div class="sub-page" id="sub-${subcatId}">
          <div class="container-glass">
            <h2 style="margin-bottom: 20px; font-size: 1.5rem; color: #ffffff;">
              ${subcat}
            </h2>
            ${contentHTML}
          </div>
        </div>
      `
      container.insertAdjacentHTML('beforeend', subPageHTML)
      
      if (!hasCustomUI) {
        setupCodeEditor(subcatId)
      }
    })
  })
}

function switchSubPage(optionId, buttonElement) {
  document.querySelectorAll('.sub-page').forEach(page => page.classList.remove('active'))
  document.querySelectorAll('.option-button').forEach(btn => btn.classList.remove('active'))
  
  document.getElementById(`sub-${optionId}`).classList.add('active')
  buttonElement.classList.add('active')
}

function setupCodeEditor(optionId) {
  const codeInput = document.getElementById(`code-input-${optionId}`)
  const lineNumbers = document.getElementById(`line-numbers-${optionId}`)

  function updateLineNumbers() {
    const lines = codeInput.value.split('\n').length
    lineNumbers.innerHTML = ''
    for (let i = 1; i <= Math.max(lines, 20); i++) {
      const lineDiv = document.createElement('div')
      lineDiv.textContent = i
      lineNumbers.appendChild(lineDiv)
    }
  }

  codeInput.addEventListener('input', updateLineNumbers)
  codeInput.addEventListener('scroll', () => {
    lineNumbers.scrollTop = codeInput.scrollTop
  })

  updateLineNumbers()
}

// dom load
document.addEventListener('DOMContentLoaded', () => {
  initializeBackground()
  init()
})
