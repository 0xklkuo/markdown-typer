export default function HomePage(): React.ReactElement {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <h1>Markdown Typer</h1>
        <p>Web app scaffold is running.</p>
      </div>
    </main>
  );
}
