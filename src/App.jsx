import { useState, useEffect } from 'react'
import './App.css'
import { allPlayersData } from './playersData'
import { saveTeams, loadTeams } from './dataUtil'

function App() {
  const [teams, setTeams] = useState([])
  const [teamName, setTeamName] = useState('')
  const [draggedPlayer, setDraggedPlayer] = useState(null)
  const [isCreatorMinimized, setIsCreatorMinimized] = useState(false)
  const [isPlayersMinimized, setIsPlayersMinimized] = useState(false)

  // Load teams from localStorage on mount
  useEffect(() => {
    const savedTeams = loadTeams()
    setTeams(savedTeams)
  }, [])

  // Save teams to localStorage whenever they change
  useEffect(() => {
    saveTeams(teams)
  }, [teams])

  // Use imported player data instead of hardcoded
  const allPlayers = allPlayersData



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
        <div className="section-header">
          <h2>Create Team</h2>
          <button
            onClick={() => setIsCreatorMinimized(!isCreatorMinimized)}
            className="btn-minimize"
            title={isCreatorMinimized ? "Expand" : "Minimize"}
          >
            {isCreatorMinimized ? '▼' : '▲'}
          </button>
        </div>
        {!isCreatorMinimized && (
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
        )}
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
                    <div className="roster-cards">
                      {team.roster.map(player => (
                        <div key={player.id} className="team-player-card">
                          <img 
                            src={player.headshot} 
                            alt={player.name}
                            className="team-player-headshot"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                          <div className="team-card-content">
                            <h4>{player.name}</h4>
                            <p className="team-card-role">{player.season}</p>
                            <div className="team-power-badge">🏆 {player.placement}</div>
                          </div>
                          <button
                            onClick={() => removePlayer(team.id, player.id)}
                            className="btn-remove-player"
                            title="Remove player"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
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
        <div className={`section section-players ${isPlayersMinimized ? 'minimized' : ''}`}>
          <div className="section-header">
            <h2>Available Players</h2>
            <button
              onClick={() => setIsPlayersMinimized(!isPlayersMinimized)}
              className="btn-minimize"
              title={isPlayersMinimized ? "Expand" : "Minimize"}
            >
              {isPlayersMinimized ? '▼' : '▲'}
            </button>
          </div>
          {!isPlayersMinimized && (
            <div className="players-grid">
              {availablePlayers.map(player => (
                <div
                  key={player.id}
                  draggable
                  onDragStart={() => handleDragStart(player)}
                  className="player-card"
                >
                  <img 
                    src={player.headshot} 
                    alt={player.name}
                    className="player-headshot"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <div className="card-content">
                    <h3>{player.name}</h3>
                    <p className="role">{player.season}</p>
                    <div className="power-badge">🏆 {player.placement}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

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