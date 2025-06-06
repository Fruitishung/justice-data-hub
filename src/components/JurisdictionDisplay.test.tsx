
import { render } from "@testing-library/react";
import { describe, test } from "vitest";
import { JurisdictionDisplay } from "./JurisdictionDisplay";

describe("JurisdictionDisplay", () => {
  test("renders without crashing", () => {
    render(<JurisdictionDisplay />);
  });
});
