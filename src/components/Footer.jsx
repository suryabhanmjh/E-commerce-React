const Footer = () => {
  return (
    <footer style={styles.footer}>
      <p>© {new Date().getFullYear()} OldBookStore. All rights reserved.</p>
    </footer>
  );
};

const styles = {
  footer: {
    background: '#222',
    color: '#fff',
    textAlign: 'center',
    padding: '15px 0',
    position: 'relative',
    bottom: 0,
    width: '100%',
    marginTop: '40px'
  }
};

export default Footer;
