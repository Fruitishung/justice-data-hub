
import { render } from "@testing-library/react";
import { JurisdictionDisplay } from "./JurisdictionDisplay";

describe("JurisdictionDisplay", () => {
  test("renders without crashing", () => {
    render(<JurisdictionDisplay />);
  });
});
