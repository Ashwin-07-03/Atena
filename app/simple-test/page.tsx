export default function SimpleTestPage() {
  return (
    <div style={{ 
      padding: '2rem', 
      maxWidth: '600px', 
      margin: '0 auto', 
      fontFamily: 'system-ui, sans-serif' 
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Simple Test Page</h1>
      <p style={{ marginBottom: '1rem' }}>This is a simple test page to verify that routing is working correctly.</p>
      <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem' }}>
        <li>
          <a href="/" style={{ color: 'blue', textDecoration: 'underline' }}>
            Home
          </a>
        </li>
        <li>
          <a href="/login" style={{ color: 'blue', textDecoration: 'underline' }}>
            Login Page
          </a>
        </li>
        <li>
          <a href="/register" style={{ color: 'blue', textDecoration: 'underline' }}>
            Register Page
          </a>
        </li>
      </ul>
    </div>
  )
} 