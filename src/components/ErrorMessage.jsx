function ErrorMessage({ message }) {
  return (
    <div className="bg-red-100 dark:bg-red-900 border-l-4 border-red-500 text-red-700 dark:text-red-200 p-4 mb-6 rounded">
      <p>{message}</p>
    </div>
  )
}

export default ErrorMessage