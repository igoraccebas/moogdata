'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Channel {
  cells: string[];
}

interface Slot {
  module: string;
  channels: Channel[];
}

interface Project {
  id: string;
  name: string;
  slotType: number;
  slots: Slot[];
}

const columnTitles = ['Title 1', 'Title 2', 'Title 3', 'Title 4', 'Title 5'];

export default function ProjectPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('projects');
    if (stored) {
      const projs: Project[] = JSON.parse(stored);
      const found = projs.find((p) => p.id === params.id);
      if (found) {
        if (!found.slots) {
          found.slots = Array.from({ length: found.slotType }, () => ({
            module: 'Relais',
            channels: Array.from({ length: 8 }, () => ({ cells: Array(5).fill('') })),
          }));
        }
        setProject(found);
      }
    }
  }, [params.id]);

  useEffect(() => {
    if (project) {
      const stored = localStorage.getItem('projects');
      const projs: Project[] = stored ? JSON.parse(stored) : [];
      const idx = projs.findIndex((p) => p.id === project.id);
      if (idx >= 0) {
        projs[idx] = project;
        localStorage.setItem('projects', JSON.stringify(projs));
      }
    }
  }, [project]);

  if (!project) return <div>Project not found</div>;

  function handleCellChange(slotIdx: number, channelIdx: number, cellIdx: number, value: string) {
    const next = { ...project };
    next.slots[slotIdx].channels[channelIdx].cells[cellIdx] = value;
    setProject(next);
  }

  function handleModuleChange(slotIdx: number, value: string) {
    const next = { ...project };
    next.slots[slotIdx].module = value;
    setProject(next);
  }

  function onDragStart(e: React.DragEvent<HTMLDivElement>, slotIdx: number, channelIdx: number) {
    e.dataTransfer.setData('text/plain', `${slotIdx}:${channelIdx}`);
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>, slotIdx: number, channelIdx: number) {
    const data = e.dataTransfer.getData('text/plain');
    const [fromSlot, fromChannel] = data.split(':').map(Number);
    if (project) {
      const next = { ...project };
      const [moved] = next.slots[fromSlot].channels.splice(fromChannel, 1);
      next.slots[slotIdx].channels.splice(channelIdx, 0, moved);
      setProject(next);
    }
  }

  function allowDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
  }

  return (
    <div>
      <button onClick={() => router.push('/')}>Back</button>
      <h2>{project.name}</h2>
      {project.slots.map((slot, slotIdx) => (
        <div key={slotIdx} className="slot">
          <div>
            Module:
            <select
              value={slot.module}
              onChange={(e) => handleModuleChange(slotIdx, e.target.value)}
            >
              <option>Relais</option>
              <option>0-10v</option>
              <option>Test</option>
            </select>
          </div>
          <div>
            {slot.channels.map((channel, channelIdx) => (
              <div
                key={channelIdx}
                className="channel draggable"
                draggable
                onDragStart={(e) => onDragStart(e, slotIdx, channelIdx)}
                onDragOver={allowDrop}
                onDrop={(e) => onDrop(e, slotIdx, channelIdx)}
              >
                {channel.cells.map((cell, cellIdx) => (
                  <input
                    key={cellIdx}
                    className="channel-cell"
                    value={cell}
                    placeholder={columnTitles[cellIdx]}
                    onChange={(e) => handleCellChange(slotIdx, channelIdx, cellIdx, e.target.value)}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
