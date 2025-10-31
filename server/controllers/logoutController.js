// Logout controller for both session and JWT-based auth
const logout = (req, res) => {
  try {
    // Clear session if using session-based auth
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({ message: 'Could not log out' });
        }
      });
    }

    // Clear JWT cookie if set
    res.clearCookie('token');
    res.clearCookie('connect.sid'); // Clear session cookie

    // Send success response
    res.status(200).json({ 
      success: true, 
      message: 'Logged out successfully',
      redirect: '/' 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during logout' });
  }
};

module.exports = { logout };