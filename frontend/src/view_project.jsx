import React, { useEffect, useState } from 'react'

export default function ViewProject() {
  const [dsProjects, setDsProjects] = useState([])
  const [webProjects, setWebProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.all([
      fetch('http://127.0.0.1:8000/api/projects/data-science/')
        .then((res) => {
          if (!res.ok) throw new Error('Unable to load data science projects')
          return res.json()
        })
        .then(setDsProjects),
      fetch('http://127.0.0.1:8000/api/projects/web-development/')
        .then((res) => {
          if (!res.ok) throw new Error('Unable to load web development projects')
          return res.json()
        })
        .then(setWebProjects),
    ])
      .catch((err) => {
        setError(err.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const renderProjects = (projects) => {
    if (projects.length === 0) {
      return (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
          No projects found yet.
        </div>
      )
    }

    return projects.map((project, index) => (
      <article key={`${project.title}-${index}`} className="overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-2xl transition transform hover:-translate-y-1">
        <img src={project.image || 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80'} alt={project.title} className="h-40 w-full object-cover" />
        <div className="p-4">
          <h3 className="text-lg font-semibold text-slate-900 mb-1">{project.title}</h3>
          <p className="text-sm text-slate-600">{project.description}</p>
        </div>
      </article>
    ))
  }

  return (
    <div className="px-6 py-12 bg-sky-100 min-h-screen">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between rounded-3xl bg-white p-5 shadow-lg">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.35em] text-emerald-500">Project View</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-950">Explore my portfolio</h1>
          </div>
          <a href="#home" className="inline-flex items-center rounded-full bg-green-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700">
            Back to Home
          </a>
        </div>

        {loading ? (
          <div className="rounded-3xl bg-white p-8 shadow-lg text-center text-slate-600">Loading projects…</div>
        ) : error ? (
          <div className="rounded-3xl bg-white p-8 shadow-lg text-center text-red-600">{error}</div>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Data Science Projects</h2>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 mb-12">
              {renderProjects(dsProjects)}
            </div>

            <h2 className="text-3xl font-bold text-slate-900 mb-6">Web Development</h2>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
              {renderProjects(webProjects)}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
