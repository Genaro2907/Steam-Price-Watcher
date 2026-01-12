import { Button } from "@/components/ui/button"
import { Gamepad2 } from "lucide-react"

function App() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-6">
      
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-white tracking-tight flex items-center gap-3">
          <Gamepad2 className="h-10 w-10 text-emerald-400" />
          Steam Price Watcher
        </h1>
        <p className="text-slate-400">
          Seu monitor de preços favorito.
        </p>
      </div>

      <div className="flex gap-4">
        <Button variant="default" size="lg" className="bg-emerald-500 hover:bg-emerald-600">
          Começar Agora
        </Button>
        
        <Button variant="outline" size="lg" className="text-white border-slate-700 hover:bg-slate-800">
          Login
        </Button>
      </div>

    </div>
  )
}

export default App