/* Altitude settings.
   clientId: the Application (client) ID of your Microsoft Entra app registration.
   Leave it empty to run with the example inbox only (no sign-in, no Graph calls). */
window.ALTITUDE_CONFIG = {
  clientId: '',
  maxMessages: 200,
  refreshMinutes: 5,   // reload the inbox this often while the pane is open (connected mailbox only)
};
