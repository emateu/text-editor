import React, { useState } from 'react'
import './App.css'

function App () {
  const [isLoading, setIsLoading] = useState(false)
  const [wordQuery, setWordQuery] = useState('')
  const [synonyms, setSynonyms] = useState(undefined)

  async function handleSearchSynonyms () {
    const query = window.getSelection().toString().trim()
    if (query) {
      setIsLoading(true)
      const response = await fetch(`https://api.datamuse.com/words?ml=${query}&max=10`)
      const data = await response.json()
      const results = data.filter(word => word.tags.includes('syn'))
      setWordQuery(query)
      setSynonyms(results)
      setIsLoading(false)
    }
  }

  function clearAssistant () {
    setWordQuery(undefined)
    setSynonyms(undefined)
  }

  function execCommand (aCommandName, aShowDefaultUI, aValueArgument) {
    document.execCommand(aCommandName, aShowDefaultUI, aValueArgument)
    clearAssistant()
  }

  return (
    <div className="App">
      <h1>Text editor</h1>

      <div className='Container'>
        <div className='Editor'>
          <div className='EditorOptions' tabIndex={2}>
            <button
              type='button'
              onClick={() => execCommand('bold')}
            >
              Bold
            </button>

            <button
              type='button'
              onClick={() => execCommand('italic')}
            >
              Italic
            </button>

            <button
              type='button'
              onClick={() => execCommand('underline')}
            >
              Underline
            </button>

            <button
              onClick={() => execCommand('indent')}
            >
              Indent
            </button>

            <button
              onClick={() => execCommand('outdent')}
            >
              Outdent
            </button>

            <button
              onClick={handleSearchSynonyms}
            >
              Search synonyms
            </button>
          </div>

          <div
            tabIndex={1}
            className="EditorContent"
            contentEditable
          >
          </div>
        </div>

        {isLoading && (
          <div className='Assistant-Loading'>
            <p>Loading...</p>
          </div>
        )}

        {!isLoading && synonyms && (
          <div className='Assistant'>
            {!!synonyms.length ? (
              <>
                <p>Synonymous for <strong>{wordQuery}</strong></p>
                <ol tabIndex={3}>
                {synonyms.map(element => {
                    const { word } = element
                    return (
                      <li key={word}>
                        <button
                          className='SynonymousButton'
                          onClick={() => {
                            document.execCommand('insertText', false, word)
                            clearAssistant()
                          }}
                        >
                          {word}
                        </button>
                      </li>
                    )
                  })}
                </ol>
              </>
            ) : (
              <p>Synonymous not found for <strong>{wordQuery}</strong></p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default App
