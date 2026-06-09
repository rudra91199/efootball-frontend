"use client"

import { useState } from "react"

interface AddPlayerModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (player: any) => void
}

export default function AddPlayerModal({ isOpen, onClose, onAdd }: AddPlayerModalProps) {
  const [newPlayer, setNewPlayer] = useState({
    name: "",
    email: "",
    gamertag: "",
    skill_level: "Beginner",
  })

  const handleAddPlayer = () => {
    if (newPlayer.name && newPlayer.email && newPlayer.gamertag) {
      onAdd(newPlayer)
      setNewPlayer({ name: "", email: "", gamertag: "", skill_level: "Beginner" })
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-lg w-full max-w-md mx-4">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Add New Player</h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              value={newPlayer.name}
              onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
              className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter player name"
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={newPlayer.email}
              onChange={(e) => setNewPlayer({ ...newPlayer, email: e.target.value })}
              className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter email address"
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Gamertag</label>
            <input
              type="text"
              value={newPlayer.gamertag}
              onChange={(e) => setNewPlayer({ ...newPlayer, gamertag: e.target.value })}
              className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter gamertag"
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Skill Level</label>
            <select
              value={newPlayer.skill_level}
              onChange={(e) => setNewPlayer({ ...newPlayer, skill_level: e.target.value })}
              className="w-full p-2 bg-gray-800/50 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
          </div>
          <div className="flex space-x-3 pt-4">
            <button
              onClick={handleAddPlayer}
              className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium transition-colors"
            >
              Add Player
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent rounded-md font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
