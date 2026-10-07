/** Theme-scoped semantic-token presets installed when a supported S7 editor
 * becomes active (unless disabled), or explicitly through the command. They
 * deliberately live outside a contributed color theme so the extension can
 * add/remove only its own selectors without replacing the user's theme. */

export const INSTALL_RECOMMENDED_SEMANTIC_COLORS_COMMAND = "tiaLint.installRecommendedSemanticColors";
export const DISABLE_RECOMMENDED_SEMANTIC_COLORS_COMMAND = "tiaLint.disableRecommendedSemanticColors";
export const RECOMMENDED_SEMANTIC_COLORS_SETTING = "tiaLint.recommendedSemanticColors.enabled";

export type RecommendedSemanticPaletteKind = "dark" | "light";

const LOGICAL_OPERATOR_SCOPE = "keyword.operator.logical.s7dcl";
const RECOMMENDED_LOGICAL_OPERATOR_COLORS: Record<RecommendedSemanticPaletteKind, string> = {
  dark: "#707070",
  light: "#404040",
};

export const RECOMMENDED_SEMANTIC_PALETTES: Record<RecommendedSemanticPaletteKind, Readonly<Record<string, string>>> = {
  dark: {
    s7TemporalType: "#D7BA7D",
    s7IntegerType: "#4FC1FF",
    s7BooleanType: "#4FC1FF",
    s7FloatType: "#4FC1FF",
    s7GenericType: "#4EC9B0",
    s7TextType: "#4FC1FF",
    parameter: "#A13A7F",
    string: "#9CDCFE",
    s7WordOperator: RECOMMENDED_LOGICAL_OPERATOR_COLORS.dark,
    s7UdtType: "#B8D7A3",
    s7CallableType: "#DCDCAA",
    s7CallableInstance: "#9CDCFE",
    "s7CallableInstance.s7Container": "#9CDCFE",
    "s7CallableInstance.s7Container.s7Indexable": "#9CDCFE",
    s7DataBlock: "#7AA2F7",
    "s7DataBlock.s7Container": "#7AA2F7",
    s7PlcTag: "#D16D9E",
    "s7PlcTag.s7Container": "#D16D9E",
    "s7PlcTag.s7Indexable": "#D16D9E",
    "s7PlcTag.s7Container.s7Indexable": "#D16D9E",
    "property.s7Container": "#8FAFD9",
    "property.s7Indexable": "#6CB6B0",
    "property.s7Container.s7Indexable": "#8FBF9F",
    "parameter.s7Container": "#8FAFD9",
    "parameter.s7Indexable": "#6CB6B0",
    "parameter.s7Container.s7Indexable": "#8FBF9F",
    "variable.s7Container": "#8FAFD9",
    "variable.s7Indexable": "#6CB6B0",
    "variable.s7Container.s7Indexable": "#8FBF9F",
  },
  light: {
    s7TemporalType: "#795E26",
    s7IntegerType: "#0070C1",
    s7BooleanType: "#0070C1",
    s7FloatType: "#0070C1",
    s7GenericType: "#267F99",
    s7TextType: "#0070C1",
    s7WordOperator: RECOMMENDED_LOGICAL_OPERATOR_COLORS.light,
    s7UdtType: "#6F42C1",
    s7CallableType: "#B54708",
    s7CallableInstance: "#001080",
    "s7CallableInstance.s7Container": "#001080",
    "s7CallableInstance.s7Container.s7Indexable": "#001080",
    s7DataBlock: "#4B3FBF",
    "s7DataBlock.s7Container": "#4B3FBF",
    s7PlcTag: "#C43E73",
    "s7PlcTag.s7Container": "#C43E73",
    "s7PlcTag.s7Indexable": "#C43E73",
    "s7PlcTag.s7Container.s7Indexable": "#C43E73",
    "property.s7Container": "#365F8D",
    "property.s7Indexable": "#167D75",
    "property.s7Container.s7Indexable": "#4F7A44",
    "parameter.s7Container": "#365F8D",
    "parameter.s7Indexable": "#167D75",
    "parameter.s7Container.s7Indexable": "#4F7A44",
    "variable.s7Container": "#365F8D",
    "variable.s7Indexable": "#167D75",
    "variable.s7Container.s7Indexable": "#4F7A44",
  },
};

const LEGACY_RECOMMENDED_COLORS: Readonly<Record<string, readonly string[]>> = {
  // ARRAY/OF now belongs to s7GenericType. Remove only preset values from
  // the retired selector; a manually customized legacy rule is preserved.
  s7ArrayType: ["#4EC9B0", "#267F99"],
  // The first released preset accidentally reused Dark+'s control-keyword
  // purple. Recognize it as ours so automatic activation upgrades it.
  s7UdtType: ["#C586C0", "#AF00DB"],
  // The original preset gave every concrete built-in family its own hue.
  // Preserve the semantic subtypes for customization, but migrate the noisy
  // managed defaults to the shared built-in-type blue.
  s7BooleanType: ["#D16D9E", "#C43E73"],
  s7FloatType: ["#B5CEA8", "#098658"],
  s7TextType: ["#CE9178", "#A31515"],
  s7CallableType: ["#795E26"],
  s7CallableInstance: ["#CE9178"],
  // Container-only values moved from lavender/purple to muted steel blue so
  // they no longer read like control-flow keywords. Keep the old dark/light
  // values managed so automatic activation upgrades existing installations.
  "property.s7Container": ["#C8A2C8", "#7B3F8C"],
  "parameter.s7Container": ["#C8A2C8", "#7B3F8C"],
  "variable.s7Container": ["#C8A2C8", "#7B3F8C"],
};

/** Adds a theme-specific TextMate color for S7 word operators. The contrast
 * differs by theme: dark gray is readable on dark backgrounds, near-black on
 * light backgrounds. Existing user rules are preserved unless explicitly
 * overwritten by the install command. */
export function withRecommendedOperatorTextMateColor(
  existing: unknown,
  themeName: string,
  paletteKind: RecommendedSemanticPaletteKind,
  overwriteCustom = true
): Record<string, unknown> {
  const root = isRecord(existing) ? existing : {};
  const themeKey = `[${themeName}]`;
  const currentTheme = isRecord(root[themeKey]) ? root[themeKey] : {};
  const currentRules = Array.isArray(currentTheme.textMateRules) ? currentTheme.textMateRules : [];
  const nextRules = [...currentRules];
  const matchingIndex = nextRules.findIndex(
    (rule) => isRecord(rule) && rule.scope === LOGICAL_OPERATOR_SCOPE && isRecord(rule.settings)
  );
  const color = RECOMMENDED_LOGICAL_OPERATOR_COLORS[paletteKind];

  if (matchingIndex >= 0) {
    const rule = nextRules[matchingIndex] as Record<string, unknown>;
    const settings = rule.settings as Record<string, unknown>;
    const currentColor = settings.foreground;
    if (overwriteCustom || isRecommendedOperatorColor(currentColor)) {
      nextRules[matchingIndex] = { ...rule, settings: { ...settings, foreground: color } };
    }
  } else {
    nextRules.push({ scope: LOGICAL_OPERATOR_SCOPE, settings: { foreground: color } });
  }

  return {
    ...root,
    [themeKey]: {
      ...currentTheme,
      textMateRules: nextRules,
    },
  };
}

function isRecommendedOperatorColor(value: unknown): boolean {
  return (
    typeof value === "string" &&
    Object.values(RECOMMENDED_LOGICAL_OPERATOR_COLORS).some((color) => color.toUpperCase() === value.toUpperCase())
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Returns a new user-setting value for
 * `editor.semanticTokenColorCustomizations`. Existing global rules and the
 * selected theme's unrelated rules are preserved; only S7 Lint's own
 * selectors are installed/updated. */
export function withRecommendedSemanticColors(
  existing: unknown,
  themeName: string,
  paletteKind: RecommendedSemanticPaletteKind,
  overwriteCustom = true
): Record<string, unknown> {
  const root = isRecord(existing) ? existing : {};
  const themeKey = `[${themeName}]`;
  const currentTheme = isRecord(root[themeKey]) ? root[themeKey] : {};
  const currentRules = isRecord(currentTheme.rules) ? currentTheme.rules : {};
  const palette = RECOMMENDED_SEMANTIC_PALETTES[paletteKind];
  const nextRules = { ...currentRules };
  for (const retiredSelector of Object.keys(LEGACY_RECOMMENDED_COLORS)) {
    if (!(retiredSelector in palette) && isManagedPresetValue(retiredSelector, nextRules[retiredSelector])) {
      delete nextRules[retiredSelector];
    }
  }
  for (const [selector, color] of Object.entries(palette)) {
    const current = currentRules[selector];
    if (overwriteCustom || current === undefined || isManagedPresetValue(selector, current)) nextRules[selector] = color;
  }
  return {
    ...root,
    [themeKey]: {
      ...currentTheme,
      rules: nextRules,
    },
  };
}

function isManagedPresetValue(selector: string, value: unknown): boolean {
  if (typeof value !== "string") return false;
  const normalized = value.toUpperCase();
  const known = [
    RECOMMENDED_SEMANTIC_PALETTES.dark[selector],
    RECOMMENDED_SEMANTIC_PALETTES.light[selector],
    ...(LEGACY_RECOMMENDED_COLORS[selector] ?? []),
  ];
  return known.some((color) => color?.toUpperCase() === normalized);
}

/** Removes recognized S7 Lint preset values from every theme block. A user
 * value that differs from every shipped/legacy preset is left untouched.
 * Returns `undefined` when no customization remains, allowing VS Code to
 * remove the User Settings key entirely. */
export function withoutRecommendedSemanticColors(existing: unknown): Record<string, unknown> | undefined {
  if (!isRecord(existing)) return undefined;
  const next: Record<string, unknown> = { ...existing };
  for (const [themeKey, rawTheme] of Object.entries(existing)) {
    if (!/^\[.+\]$/.test(themeKey) || !isRecord(rawTheme) || !isRecord(rawTheme.rules)) continue;
    const rules: Record<string, unknown> = { ...rawTheme.rules };
    const managedSelectors = new Set([
      ...Object.keys(RECOMMENDED_SEMANTIC_PALETTES.dark),
      ...Object.keys(LEGACY_RECOMMENDED_COLORS),
    ]);
    for (const selector of managedSelectors) {
      if (isManagedPresetValue(selector, rules[selector])) delete rules[selector];
    }

    const theme: Record<string, unknown> = { ...rawTheme };
    if (Object.keys(rules).length > 0) theme.rules = rules;
    else delete theme.rules;

    // The old manual installer added `enabled: true`. If nothing else remains
    // in this theme block, remove that legacy shell as well.
    if (Object.keys(theme).length === 1 && theme.enabled === true) delete theme.enabled;
    if (Object.keys(theme).length > 0) next[themeKey] = theme;
    else delete next[themeKey];
  }
  return Object.keys(next).length > 0 ? next : undefined;
}

/** Removes only S7 Lint's managed word-operator color, retaining other
 * TextMate rules and any user-customized foreground. */
export function withoutRecommendedOperatorTextMateColor(existing: unknown): Record<string, unknown> | undefined {
  if (!isRecord(existing)) return undefined;
  const next: Record<string, unknown> = { ...existing };
  for (const [themeKey, rawTheme] of Object.entries(existing)) {
    if (!/^\[.+\]$/.test(themeKey) || !isRecord(rawTheme) || !Array.isArray(rawTheme.textMateRules)) continue;
    const rules = rawTheme.textMateRules.filter((rule) => {
      if (!isRecord(rule) || rule.scope !== LOGICAL_OPERATOR_SCOPE || !isRecord(rule.settings)) return true;
      return !isRecommendedOperatorColor(rule.settings.foreground);
    });
    const theme: Record<string, unknown> = { ...rawTheme };
    if (rules.length > 0) theme.textMateRules = rules;
    else delete theme.textMateRules;
    if (Object.keys(theme).length > 0) next[themeKey] = theme;
    else delete next[themeKey];
  }
  return Object.keys(next).length > 0 ? next : undefined;
}
