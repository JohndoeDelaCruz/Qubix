import { test, type TestContext } from "node:test";
import assert from "node:assert/strict";
import {
  existsSync, mkdirSync, mkdtempSync, readFileSync, renameSync,
  rmSync, writeFileSync,
} from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { Store } from "../server/store";
import { readStoredValue, removeStoredValue } from "../client/src/storage";
import { readSoundSettings } from "../client/src/audio/catalog";

const require = createRequire(import.meta.url);
const { desktopDataDirectory } = require("../electron/data-path.cjs") as {
  desktopDataDirectory(appData: string, userData: string): string;
};

function directory(t: TestContext) {
  const base = path.resolve("work/branding-tests");
  mkdirSync(base, { recursive: true });
  const target = mkdtempSync(path.join(base, "case-"));
  t.after(() => {
    assert.ok(path.resolve(target).startsWith(base + path.sep + "case-"));
    rmSync(target, { recursive: true, force: true });
  });
  return target;
}

function browserStorage(initial: Record<string, string> = {}) {
  const values = new Map(Object.entries(initial));
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => { values.set(key, value); },
    removeItem: (key: string) => { values.delete(key); },
  };
}

test("desktop rename copies saved data and photos without modifying the earlier installation", (t) => {
  const base = directory(t);
  const previous = path.join(base, "QuizHost/data");
  const userData = path.join(base, "Qubix");
  mkdirSync(path.join(previous, "images"), { recursive: true });
  writeFileSync(path.join(previous, "quizhost.sqlite"), "saved quizzes and results");
  writeFileSync(path.join(previous, "images/question.png"), "saved photo");
  const current = desktopDataDirectory(base, userData);
  assert.equal(current, path.join(userData, "data"));
  assert.equal(readFileSync(path.join(current, "quizhost.sqlite"), "utf8"), "saved quizzes and results");
  assert.equal(readFileSync(path.join(current, "images/question.png"), "utf8"), "saved photo");
  assert.equal(readFileSync(path.join(previous, "quizhost.sqlite"), "utf8"), "saved quizzes and results");
  writeFileSync(path.join(current, "qubix.sqlite"), "newer Qubix data");
  desktopDataDirectory(base, userData);
  assert.equal(readFileSync(path.join(current, "qubix.sqlite"), "utf8"), "newer Qubix data");
});

test("fresh desktop setup does not create or import unrelated directories", (t) => {
  const base = directory(t);
  const target = desktopDataDirectory(base, path.join(base, "Qubix"));
  assert.equal(target, path.join(base, "Qubix/data"));
  assert.equal(existsSync(target), false);
});

test("database rename retains quizzes, preserves the old file and prefers newer data on reopen", async (t) => {
  const base = directory(t);
  let store = await Store.open(base);
  const quiz = { ...store.quizzes()[0], title: "Saved classroom quiz" };
  store.saveQuiz(quiz);
  store.close();
  renameSync(path.join(base, "qubix.sqlite"), path.join(base, "quizhost.sqlite"));
  const original = readFileSync(path.join(base, "quizhost.sqlite"));
  store = await Store.open(base);
  assert.equal(store.quiz(quiz.id)?.title, "Saved classroom quiz");
  store.saveQuiz({ ...quiz, title: "Edited in Qubix" });
  store.close();
  assert.deepEqual(readFileSync(path.join(base, "quizhost.sqlite")), original);
  store = await Store.open(base);
  assert.equal(store.quiz(quiz.id)?.title, "Edited in Qubix");
  store.close();
});

test("host tokens and player sessions migrate while newer Qubix values take precedence", () => {
  const storage = browserStorage({
    "quizhost:host": "private-host-token",
    "quizhost:player": '{"id":"student-one"}',
  });
  assert.equal(readStoredValue(storage, "qubix:host"), "private-host-token");
  assert.equal(storage.getItem("qubix:host"), "private-host-token");
  assert.equal(readStoredValue(storage, "qubix:player"), '{"id":"student-one"}');
  storage.setItem("qubix:host", "newer-token");
  assert.equal(readStoredValue(storage, "qubix:host"), "newer-token");
  removeStoredValue(storage, "qubix:player");
  assert.equal(readStoredValue(storage, "qubix:player"), null);
});

test("sound and reduced-motion choices survive the rename", () => {
  const storage = browserStorage({
    "quizhost:sound:v2:student": JSON.stringify({ muted: true, volume: 0.4, music: false, effects: true }),
    "quizhost:reduced-motion": "true",
  });
  assert.deepEqual(readSoundSettings("student", storage), {
    muted: true, volume: 0.4, music: false, effects: true,
  });
  assert.ok(storage.getItem("qubix:sound:v2:student"));
  assert.equal(readStoredValue(storage, "qubix:reduced-motion"), "true");
});

test("readable legacy preferences still work when browser writes are blocked", () => {
  const storage = {
    getItem: (key: string) => key === "quizhost:reduced-motion" ? "true" : null,
    setItem: () => { throw new Error("Storage write blocked"); },
  };
  assert.equal(readStoredValue(storage, "qubix:reduced-motion"), "true");
});
