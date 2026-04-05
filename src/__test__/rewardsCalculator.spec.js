import { describe, it, expect } from "vitest";
import calculateRewards from "../utils/calculateRewards";

describe("calculateRewards - Positive Test Cases", () => {
  it("should return 90 points for a $120 purchase (2x20 + 1x50)", () => {
    expect(calculateRewards(120)).toBe(90);
  });

  it("should return 25 points for a $75 purchase (1x25)", () => {
    expect(calculateRewards(75)).toBe(25);
  });

  it("should return 250 points for a $200 purchase (2x100 + 1x50)", () => {
    expect(calculateRewards(200)).toBe(250);
  });
});

describe("calculateRewards - Negative Test Cases", () => {
  it("should return 0 points for a $30 purchase (below $50 threshold)", () => {
    expect(calculateRewards(30)).toBe(0);
  });

  it("should return 0 points for negative amounts", () => {
    expect(calculateRewards(-50)).toBe(0);
  });

  it("should return 0 points for NaN input", () => {
    expect(calculateRewards(NaN)).toBe(0);
  });
});

describe("calculateRewards - Fractional Values", () => {
  it("should floor $120.99 to $120 and return 90 points", () => {
    expect(calculateRewards(120.99)).toBe(90);
  });

  it("should floor $75.50 to $75 and return 25 points", () => {
    expect(calculateRewards(75.5)).toBe(25);
  });

  it("should floor $50.99 to $50 and return 0 points (exactly $50)", () => {
    expect(calculateRewards(50.99)).toBe(0);
  });

  it("should return 50 points for exactly $100 (1x50)", () => {
    expect(calculateRewards(100)).toBe(50);
  });

  it("should return 0 for exactly $50", () => {
    expect(calculateRewards(50)).toBe(0);
  });
});
