import { useParams } from 'react-router-dom'

function ProjectDetail() {
  const { slug } = useParams()

  return (
    <div className="max-w-6xl mx-auto px-6 py-24">
      <h1 className="font-display font-bold text-3xl">
        Détail projet — à construire
      </h1>
      <p className="font-mono text-mist text-sm mt-2">slug : {slug}</p>
    </div>
  )
}

export default ProjectDetail