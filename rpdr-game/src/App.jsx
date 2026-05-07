import { useState } from 'react'
import './App.css'

function App() {
  const [teams, setTeams] = useState([])
  const [teamName, setTeamName] = useState('')
  const [draggedPlayer, setDraggedPlayer] = useState(null)

  // RuPaul's Drag Race All Stars Season 11 Queens with Official Headshots
  const allPlayers = [
    { 
      id: 1, 
      name: "A'Keria C. Davenport", 
      season: 'Season 11, All Stars 6', 
      placement: '3rd',
      headshot: 'assets/AkeriaCDavenport.webp'
    },
    { 
      id: 2, 
      name: 'April Carrión', 
      season: 'Season 6', 
      placement: '11th',
      headshot: 'assets/AprilCarri.webp'
    },
    { 
      id: 3, 
      name: 'Aura Mayari', 
      season: 'Season 15', 
      placement: '11th',
      headshot: 'assets/AuraMayari.webp'
    },
    { 
      id: 4, 
      name: 'Crystal Methyd', 
      season: 'Season 12', 
      placement: 'Runner-up',
      headshot: 'assets/CrystalMethyd.webp'
    },
    { 
      id: 5, 
      name: 'Hershii LiqCour-Jeté', 
      season: 'Season 16', 
      placement: 'TBD',
      headshot: 'assets/HershiiLiqCour-Jet.webp'
    },
    { 
      id: 6, 
      name: 'Jasmine Kennedie', 
      season: 'Season 14', 
      placement: 'TBD',
      headshot: 'assets/JasmineKennedie.webp'
    },
    { 
      id: 7, 
      name: 'Joey Jay', 
      season: 'Season 13', 
      placement: 'TBD',
      headshot: 'assets/JoeyJay.webp'
    },
    { 
      id: 8, 
      name: 'Kennedy Davenport', 
      season: 'Season 7, All Stars 3', 
      placement: '4th',
      headshot: 'assets/KennedyDavenport.webp'
    },
    { 
      id: 9, 
      name: 'Lucky Starzzz', 
      season: 'Season 17', 
      placement: 'TBD',
      headshot: 'assets/LuckyStarzzz.webp'
    },
    { 
      id: 10, 
      name: 'Dawn', 
      season: 'Season 16', 
      placement: 'TBD',
      headshot: 'assets/Dawn.webp'
    },
    { 
      id: 11, 
      name: 'Morphine Love Dion', 
      season: 'Season 16', 
      placement: 'TBD',
      headshot: 'assets/MorphineLoveDion.webp'
    },
    { 
      id: 12, 
      name: 'Morgan McMichaels', 
      season: 'Season 2, All Stars 3', 
      placement: '6th',
      headshot: 'assets/MorganMcMichaels.webp'
    },
    { 
      id: 13, 
      name: 'Mystique Summers', 
      season: 'Season 2', 
      placement: '10th',
      headshot: 'assets/MystiqueSummers.webp'
    },
    { 
      id: 14, 
      name: 'Salina EsTitties', 
      season: 'Season 15', 
      placement: '6th',
      headshot: 'assets/SalinaEsTitties.webp'
    },
    { 
      id: 15, 
      name: 'Sam Star', 
      season: 'Season 17', 
      placement: '3rd',
      headshot: 'assets/SamStar.webp'
    },
    { 
      id: 16, 
      name: 'Shuga Cain', 
      season: 'Season 11', 
      placement: '7th',
      headshot: 'assets/ShugaCain.webp'
    },
    { 
      id: 17, 
      name: 'Silky Nutmeg Ganache', 
      season: 'Season 11, All Stars 6', 
      placement: '3rd',
      headshot: 'assets/SilkyNutmegGanache.webp'
    },
    { 
      id: 18, 
      name: 'Vivacious', 
      season: 'Season 6', 
      placement: '12th',
      headshot: 'assets/Vivacious.webp'
    },
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