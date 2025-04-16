function Unauthorized() {
    return (
      <>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '120vh',
          backgroundColor: '#ffffff',
          position: 'relative',
          top: '-20vh',
          zIndex: '-2',
        }}>
          <img
            src="/entry-wizard.gif"
            alt="wizard bouncer kicking you out of the stats club"
            style={{ maxWidth: '100%', maxHeight: '100%' }}
          />
        </div>
  
        {/* 20vh white bar at the bottom */}
        <div style={{
          position: 'absolute',
          top: '110vh',
          bottom: '0',
          left: '0',
          width: '100%',
          height: '20vh',
          backgroundColor: '#ffffff',
          zIndex: '-1', // Ensure it's behind the main content
        }} />
      </>
    );
  }
  
  export default Unauthorized;
  