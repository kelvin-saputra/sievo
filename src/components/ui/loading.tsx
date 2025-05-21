import type React from "react"

interface LoadingProps {
  message?: string
}

const Loading: React.FC<LoadingProps> = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full">
      <div className="relative w-16 h-16 mb-4">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-t-[#2c3e50] rounded-full animate-spin"></div>
      </div>
      <p className="text-gray-600 text-center font-medium">{message}</p>
    </div>
  )
}

export default Loading
