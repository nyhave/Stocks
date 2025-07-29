class Settings {
  constructor(riskLevel = 'medium', notifyFrequency = 'weekly') {
    this.riskLevel = riskLevel;
    this.notifyFrequency = notifyFrequency;
  }
}

async function configureSettings(settings, ask) {
  console.log('\n===== Settings =====');
  const risk = await ask(`Risk level (low/medium/high) [${settings.riskLevel}]: `);
  if (risk) settings.riskLevel = risk;
  const freq = await ask(`Notification frequency (daily/weekly/monthly) [${settings.notifyFrequency}]: `);
  if (freq) settings.notifyFrequency = freq;
  console.log('Settings updated.\n');
  return settings;
}

module.exports = { Settings, configureSettings };
