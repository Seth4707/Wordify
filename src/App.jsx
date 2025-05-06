import { useState, useEffect, useRef } from 'react'
import SearchBar from './components/SearchBar'
import WordDefinition from './components/WordDefinition'
import ErrorMessage from './components/ErrorMessage'
import ThemeToggle from './components/ThemeToggle'
import WordOfTheDay from './components/WordOfTheDay'
import Favorites from './components/Favorites'
// Remove any import of App.css if it exists

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [wordData, setWordData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [darkMode, setDarkMode] = useState(false)
  const [favorites, setFavorites] = useState([])
  const [searchHistory, setSearchHistory] = useState([])
  const [currentPage, setCurrentPage] = useState('search') // 'search', 'favorites', or 'history'
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const menuRef = useRef(null)
  
  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMobileMenuOpen(false)
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [menuRef])

  useEffect(() => {
    // Load dark mode preference
    const savedDarkMode = localStorage.getItem('wordify-dark-mode')
    if (savedDarkMode !== null) {
      const isDarkMode = JSON.parse(savedDarkMode)
      setDarkMode(isDarkMode)
      // Apply dark mode immediately
      if (isDarkMode) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    } else {
      // Check if user prefers dark mode
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
      setDarkMode(prefersDarkMode)
      if (prefersDarkMode) {
        document.documentElement.classList.add('dark')
      }
    }
    
    // Load favorites
    const storedFavorites = localStorage.getItem('wordify-favorites')
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites))
    }
    
    // Load search history
    const storedHistory = localStorage.getItem('wordify-history')
    if (storedHistory) {
      setSearchHistory(JSON.parse(storedHistory))
    }
  }, [])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('wordify-dark-mode', JSON.stringify(darkMode))
  }, [darkMode])

  const searchWord = async (word) => {
    if (!word.trim()) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
      
      if (!response.ok) {
        throw new Error(response.status === 404 
          ? `No definitions found for "${word}"` 
          : 'Failed to fetch definition')
      }
      
      const data = await response.json()
      setWordData(data[0])
      
      // Add to search history if successful
      if (!searchHistory.includes(word)) {
        const updatedHistory = [word, ...searchHistory].slice(0, 20) // Keep only last 20 searches
        setSearchHistory(updatedHistory)
        localStorage.setItem('wordify-history', JSON.stringify(updatedHistory))
      } else {
        // Move the word to the top of history if it already exists
        const updatedHistory = [word, ...searchHistory.filter(item => item !== word)]
        setSearchHistory(updatedHistory)
        localStorage.setItem('wordify-history', JSON.stringify(updatedHistory))
      }
    } catch (err) {
      setError(err.message)
      setWordData(null)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleFavorite = (word) => {
    let updatedFavorites
    if (favorites.includes(word)) {
      updatedFavorites = favorites.filter(fav => fav !== word)
    } else {
      updatedFavorites = [...favorites, word]
    }
    setFavorites(updatedFavorites)
    localStorage.setItem('wordify-favorites', JSON.stringify(updatedFavorites))
  }

  const isFavorite = wordData ? favorites.includes(wordData.word) : false

  // Function to remove item from history
  const removeFromHistory = (word) => {
    const updatedHistory = searchHistory.filter(item => item !== word)
    setSearchHistory(updatedHistory)
    localStorage.setItem('wordify-history', JSON.stringify(updatedHistory))
  }

  // Function to clear all history
  const clearHistory = () => {
    setSearchHistory([])
    localStorage.removeItem('wordify-history')
  }

  // Render different content based on current page
  const renderPageContent = () => {
    switch(currentPage) {
      case 'search':
        return (
          <>
            <SearchBar 
              searchTerm={searchTerm} 
              setSearchTerm={setSearchTerm} 
              onSearch={searchWord} 
            />
            
            <div className="mb-6">
              <WordOfTheDay onSelectWord={(word) => {
                setSearchTerm(word)
                searchWord(word)
              }} />
            </div>
            
            {isLoading && (
              <div className="flex justify-center my-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
              </div>
            )}
            
            {error && <ErrorMessage message={error} />}
            
            {wordData && !isLoading && !error && (
              <div>
                <div className="flex justify-end mb-2">
                  <button 
                    onClick={() => toggleFavorite(wordData.word)}
                    className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-300"
                  >
                    {isFavorite ? (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        Remove from favorites
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                        Add to favorites
                      </>
                    )}
                  </button>
                </div>
                <WordDefinition wordData={wordData} />
              </div>
            )}
          </>
        );
      
      case 'favorites':
        return (
          <div className="py-4">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Your Favorite Words</h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 text-gray-900 dark:text-white">
              {favorites.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {favorites.map((word, index) => (
                    <div key={index} className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                      <button 
                        onClick={() => {
                          setSearchTerm(word);
                          searchWord(word);
                          setCurrentPage('search');
                        }}
                        className="text-green-600 dark:text-green-400 hover:underline"
                      >
                        {word}
                      </button>
                      <button 
                        onClick={() => toggleFavorite(word)}
                        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <span className="material-icons text-sm">close</span>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-300 text-center py-8">
                  You haven't added any favorite words yet.
                </p>
              )}
            </div>
          </div>
        );
      
      case 'history':
        return (
          <div className="py-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Search History</h2>
              {searchHistory.length > 0 && (
                <button 
                  onClick={clearHistory}
                  className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm flex items-center"
                >
                  <span className="material-icons text-sm mr-1">delete</span>
                  <span className="hidden sm:inline">Clear All</span>
                </button>
              )}
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 text-gray-900 dark:text-white">
              {searchHistory.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {searchHistory.map((word, index) => (
                    <div key={index} className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                      <button 
                        onClick={() => {
                          setSearchTerm(word);
                          searchWord(word);
                          setCurrentPage('search');
                        }}
                        className="text-green-600 dark:text-green-400 hover:underline"
                      >
                        {word}
                      </button>
                      <button 
                        onClick={() => removeFromHistory(word)}
                        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <span className="material-icons text-sm">close</span>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-300 text-center py-8">
                  Your search history is empty.
                </p>
              )}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen transition-colors duration-300 flex justify-center items-start py-4 sm:py-8 px-2 sm:px-4 bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden text-gray-900 dark:text-white">
        {/* Header */}
        <header className="bg-green-600 dark:bg-green-800 text-white p-3 sm:p-4">
          <div className="flex justify-between items-center">
            {/* Logo - Always on the left */}
            <div className="flex items-center">
              <button 
                onClick={() => setCurrentPage('search')}
                className="text-2xl font-bold hover:text-green-200 transition-colors focus:outline-none"
              >
                Wordify
              </button>
            </div>
            
            {/* Desktop Navigation - Hidden on mobile */}
            <div className="hidden sm:flex items-center space-x-4">
              <button 
                onClick={() => setCurrentPage('search')}
                className={`flex items-center ${currentPage === 'search' ? 'bg-green-700 dark:bg-green-900' : 'bg-green-500 dark:bg-green-700'} hover:bg-green-700 dark:hover:bg-green-900 px-4 py-2 rounded-md transition-colors`}
              >
                <span className="material-icons text-xl mr-2">search</span>
                <span>Search</span>
              </button>
              <button 
                onClick={() => setCurrentPage('favorites')}
                className={`flex items-center ${currentPage === 'favorites' ? 'bg-green-700 dark:bg-green-900' : 'bg-green-500 dark:bg-green-700'} hover:bg-green-700 dark:hover:bg-green-900 px-4 py-2 rounded-md transition-colors`}
              >
                <span className="material-icons text-xl mr-2">star</span>
                <span>Favorites</span>
              </button>
              <button 
                onClick={() => setCurrentPage('history')}
                className={`flex items-center ${currentPage === 'history' ? 'bg-green-700 dark:bg-green-900' : 'bg-green-500 dark:bg-green-700'} hover:bg-green-700 dark:hover:bg-green-900 px-4 py-2 rounded-md transition-colors`}
              >
                <span className="material-icons text-xl mr-2">history</span>
                <span>History</span>
              </button>
              <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
            </div>
            
            {/* Mobile Menu Button - Only visible on mobile */}
            <div className="flex sm:hidden items-center space-x-2">
              <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg bg-green-500 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-900 transition-colors"
              >
                <span className="material-icons">
                  {mobileMenuOpen ? 'close' : 'menu'}
                </span>
              </button>
            </div>
          </div>
          
          {/* Mobile Navigation Dropdown */}
          {mobileMenuOpen && (
            <div 
              ref={menuRef}
              className="sm:hidden mt-3 bg-green-700 dark:bg-green-900 rounded-md overflow-hidden"
            >
              <button 
                onClick={() => {
                  setCurrentPage('search')
                  setMobileMenuOpen(false)
                }}
                className={`flex items-center w-full px-4 py-3 ${currentPage === 'search' ? 'bg-green-800 dark:bg-green-950' : ''} hover:bg-green-800 dark:hover:bg-green-950 transition-colors`}
              >
                <span className="material-icons mr-3">search</span>
                <span>Search</span>
              </button>
              <button 
                onClick={() => {
                  setCurrentPage('favorites')
                  setMobileMenuOpen(false)
                }}
                className={`flex items-center w-full px-4 py-3 ${currentPage === 'favorites' ? 'bg-green-800 dark:bg-green-950' : ''} hover:bg-green-800 dark:hover:bg-green-950 transition-colors`}
              >
                <span className="material-icons mr-3">star</span>
                <span>Favorites</span>
              </button>
              <button 
                onClick={() => {
                  setCurrentPage('history')
                  setMobileMenuOpen(false)
                }}
                className={`flex items-center w-full px-4 py-3 ${currentPage === 'history' ? 'bg-green-800 dark:bg-green-950' : ''} hover:bg-green-800 dark:hover:bg-green-950 transition-colors`}
              >
                <span className="material-icons mr-3">history</span>
                <span>History</span>
              </button>
            </div>
          )}
        </header>
        
        {/* Main content */}
        <div className="p-4 sm:p-6">
          {renderPageContent()}
        </div>
      </div>
    </div>
  )
}

export default App
























