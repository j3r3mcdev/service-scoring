import { execSync } from "node:child_process";
import fs from "node:fs";

// Colors
const green = (msg) => console.log(`\x1b[32m${msg}\x1b[0m`);
const red = (msg) => console.log(`\x1b[31m${msg}\x1b[0m`);
const yellow = (msg) => console.log(`\x1b[33m${msg}\x1b[0m`);
const log = (msg) => console.log(msg);

// Mode
const mode = process.argv[2] === "lite" ? "lite" : "full";
let failed = false;

// Helper: run commands safely
const run = (label, cmd) => {
  log(label);
  try {
    execSync(cmd, { stdio: "inherit" });
    green(`✔ ${label.replace(/^[^ ]+ /, "")} OK`);
  } catch {
    red(`✖ ${label.replace(/^[^ ]+ /, "")} FAILED`);
    failed = true;
  }
};

// CLEAN DIST
log("🧹 Cleaning dist...");
try {
  fs.rmSync("dist", { recursive: true, force: true });
  green("✔ dist cleaned");
} catch {
  red("✖ Failed to clean dist");
  failed = true;
}

// TYPE CHECK
run("🔍 Checking TypeScript...", "tsc --noEmit");

// BUILD
run("🏗 Building project...", "tsc");

// CHECK JEST MODE
log("🔎 Checking Jest mode...");
try {
  const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
  if (!pkg.scripts.test.includes("--runInBand")) {
    yellow("⚠ Jest is NOT running in band — tests may collide");
  } else {
    green("✔ Jest runs in band");
  }
} catch {
  yellow("⚠ Could not verify Jest mode");
}

// TESTS + CAPTURE COVERAGE
log("🧪 Running Jest tests...");
let jestOutput = "";
try {
  jestOutput = execSync("npm test", { encoding: "utf8" });
  green("✔ Jest tests passed");
} catch (err) {
  jestOutput = err.stdout?.toString() || "";
  red("✖ Jest tests FAILED");
  failed = true;
}

// EXTRACT COVERAGE SUMMARY (Jest 30.x)
let coverageTable = "";
const summaryStart = jestOutput.indexOf("Coverage summary");

if (summaryStart !== -1) {
  const afterSummary = jestOutput.substring(summaryStart);

  // On coupe à la ligne de fin "====="
  const endIndex = afterSummary.indexOf(
    "================================================================================",
  );
  const rawTable =
    endIndex !== -1
      ? afterSummary.substring(
          0,
          endIndex +
            "================================================================================"
              .length,
        )
      : afterSummary;

  // Nettoyage : enlever "Coverage summary ==============================="
  coverageTable = rawTable
    .split("\n")
    .filter((line) => !line.includes("Coverage summary"))
    .filter((line) => !/^=+$/.test(line.trim()))
    .join("\n")
    .trim();
} else {
  coverageTable = "⚠ Coverage summary not found";
}

// COLORIZE COVERAGE SUMMARY
const colorizeCoverage = (table) => {
  if (!table || table.startsWith("⚠")) return table;

  return table.replace(/(\d+(\.\d+)?)%/g, (match) => {
    const percent = parseFloat(match);
    if (percent >= 80) return `\x1b[32m${match}\x1b[0m`; // green
    if (percent >= 50) return `\x1b[33m${match}\x1b[0m`; // yellow
    return `\x1b[31m${match}\x1b[0m`; // red
  });
};

// GIT CHECK (FULL ONLY)
let gitWarning = false;
if (mode === "full") {
  log("🔎 Checking Git status...");
  try {
    const gitStatus = execSync("git status --porcelain").toString().trim();
    if (gitStatus.length > 0) {
      yellow("⚠ Untracked or modified files detected:");
      console.log(gitStatus);
      gitWarning = true;
    } else {
      green("✔ No untracked files");
    }
  } catch {
    yellow("⚠ Git not available — skipping");
  }
}

// FINAL REPORT
log("\n📊 FINAL REPORT");

if (failed) {
  red("❌ SANITY FAILED — Push blocked");

  log(`
╔══════════════════════════════════════╗
║       Purgatoire sur terre           ║
╠══════════════════════════════════════╣
║   La porte reste fermée.             ║
║   Mais elle s’ouvrira quand tu       ║
║   auras purifié ce petit péché       ║
║   technique.                         ║
╚══════════════════════════════════════╝
  `);

  log("\n📊 Coverage Report:\n");
  console.log(colorizeCoverage(coverageTable));

  process.exit(1);
} else {
  green("✅ SANITY PASSED — Safe to push");

  if (mode === "full" && gitWarning) {
    yellow("⚠ Warning: You have untracked files");
  }

  log(`
╔══════════════════════════════════════╗
║          Paradis sur terre           ║
╠══════════════════════════════════════╣
║     N'oublie pas de remercier        ║
║     Jésus le Christ pour cette       ║
║     victoire technique.              ║
╚══════════════════════════════════════╝
  `);

  log("\n📊 Coverage Report:\n");
  console.log(colorizeCoverage(coverageTable));

  log("\n🎉 ALL CHECKS PASSED — YOU ARE CLEAR TO DEPLOY 🚀");

  process.exit(0);
}
