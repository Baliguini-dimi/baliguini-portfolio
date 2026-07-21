function AdminPageHeader({ title, description, action }) {
  return (
    <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
      <div>
        <h1 className="font-display font-bold text-3xl">{title}</h1>
        {description && (
          <p className="font-mono text-xs text-mist mt-2">{description}</p>
        )}
      </div>
      {action}
    </div>
  )
}

export default AdminPageHeader