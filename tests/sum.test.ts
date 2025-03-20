import {describe, expect, it} from "vitest";
import { skibidiToileet } from "../utils/sum";

describe("skibidiToileet", () => {
    it('should return the number plus one', () => {
        expect(skibidiToileet(1)).toBe(2);
    });
});