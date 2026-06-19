import { Delete } from "lucide-react"

interface NumericKeypadProps {
  onKeyPress: (key: string) => void
  onBackspace: () => void
  onSubmit: () => void
  disabled?: boolean
}

export function NumericKeypad({ onKeyPress, onBackspace, disabled }: NumericKeypadProps) {
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "backspace"]

  return (
    <div className="grid grid-cols-3 gap-3">
      {keys.map((key, index) => {
        if (key === "") {
          return <div key={index} />
        }

        if (key === "backspace") {
          return (
            <button
              key={index}
              type="button"
              className="flex aspect-square h-14 ml-3 items-center justify-center rounded-lg border border-gray-700 bg-gray-800/80 text-white transition-all hover:bg-gray-700 active:scale-95 disabled:opacity-50 disabled:hover:bg-gray-800/80"
              onClick={onBackspace}
              disabled={disabled}
            >
              <Delete className="h-5 w-5" />
            </button>
          )
        }

        return (
          <button
            key={index}
            type="button"
            className="flex aspect-square h-14 ml-3 items-center justify-center rounded-lg border border-gray-700 bg-gray-800/80 text-xl font-medium text-white transition-all hover:bg-gray-700 active:scale-95 disabled:opacity-50 disabled:hover:bg-gray-800/80"
            onClick={() => onKeyPress(key)}
            disabled={disabled}
          >
            {key}
          </button>
        )
      })}
    </div>
  )
}

