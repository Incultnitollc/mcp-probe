import type {
  PublishabilityCheckContext,
  PublishabilityResult,
} from "./types.js";
import {
  checkDescriptionFiveAxis,
  checkEnumShape,
  checkMutationLegibility,
  checkAntiPurposeClause,
  checkDistributionMetadata,
} from "./publishability-checks.js";

export async function runPublishabilitySuite(
  ctx: PublishabilityCheckContext
): Promise<PublishabilityResult[]> {
  const { tools } = ctx.result;
  return [
    checkDescriptionFiveAxis(tools),
    checkEnumShape(tools),
    checkMutationLegibility(tools),
    await checkDistributionMetadata(ctx.packageJsonPath),
    checkAntiPurposeClause(tools),
  ];
}
