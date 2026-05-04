import { useState } from 'react'
import './App.css'

function App() {
  const [teams, setTeams] = useState([])
  const [teamName, setTeamName] = useState('')
  const [draggedPlayer, setDraggedPlayer] = useState(null)

  // Generate fantasy players
  const allPlayers = [
    { id: 1, name: 'Aldric Steelborn', role: 'Knight', power: 92 },
    { id: 2, name: 'Brianna Shadowend', role: 'Rogue', power: 88 },
    { id: 3, name: 'Caspian Brightbane', role: 'Mage', power: 95 },
    { id: 4, name: 'Delilah Duskfire', role: 'Cleric', power: 86 },
    { id: 5, name: 'Ezra Stormcaller', role: 'Sorcerer', power: 91 },
    { id: 6, name: 'Fiona Nightwhisper', role: 'Ranger', power: 87 },
    { id: 7, name: 'Garrett Goldleaf', role: 'Paladin', power: 89 },
    { id: 8, name: 'Helena Ironfist', role: 'Barbarian', power: 93 },
    { id: 9, name: 'Ivan Swiftblade', role: 'Rogue', power: 84 },
    { id: 10, name: 'Jasmine Darkhollow', role: 'Mage', power: 90 },
    { id: 11, name: 'Kael Frostborn', role: 'Sorcerer', power: 88 },
    { id: 12, name: 'Luna Starweaver', role: 'Cleric', power: 85 },
  ]

  // Get available players (not already in any team)
  const usedPlayerIds = new Set()
  teams.forEach(team => {
    team.roster.forEach(player => {
      usedPlayerIds.add(player.id)
    })
  })
  const availablePlayers = allPlayers.filter(p => !usedPlayerIds.has(p.id))

  // Create team
  const createTeam = () => {
    if (teamName.trim()) {
      const newTeam = {
        id: Date.now(),
        name: teamName,
        roster: [],
      }
      setTeams([...teams, newTeam])
      setTeamName('')
    }
  }

  // Handle drag start
  const handleDragStart = (player) => {
    setDraggedPlayer(player)
  }

  // Handle drop
  const handleDrop = (teamId) => {
    if (draggedPlayer) {
      setTeams(teams.map(team =>
        team.id === teamId
          ? { ...team, roster: [...team.roster, draggedPlayer] }
          : team
      ))
      setDraggedPlayer(null)
    }
  }

  // Remove player from team
  const removePlayer = (teamId, playerId) => {
    setTeams(teams.map(team =>
      team.id === teamId
        ? { ...team, roster: team.roster.filter(p => p.id !== playerId) }
        : team
    ))
  }

  // Delete team
  const deleteTeam = (teamId) => {
    setTeams(teams.filter(t => t.id !== teamId))
  }

  return (
    <div className="app-container">
      {/* Section 1: Team Creation */}
      <div className="section section-creator">
        <h2>Create Team</h2>
        <div className="input-group">
          <input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && createTeam()}
            placeholder="Enter team name..."
            className="team-input"
          />
          <button onClick={createTeam} className="btn-create">
            Add Team
          </button>
        </div>
      </div>

      {/* Section 2 & 3: Teams and Players Side by Side */}
      <div className="sections-row">
        {/* Left: Teams List */}
        <div className="section section-teams">
          <h2>Teams ({teams.length})</h2>
          <div className="teams-grid">
            {teams.map(team => (
              <div key={team.id} className="team-card">
                <div className="team-header">
                  <h3>{team.name}</h3>
                  <button
                    onClick={() => deleteTeam(team.id)}
                    className="btn-delete"
                  >
                    ×
                  </button>
                </div>

                <div
                  className="team-drop-zone"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(team.id)}
                >
                  {team.roster.length === 0 ? (
                    <p className="drop-hint">Drag players here</p>
                  ) : (
                    <ul className="roster-list">
                      {team.roster.map(player => (
                        <li key={player.id} className="roster-item">
                          <div className="player-info">
                            <span className="player-name">{player.name}</span>
                            <span className="player-role">{player.role}</span>
                          </div>
                          <button
                            onClick={() => removePlayer(team.id, player.id)}
                            className="btn-remove"
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="team-footer">
                  {team.roster.length} / 5 players
                </div>
              </div>
            ))}
          </div>

          {teams.length === 0 && (
            <div className="empty-state">
              <p>Create a team to get started</p>
            </div>
          )}
        </div>

        {/* Right: Player Cards */}
        <div className="section section-players">
          <h2>Available Players</h2>
          <div className="players-grid">
            {availablePlayers.map(player => (
              <div
                key={player.id}
                draggable
                onDragStart={() => handleDragStart(player)}
                className="player-card"
              >
                <div className="card-content">
                  <h3>{player.name}</h3>
                  <p className="role">{player.role}</p>
                  <div className="power-badge">⚡ {player.power}</div>
                </div>
              </div>
            ))}
          </div>

          {availablePlayers.length === 0 && (
            <div className="empty-state">
              <p>All players have been drafted!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App