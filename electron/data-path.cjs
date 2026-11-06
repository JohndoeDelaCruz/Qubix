const fs = require("node:fs");
const path = require("node:path");

function desktopDataDirectory(appData, userData) {
  const current = path.join(userData, "data");
  const legacy = path.join(appData, "QuizHost", "data");
  if (fs.existsSync(current) || !fs.existsSync(path.join(legacy, "quizhost.sqlite")))
    return current;

  fs.mkdirSync(userData, { recursive: true });
  const staging = fs.mkdtempSync(path.join(userData, ".data-migration-"));
  // Stage the complete directory so a failed copy cannot appear as migrated data.
  // Keep the previous installation's database and photos untouched.
  fs.cpSync(legacy, staging, { recursive: true, force: false });
  fs.renameSync(staging, current);
  return current;
}

module.exports = { desktopDataDirectory };
