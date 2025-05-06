function WordDefinition({ wordData }) {
  if (!wordData) return null

  const { word, phonetics, meanings } = wordData

  // Find phonetic with audio
  const phoneticWithAudio = phonetics.find(p => p.audio)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 mb-6 text-gray-900 dark:text-white">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
        <div className="mb-3 sm:mb-0 text-center sm:text-left">
          <h2 className="text-2xl sm:text-3xl font-bold">{word}</h2>
          {phonetics.length > 0 && phonetics[0].text && (
            <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg">{phonetics[0].text}</p>
          )}
        </div>
        
        {phoneticWithAudio && (
          <div className="flex justify-center sm:justify-end">
            <button 
              onClick={() => new Audio(phoneticWithAudio.audio).play()}
              className="bg-blue-100 dark:bg-blue-900 p-2 sm:p-3 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {meanings.map((meaning, index) => (
        <div key={index} className="mb-5 sm:mb-6">
          <div className="flex items-center mb-2">
            <h3 className="text-lg sm:text-xl font-semibold italic mr-2">{meaning.partOfSpeech}</h3>
            <div className="h-px bg-gray-300 dark:bg-gray-600 flex-grow"></div>
          </div>
          
          <h4 className="text-base sm:text-lg font-medium mb-2 text-gray-700 dark:text-gray-300">Definitions</h4>
          <ul className="list-disc pl-5 sm:pl-6 space-y-2">
            {/* Limit to 2 definitions */}
            {meaning.definitions.slice(0, 2).map((def, idx) => (
              <li key={idx} className="text-gray-800 dark:text-gray-200 text-sm sm:text-base">
                <p>{def.definition}</p>
                {/* Show example if available */}
                {def.example && (
                  <p className="text-gray-600 dark:text-gray-400 mt-1 text-xs sm:text-sm">
                    "{def.example}"
                  </p>
                )}
              </li>
            ))}
          </ul>
          
          {/* Show only if there are synonyms */}
          {meaning.synonyms.length > 0 && (
            <div className="mt-3 sm:mt-4">
              <h4 className="text-base sm:text-lg font-medium mb-2 text-gray-700 dark:text-gray-300">Synonyms</h4>
              <div className="flex flex-wrap gap-2">
                {/* Limit to 2 synonyms */}
                {meaning.synonyms.slice(0, 2).map((synonym, idx) => (
                  <span key={idx} className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-md text-xs sm:text-sm">
                    {synonym}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Show only if there are antonyms */}
          {meaning.antonyms.length > 0 && (
            <div className="mt-3 sm:mt-4">
              <h4 className="text-base sm:text-lg font-medium mb-2 text-gray-700 dark:text-gray-300">Antonyms</h4>
              <div className="flex flex-wrap gap-2">
                {/* Limit to 2 antonyms */}
                {meaning.antonyms.slice(0, 2).map((antonym, idx) => (
                  <span key={idx} className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-2 py-1 rounded-md text-xs sm:text-sm">
                    {antonym}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default WordDefinition


