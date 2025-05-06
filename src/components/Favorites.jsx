import { useState, useEffect } from 'react'

function Favorites({ onSelectWord }) {
  const [favorites, setFavorites] = useState([])

  useEffect(() => {
    const storedFavorites = localStorage.getItem('wordify-favorites')
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites))
    }
  }, [])

  const removeFromFavorites = (word) => {
    const updatedFavorites = favorites.filter(fav => fav !== word)
    setFavorites(updatedFavorites)
    localStorage.setItem('wordify-favorites', JSON.stringify(updatedFavorites))
  }

  if (favorites.length === 0) return null

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
      <h3 className="text-lg font-semibold mb-2">Favorites</h3>
      <div className="flex flex-wrap gap-2">
        {favorites.map((word, index) => (
          <div key={index} className="flex items-center bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
            <button 
              onClick={() => onSelectWord(word)}
              className="text-blue-600 dark:text-blue-400 hover:underline mr-2"
            >
              {word}
            </button>
            <button 
              onClick={() => removeFromFavorites(word)}
              className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Favorites