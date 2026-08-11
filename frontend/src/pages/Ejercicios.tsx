import { ExerciseShell } from '@/components/ejercicios/ExerciseShell'
import { usePerfilStore } from '@/lib/stores/perfilStore'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'

export default function Ejercicios() {
  const perfilId = usePerfilStore((s) => s.perfilActivoId)

  if (!perfilId) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center font-poppins">
        <div className="text-center">
          <p className="text-2xl font-bold text-[#0f172a] mb-4">Sin perfil activo</p>
          <Link to="/perfiles"><Button>Elegir perfil →</Button></Link>
        </div>
      </div>
    )
  }

  return <ExerciseShell />
}
