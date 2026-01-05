import { Link } from 'react-router-dom'

const projectFiles = [
  { name: 'src/App.tsx', description: 'Hoofd React component' },
  { name: 'src/App.css', description: 'Styling voor App component' },
  { name: 'src/main.tsx', description: 'Entry point van de applicatie' },
  { name: 'src/index.css', description: 'Globale styling' },
  { name: 'index.html', description: 'HTML template' },
  { name: 'vite.config.ts', description: 'Vite configuratie' },
  { name: 'package.json', description: 'Project dependencies' },
  { name: 'tsconfig.json', description: 'TypeScript configuratie' },
]

function Home() {
  return (
    <div className="container">
      <img
        src="https://em-content.zobj.net/source/apple/391/waving-hand_1f44b.png"
        alt="Waving hand"
        className="wave-image"
      />
      <h1>Hello World</h1>

      <nav className="nav-links">
        <Link to="/contact">Contact</Link>
      </nav>

      <div className="files-section">
        <h2>Projectbestanden</h2>
        <ul className="file-list">
          {projectFiles.map((file) => (
            <li key={file.name} className="file-item">
              <code>{file.name}</code>
              <span>{file.description}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Home
