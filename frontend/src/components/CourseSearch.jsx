import { useEffect, useState, useMemo, useRef } from 'react'
import Fuse from 'fuse.js'

export function CourseSearch({ onAddCourse }) {
  const [courses, setCourses] = useState([])
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    fetch('http://localhost:3000/api/courses')
      .then((res) => res.json())
      .then((data) => setCourses(Array.isArray(data) ? data : []))
      .catch((err) => console.error('Failed to load courses:', err))
  }, [])

  // Close the dropdown when clicking outside the search area
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const fuse = useMemo(() => {
    const coursesWithCode = courses.map((course) => ({ ...course, code: `${course.subject} ${course.number}` }))
    return new Fuse(coursesWithCode, { keys: ['code', 'subject', 'number', 'title'], threshold: 0.3 })
  }, [courses])

  const results = query.trim() ? fuse.search(query).slice(0, 8).map((r) => r.item) : []

  return (
    <div className="course-search" ref={containerRef}>
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setIsOpen(true)
        }}
        onFocus={() => setIsOpen(true)}
        placeholder="Search for courses (e.g. CSE 100)"
      />
      {isOpen && results.length > 0 && (
        <ul className="course-search-results">
          {results.map((course) => (
            <li key={course._id}>
                <div className="course-header">
                <span>{course.subject} {course.number} — {course.title}</span>
                <button type="button" onClick={() => onAddCourse(course)}>Add lecture</button>
                </div>

                {course.sections
                ?.filter((s) => s.type === 'DI' && s.days && !s.cancelled)
                .map((s) => (
                    <div className="section-row" key={s.code}>
                    <span>DI {s.code} · {s.days} {s.time_start}-{s.time_end}</span>
                    <button type="button" onClick={() => onAddCourse(course, s)}>Add</button>
                    </div>
                ))}
            </li>
            ))}
        </ul>
      )}
    </div>
  )
}