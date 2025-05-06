import { useState, useEffect } from 'react'

function WordOfTheDay({ onSelectWord }) {
  const [wordOfDay, setWordOfDay] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWordOfDay = async () => {
      setLoading(true)
      
      // Get a random word from a small curated list
      const wordList = [
        'serendipity', 'ephemeral', 'luminous', 'mellifluous', 'eloquent',
        'resplendent', 'ethereal', 'serene', 'quintessential', 'pernicious'
      ]
      
      // Use date as seed for consistent daily word
      const today = new Date()
      const dateString = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`
      const dateHash = Array.from(dateString).reduce((acc, char) => acc + char.charCodeAt(0), 0)
      const wordIndex = dateHash % wordList.length
      
      try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${wordList[wordIndex]}`)
        if (response.ok) {
          const data = await response.json()
          setWordOfDay(data[0])
        }
      } catch (error) {
        console.error('Error fetching word of the day:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchWordOfDay()
  }, [])

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6 animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
      </div>
    )
  }

  if (!wordOfDay) return null

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 sm:p-4 mb-4 sm:mb-6">
      <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-900 dark:text-white">Word of the Day</h3>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{wordOfDay.word}</p>
          {wordOfDay.meanings[0] && (
            <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm italic">
              {wordOfDay.meanings[0].partOfSpeech}
            </p>
          )}
        </div>
        <button 
          onClick={() => onSelectWord(wordOfDay.word)}
          className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm sm:text-base"
        >
          Look up
        </button>
      </div>
    </div>
  )
}

export default WordOfTheDay

