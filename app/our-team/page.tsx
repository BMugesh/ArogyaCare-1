"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Github, Linkedin, Mail, User, UserCircle } from "lucide-react"

const teamMembers = [
  {
    name: "ASWIN KRISHNA C.P",
    role: "Developer",
    bio: "Aswin is a dedicated developer focused on building impactful digital solutions for healthcare.",
    links: {
      github: "",
      linkedin: "",
      email: "",
    },
  },
  {
    name: "BALA MUGESH",
    role: "Developer",
    bio: "Bala Mugesh is a versatile developer passionate about technology and rural empowerment.",
    links: {
      github: "",
      linkedin: "",
      email: "",
    },
  },
  {
    name: "RAM DHARSHAN",
    role: "Team Lead",
    bio: "Ram Dharshan leads the team, ensuring smooth project execution and collaboration.",
    links: {
      github: "",
      linkedin: "",
      email: "",
    },
  },
]

const TeamMember = ({ member, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
      className="bg-gray-900 dark:bg-black border border-gray-700 rounded-lg shadow-lg overflow-hidden"
    >
      <div className="h-48 sm:h-56 md:h-64 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
        {index < 2 ? (
          <User className="w-24 h-24 sm:w-32 sm:h-32 text-blue-400" />
        ) : (
          <UserCircle className="w-24 h-24 sm:w-32 sm:h-32 text-purple-400" />
        )}
      </div>
      <div className="p-3 sm:p-4 md:p-6">
        <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-1 sm:mb-2 text-white">{member.name}</h3>
        <p className="text-xs sm:text-sm text-gray-400 mb-2 sm:mb-4">{member.role}</p>
        <p className="text-xs sm:text-sm text-gray-300 mb-2 sm:mb-4 line-clamp-4">{member.bio}</p>
        <div className="flex space-x-3 sm:space-x-4">
  <a
    href={member.links.github}
    target="_blank"
    rel="noopener noreferrer"
    className="text-gray-400 hover:text-white"
    title="Github"
  >
    <Github className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
  </a>
  <a
    href={member.links.linkedin}
    target="_blank"
    rel="noopener noreferrer"
    className="text-gray-400 hover:text-white"
    title="Linkedin"
  >
    <Linkedin className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
  </a>
  <a
    href={`mailto:${member.links.email}`}
    className="text-gray-400 hover:text-white"
    title="Mail"
  >
    <Mail className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
  </a>
</div>
        
      </div>
    </motion.div>
  )
}

export default function OurTeam() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-center mb-12"
        >
          Our Team
        </motion.h1>
        <section className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {isLoaded &&
            teamMembers.map((member, index) => <TeamMember key={member.name} member={member} index={index} />)}
        </section>
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-semibold mb-4 pt-10">Our Vision</h2>
          <p className="text-gray-400">
            At ArogyaCare, we envision a world where quality healthcare is accessible to everyone, regardless of their
            location or economic status. Our mission is to leverage cutting-edge technology to bridge the gap between
            rural communities and healthcare professionals, ensuring that every individual has access to timely and
            effective medical advice and support.
          </p>
        </motion.section>
      </main>
      <Footer />
    </div>
  )
}
