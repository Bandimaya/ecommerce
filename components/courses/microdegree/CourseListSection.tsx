import React from 'react'
import CourseCard from './CourseCard'

const sampleCourses = [
  {
    id: 1,
    title: 'Robotics Starter Microdegree',
    img: 'https://images.avishkaar.cc/courses/main_pages/rmd-shop-page-thumbnail.webp',
    age: '8+ Age • 2 Months',
    description: 'Hands-on robotics starter programme.'
  },
  {
    id: 2,
    title: 'IOT & Electronics Microdegree',
    img: 'https://images.avishkaar.cc/courses/main_pages/iotmd-shop-page-thumbnail.webp',
    age: '10+ Age • 2 Months',
    description: 'Projects with sensors and electronics.'
  },
  {
    id: 3,
    title: 'Artificial Intelligence Microdegree',
    img: 'https://images.avishkaar.cc/courses/main_pages/aimd-shop-page-thumbnail.webp',
    age: '10+ Age • 2 Months',
    description: 'Intro to AI and Python for kids.'
  }
]

export default function CourseListSection() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {sampleCourses.map((c: any) => (
        <CourseCard key={c.title} course={c} />
      ))}
    </section>
  )
}
