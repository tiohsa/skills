#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const startAll = Date.now();
const featureMapPath = path.resolve("verification/feature-map.json");

const steps = [
  { name: "typecheck", cmd: process.env.VERIFY_TYPECHECK_CMD || "" },
  { name: "lint-and-boundaries", cmd: process.env.VERIFY_LINT_CMD || "" },
  { name: "unit-and-integration", cmd: process.env.VERIFY_TEST_CMD || "" },
  { name: "runtime-e2e", cmd: process.env.VERIFY_E2E_CMD || "" }
].filter((step) => step.cmd.trim().length > 0);

const results = [];
let overallStatus = "passed";

if (!fs.existsSync(featureMapPath)) {
  overallStatus = "failed";
  results.push({
    name: "feature-map-check",
    status: "failed",
    durationMs: 0,
    error: "Missing verification/feature-map.json"
  });
}

for (const step of steps) {
  const stepStart = Date.now();
  const proc = spawnSync(step.cmd, {
    shell: true,
    encoding: "utf-8",
    env: process.env
  });
  const durationMs = Date.now() - stepStart;
  const passed = proc.status === 0;

  if (!passed) {
    overallStatus = "failed";
  }

  results.push({
    name: step.name,
    command: step.cmd,
    status: passed ? "passed" : "failed",
    exitCode: proc.status ?? 1,
    durationMs,
    stdoutTail: (proc.stdout || "").slice(-2000),
    stderrTail: (proc.stderr || "").slice(-2000)
  });

  if (!passed && process.env.VERIFY_FAIL_FAST === "1") {
    break;
  }
}

const report = {
  status: overallStatus,
  totalDurationMs: Date.now() - startAll,
  timestamp: new Date().toISOString(),
  checks: results
};

console.log(JSON.stringify(report, null, 2));
process.exit(overallStatus === "passed" ? 0 : 1);
