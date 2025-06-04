'use client';
import { useState, FormEvent } from 'react';
import Link from 'next/link';

interface Project {
  id: string;
  name: string;
  slotType: number; // 2 or 5
}

export default function Home() {
  const [projects, setProjects] = useState<Project[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('projects');
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });
  const [name, setName] = useState('');
  const [slotType, setSlotType] = useState(5);

  function save(projects: Project[]) {
    localStorage.setItem('projects', JSON.stringify(projects));
  }

  function addProject(e: FormEvent) {
    e.preventDefault();
    const newProject = { id: Date.now().toString(), name, slotType };
    const next = [...projects, newProject];
    setProjects(next);
    save(next);
    setName('');
  }

  return (
    <div>
      <h1>Moog Pro Light Projects</h1>
      <form onSubmit={addProject}>
        <input
          value={name}
          placeholder="Project name"
          onChange={(e) => setName(e.target.value)}
          required
        />
        <select value={slotType} onChange={(e) => setSlotType(Number(e.target.value))}>
          <option value={5}>5 Slot</option>
          <option value={2}>2 Slot</option>
        </select>
        <button type="submit">Create</button>
      </form>
      <ul>
        {projects.map((p) => (
          <li key={p.id}>
            <Link href={`/projects/${p.id}`}>{p.name}</Link> ({p.slotType} slots)
          </li>
        ))}
      </ul>
    </div>
  );
}
