import ModulePage from "../components/ModulePage";

function Settings() {
  return (
    <ModulePage
      title="Settings"
      description="Manage your business and platform settings."
      type="settings"
    >

      <div className="module-card">

        <h2>Business Settings</h2>

        <p>
          Business information, financial preferences,
          data permissions and account settings will be
          managed here.
        </p>

      </div>

      <div className="module-card">

        <h2>Data Permissions</h2>

        <p>
          FinTwin will only use financial data that the
          business has explicitly consented to provide.
        </p>

      </div>

    </ModulePage>
  );
}

export default Settings;