'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, ExternalLink, Briefcase, GraduationCap, Code2, FolderGit2, Award, Star, Download, Loader2 } from 'lucide-react'
import type { GeneratedResume } from '@/lib/resume/generator'

interface ResumeCardProps {
  resume: GeneratedResume
  onDownload: () => void
  downloading: boolean
}

function ResumeSection({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-1.5 mb-2.5 pb-1 border-b border-gray-100">
        <span className="text-indigo-500">{icon}</span>
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{title}</h2>
      </div>
      {children}
    </div>
  )
}

export function ResumeCard({ resume, onDownload, downloading }: ResumeCardProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Download bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-neon-blue/5 border border-neon-blue/20 rounded-xl mb-4 shrink-0">
        <div className="flex items-center gap-2">
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-neon-blue"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span className="text-xs font-mono text-neon-blue">Resume ready</span>
        </div>
        <button
          onClick={onDownload}
          disabled={downloading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neon-blue/10 border border-neon-blue/30 text-xs font-mono text-neon-blue hover:bg-neon-blue/20 transition-all disabled:opacity-50"
        >
          {downloading ? <Loader2 size={11} className="animate-spin" /> : <Download size={11} />}
          {downloading ? 'Preparing...' : 'Download PDF'}
        </button>
      </div>

      {/* Resume preview — scrollable */}
      <div className="flex-1 overflow-y-auto scrollbar-none">
        <motion.div
          key={resume.name + resume.summary.slice(0, 20)}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="bg-white text-gray-900 rounded-2xl p-7 shadow-xl font-sans text-sm leading-relaxed"
          id="resume-preview"
        >
          {/* Header */}
          <div className="border-b border-gray-100 pb-4 mb-4">
            <h1 className="text-xl font-bold text-gray-900 leading-tight">{resume.name}</h1>
            <p className="text-indigo-600 font-medium text-sm mt-0.5">{resume.title}</p>
            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2.5 text-[11px] text-gray-500">
              {resume.contact.email && (
                <span className="flex items-center gap-1"><Mail size={9} />{resume.contact.email}</span>
              )}
              {resume.contact.phone && (
                <span className="flex items-center gap-1"><Phone size={9} />{resume.contact.phone}</span>
              )}
              {resume.contact.location && (
                <span className="flex items-center gap-1"><MapPin size={9} />{resume.contact.location}</span>
              )}
              {resume.contact.linkedin && (
                <span className="flex items-center gap-1"><ExternalLink size={9} />{resume.contact.linkedin}</span>
              )}
              {resume.contact.github && (
                <span className="flex items-center gap-1"><ExternalLink size={9} />{resume.contact.github}</span>
              )}
              {resume.contact.portfolio && (
                <span className="flex items-center gap-1"><ExternalLink size={9} />{resume.contact.portfolio}</span>
              )}
            </div>
          </div>

          {/* Summary */}
          <ResumeSection icon={<Star size={12} />} title="Professional Summary">
            <p className="text-gray-700 text-xs leading-relaxed">{resume.summary}</p>
          </ResumeSection>

          {/* Experience */}
          {resume.experience.length > 0 && (
            <ResumeSection icon={<Briefcase size={12} />} title="Experience">
              {resume.experience.map((exp, i) => (
                <div key={i} className={i > 0 ? 'mt-3.5' : ''}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-gray-900 text-xs">{exp.role}</p>
                      <p className="text-[11px] text-gray-500">{exp.company} · {exp.location}</p>
                    </div>
                    <span className="text-[11px] text-gray-400 shrink-0">{exp.duration}</span>
                  </div>
                  <ul className="mt-1.5 space-y-1">
                    {exp.bullets.map((b, j) => (
                      <li key={j} className="flex gap-1.5 text-[11px] text-gray-700">
                        <span className="text-indigo-400 mt-0.5 shrink-0">▸</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </ResumeSection>
          )}

          {/* Skills */}
          {resume.skills.filter(s => s.items.length > 0).length > 0 && (
            <ResumeSection icon={<Code2 size={12} />} title="Skills">
              <div className="space-y-1.5">
                {resume.skills.filter(s => s.items.length > 0).map((s, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <span className="text-[11px] font-semibold text-gray-500 w-24 shrink-0 pt-0.5">{s.category}</span>
                    <div className="flex flex-wrap gap-1">
                      {s.items.map((item, j) => (
                        <span key={j} className="px-1.5 py-0.5 bg-gray-50 border border-gray-100 rounded text-[10px] text-gray-600">{item}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ResumeSection>
          )}

          {/* Projects */}
          {resume.projects && resume.projects.length > 0 && (
            <ResumeSection icon={<FolderGit2 size={12} />} title="Projects">
              {resume.projects.map((p, i) => (
                <div key={i} className={i > 0 ? 'mt-3.5' : ''}>
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-gray-900 text-xs">{p.name}</p>
                    <span className="text-[11px] text-gray-400 shrink-0">{p.tech.slice(0, 3).join(', ')}</span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5">{p.description}</p>
                  <ul className="mt-1 space-y-1">
                    {p.bullets.map((b, j) => (
                      <li key={j} className="flex gap-1.5 text-[11px] text-gray-700">
                        <span className="text-indigo-400 mt-0.5 shrink-0">▸</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </ResumeSection>
          )}

          {/* Education */}
          {resume.education.length > 0 && (
            <ResumeSection icon={<GraduationCap size={12} />} title="Education">
              {resume.education.map((e, i) => (
                <div key={i} className={`flex items-start justify-between gap-2 ${i > 0 ? 'mt-3' : ''}`}>
                  <div>
                    <p className="font-semibold text-gray-900 text-xs">{e.degree}</p>
                    <p className="text-[11px] text-gray-500">{e.institution}{e.gpa ? ` · GPA: ${e.gpa}` : ''}</p>
                    {e.highlights?.filter(Boolean).map((h, j) => (
                      <p key={j} className="text-[11px] text-gray-400 mt-0.5">· {h}</p>
                    ))}
                  </div>
                  <span className="text-[11px] text-gray-400 shrink-0">{e.duration}</span>
                </div>
              ))}
            </ResumeSection>
          )}

          {/* Certifications */}
          {resume.certifications?.filter(Boolean).length ? (
            <ResumeSection icon={<Award size={12} />} title="Certifications">
              <ul className="space-y-1">
                {resume.certifications!.filter(Boolean).map((c, i) => (
                  <li key={i} className="flex gap-1.5 text-[11px] text-gray-700">
                    <span className="text-indigo-400 mt-0.5 shrink-0">▸</span>{c}
                  </li>
                ))}
              </ul>
            </ResumeSection>
          ) : null}

          {/* Achievements */}
          {resume.achievements?.filter(Boolean).length ? (
            <ResumeSection icon={<Star size={12} />} title="Achievements">
              <ul className="space-y-1">
                {resume.achievements!.filter(Boolean).map((a, i) => (
                  <li key={i} className="flex gap-1.5 text-[11px] text-gray-700">
                    <span className="text-indigo-400 mt-0.5 shrink-0">▸</span>{a}
                  </li>
                ))}
              </ul>
            </ResumeSection>
          ) : null}
        </motion.div>
      </div>
    </div>
  )
}
