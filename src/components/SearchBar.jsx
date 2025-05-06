import { useState } from 'react'

function SearchBar({ searchTerm, setSearchTerm, onSearch }) {
  const [inputValue, setInputValue] = useState(searchTerm)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSearchTerm(inputValue)
    onSearch(inputValue)
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4 sm:mb-6">
      <div className="flex">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search for a word..."
          className="flex-grow px-3 sm:px-4 py-2 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white text-sm sm:text-base"
        />
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white px-3 sm:px-4 py-2 rounded-r-lg transition-colors text-sm sm:text-base"
        >
          Search
        </button>
      </div>
    </form>
  )
}

export default SearchBar




