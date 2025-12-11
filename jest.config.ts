import { createDefaultEsmPreset } from "ts-jest";
import type { Config } from "jest";

const tsJestTransformCfg = createDefaultEsmPreset().transform;

export default {
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
} satisfies Config;
