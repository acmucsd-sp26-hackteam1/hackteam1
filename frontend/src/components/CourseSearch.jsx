import { useEffect, useState, useMemo } from 'react'
import Fuse from 'fuse.js'

export function CourseSearch({ onAddCourse }) {
  const [courses, setCourses] = useState([])
  const [query, setQuery] = useState('')

  useEffect(() => {
    fetch('http://localhost:3000/api/courses')
        .then((res) => {
        console.log('courses status:', res.status)
        return res.json()
        })
        .then((data) => {
        console.log('courses data:', data)
        setCourses(Array.isArray(data) ? data : [])
        })
        .catch((err) => console.error('Failed to load courses:', err))
    }, [])

  const fuse = useMemo(
    () => new Fuse(courses, { keys: ['subject', 'number', 'title'], threshold: 0.3 }),
    [courses]
  )

  const results = query.trim() ? fuse.search(query).slice(0, 8).map((r) => r.item) : []

  return (
    <div className="course-search">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for courses (e.g. CSE 100)"
      />
      {results.length > 0 && (
        <ul className="course-search-results">
          {results.map((course) => (
            <li key={`${course.subject}${course.number}`}>
              <span>{course.subject} {course.number} — {course.title}</span>
              <button type="button" onClick={() => onAddCourse(course)}>Add</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}